const express = require('express');
const ldap = require('ldapjs');
const ldapAuth = require('ldap-authentication');
const CONFIG = require('./config');

const app = express();
const port = 3000;

const server = ldap.createServer();

server.search('', (req, res) => {
  const obj = {
    dn: req.dn.toString(),
    attributes: {
      objectclass: ['username', 'password'],
    },
  };

  if (req.filter.matches(obj.attributes)) {
    res.send(obj);
  }

  res.end();
});

// Configuración de conexión LDAP
const ldapConfig = {
  url: 'ldap://10.37.100.150:389',
  bindDN: 'CN=homologaciones,CN=Users,DC=ldap,DC=swm,DC=com,DC=ar',
  searchBase: 'DC=ldap,DC=swm,DC=com,DC=ar',
  bindCredentials: CONFIG.ldap.password,
};

const isAuthenticated = async () => {
  return await ldapAuth.authenticate('ldap://10.37.100.150:389', username, password);
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (await isAuthenticated()) {
      const client = ldap.createClient({ url: ldapConfig.url });
      client.bind(ldapConfig.bindDN, ldapConfig.bindCredentials, (err) => {
        if (err) {
          res.status(500).json({ message: 'Error de autenticación' });
          return;
        }

        const searchOptions = {
          scope: 'sub',
          filter: `(sAMAccountName=${username})`,
          attributes: ['dn', 'cn'],
        };

        client.search(ldapConfig.searchBase, searchOptions, (searchErr, searchRes) => {
          if (searchErr) {
            res.status(500).json({ message: 'Error de búsqueda' });
            return;
          }

          let userData = {};

          searchRes.on('searchEntry', (entry) => {
            userData = entry.object;
          });

          searchRes.on('end', () => {
            client.unbind();

            res.json({ message: 'Inicio de sesión exitoso', user: userData });
          });
        });
      });
    } else {
      res.status(401).json({ message: 'Inicio de sesión fallido' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de autenticación' });
  }
});

app.listen(port, () => {
  console.log('Server corriendo en el puerto', port);
});
/**
 * Arquivo: src/controllers/auth.controller
 * Descrição: arquivo responsável pela lógica de autenticação e usuários da API
 * Data: 05/03/2021
 * Autor: Leticia Machado
 */
const ad = require("../config/activeDirectory");

//Método para autenticar usuários
exports.user_authenticate = (req, res) => {
  const { user, pass, domain } = req.body;
  try {
    ad.authenticate(domain + "\\" + user, pass, function (err, auth) {
      console.log(auth);
      if (auth) {
        return res.status(200).json({
          message: "Authenticated!",
        });
      } else {
        return res.status(401).send({
          message: "Authentication failed!",
          error: err,
        });
      }
    });

    let username = "csh_recept@swm.com.ar";
    let groupName = "ris_group_clerks";

    ad.userExists(username, function (err, exists) {
      if (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return;
      }

      console.log(username + " exists: " + exists);
    });

    ad.isUserMemberOf(username, groupName, function (err, isMember) {
      if (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return;
      }

      console.log(username + " isMemberOf " + groupName + ": " + isMember);
    });
  } catch (err) {
    return res.status(500).send({ message: "ERROR " + err });
  }
};

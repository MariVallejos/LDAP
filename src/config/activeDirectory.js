/**
 * Arquivo: src/config/activeDirectory
 * Descrição: arquivo responsável pela configuração de acesso ao Active Directory
 * Data: 05/03/2021
 * Autor: Leticia Machado
 */

const ActiveDirectory = require("activedirectory2");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  url: "ldap://10.37.100.150:389",
  baseDN: "DC=swm,DC=com,DC=ar",
  username: "homologaciones",
  password: "b5x8fUFTVR",
};

const ad = new ActiveDirectory(config);

console.log(ad);

module.exports = ad;

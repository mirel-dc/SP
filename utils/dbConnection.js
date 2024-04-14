const mysql = require("mysql2");
const dbConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tsygankov_login",
});
module.exports = dbConnection.promise();

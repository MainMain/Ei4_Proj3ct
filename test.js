var http = require('http');
var oDatabase = require('./model/database');
var oUtilisateurDB = require('./persistance/Utilisateur_BD');

var etat = 1;
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Salut tout le monde !');
});
server.listen(8080);

oDatabase.Initialiser();
oUtilisateurDB.Inscription("joe","unmaiil@gmail.com","password1",10,20,5,20,10,"");	
 

etat = oUtilisateurDB.Connexion("joe","password");


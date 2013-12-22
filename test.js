var http = require('http');
var oDatabase = require('./model/database');
var oUtilisateurDB = require('./persistance/Utilisateur_BD');
var id = "52b5f62b12df0de012000001";
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Salut tout le monde !');
});
server.listen(8080);

oDatabase.Initialiser();

//oUtilisateurDB.Inscription("aze","aze","aze",callbackInscription);	

//callbackInscription = function(reponse)
	//{
		//console.log(reponse+"\n\n");
		//id = reponse.id;
		
	//}
	
	
	
	
	
callbackGetUtilisateur = function(reponse)
{
			console.log(reponse.pass);
			console.log("DIS MOI UN TRUC !!!!");

}

oUtilisateurDB.GetUtilisateur(id,callbackGetUtilisateur);

	


	
 




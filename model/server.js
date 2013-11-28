//appel aux modules
var http = require('http');
//var app = express();
var url = require("url");
var querystring = require('querystring');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var oPersonnage = require('./object/Personnage');
var oCarte = require('./object/Carte');
var fs = require('fs');

//var eventjeu = new EventEmitter();

// Session
//app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));

// lancement du serveur
oCarte.Initialiser(3, 4);

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
	fs.readFile('./view/accueil.ejs', 'utf-8', function(error, content) {
		res.writeHead(200, {
			"Content-Type" : "text/html"
		});
		res.end(content);

		// Chargement de socket.io
		var io = require('socket.io').listen(server, {log : false});
		var myPerso = new oPersonnage('Mainmain');
		
		
		// Quand on client se connecte, on le note dans la console
		io.sockets.on('connection', function(socket) {
			console.log('SERVER : Un client est connecté !');
			socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.getIdSalleEnCours());
			
			
			// Quand le serveur reçoit un signal de type "MESSAGE" du client
			socket.on('MESSAGE_CS', function(message) {
				console.log('SERVER : Un client me parle ! Il me dit : ' + message);
			});

			// Quand le serveur reçoit un signal de type "MOVE_PERSONNAGE_CS" du
			// client
			socket.on('MOVE_PERSONNAGE_CS', function(move) {
				console.log('SERVER : Déplacement du personnage demandé : ' + move);
				var ansDeplacementOk = myPerso.deplacement(move);
				if (ansDeplacementOk == true)
					{
				console.log('SERVER : DEBUG envoi de la nouvelle position');
				socket.emit('MOVE_PERSONNAGE_SC', myPerso.idSalleEnCours);
					}
				else
					{
						console.log('SERVER : DEBUG envoi deplacement impossible');
						socket.emit('MOVE_PERSONNAGE_SC', "-1");
					}	
			});
		});
	});
});

// server.listen(8080);
server.on('close', function() { // On écoute l'évènement close
	console.log('Bye bye !');
});

console.log("Script lancé ! sur http://127.0.0.1:8080");
server.listen(8080);

function InitPersonnage() {
	// --- Attributs d'instance
	this.name = name;
	this.idSalleEnCours = 7;
}

//appel aux modules
//var http = require('http');
var url         = require("url");
var querystring = require('querystring');
var express     = require('express'),
    routes      = require('./routes'),
    http        = require('http'),
    path        = require('path');
var app         = express();
var server      = http.createServer(app);


/*
 *
 */
// require model
var oDatabase	= require('./model/database');

// require objets
//var oPersonnage = require('./model/object/Personnage');
var oCarte	= require('./model/object/Carte');

//require persistance
var oCase_BD       = require('./persistance/Case_BD');
//var oItem_BD       = require('./persistance/Item_BD');
var oUtilisateur_BD  = require('./persistance/Utilisateur_BD');
//var oPersonnage_BD = require('./persistance/Personnage_BD');

//require manager
var oPersonnage_Manager  = require('./manager/Personnage_Manager');
var oItem_Manager        = require('./manager/Item_Manager');
var oCase_Manager        = require('./manager/Case_Manager');
var oUtilisateur_Manager = require('./manager/Utilisateur_Manager');

//Tableau des utilisateur en ligne
var usersOnline = new Array();

//Initialisation de la base de données
oDatabase.Initialiser();

// FLORIAN : DEFINITION DE LA DIMENSION DE LA CARTE
oCarte.Initialiser(6, 6);

oUtilisateur_Manager.Load();
oPersonnage_Manager.Load();
oItem_Manager.Load();

oCase_BD.Initialiser();

oCase_Manager.Load();

/*
 * CONFIGURATION DU SERVEUR
 */
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: "testDeMainMain"}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/')));

/*
 * CONFIGURATION DES MANAGERS
 */
var optionAccueil = {"username": null, "errorLogin": null, "InfoInscription": null, "usernameInscription": null, "sessionID": null}

function restrict(req, res, next)
{
	if (req.session.username)
	{
		next();
	}
	else
	{
		optionAccueil.errorLogin = 'Veuillez vous connectez !';
		res.render('accueil', optionAccueil);
		optionAccueil.errorLogin = null;
	}
}
/*
 * CONFIGURATION DES ROUTES
 */
app.get('/', function fonctionIndex(req, res)
{
	var s = req.session;
	
	optionAccueil.username = s.username;
	optionAccueil.sessionID = s.idUser;
	
	res.render('accueil', optionAccueil);
	
	optionAccueil.username = null;
	optionAccueil.sessionID = null;
});

app.get('/jeu', function fonctionIndex(req, res)
{
	var s = req.session;
	var options;
	
	if (typeof s.username === "undefined")
	{
		optionAccueil.errorLogin = "Vous devez vous connecter avant de jouer ! ";
		
		res.render('accueil', optionAccueil);
		
		optionAccueil.errorLogin = null;
	}
	else
	{
		options = { "username": s.username, "idEquipe": oUtilisateur_Manager.GetNumEquipe(s.idUser), "sessionID" : s.idUser };
		
		res.render('game', options);
	}
});

app.put('/jeu', restrict, function fonctionJeu(req, res)
{
	var b = req.body;
	var s = req.session;
	var options = { "username": s.username, "idEquipe": oUtilisateur_Manager.GetNumEquipe(s.idUser), "sessionID" : s.idUser };
	
	if(b.competence == "brute" || b.competence == "explorateur" || b.competence == "chercheur")
	{
		oUtilisateur_Manager.SetNumEquipe(s.idUser, b.equipe);
		oPersonnage_Manager.SetCompetence(s.idUser, b.competence);
		options.idEquipe = b.equipe;
	}
	
	res.render('game', options);
});

app.get('/regles', function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { "username": s.username, "sessionID" : s.idUser };
	
	res.render('regles', options);
});

app.get('/chat-equipe', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { "username": s.username, "sessionID" : s.idUser, "idEquipe": oUtilisateur_Manager.GetNumEquipe(s.idUser) };
	
	res.render('chat-equipe', options);
});

app.get('/classement', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { "username":s.username, "sessionID" : s.idUser };
	
	res.render('classement', options);
});

app.get('/chat-general', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { "username": s.username, "sessionID" : s.idUser };
	res.render('chat', options);
});

app.post("/", function (req, res)
{
	var b = req.body;
	oUtilisateur_BD.Connexion(b.username, b.password, req, res, callbackConnexion);
});

callbackConnexion = function(reponseConnexion, req, res)
{
	var b = req.body;
	var s = req.session;
	// Si bon couple, on recoi l'id de l'user
	if (typeof reponseConnexion === 'string')
	{
		console.log("REPONSE CONNEXION =" + reponseConnexion);
		
		s.username = b.username;
		s.idUser = reponseConnexion;
		
		optionAccueil.username = s.username;
		optionAccueil.sessionID = s.idUser;
		
		res.render("accueil", optionAccueil);
		
		optionAccueil.sessionID = null;
		optionAccueil.username = null;
	}
	else if(reponseConnexion == -1)
	{
		optionAccueil.errorLogin = "Couple Login/Mot de passe incorrect";
		
		res.render("accueil", optionAccueil);
		
		optionAccueil.errorLogin = null;
	}
	else
	{
		optionAccueil.errorLogin = "Erreur Interne";
		
		res.render("accueil", optionAccueil);
		
		optionAccueil.errorLogin = null;
	}
},

app.put('/', function (req, res)
{
	var b = req.body;
	oUtilisateur_BD.Inscription(b.username, b.password, b.email, req, res, callbackInscription);
});
	
callbackInscription = function(reponseInscription, req, res)
{
	var b = req.body;
	if (reponseInscription == -1)
	{
		optionAccueil.InfoInscription = "Login";
		
		res.render("accueil", optionAccueil);
		
		optionAccueil.InfoInscription = null;
	}
	else if(reponseInscription == -2)
	{
		optionAccueil.InfoInscription = "Email";
		
		res.render("accueil", optionAccueil);
		
		optionAccueil.InfoInscription = null;
	}
	else
	{
		optionAccueil.usernameInscription = b.username;
		
		oUtilisateur_Manager.LoadUser(reponseInscription);
		oPersonnage_Manager.LoadUser(reponseInscription);
		
		res.render("accueil", optionAccueil);
		
		optionAccueil.usernameInscription = null;
	}
},

app.delete("/", function (req, res)
{
	req.session.destroy();
	res.render('accueil', optionAccueil);
});

/*
 * LANCEMENT DU SERVEUR
 */
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

/*
 * CHARGEMENT DE SOCKET.IO
 */
var io = require('socket.io').listen(server, { log: false });

/*
 * INITIALISATION DE LA BD
 * Comme il n'y a pas de BD pour le moment, on en simule une...
 */
//oItem_BD.Initialiser();


/*
 * INITIALISATION DU PERSONNAGE ET DES MANAGERS
 */

//try
//{
	
	
	/*, function()
			{
				console.log("Fin oPersonnage_Manager--------------------------");
				var oCase_Manager = new oCase_Manager(oPersonnage_Manager.GetIdSalleEnCours());
			});*/
	
//}catch(err)
//{
	//console.log("PAS DE PERSO CORRESPONDANT A CET USER !");
//}



/**
 * ********* EVENEMENTS LORS DE RECEPTION D'UNE COMMUNICATION CLIENT -> SERVEUR
 * *************
 */
 
 var usersInTeamChat = new Array();
 var usersInGeneralChat = new Array();
 
 
 //Client Connecté au chat d'équipe
var chatEquipe = io.of('/chat-equipe').on('connection', function (socket)
{
	var id = "";
	
	socket.on('INFO_USER_CS', function(userID, user)
	{
		var users = new Array();
		var j = 0;
		var newUser = false;
		var numEquipe;
		
		id = userID;
		
		if(oUtilisateur_Manager.exist(id))
		{
			numEquipe = oUtilisateur_Manager.GetNumEquipe(id);
			
			if(!usersInTeamChat[id])
			{
				usersInTeamChat[id] = new Object();
				usersInTeamChat[id].sockets = new Array();
				newUser = true;
			}
			
			usersInTeamChat[id].username = user;
			usersInTeamChat[id].sockets.push(socket);
			usersInTeamChat[id].numEquipe = numEquipe;
		
			for(var i in usersInTeamChat)
			{
				if(usersInTeamChat[i].numEquipe == numEquipe)
				{
					users[j] = usersInTeamChat[i].username;
					j++;			
				}
			}
			if(newUser)
			{
				console.log("L'utilisateur " + user + " s'est connecté au chat d'equipe.");
				for(var i in usersInTeamChat)
				{
					if(usersInTeamChat[i].numEquipe == numEquipe)
					{
						for(var k in usersInTeamChat[i].sockets)
						{
							usersInTeamChat[i].sockets[k].emit("USER_MESSAGE_SC", "Utilisateur connecté", user);
							usersInTeamChat[i].sockets[k].emit('USER_CONNECTED_SC', users);
						}
					}
				}
			}
		}
	});
	
	socket.on('USER_MESSAGE_CS', function(user, message)
	{
		var numEquipe;
		if(oUtilisateur_Manager.exist(id))
		{
			numEquipe = oUtilisateur_Manager.GetNumEquipe(id);
			for(var i in usersInTeamChat)
			{
				if(usersInTeamChat[i].numEquipe == numEquipe)
				{
					for(var k in usersInTeamChat[i].sockets)
					{
						usersInTeamChat[i].sockets[k].emit("USER_MESSAGE_SC", user, message);
					}
				}
			}
		}
	});
	
	socket.on('disconnect', function()
	{
		var users = new Array();
		var j = 0;
		var numEquipe;
		
		if(oUtilisateur_Manager.exist(id))
		{
			numEquipe = oUtilisateur_Manager.GetNumEquipe(id);
			if(usersInTeamChat[id])
			{
				usersInTeamChat[id].sockets.splice(usersInTeamChat[id].sockets.indexOf(socket), 1);
				if(usersInTeamChat[id].sockets.length == 0)
				{				
					for(var i in usersInTeamChat)
					{
						if(usersInTeamChat[i].numEquipe == numEquipe)
						{
							for(var k in usersInTeamChat[i].sockets)
							{
								usersInTeamChat[i].sockets[k].emit("USER_MESSAGE_SC", "Utilisateur deconnecté", usersInTeamChat[id].username);
							}
						}
					}
					console.log("Déconnexion de " + usersInTeamChat[id].username + " du chat");
					delete usersInTeamChat[id];
				}
				
				for(var i in usersInTeamChat)
				{
					if(usersInTeamChat[i].numEquipe == numEquipe)
					{
						users[j] = usersInTeamChat[i].username;
						j++;			
					}
				}
				
				for(var i in usersInTeamChat)
				{
					if(usersInTeamChat[i].numEquipe == numEquipe)
					{
						for(var k in usersInTeamChat[i].sockets)
						{
							usersInTeamChat[i].sockets[k].emit("USER_MESSAGE_SC", "Utilisateur connecté", user);
							usersInTeamChat[i].sockets[k].emit('USER_CONNECTED_SC', users);
						}
					}
				}
			}
		}
	});
});
 
 
 //Client Connecté au chat général
var chat = io.of('/chat-general').on('connection', function (socket)
{
	var id = "";
	socket.on('INFO_USER_CS', function(userID, user)
	{
		var users = new Array();
		var j = 0;
		var newUser = false;
		
		id = userID;
		
		if(!usersInGeneralChat[id])
		{
			usersInGeneralChat[id] = new Object();
			usersInGeneralChat[id].sockets = new Array();
			newUser = true;
		}
		usersInGeneralChat[id].username = user;
		usersInGeneralChat[id].sockets.push(socket);
	
		for(var i in usersInGeneralChat)
		{
			users[j] = usersInGeneralChat[i].username;
			j++;
		}
		if(newUser)
		{
			console.log("L'utilisateur " + user + " s'est connecté au chat.");
			chat.emit("USER_MESSAGE_SC", "Utilisateur connecté", user);
		}
		
		chat.emit('USER_CONNECTED_SC', users);
	});
	
	socket.on('USER_MESSAGE_CS', function(user, message)
	{
		chat.emit("USER_MESSAGE_SC", user, message);
	});
	
	
	socket.on('disconnect', function()
	{
		var users = new Array();
		var j = 0;
		
		if(usersInGeneralChat[id])
		{
			usersInGeneralChat[id].sockets.splice(usersInGeneralChat[id].sockets.indexOf(socket), 1);
			if(usersInGeneralChat[id].sockets.length == 0)
			{
				chat.emit("USER_MESSAGE_SC", "Utilisateur deconnecté", usersInGeneralChat[id].username);
				console.log("Déconnexion de " + usersInGeneralChat[id].username + " du chat");
				delete usersInGeneralChat[id];
			}
			
			for(var i in usersInGeneralChat)
			{
				users[j] = usersInGeneralChat[i].username;
				console.log("User :" + usersInGeneralChat[i].username);
				j++;
			}
			chat.emit("USER_CONNECTED_SC", users);
		}
	});
});

 
/*
 * CONNEXION D'UN CLIENT
 */
io.sockets.on('connection', function (socket)
{
	var idUser = "";
    //test sessions
    socket.emit('MESSAGE_TEST', 'Vous êtes bien connecté !');
    socket.broadcast.emit('MESSAGE_TEST', 'Un autre client vient de se connecter !');
	
    console.log('SERVER : Un client est connecté !');
    //socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.GetIdSalleEnCours());

	socket.on('INFO_USER_CS', function(sessionID, username, page)
	{
		idUser = sessionID;
		user = username;
		
		users = new Array();
		j = 0;
		
		if(!usersOnline[idUser])
		{
			usersOnline[idUser] = new Object()
			usersOnline[idUser].sockets = new Array();
			usersOnline[idUser].pages = new Array();
		}
		usersOnline[idUser].username = user;
		usersOnline[idUser].pages[socket] = page;
		usersOnline[idUser].sockets.push(socket);
		
		console.log("Connexion de " + user + " à la page " + page);
	});
	
	socket.on('disconnect', function()
	{
		if(usersOnline[idUser])
		{
			var user = usersOnline[idUser].username;
			var page = usersOnline[idUser].pages[socket];
			
			usersOnline[idUser].sockets.splice(usersOnline[idUser].sockets.indexOf(socket), 1);
			delete usersOnline[idUser].pages[socket];
			
			console.log("Déconnexion de " + user + " de la page " + page);
			
			if(usersOnline[idUser].sockets.length == 0)
			{
				console.log("Déconnexion de " + usersOnline[idUser].username);
				delete usersOnline[idUser];
			}
		}
	});
	
    /*
     *
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE DE DEPLACEMENT VERS UNE DIRECTION DONNEE Renvoi
     * la case avec MOVE_PERSONNAGE_SC 
     * return : oCase_Manager[oPersonnage_Manager[idUser].GetIdSalleEnCours()].GetCopieCase() si ok
     * erreur : renvoi 0 si erreur de case
     * erreur : renvoi -1 si impossible de bouger 
     * erreur : -2 si aucun de Pts Mouvement
     * erreur : -3 si trop de goules
     * erreur : -4 si zone sure adverse
     * 
     * 
     */
    socket.on('MOVE_PERSONNAGE_CS', function (move)
	{
		console.log("*******************************************************");
		// log
		console.log('SERVER : Déplacement du personnage demandé : ' + move);
    	
		// -> calcul de goules
		var nbrGoules = oCase_Manager.GetNombreGoules(oPersonnage_Manager.GetIdSalleEnCours(idUser));
		nbrGoules = nbrGoules - oCase_Manager.GetNombreAllies(oPersonnage_Manager.GetIdSalleEnCours(idUser));
		
		// test si déplacement possible
		var testDep = oPersonnage_Manager.TestDeplacementPossible(idUser, nbrGoules, move);
		if (testDep != 1)
		{
			switch(testDep)
			{
				case -2 : // plus de PM
					console.log('SERVER : DEBUG envoi deplacement impossible : pu de PM');
					socket.emit('MOVE_PERSONNAGE_SC', -2);
					break;
					
				case -3 : // trop de goules
					console.log('SERVER : DEBUG envoi deplacement impossible : trop de goules');
					socket.emit('MOVE_PERSONNAGE_SC', -3);
					break;
			}
			return;
		}
		
		// test si pas zone sure adverse
		// on regarde le manager de la salle suivante et on teste si zone sure
		var idNextCase = oPersonnage_Manager.GetIdNextSalle(idUser, move);
		//console.log("------------------------------" + oCase_Manager[idNextCase].GetTestZoneSure(oUtilisateur_Manager.GetNumEquipe()));
		if (idNextCase == -1)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', -1);
			return;
		}
		else if (oCase_Manager.GetTestZoneSure(idNextCase, oUtilisateur_Manager.GetNumEquipe(idUser)))
		{
			
			console.log("SERVEUR : ! impossible : déplacement vers zone sûre ennemie !");
			socket.emit('MOVE_PERSONNAGE_SC', -4);
			return;
		}
		
    	// ********* algorithme de calcul de l'impact des goules *********
    	/*var restG = TestGoules();

    	console.log("actionOk ? " + restG["actionOk"]);
    	if (restG["actionOk"] == 0)
		{
			// log
			console.log("deplacement ratée à cause des goules");
			
			// retrait des points de déplacement
			oPersonnage_Manager.PerteDeplacementParGoules();
			
			// renvoi de la réponse
			socket.emit('MOVE_PERSONNAGE_SC', -5, restG["degats"]); 
			return;
		}
    	// ***************************************************************
		
        // TEST déplacement du personnage
    	//***************************************
    	nbrGoules = 0;
    	/*************************************/
		ActualiserCase(oPersonnage_Manager.GetIdSalleEnCours(idUser));
		
		// informer
		InformerPersonnages_Case("a quitté la salle.");
		// traiter
		var ansDeplacementOk = oPersonnage_Manager.Deplacement(idUser, move, nbrGoules);
		
		ActualiserCase(oPersonnage_Manager.GetIdSalleEnCours(idUser));
		
		// informer
		InformerPersonnages_Case("vient d'entrer dans la salle.");
		
		console.log("SERVEUR : code retour ans : " + ansDeplacementOk);
		// si le déplacement a réussi
		if (ansDeplacementOk == 1) 
		{
			console.log('SERVER : deplacement ok envoi de la nouvelle position');
			
			// mise en mode "oisif"
	        oPersonnage_Manager.InitialiserMode(idUser);
	        
			// enregistre dans le manager
			//oCase_Manager[oPersonnage_Manager.GetIdSalleEnCours()].ChangeCase(oPersonnage_Manager.GetIdSalleEnCours());
			
			// récupère la salle en cours
			//var oCase_Manager[oPersonnage_Manager.GetIdSalleEnCours()].GetCopieCase() = oCase_BD.GetCaseById(oPersonnage_Manager.GetIdSalleEnCours());
			//var oCase_Manager[oPersonnage_Manager.GetIdSalleEnCours()].GetCopieCase() = oCase_Manager[oPersonnage_Manager.GetIdSalleEnCours()].GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours());
			
			// renvoi la salle ou erreur
			if (oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(idUser)) == null)
				socket.emit('MOVE_PERSONNAGE_SC', 0);
			else
				socket.emit('MOVE_PERSONNAGE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(idUser)));
		}
		// si le déplacement a raté
		else if (ansDeplacementOk == -1)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', -1);
		}
		else if (ansDeplacementOk == -2)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible : pu de PM');
			socket.emit('MOVE_PERSONNAGE_SC', -2);
		}
		console.log("*******************************************************");
		//});
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM 
     * return 1 si arme équipée / déséquipée
     * return 2 si armure équipée / déséquipée
     * erreur : 0 si objet n'est pas dans le sac
     * erreur : -1 si il y a déja une arme d'équipée
     * erreur : -2 si il y a déja une armure d'équipée
     * erreur : -3 si item n'est ni arme ni armure
     * erreur : -4 si l'item a dequiper n'est pas équipé au préalable
     */
    socket.on('INV_PERSONNAGE_CS', function (type, id_item)
	{
		console.log("*******************************************************");
		
		// recupere l'currentItem
		var currentItem = oItem_Manager.GetItem(id_item);
		if (currentItem == null || typeof(currentItem) === "undefined" )
		{
			console.log("SERVEUR : erreur : id item : " + id_item);
			return;
		}
		
		// check si currentItem est bien dans le sac
		var existItemInSac = oPersonnage_Manager.ExistItemInSac(idUser, currentItem);
		
		// si l'item n'est pas dans le sac, on renvoi 0
		if (existItemInSac == false)
		{
			socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, 0);
		}
		else
		{
			// si c'est une demande pour s'équiper
			if (type == "EQUIPER")
			{
				console.log("SERVEUR : Tentative d'équipement de l'item " + currentItem.nom + " de type " + currentItem.type);
				// on équipe le perso
				 /* return 1 si ok
				 * erreur : -1 si déja une arme équipée
				 * erreur : -2 si déja une arme équipée
				 * erreur : -3 si ni une arme, ni une armure
				 */
				// demande d'équipement au manager
				var reponse = oPersonnage_Manager.SEquiper(idUser, currentItem);
				
				console.log("SERVEUR : code retour : " + reponse);
				// et selon le message renvoyé
				switch (reponse)
				{
					case 1:
						console.log("SERVEUR : equipement ok");
						socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, 1);
						break;
					case -1:
						console.log("SERVEUR : deja une arme equipee");
						socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, -1);
						break;
					case -2:
						console.log("SERVEUR : deja une armure equipee");
						socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, -2);
						break;
					case -3:
						console.log("SERVEUR : item non equipable");
						socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, -3);
						break;
					default:
						console.log("SERVEUR :equipement - SWITCH DEFAULT");
						break;
				}
			}
			else if (type == "DESEQUIPER") 
			{
				console.log("SERVEUR : demande de déséquipement de l'item " + currentItem.id +" - " + currentItem.nom);
				var r = oPersonnage_Manager.SeDesequiper(idUser, currentItem);
				if (r == -1) 
					socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, -4);
				else
					socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, currentItem.type);
			}
		}
		console.log("*******************************************************");
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE POUR RAMASSER OU DEPOSER UN ITEM 
     * 
     * return TYPE (RAMASSER OU DEPOSER)
     * 
     * ET return poidsTotal si ok 
     * erreur : -1 si poids insufisant
     * erreur : -2 si objet n'est pas dans la case / le sac 
     * erreur : -3 si objet à déposer est équipé
     * erreur : -4 si autre
     * erreur : -5 si raté par goules
     * 
     * ET return id_item
     * 
     * ET degats reçus
     * 
     * ET nbr goules attaquantes
     */
    socket.on('INV_CASE_CS', function (type, id_item)
	{
		console.log("*******************************************************");
		
		// récupère la case en cours
		//var oCase_Manager[oPersonnage_Manager.GetIdSalleEnCours()].GetCopieCase() = oCase_BD.GetCaseById(oPersonnage_Manager.GetIdSalleEnCours());

		// recupere l'currentItem
		var currentItem = oItem_Manager.GetItem(id_item);

		if (currentItem == null || typeof(currentItem) === "undefined" )
		{
			console.log("SERVEUR : erreur : id item : " + id_item);
			return;
		}
		
		// si action de type ramasser
		if (type == "RAMASSER") 
		{
			// log
			console.log("SERVER : Demande pour ramasser l'currentItem : " + id_item + " - " + currentItem.nom);

			// check si currentItem est bien dans la salle
			//var existItemInSalle = oCase_Manager[oPersonnage_Manager.GetIdSalleEnCours()].GetCopieCase().existItemInSalle(currentItem);
			var existItemInSalle = oCase_Manager.ExistItem(oPersonnage_Manager.GetIdSalleEnCours(idUser), currentItem);
			
			// si l'objet est bien dans la salle
			if (existItemInSalle == true)
			{
				//console.log("SERVER : poids sac : " + oPersonnage_Manager.GetPoidsSac() + " - poids item : " + currentItem.poids + " - poids max : " + myPerso.poidsMax);
				 // ********* algorithme de calcul de l'impact des goules *********
		    	var restG = TestGoules();
		
		    	if (restG["actionOk"] == 0)
				{
					// log
					console.log("SERVEUR : ramassage raté à cause des goules");
					
					// renvoi de la réponse
					socket.emit('INV_CASE_SC', 'RAMASSER', -5, currentItem.id, restG["degats"], restG["nbrGoulesA"]);
					return;
				}
		    	// ***************************************************************
				// demande au manager de perso d'ajouter l'item
				var r = oPersonnage_Manager.AjouterItemAuSac(idUser, currentItem);
				
				// ramassage ok
				if (r == 1)
				{
					console.log("SERVER : Demande de ramassage ok ");
						
					// suppression de l'objet de la case
					oCase_Manager.SupprimerItem(oPersonnage_Manager.GetIdSalleEnCours(idUser), currentItem);
						
			        // informer les autres joueurs
			        InformerPersonnages_Case("a ramassé l'objet " + currentItem.nom);
			    	
					// return au client
					socket.emit('INV_CASE_SC', 'RAMASSER', oPersonnage_Manager.GetPoidsSac(idUser), currentItem.id, restG["degats"], restG["nbrGoulesA"]);
					return;
				}
				else
				{
					// log
					console.log("SERVER : Demande de ramassage impossible : poids max atteint");
					
					// return au client que l'objet ne peut être ajouté (poids insufisant)
					socket.emit('INV_CASE_SC', 'RAMASSER', -1, currentItem.id, 0, 0);
					return;
				}
			} // fin if (existItemInSalle == true)
			// si l'objet n'est pas dans la case (! l'ihm n'a pas été mis à jour !)
			else
			{
				// return que l'objet n'est pas dans la case
				socket.emit('INV_CASE_SC', 'RAMASSER', -2, currentItem.id, 0, 0);
				return;
			}
			
		}
		// si action de type depose
		else if (type == "DEPOSER") 
		{
		// log
		console.log("SERVER : Demande pour deposer l'currentItem : " + id_item + " - " + currentItem.nom);
			
		// check si l'objet à déposer n'est pas équipé
		if (oPersonnage_Manager.IsItemEquipee(idUser, currentItem) == true)
			{
				console.log("APP : Objet à déposer est équipé !! ");
				socket.emit('INV_CASE_SC', 'DEPOSER', -3, currentItem.id, 0, 0);
				return;
			}
		
		
		// check si currentItem est bien dans le sac
		var existItemInSac = oPersonnage_Manager.ExistItemInSac(idUser, currentItem);

		// si l'item est bien dans le sac
		if (existItemInSac == true) {
			// ajout de l'item a la case
			oCase_Manager.AjouterItem(oPersonnage_Manager.GetIdSalleEnCours(idUser), currentItem);
			
			// suppression de l'item au perso
			oPersonnage_Manager.SupprimerDuSac(idUser, currentItem);
			
			// informer les autres joueurs
	        InformerPersonnages_Case("a déposé l'objet " + currentItem.nom);
	        
			// return au client
			socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, oPersonnage_Manager.GetPoidsSac(idUser), 0, 0);
			}
			// si l'item n'est pas dans le sac (! l'ihm n'a pas été mis à jour !)
			else {
				// return que l'item n'est pas dans le sac
				socket.emit('INV_CASE_SC', 'DEPOSER', -2, currentItem.id, 0, 0);
			}
		}
		console.log("*******************************************************");
    });
	
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFOS SUR UNE CASE 
     * Renvoi la case 
     * Si erreur : renvoi NULL
     * 
     * ET nbr allies
     * 
     * ET nbr ennemis
     */
    socket.on('INFO_CASE_CS', function ()
	{
		console.log("*******************************************************");
		
		if (oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(idUser)) == null)
		{
			socket.emit('INFO_CASE_SC', "ERREUR_CASE");
		}
		else
		{
			var numEquipe = oUtilisateur_Manager.GetNumEquipe(idUser);
			var res	= oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(idUser, numEquipe);
	    	
			socket.emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(idUser)), res.nbrAllies, res.nbrEnnemis);
		}
		
		console.log("*******************************************************");
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFO SUR LE PERSONNAGE
     */
    socket.on('INFO_PERSONNAGE_CS', function ()
	{
		socket.emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(idUser));
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
	/**************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR UTILISER UN ITEM
	 * 
	 * renvoi id item
	 * 
	 * ET return 1 si ok
	 * erreur : -1 si objet n'est pas dans le sac
	 * erreur : -2 si objet pas utilisable
	 */
    socket.on('PERSONNAGE_USE_CS', function (id_item)
    {
    	console.log("*******************************************************");
    	// recupere l'currentItem
    	var currentItem = oItem_Manager.GetItem(id_item);

    	// check si currentItem est bien dans le sac
  		var existItemInSac = oPersonnage_Manager.ExistItemInSac(idUser, currentItem);
		
  		if (existItemInSac == false)
		{
			socket.emit('PERSONNAGE_USE_CS', currentItem, -1);
		}
		else
		{
			// le personnage tente d'utiliser l'item
			var reponse = oPersonnage_Manager.Utiliser(idUser, currentItem);
				
			// et selon le message renvoyé
			if (reponse == 1) 
			{
				console.log("SERVEUR : utilisation de l'item ok");
				socket.emit('PERSONNAGE_USE_SC', 'EQUIPER', currentItem, 1);
				ActualiserCase(oPersonnage_Manager.GetIdSalleEnCours(idUser));
			}
			else
			{
				console.log("SERVEUR : impossible d'utiliser cet item !");
				socket.emit('PERSONNAGE_USE_SC', 'EQUIPER', currentItem, -2);
			}
		}
		console.log("*******************************************************");
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR CHANGER DE MODE
	 * 
	 * return mode
	 * 
	 * ET return 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -4 si déja dans ce mode
	 * erreur : -5 si raté à cause goules
	 * erreur : -10 si plus de pts actions
	 * 
	 * ET return dégats infligés
	 * 
	 * ET nbr goules attaquantes
	 */
    socket.on('PERSONNAGE_MODE_CS', function (mode)
	{
        console.log("*******************************************************");
        console.log("SERVEUR : chgt de mode demandé, de " + oPersonnage_Manager.GetMode(idUser) + " -> " + mode);
        
        // si déja dans ce mode
        if (oPersonnage_Manager.GetMode(idUser) == mode)
        {
            socket.emit('PERSONNAGE_MODE_SC', mode, -4, 0, 0);
            return;
        }
        // si c'est un passage en mode défense
        if (mode == 3)
		{
        	 if(oPersonnage_Manager.TestPtActions(idUser, "chgtMode_def"))
        	 {
             	socket.emit('PERSONNAGE_MODE_SC', mode, -10, 0, 0);
             	return;
        	 }
        	 else
        	 {
        		 // changement de mode
        		 oPersonnage_Manager.ChangementMode(idUser, mode);

        		 // réponse ok
        		 socket.emit('PERSONNAGE_MODE_SC', mode, 1, 0, 0);
        		 return;
        	 }
        }
        // si c'est un passage dans un autre mode
        
        // si pu de pts actions
        if(oPersonnage_Manager.TestPtActions(idUser, "chgtMode")){
        	socket.emit('PERSONNAGE_MODE_SC', mode, -10, 0, 0);
        	return;
        }
        
        // ********* algorithme de calcul de l'impact des goules *********
    	var restG = TestGoules();

    	if (restG["actionOk"] == 0)
		{
			// log
			console.log("SERVEUR : chgt de mode ratée à cause des goules");
			
			// renvoi de la réponse
			socket.emit('PERSONNAGE_MODE_SC', mode, -5, restG["degats"], restG["nbrGoulesA"]); 
			return;
		}
    	// ***************************************************************

    	// chgt de mode du perso
        oPersonnage_Manager.ChangementMode(idUser, mode);
    	socket.emit('PERSONNAGE_MODE_SC', mode, 1, restG["degats"], restG["nbrGoulesA"]);
    	ActualiserCase(oPersonnage_Manager.GetIdSalleEnCours(idUser));
		
    	console.log("SERVEUR : chgt de mode ok");
        console.log("*******************************************************");
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR EFFECTUER UNE FOUILLE RAPIDE
	 * 
	 * 
	 * return : 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -1 si fouille rate
	 * erreur : -5 si action raté
	 * erreur : -10 si plus de pts actions
	 * 
	 * ET return éventuels item découvert
	 * 
	 * ET return éventuel dégats infligés
	 * 
	 * ET return 1 si objet ajouté au sac, 0 si a la salle
	 * 
	 * ET return nbr ennemis découverts
	 * 
	 * ET nbr goules attaquantes
	 */
    socket.on('ACTION_FOUILLE_RAPIDE_CS', function ()
    {
    	console.log("***************** FOUILLE RAPIDE ******************************");
       
    	// si pu de pts actions
        if(oPersonnage_Manager.TestPtActions(idUser, "fouilleRapide"))
		{
        	socket.emit('ACTION_FOUILLE_RAPIDE_SC', -10, null, 0, 0, 0, 0);
        	return;
        }
        
    	// ********* algorithme de calcul de l'impact des goules *********
    	var restG = TestGoules();

    	if (restG["actionOk"] == 0)
		{
			// log
			console.log("fouille ratée à cause des goules");
			// retrait de points d'actions
			oPersonnage_Manager.PerteActionParGoules(idUser);
			// renvoi de la réponse
			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -5, null, restG["degats"], null, 0, restG["nbrGoulesA"]); 
			return;
		}
    	// ***************************************************************
    	
        // calcul si la fouille reussie
        var fouilleFrutueuse = oCase_Manager.Fouille(oPersonnage_Manager.GetIdSalleEnCours(idUser), oPersonnage_Manager.GetMultiFouille(idUser));
        var nbrEnnDecouverts = 0;
        var ennemiDecouvert = oPersonnage_Manager.ChercherEnnemi(idUser);
        // var fouilleFrutueuse = oCase_Manager[oPersonnage_Manager.GetIdSalleEnCours()].DecouverteEnnemi( , );
        
        // retrait des points d'actions
        oPersonnage_Manager.FouilleRapide(idUser);
        
        // si fouille Fructueuse détermination de l'item trouvé
        if (fouilleFrutueuse)
        {
        	console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : fouille fructueuse");
        	// tire un item aléatoire
        	var item = oItem_Manager.GetItemAleatoire();
        	// ajout au sac
        	var res = oPersonnage_Manager.AjouterItemAuSac(idUser, item);
        	        		
        	// si la res est false, c'est que l'objet na pas pu être ajouté au sac
        	// donc ajout à la salle
        	if (!res)
        		oCase_Manager.AjouterItem(oPersonnage_Manager.GetIdSalleEnCours(idUser), item);
			
        	console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : fouille fructueuse. Ajout au sac? " + res);
        	// si la fouille réussie
        	socket.emit('ACTION_FOUILLE_RAPIDE_SC',  1, item, restG["degats"], res, nbrEnnDecouverts, restG["nbrGoulesA"]); 
			ActualiserCase(oPersonnage_Manager.GetIdSalleEnCours(idUser));
        }
        else
        {
        	console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : fouille raté");
        	socket.emit('ACTION_FOUILLE_RAPIDE_SC',  -1, null, restG["degats"], null, nbrEnnDecouverts, restG["nbrGoulesA"]); 
        }
        console.log("*****************************************************************");
        
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR ATTAQUER UN AUTRE JOUEUR
	 * return 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -1 si joueur n'est plus dans la caase
	 * erreur : -5 si raté à cause goules
	 * erreur : -10 si plus de pts actions
	 * 
	 * ET return dégats infligés
	 * 
	 * ET return dégats reçus (ennemi)
	 * 
	 * ET return dégats reçues (goules)
	 * 
	 * ET nbr goules attaquantes
	 */
    socket.on('ACTION_ATTAQUE_CS', function (idPersonnageCible)
	{
		console.log("SERVER : idPersonnageCible attaque : " + idPersonnageCible);
    	// récupèration de l'id de l'user propriétaire de ce perso
    	var idCible = oUtilisateur_Manager.findIdUser(idPersonnageCible);
		
		console.log("SERVER : idCible attaque : " + idCible);
		
        // si pu de pts actions
        if(oPersonnage_Manager.TestPtActions(idUser, "attaqueEnnemi"))
        {
        	socket.emit('ACTION_ATTAQUE_SC', -10, 0, 0, 0, 0);
        	return;
        }
        
        // si plus dans la case
        if(!oPersonnage_Manager.MemeSalle(idUser, idCible))
        {
        	socket.emit('ACTION_ATTAQUE_SC', -1, 0, 0, 0, 0);
        	return;
        }
        
        // ********* algorithme de calcul de l'impact des goules *********
    	var restG = TestGoules();

    	if (restG["actionOk"] == 0)
		{
			// log
			console.log("SERVEUR : attaque ratée à cause des goules");
			
			// renvoi de la réponse
			socket.emit('PERSONNAGE_MODE_SC', -5, 0, 0, restG["degats"], restG["nbrGoulesA"]); 
			return;
		}
    	// ***************************************************************
    	
    	// mise en mode "oisif"
        oPersonnage_Manager.InitialiserMode(idUser);
        
        // combat
        var ans = oPersonnage_Manager.Attaquer(idUser, idCible);
        
        // informer les autres joueurs
        InformerPersonnages_Case("a attaqué un autre joueur ! ");
        
        // voir s'il y a des mots
        if (oPersonnage_Manager.estMort(idUser)) MettreKo(idUser, idCible);
        if (oPersonnage_Manager.estMort(idCible)) MettreKo(idCible, idUser);

        // log
        console.log("Attaque de " + idUser + " -> " + idCible +" : (" + ans.degatsInfliges + ") <-> ("+ans.degatsRecus +")");
        // return
        socket.emit('ACTION_ATTAQUE_SC', 1, ans.degatsInfliges,  ans.degatsRecus, restG["degats"], restG["nbrGoulesA"]);
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR OBTENIR LES MESSAGES EN ATTENTE
	 * return 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -1 si aucun message
	 * 
	 * ET liste messages
	 * 
	 */
    socket.on('CHECK_MSG_ATT_CS', function () {
    	if (oPersonnage_Manager.GetListMsgAtt(idUser).count > 0)
    	{
    		socket.emit('CHECK_MSG_ATT_SC', 1, oPersonnage_Manager.GetListMsgAtt(idUser));
    	}
    	else
    	{
    		socket.emit('CHECK_MSG_ATT_SC', -1);
    	}
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR ATTAQUER UNE GOULE
	 * return 2 si deux goules tuées
	 * return 1 si une goules tuée
	 * erreur : 0 si erreur interne
	 * erreur : -1 si aucune goule tuée
	 * erreut : -2 si pas de goules dans la salle
	 * 
	 * ET degats reçus
	 * 
	 * ET nbr goules attaquantes
	 * 
	 */
    socket.on('ACTION_ATTAQUE_GOULE_CS', function ()
	{
    	console.log("******************** ATTAQUE DE GOULES *****************");
    	
        // si pu de pts actions
        if(oPersonnage_Manager.TestPtActions(idUser, "attaqueGoule"))
		{
        	socket.emit('PERSONNAGE_MODE_SC', -10, 0, 0);
        }
        else
		{
			// si pas de goules dans la salle
			if (oCase_Manager.GetNombreGoules(oPersonnage_Manager.GetIdSalleEnCours(idUser)) == 0)
			{
				socket.emit('ACTION_ATTAQUE_GOULE_SC', -2, 0, 0);
			}
			else
			{
				// calcul des dégats subis
				var ans = oCase_Manager.AttaqueDeGoules(oPersonnage_Manager.GetIdSalleEnCours(idUser));
				var degatsSubis = oPersonnage_Manager.subirDegats(idUser, ans["degats"]);
				
				// goules tuées
				var goulesTues = oCase_Manager.AttaqueGoule(oPersonnage_Manager.GetIdSalleEnCours(idUser));
				
				// mise en mode "oisif"
				oPersonnage_Manager.InitialiserMode(idUser);
				
				// attaque
				oPersonnage_Manager.AttaquerGoule(idUser);
				
				// informer les perso
				InformerPersonnages_Case("a courageusement tué " + goulesTues + " goules ! ");
				
				console.log("SERVEUR : attaque goules ->  Goules tués : " + goulesTues + " - Degats " + degatsSubis);
				socket.emit('ACTION_ATTAQUE_GOULE_SC', goulesTues, degatsSubis, 0);
				console.log("*********************************************************");
			}
		}
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UN ACCUSE DE LECTURE DES MESSAGES
	 */ 
    socket.on('ACCUSE_LECTURE_MSG_CS', function ()
	{
    	console.log("SERVEUR : Effacement des messages en attente du joueur " + oUtilisateur_Manager.GetPseudo(idUser));
    	oPersonnage_Manager.EffacerMessages(idUser);
    	
    	// si le perso est KO
    	if (oPersonnage_Manager.GetSante(idUser) == 0)
    	{
    		// retablissement de la sante
    		oPersonnage_Manager.SeRetablir(idUser);
    		
    		// deplacement vers zone sure
			oPersonnage_Manager.goZoneSure(idUser);
    	}
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR RENVOYER LA LISTE DES ALLIES DANS LA CASE
	 * 
	 * return tableau associatif : [pseudo, personnageAAfficher]
	 * erreur : liste vide si aucun allié dans la case
	 */ 
    socket.on('INFO_CASE_ALLIES_CS', function ()
	{
    	console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    	// déclaration des variables
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser);
		
    	socket.emit('INFO_CASE_ALLIES_SC', liste.Allies);
		
    	console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR RENVOYER LA LISTE DES ENNEMIS DANS LA CASE
	 * 
	 * return liste des ennemis (tableau associatif) [idUtilisateur, personnageEnnemi]
	 * erreur : liste vide si aucun ennemis dans la case
	 */ 
    socket.on('INFO_CASE_ENNEMIS_CS', function ()
	{
    	console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    	// déclaration des variables
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser);
		
    	socket.emit('INFO_CASE_ENNEMIS_SC', liste.Ennemis);
		
    	console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    });
    /*  
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE POUR TOUT SAUVEGARDER (DEBUG)
     * return [actionOk, degats]
     */
    socket.on('SAVE_BD_DEBUG_CS', function ()
	{
    	SauvegardeGlobale();
    });
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * FONCTION DE TEST DE L'IMPACT DES GOULES SUR LES ACTIONS / DEPLACEMENTS DES JOUEURS
     * return [actionOk, degats]
     */
    function TestGoules()
    {
    	 // calcul si blessé par goules
        var ans = oCase_Manager.AttaqueDeGoules(oPersonnage_Manager.GetIdSalleEnCours(idUser));
        
        // informe le manager de perso des dégats
        var degatsInfliges = oPersonnage_Manager.subirDegats(idUser, ans["degats"]);

        console.log("SERVEUR -> GOULES : degats par goules : " + ans["degats"]);
        console.log("SERVEUR -> GOULES : degats infligés : " + degatsInfliges);
        console.log("SERVEUR -> GOULES : nbr goules attaquantes :  " + ans["nbrGoulesA"]);
        console.log("SERVEUR -> GOULES : action ok ? : " + ans["actionOk"]);
        
        return ans;
    }
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * FONCTION POUR INFORMER LES AUTRES JOUEURS DE LA MEME CASE D'UN EVENEMENT
     */
    function InformerPersonnages_Case(evenement)
    {
		var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalle(idUser);
		
    	for(var i in liste.Allies) 
    	{
			var id = liste.Allies[i];
			
			oPersonnage_Manager.AddMessage(id, "L'allié " + oUtilisateur_Manager.GetPseudo(idUser) + " " + evenement);
			
			if(usersOnline[id])
			{
				var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
				for(var j in usersOnline[id].sockets)
				{
					usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(idUser)), res.nbrAllies, res.nbrEnnemis);
				}
			}
		}
    	for(var i in liste.Ennemis) 
    	{
			var id = liste.Ennemis[i];
			
			oPersonnage_Manager.AddMessage(id, "Un ennemi " + evenement);
			
			if(usersOnline[id])
			{
				var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
				for(var j in usersOnline[id].sockets)
				{
					usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(idUser));
					usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(idUser)), res.nbrAllies, res.nbrEnnemis);
				}
			}
		}
    }
	
    function ActualiserCase(idCase)
    {
		var listePerso = oPersonnage_Manager.GetPersonnagesDansSalle(idCase);
		
    	for(var i in listePerso) 
    	{
			var id = listePerso[i];
			
			if(usersOnline[id])
			{
				var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
				for(var j in usersOnline[id].sockets)
				{
					usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id));
					usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(idUser)), res.nbrAllies, res.nbrEnnemis);
				}
			}
		}
    }
	
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * FONCTION DE SAUVEGARDE DE TOUTES LES DONNEES
     */
    function SauvegardeGlobale()
    {
		oUtilisateur_Manager.Save();
		oPersonnage_Manager.Save();
		oCase_Manager.Save();
    }
    /*
     * 
     *
     *
     *
     *
     *
     *
     *
    /******************************************************************************************************************
     * FONCTION POUR COMPTER LE NOMBRE D'ENNEMIS ET ALLIES DANS UNE CASE
     */
  
    /*
     * 
     * 
     * 
     * 
     * 
     *
    /******************************************************************************************************************
     * FONCTION POUR FAIRE METTRE KO UN JOUEUR
     */
    function MettreKo(idUserKo, idUserTueur)
    {
		// log
		console.log("SERVEUR : attaque() : Le joueur " + oUtilisateur_Manager.GetPseudo(idUserKo) + " vient de mourir");
		
		// transfert de son inventaire
		oPersonnage_Manager.TransfererInventaire(idUserKo);
		
		// traitement de sa mort
		oPersonnage_Manager.goZoneSure(idUserKo);
    	
    	
		// informer les autres joueurs de la case
		InformerPersonnages_Case("est KO... ");
    }
    /******************************************************************************************************************
     * FONCTION DE TEST SI UNE FOUILLE PERMET DE DECOUVRIR OU ITEM OU UNE PERSONNE
     * return [actionOk, degats]
     */
    

});


// server.listen(8080);
app.on('close', function () { // On écoute l'évènement close
    console.log('Bye bye !');
});

console.log("SERVEUR : Script lancé ! sur http://127.0.0.1:8080");
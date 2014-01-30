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

var date = new Date();
console.log(date);
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

callbackFinFouille = function(idUser)
{
	// actualiser joueurs, au cas où l'item est arrivé dans la case
	var idCase = oPersonnage_Manager.GetIdSalleEnCours(idUser);
	ActualiserAllGlobal(idCase);
	
	// si le joueur qui a fini la fouille est online
	//ActualiserGlobal(idUser);
	
};

oPersonnage_Manager.Load(callbackFinFouille);
oItem_Manager.Load();

oCase_BD.Initialiser();

oCase_Manager.Load();

/*
 * CONFIGURATION DU SERVEUR
 */
app.set('port', process.env.PORT || 443);
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
server.listen(app.get('port'), function ()
{
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
			usersOnline[idUser] = new Object();
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
		var idCasePrecedente = oPersonnage_Manager.GetIdSalleEnCours(idUser);
		
		var reponseDeplacement = oPersonnage_Manager.Deplacement(idUser, move);
		
		// on ne rafraichit que si le deplacement à réussi
		if (reponseDeplacement.id || reponseDeplacement.id >= 0)
		{
			ActualiserAllInCase(idCasePrecedente);
			ActualiserAllInCase(reponseDeplacement.id);
			
			InformerAllInCase(" vient de quitter la salle", idCasePrecedente);
			InformerAllInCase(" vient d'entrer dans la salle", reponseDeplacement.id);
		}
		
		
		socket.emit('MOVE_PERSONNAGE_SC', reponseDeplacement);
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
     * erreur : 0 si objet n'est pas dans le sac / Objet inexistant
     * erreur : -3 si item n'est ni arme ni armure
     * erreur : -4 si l'item a dequiper n'est pas équipé au préalable
     */
    socket.on('INV_PERSONNAGE_CS', function (type, id_item)
	{
		var currentItem = oItem_Manager.GetItem(id_item);
		var reponse;
		
		console.log("*******************************************************");
		
		if (type == "EQUIPER")
		{
			reponse = oPersonnage_Manager.equiper(idUser, id_item);
			socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, reponse);
			console.log("SERVEUR : INV_PERSONNAGE_CS : Equipement" + reponse);
		}
		else if (type == "DESEQUIPER") 
		{
			reponse = oPersonnage_Manager.desequiper(idUser, id_item);
			socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem, reponse);
			console.log("SERVEUR : INV_PERSONNAGE_CS : Desequipement" + reponse);
		}
		
		// actualiser l'ihm pour les perso de la meme case connectés
		ActualiserAllInCase();
		
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
     * erreur : -6 si tentative ramasser ODD dans zone sure
     * 
     * ET return id_item
     * 
     * ET degats reçus
     * 
     * ET nbr goules attaquantes
     */
    socket.on('INV_CASE_CS', function (type, id_item)
	{
		var currentItem = oItem_Manager.GetItem(id_item);
		var reponse;
		
		console.log("*******************************************************");
		
		console.log("SERVEUR : INV_CASE_CS : Demande pour " + type + " l'item : " + id_item);
		
		reponse = oPersonnage_Manager.ramasserDeposer(idUser, type, currentItem);
		
		socket.emit('INV_CASE_SC', type, reponse.reponseAction, id_item, reponse.degatSubis, reponse.nbrGoulesA);
		
		// actualiser l'ihm pour les perso de la meme case connectés
		ActualiserAllInCase();
		
		if (reponse.reponseAction > 0)
			{
				if (type == "RAMASSER") InformerAllInCase("vient de ramasser cet item : " + currentItem.nom);
				if (type == "DEPOSER")  InformerAllInCase("vient de déposer cet item : " + currentItem.nom);
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
		var liste	= oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(idUser);
		var idSalle	= oPersonnage_Manager.GetIdSalleEnCours(idUser);
		var maCase	= oCase_Manager.GetCopieCase(idSalle);
		
		socket.emit('INFO_CASE_SC', maCase, liste.nbrAllies, liste.nbrEnnemis);
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
		var monPerso = oPersonnage_Manager.GetCopiePerso(idUser);
		socket.emit('INFO_PERSONNAGE_SC', monPerso);
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
		
		var reponse = oPersonnage_Manager.Utiliser(idUser, id_item);
		
		socket.emit('PERSONNAGE_USE_SC', id_item, reponse);
		
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
		var reponse = oPersonnage_Manager.ChangementMode(idUser, mode);
		
		socket.emit('PERSONNAGE_MODE_SC', mode, reponse.reponseChargement, reponse.degatsSubis, reponse.nbrGoules);
		
		if (mode == 1) InformerAllInCase("commence à fouiller la salle");
		if (mode == 3) InformerAllInCase("se prépare au combat !");
		
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
	 * ET return éventuel dégats subis
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
       
    	var reponse = oPersonnage_Manager.fouilleRapide(idUser);
    	
    	switch(reponse.codeRetour)
    	{
    		case 1 : 
    			console.log("SERVEUR : Fouille Rapide() : Fouille réussie ! Objet découvert : " + reponse.itemDecouvert.nom);
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', 1, reponse.itemDecouvert,
    					reponse.degatSubis, 0, reponse.nbrEnnemisDecouverts, reponse.nbrGoulesA);
    			// actualiser l'ihm pour les perso de la meme case connectés
    			ActualiserAllInCase();
    			break;
    		case -1 : 
    			console.log("SERVEUR : Fouille Rapide() : Fouille ratée !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -1, null, reponse.degatSubis, 0, 
    					reponse.nbrEnnemisDecouverts, reponse.nbrGoulesA);
    			break;
    			
    		case -5 : 
    			console.log("SERVEUR : Fouille Rapide() : Intercepté par goule !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -10, null, reponse.degatSubis, 
    					0, 0, reponse.nbrGoulesA);
    			break;
    			
    		case -10 : 
    			console.log("SERVEUR : Fouille Rapide() : Pas assez de PA !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -10, null, 0, 0, 0, 0);
    			break;
    		default :
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', 0, null, 0, 0, 0, 0);
    		break;
    	}
    	console.log("***************************************************************");
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
    	// récupèration de l'id de l'user propriétaire de ce perso
    	var idCible = oUtilisateur_Manager.findIdUser(idPersonnageCible);
    	var idCase = oPersonnage_Manager.GetIdSalleEnCours(idUser);
        var ans = oPersonnage_Manager.Attaquer(idUser, idCible);
		
        // récupère les pseudo
        
		console.log("SERVER : idPersonnageCible attaqué : " + idPersonnageCible);
		
        socket.emit('ACTION_ATTAQUE_SC', ans.reponseAttaque, ans.degatsInfliges,  ans.degatsRecus, ans.degatSubisParGoules, ans.nbrGoules);
		
        // actualiser l'ihm pour les perso de la meme case connectés
		ActualiserAllInCase();
		
		InformerAllInCase("vient d'attaquer " + idPersonnageCible);
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
        if(!oPersonnage_Manager.TestPtActions(idUser, "attaqueGoule"))
		{
        	socket.emit('ACTION_ATTAQUE_GOULE_SC', -10, 0, 0);
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
				// calcul soutien alliés
				var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(idUser);
				
				// calcul des dégats subis
				var ans = oCase_Manager.AttaqueDeGoules(oPersonnage_Manager.GetIdSalleEnCours(idUser), res.nbrAllies);
				var degatsSubis = oPersonnage_Manager.subirDegats(idUser, ans["degats"]);
				
				// goules tuées
				var goulesTues = oCase_Manager.AttaqueGoule(oPersonnage_Manager.GetIdSalleEnCours(idUser));
				
				// mise en mode "oisif"
				oPersonnage_Manager.InitialiserMode(idUser);
				
				// attaque
				oPersonnage_Manager.AttaquerGoule(idUser);
				
				// informer les perso
				InformerAllInCase("a courageusement tué " + goulesTues + " goules ! ");
				
				console.log("SERVEUR : attaque goules ->  Goules tués : " + goulesTues + " - Degats " + degatsSubis);
				socket.emit('ACTION_ATTAQUE_GOULE_SC', goulesTues, degatsSubis, 0);
				
				// actualiser l'ihm pour les perso de la meme case connectés
				ActualiserAllInCase();
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
    	
    	// effacement des messages
    	oPersonnage_Manager.EffacerMessages(idUser);
    	
    	// si le perso est KO
    	if (oPersonnage_Manager.estMort(idUser))
    	{
    		// retablissement de la sante et transfert en zone sure
    		oPersonnage_Manager.SeRetablir(idUser);
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
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser, false);
    	socket.emit('INFO_CASE_ALLIES_SC', liste.Allies);
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
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser, true);
    	socket.emit('INFO_CASE_ENNEMIS_SC', liste.Ennemis);
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
     * FONCTION POUR INFORMER LES AUTRES JOUEURS DE LA MEME CASE D'UN EVENEMENT
     */
    function InformerAllInCase(evenement, idCase)
    {
    	// on récupère l'id de la case
    	if (typeof idCase === "undefined")
    		var idCase = oPersonnage_Manager.GetIdSalleEnCours(idUser);
    	
    	// on récupère la liste des persos de la case
		var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalle(idUser);
		
		var idCaseCurrentPerso;
		
		// pour chaque allié....
    	for(var i in liste.Allies) 
    	{
    		// on récupère son id
			var id = liste.Allies[i];
			
			// et son id de case
			idCaseCurrentPerso = oPersonnage_Manager.GetIdSalleEnCours(id);
			
			/* si ce n'est pas l'user qui a crée l'event 
			 * et que le joueur n'est pas mort
			 * et que le joueur est dans la meme case
			 * */
			if (id != idUser && !oPersonnage_Manager.estMort(id) && idCase == idCaseCurrentPerso)
			{
				oPersonnage_Manager.AddMessage(id, "L'allié " + oUtilisateur_Manager.GetPseudo(idUser) + " " + evenement);
			}
		}
    	
    	// pour chaque ennemi....
    	for(var i in liste.Ennemis) 
    	{
    		// on récupère son id
			var id = liste.Ennemis[i];
			
			// et son id de case
			idCaseCurrentPerso = oPersonnage_Manager.GetIdSalleEnCours(id);
			
			/* si ce n'est pas l'user qui a crée l'event 
			 * et que le joueur n'est pas mort
			 * et que le joueur est dans la meme case
			 * */
			if (id != idUser && !oPersonnage_Manager.estMort(id) && idCase == idCaseCurrentPerso)
			{
				oPersonnage_Manager.AddMessage(id, "Un ennemi " + evenement);
			}
		}
    	
    	// pour ceux qui sont en ligne, on les informe instantanément
    	ActualiserAllInCase();
    }
	
    function ActualiserAllInCase(idCase)
    {
    	// on récupère l'id de la case
    	if (typeof idCase === "undefined")
    		var idCase = oPersonnage_Manager.GetIdSalleEnCours(idUser);
		
    	// on récupère la liste des personnages de la case
		var listePerso = oPersonnage_Manager.GetPersonnagesDansSalle(idCase);
		
		// pour chaque perso de la case
    	for(var i in listePerso) 
    	{
    		// on récupère son id
			var id = listePerso[i];
			
			// si en ligne ET différent de l'user qui a crée l'event
			if(usersOnline[id] && !oPersonnage_Manager.estMort(id))
			{
				var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
				for(var j in usersOnline[id].sockets)
				{
					usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id));
					usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(idCase), res.nbrAllies, res.nbrEnnemis);
				}
			}
		}
    }
});

function ActualiserAllGlobal(idCase)
{
	var listePerso = oPersonnage_Manager.GetPersonnagesDansSalle(idCase);
	
	for(var i in listePerso) 
	{
		var id = listePerso[i];
		
		// si en ligne
		if(usersOnline[id])
		{
			var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
			for(var j in usersOnline[id].sockets)
			{
				usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id));
				usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(idCase), res.nbrAllies, res.nbrEnnemis);
			}
		}
	}
}

setInterval(function() 
{ 
   	console.log("***************** SAUVEGARDE GLOBALE DES DONNEES *****************************");
   	var date = new Date();
   	console.log("[ ! ] Sauvegarde globale ! Date: " + date);
   				
	// regain des pts move et action
	oPersonnage_Manager.nouvelleJournee();
	oCase_Manager.nouvelleJournee();
			
   	// sauvegarde de données
   	oUtilisateur_Manager.Save();
	oPersonnage_Manager.Save();
	oCase_Manager.Save();
			
			
	// maj ihms des connectés
	for(var id in usersOnline)
	{
		for(var j in usersOnline[id].sockets)
		{
			oPersonnage_Manager.AddMessage(id, "FLAAAAAAAAAAAAAAAAAAAAAAAAAAAASH ! ");
			var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
			usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id));
			usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdSalleEnCours(id)), res.nbrAllies, res.nbrEnnemis);
		}
	}
	
},  1000 * 60 * 10  ); // 1000 millisec * 60 sec * 10 min



// server.listen(8080);
app.on('close', function () { // On écoute l'évènement close
    console.log('Bye bye !');
});

console.log("SERVEUR : Script lancé ! sur http://127.0.0.1:8080");
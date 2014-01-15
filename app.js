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
var oDatabase = require('./model/database');

// require objets
//var oPersonnage = require('./model/object/Personnage');
//var oCarte      = require('./model/object/Carte');

//require persistance
var oCase_BD       = require('./persistance/Case_BD');
//var oItem_BD       = require('./persistance/Item_BD');
var oUtilisateur_BD  = require('./persistance/Utilisateur_BD');
//var oPersonnage_BD = require('./persistance/Personnage_BD');
var oCarte = require('./model/object/Carte');

//require manager
var oPersonnage_Manager  = require('./manager/Personnage_Manager');
var oItem_Manager        = require('./manager/Item_Manager');
var oCase_Manager        = require('./manager/Case_Manager');
var oUtilisateur_Manager = require('./manager/Utilisateur_Manager');

//Initialisation de la base de données
oDatabase.Initialiser();

// FLORIAN : DEFINITION DE LA DIMENSION DE LA CARTE
oCarte.Initialiser(6, 6);

var iManager    = new oItem_Manager();

var usersOnline = new Array();

var idCases = new Array();

//Indice = idUser || Valeur = manager de l'user/perso
var uManagers   = new Array();
var pManagers   = new Array();

//Indice = idCase || Valeur = caseManager de la case
var cManagers   = new Array();

oCase_BD.Initialiser();

idCases = oCase_BD.GetCasesId();
for(var i in idCases)
{
	cManagers[idCases[i]] = new oCase_Manager();
	cManagers[idCases[i]].Load(idCases[i]);
	console.log("idCases[i] =" + idCases[i]);
}

oUtilisateur_BD.GetUsersId(function(tabId)
{
	var id;
	for(var i in tabId)
	{
		id = tabId[i];

		uManagers[id] = new oUtilisateur_Manager();
		pManagers[id] = new oPersonnage_Manager();

		uManagers[id].Load(id);
		pManagers[id].Load(id);
		
		console.log("User manager de l'user " + id + " :" + uManagers[id]);
		console.log("Personnage manager de l'user " + id + " :" + pManagers[id]);
	}
});

console.log("TEST123");
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
// sessions
app.use(express.cookieParser());
app.use(express.session({secret: 'some secret key'}));

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
		options = { "username": s.username, "idEquipe": uManagers[s.idUser].GetNumEquipe(), "sessionID" : s.idUser };
		
		res.render('game', options);
		
		console.log("ID USER = " + s.idUser);
		console.log("USER MANAGER = " + uManagers[s.idUser]);
	}
});

app.put('/jeu', restrict, function fonctionJeu(req, res)
{
	var b = req.body;
	var s = req.session;
	var options = { "username": s.username, "idEquipe": uManagers[s.idUser].GetNumEquipe(), "sessionID" : s.idUser };
	
	if(b.competence == "brute" || b.competence == "explorateur" || b.competence == "chercheur")
	{
		uManagers[s.idUser].SetNumEquipe(b.equipe);
		pManagers[s.idUser].SetCompetence(b.competence);
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
	var options = { "username": s.username, "sessionID" : s.idUser, "idEquipe": uManagers[s.idUser].GetNumEquipe() };
	
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

		uManagers[s.idUser] = new oUtilisateur_Manager();
		pManagers[s.idUser] = new oPersonnage_Manager();

		uManagers[s.idUser].Load(s.idUser);
		pManagers[s.idUser].Load(s.idUser);
		
		//cManagers[pManagers[s.idUser].GetIdSalleEnCours()];
		// redirige à la page d'accueil
		res.render("accueil", optionAccueil);
		
		optionAccueil.sessionID = null;
		optionAccueil.username = null;
		
		console.log("s.idUser =" + s.idUser);
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
				console.log("Fin pManager--------------------------");
				var cManager = new oCase_Manager(pManager.GetIdSalleEnCours());
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
		
		if(uManagers[id])
		{
			numEquipe = uManagers[id].GetNumEquipe();
			
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
		if(uManagers[id])
		{
			numEquipe = uManagers[id].GetNumEquipe();
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
		
		if(uManagers[id])
		{
			numEquipe = uManagers[id].GetNumEquipe();
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
	var id = "";
    //test sessions
    socket.emit('MESSAGE_TEST', 'Vous êtes bien connecté !');
    socket.broadcast.emit('MESSAGE_TEST', 'Un autre client vient de se connecter !');
	
    console.log('SERVER : Un client est connecté !');
    //socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.GetIdSalleEnCours());

	socket.on('INFO_USER_CS', function(sessionID, username, page)
	{
		id = sessionID;
		user = username;
		
		users = new Array();
		j = 0;
		
		if(!usersOnline[id])
		{
			usersOnline[id] = new Object()
			usersOnline[id].sockets = new Array();
			usersOnline[id].pages = new Array();
		}
		usersOnline[id].username = user;
		usersOnline[id].pages[socket] = page;
		usersOnline[id].sockets.push(socket);
		
		console.log("Connexion de " + user + " à la page " + page);
	});
	
	socket.on('disconnect', function()
	{
		if(usersOnline[id])
		{
			var user = usersOnline[id].username;
			var page = usersOnline[id].pages[socket];
			
			usersOnline[id].sockets.splice(usersOnline[id].sockets.indexOf(socket), 1);
			delete usersOnline[id].pages[socket];
			
			console.log("Déconnexion de " + user + " de la page " + page);
			
			if(usersOnline[id].sockets.length == 0)
			{
				console.log("Déconnexion de " + usersOnline[id].username);
				delete usersOnline[id];
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
     * return : cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase() si ok
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
		
		// get nb allies
		var ans = GetNbPersonnages_Case();
    	
		// -> calcul de goules
		var nbrGoules = cManagers[pManagers[id].GetIdSalleEnCours()].GetNombreGoules();
		nbrGoules = nbrGoules - ans["nbAllies"];
		
		// test si déplacement possible
		var testDep = pManagers[id].TestDeplacementPossible(nbrGoules, move);
		if (testDep != 1)
			{
				switch(testDep)
				{
					case -2 : // plus de PM
						console.log('SERVER : DEBUG envoi deplacement impossible : pu de PM');
						socket.emit('MOVE_PERSONNAGE_SC', -2, 0);
						break;
						
					case -3 : // trop de goules
						console.log('SERVER : DEBUG envoi deplacement impossible : trop de goules');
						socket.emit('MOVE_PERSONNAGE_SC', -3, 0);
						break;
				}
				return;
			}
		
		// test si pas zone sure adverse
		// on regarde le manager de la salle suivante et on teste si zone sure
		var idNextCase = pManagers[id].GetIdNextSalle(move);
		//console.log("------------------------------" + cManagers[idNextCase].GetTestZoneSure(uManagers[id].GetNumEquipe()));
		if (idNextCase == -1)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', -1);
			return;
		}
		else if (idNextCase != -1 && cManagers[idNextCase].GetTestZoneSure(uManagers[id].GetNumEquipe()))
		{
			
			console.log("SERVEUR : ! impossible : déplacement vers zone sûre ennemie !");
			socket.emit('MOVE_PERSONNAGE_SC', -4, 0);
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
			pManagers[id].PerteDeplacementParGoules();
			
			// renvoi de la réponse
			socket.emit('MOVE_PERSONNAGE_SC', -5, restG["degats"]); 
			return;
		}
    	// ***************************************************************
		
        // TEST déplacement du personnage
    	//***************************************
    	nbrGoules = 0;
    	/*************************************/
		// informer
		this.InformerPersonnages_Case("a quitté la salle.");
		
		// traiter
		var ansDeplacementOk = pManagers[id].Deplacement(move, nbrGoules);
		
		// informer
		this.InformerPersonnages_Case("vient d'entrer dans  salle.");
		
		console.log("SERVEUR : code retour ans : " + ansDeplacementOk);
		// si le déplacement a réussi
		if (ansDeplacementOk == 1) 
		{
			console.log('SERVER : deplacement ok envoi de la nouvelle position');
			
			// mise en mode "oisif"
	        pManagers[id].InitialiserMode();
	        
			// enregistre dans le manager
			//cManagers[pManagers[id].GetIdSalleEnCours()].ChangeCase(pManagers[id].GetIdSalleEnCours());
			
			// récupère la salle en cours
			//var cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase() = oCase_BD.GetCaseById(pManagers[id].GetIdSalleEnCours());
			//var cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase() = cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase(pManagers[id].GetIdSalleEnCours());
			
			// renvoi la salle ou erreur
			if (cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase() == null)
				socket.emit('MOVE_PERSONNAGE_SC', 0);
			else
				socket.emit('MOVE_PERSONNAGE_SC', cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase());
		}
		// si le déplacement a raté
		else if (ansDeplacementOk == -1)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', -1);
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
		var currentItem = iManager.GetItem(id_item);
		if (currentItem == null || typeof(currentItem) === "undefined" )
			{
				console.log("SERVEUR : erreur : id item : " + id_item);
				return;
			}
		
		// check si currentItem est bien dans le sac
		var existItemInSac = pManagers[id].ExistItemInSac(currentItem);
		
		// si l'item n'est pas dans le sac, on renvoi 0
		if (existItemInSac == false)
			socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, 0);

		// si c'est une demande pour s'équiper
		if (type == "EQUIPER") {
			console.log("SERVEUR : Tentative d'équipement de l'item " + currentItem.nom + " de type " + currentItem.type);
			// on équipe le perso
			 /* return 1 si ok
			 * erreur : -1 si déja une arme équipée
			 * erreur : -2 si déja une arme équipée
			 * erreur : -3 si ni une arme, ni une armure
			 */
			// demande d'équipement au manager
			var reponse = pManagers[id].SEquiper(currentItem);
			
			console.log("SERVEUR : code retour : " + reponse);
			// et selon le message renvoyé
			switch (reponse) {
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
		} else if (type == "DESEQUIPER") 
		{
			console.log("SERVEUR : demande de déséquipement de l'item " + currentItem.id +" - " + currentItem.nom);
			var r = pManagers[id].SeDesequiper(currentItem);
			if (r == -1) 
				socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, -4);
			else
				socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, currentItem.type);
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
		//var cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase() = oCase_BD.GetCaseById(pManagers[id].GetIdSalleEnCours());

		// recupere l'currentItem
		var currentItem = iManager.GetItem(id_item);

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
			//var existItemInSalle = cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase().existItemInSalle(currentItem);
			var existItemInSalle = cManagers[pManagers[id].GetIdSalleEnCours()].ExistItem(currentItem);
			
			// si l'objet est bien dans la salle
			if (existItemInSalle == true)
			{
				//console.log("SERVER : poids sac : " + pManagers[id].GetPoidsSac() + " - poids item : " + currentItem.poids + " - poids max : " + myPerso.poidsMax);
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
				var r = pManagers[id].AjouterItemAuSac(currentItem);
				
				// ramassage ok
				if (r == 1)
				{
					console.log("SERVER : Demande de ramassage ok ");
						
					// suppression de l'objet de la case
					cManagers[pManagers[id].GetIdSalleEnCours()].SupprimerItem(currentItem);
						
			        // informer les autres joueurs
			        InformerPersonnages_Case("a ramassé l'objet " + currentItem.nom);
			    	
					// return au client
					socket.emit('INV_CASE_SC', 'RAMASSER', pManagers[id].GetPoidsSac(), currentItem.id, restG["degats"], restG["nbrGoulesA"]);
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
		if (pManagers[id].IsItemEquipee(currentItem) == true)
			{
				console.log("APP : Objet à déposer est équipé !! ");
				socket.emit('INV_CASE_SC', 'DEPOSER', -3, currentItem.id, 0, 0);
				return;
			}
		
		
		// check si currentItem est bien dans le sac
		var existItemInSac = pManagers[id].ExistItemInSac(currentItem);

		// si l'item est bien dans le sac
		if (existItemInSac == true) {
			// ajout de l'item a la case
			cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase().ajouterItem(currentItem);
			
			// suppression de l'item au perso
			pManagers[id].SupprimerDuSac(currentItem);
			
			// informer les autres joueurs
	        InformerPersonnages_Case("a déposé l'objet " + currentItem.nom);
	        
			// return au client
			socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, pManagers[id].GetPoidsSac(), 0, 0);
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
		// récupère la salle en cours
		//var cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase() = oCase_BD.GetCaseById(pManagers[id].GetIdSalleEnCours());
		// return selon la valeur de retour
		console.log("cManagers = " + cManagers[pManagers[id].GetIdSalleEnCours()]);
		if (cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase() == null)
			socket.emit('INFO_CASE_SC', "ERREUR_CASE");
		else
		{
			// obtien le nb de persos
			var ans = GetNbPersonnages_Case();
	    	
			// envoi au client
			socket.emit('INFO_CASE_SC', cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase(), ans["nbAllies"],  ans["nbEnnemis"]);
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
		console.log("USER OBJECT = -" + usersOnline[id] + "-");
		socket.emit('INFO_PERSONNAGE_SC', pManagers[id].GetCopiePerso());
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
    	var currentItem = iManager.GetItem(id_item);

    	// check si currentItem est bien dans le sac
  		var existItemInSac = pManagers[id].ExistItemInSac(currentItem);
  		if (existItemInSac == false) 
  		{
  			socket.emit('PERSONNAGE_USE_SC', id_item, -1);
  			return;
		}

    	// le personnage tente d'utiliser l'item
    	var reponse = pManagers[id].Utiliser(currentItem);
    		
    	// et selon le message renvoyé
    	if (reponse == 1) 
    	{
    		console.log("SERVEUR : utilisation de l'item ok");
    		socket.emit('PERSONNAGE_USE_SC', id_item, 1);
    	}
    	else{
    		console.log("SERVEUR : impossible d'utiliser cet item !");
    		socket.emit('PERSONNAGE_USE_SC', id_item, -2);
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
    socket.on('PERSONNAGE_MODE_CS', function (mode) {
        console.log("*******************************************************");
        console.log("SERVEUR : chgt de mode demandé, de " + pManagers[id].GetMode() + " -> " + mode);
        
        // si déja dans ce mode
        if (pManagers[id].GetMode() == mode)
        {
            socket.emit('PERSONNAGE_MODE_SC', mode, -4, 0, 0);
            return;
        }
        // si c'est un passage en mode défense
        if (mode == 3) {
        	 if(pManagers[id].TestPtActions("chgtMode_def"))
        	 {
             	socket.emit('PERSONNAGE_MODE_SC', mode, -10, 0, 0);
             	return;
        	 }
        	 else
        	 {
        		 // changement de mode
        		 pManagers[id].ChangementMode(mode);

        		 // réponse ok
        		 socket.emit('PERSONNAGE_MODE_SC', mode, 1, 0, 0);
        		 return;
        	 }
        }
        // si c'est un passage dans un autre mode
        
        // si pu de pts actions
        if(pManagers[id].TestPtActions("chgtMode")){
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
        pManagers[id].ChangementMode(mode);
    	console.log("SERVEUR : chgt de mode ok");
    	socket.emit('PERSONNAGE_MODE_SC', mode, 1, restG["degats"], restG["nbrGoulesA"]);
    	 
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
        if(pManagers[id].TestPtActions("fouilleRapide"))
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
    			pManagers[id].PerteActionParGoules();
    			// renvoi de la réponse
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -5, null, restG["degats"], null, 0, restG["nbrGoulesA"]); 
    			return;
    		}
    	// ***************************************************************
    	
        // calcul si la fouille reussie
        var fouilleFrutueuse = cManagers[pManagers[id].GetIdSalleEnCours()].Fouille(pManagers[id].GetMultiFouille());
        var nbrEnnDecouverts = 0;
        var ennemiDecouvert;
        // pour chaque personnage caché de la salle, calcul s'il est découvert
    	for(var idUser in pManagers) 
    	{
    		// si le perso en cours est dans la meme salle ET en mode planqué
    		if(pManagers[idUser].GetIdSalleEnCours() == pManagers[id].GetIdSalleEnCours() 
    				&& pManagers[idUser].mode == 2)
    		{
    			console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : id salle : " + pManagers[idUser].GetIdSalleEnCours());
    			// si équipe différente
    			if (uManagers[idUser].GetNumEquipe() != uManagers[idUser].GetNumEquipe(id))
    			{
    				console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : : " + uManagers[idUser].GetNumEquipe());
    				ennemiDecouvert = cManagers[pManagers[id].GetIdSalleEnCours()].DecouverteEnnemi(pManagers[id].GetMultiFouille(), pManagers[idUser].GetMultiCache());
    				if (ennemiDecouvert)
    				{
    					console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : ennemi découvert lors d'une fouille !");
    					// incrémente nombre découvertes
    					nbrEnnDecouverts++;
    					
    					// modifie le mode du perso découvert
    					pManagers[idUser].Decouvert();
    				}
    			}
    		}
    	}
        // var fouilleFrutueuse = cManagers[pManagers[id].GetIdSalleEnCours()].DecouverteEnnemi( , );
        
        // retrait des points d'actions
        pManagers[id].FouilleRapide();
        
        // si fouille Fructueuse détermination de l'item trouvé
        if (fouilleFrutueuse)
        {
        	console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : fouille fructueuse");
        	// tire un item aléatoire
        	var item = iManager.GetItemAleatoire();
        	// ajout au sac
        	var res = pManagers[id].AjouterItemAuSac(item);
        	        		
        	// si la res est false, c'est que l'objet na pas pu être ajouté au sac
        	// donc ajout à la salle
        	if (!res)
        		cManagers[pManagers[id].GetIdSalleEnCours()].AjouterItem(item);
        	      		
        	console.log("SERVEUR : ACTION_FOUILLE_RAPIDE_CS : fouille fructueuse. Ajout au sac? " + res);
        	// si la fouille réussie
        	socket.emit('ACTION_FOUILLE_RAPIDE_SC',  1, item, restG["degats"], res, nbrEnnDecouverts, restG["nbrGoulesA"]); 
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
    socket.on('ACTION_ATTAQUE_CS', function (idPersonnageCible) {
    	
    	// récupèration de l'id de l'user propriétaire de ce perso
    	var idCible;
    	for (idUser in uManagers)
    		{
    			if (uManagers[idUser].GetIdPersonnage() == idPersonnageCible)
    			{
    				idCible = idUser;
    				break;
    			}
    		}
    	
        // si pu de pts actions
        if(pManagers[id].TestPtActions("attaqueEnnemi"))
        {
        	socket.emit('ACTION_ATTAQUE_SC', -10, 0, 0, 0, 0);
        	return;
        }
        
        // si plus dans la case
        if(pManagers[idCible].GetIdSalleEnCours() != pManagers[id].GetIdSalleEnCours())
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
        pManagers[id].InitialiserMode();
        
        // combat
        var ans = pManagers[id].Attaquer(pManagers[idCible]);
        
        // informer les autres joueurs
        InformerPersonnages_Case("a attaqué un autre joueur ! ");
        if (pManagers[id].GetPtsSante() <= 0)
        	{
        		// log
        		console.log("SERVEUR : attaque() : Le joueur " + uManagers[id].GetPseudo() + " vient de mourir");
        		// traitement de sa mort
        		pManagers[id].Mourir(uManagers[idCible].GetPseudo());
        		// informer les autres joueurs de la case
        		InformerPersonnages_Case("est KO... ");
        	}
        if (pManagers[idCible].GetPtsSante() <= 0)
        	{
        		// log
        		console.log("SERVEUR : attaque() : Le joueur " + uManagers[id].GetPseudo() + " vient de mourir");
        		 // traitement de sa mort
        		pManagers[idCible].Mourir(uManagers[id].GetPseudo());
        		// informer les autres joueurs de la case
        		InformerPersonnages_Case("est KO... ");
        	}
        
        
        // log
        console.log("Attaque de " + id + " -> " + idCible +" : (" + ans.degatsInfliges + ") <-> ("+ans.degatsRecus +")");
        // return
        socket.emit('ACTION_ATTAQUE_SC', 1, degatsInfliges, degatsRecus, restG["degats"], restG["nbrGoulesA"]);
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
    	if (pManager[id].GetListMsgAtt().count > 0)
    	{
    		socket.emit('CHECK_MSG_ATT_SC', 1, pManager[id].GetListMsgAtt());
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
    socket.on('ACTION_ATTAQUE_GOULE_CS', function () {
    	console.log("******************** ATTAQUE DE GOULES *****************");
    	
        // si pu de pts actions
        if(pManagers[id].TestPtActions("attaqueGoule")){
        	socket.emit('PERSONNAGE_MODE_SC', -10, 0, 0);
        	return;
        }
        
    	// si pas de goules dans la salle
    	if (cManagers[pManagers[id].GetIdSalleEnCours()].GetNombreGoules() == 0)
    	{
    		socket.emit('ACTION_ATTAQUE_GOULE_SC', -2, 0, 0);
    		return;
    	}
    	
    	// mise en mode "oisif"
        pManagers[id].InitialiserMode();
        
    	// calcul des dégats subis
    	var ans = cManagers[pManagers[id].GetIdSalleEnCours()].AttaqueDeGoules();
    	var degatsSubis = pManagers[id].DiminuerSante(ans["degats"]);
    	
    	// attaque
    	pManagers[id].AttaquerGoule();
    	
    	// goules tuées
    	var goulesTues = cManagers[pManagers[id].GetIdSalleEnCours()].AttaqueGoule();
    	
    	// informer les perso
    	InformerPersonnages_Case(" a courageusement tué " + goulesTues + " goules ! ");
    	
    	console.log("SERVEUR : attaque goules ->  Goules tués : " + goulesTues + " - Degats " + degatsSubis);
    	socket.emit('ACTION_ATTAQUE_GOULE_SC', goulesTues, degatsSubis, 0);
    	console.log("*********************************************************");
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
    socket.on('ACCUSE_LECTURE_MSG_CS', function () {
    	console.log("SERVEUR : Effacement des messages en attente du joueur " + uManagers[id].GetPseudo());
    	pManagers[id].EffacerMessages();
    	
    	// si le perso est KO
    	if (pManagers[id].GetSante() == 0)
    	{

    		// retablissement de la sante
    		pManager[id].SeRetablir(uManager[id]);
    		
    		// deplacement vers zone sure
    		if (uManager[id].GetNumEquipe == 1)
    			pManager[id].GoCaseById(
    					cManager[pManager[id].GetIdSalleEnCours()].idZoneSure1);
    		else
    			pManager[id].GoCaseById(
    					cManager[pManager[id].GetIdSalleEnCours()].idZoneSure2);
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
    socket.on('INFO_CASE_ALLIES_CS', function () {
    	console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    	// déclaration des variables
    	var listeAllies = new Array();
    	var idSalle = pManagers[id].GetIdSalleEnCours();
    	
    	
    	// construction de la liste
    	for(var idUser in pManagers) 
    	{
    		// si le perso en cours est dans la meme salle
    		if(id != idUser && pManagers[idUser].GetIdSalleEnCours() == idSalle)
    		{
    			//console.log("------ id salle : " + pManagers[idUser].GetIdSalleEnCours());
    			// si l'user correspondant au perso est de la meme équipe
    			if (uManagers[id].GetNumEquipe() == uManagers[idUser].GetNumEquipe())
    			{
    				//console.log("------ num equipe : " + uManagers[idUser].GetNumEquipe());
    				//listeAllies[idUser] = (pManagers[idUser].getPersonnageToDisplay());
    				listeAllies.push(pManagers[idUser].getPersonnageToDisplay());
    				console.log("---------- AJOUT DE DU PERSO DE " + uManagers[idUser].GetPseudo());
    			}
    		}
    	}
    /*	var size = 0;
    	 for (var key in listeAllies) 
    	    {
    	        if (listeAllies.hasOwnProperty(key)) size++;
    	        console.log("------- key = " + key);
    	    }*/
    	//console.log("SERVEUR : INFO_CASE_ALLIES_CS : taille de la liste des alliés = " + size);
    	socket.emit('INFO_CASE_ALLIES_SC', listeAllies);
    	//console.log("SERVEUR : INFO_CASE_ALLIES_CS : taille de la liste des alliés = " + size);
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
    socket.on('INFO_CASE_ENNEMIS_CS', function () {
    	console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    	// déclaration des variables
    	var listeEnn = new Array();
    	var idSalle = pManagers[id].GetIdSalleEnCours();
    	
    	
    	// construction de la liste
    	for(var idUser in pManagers) 
    	{
    		// si le perso en cours est dans la meme salle
    		if(pManagers[idUser].GetIdSalleEnCours() == idSalle && pManagers[idUser].GetMode != 2)
    		{
    			console.log("------ id salle : " + pManagers[idUser].GetIdSalleEnCours());
    			// si l'user correspondant au perso est de la meme équipe
    			if (uManagers[id].GetNumEquipe() == uManagers[idUser].GetNumEquipe())
    			{
    				console.log("------ num equipe : " + uManagers[idUser].GetNumEquipe());
    				listeEnn.push(pManagers[idUser].getPersonnageToDisplay());
    			}
    		}
    	}
    /*	var size = 0;
   	 for (var key in listeEnn) 
   	    {
   	        if (listeEnn.hasOwnProperty(key)) size++;
   	        console.log("------- key = " + key);
   	    }*/
   	 //console.log("SERVEUR : INFO_CASE_ALLIES_CS : taille de la liste des ennemis = " + size);
    	socket.emit('INFO_CASE_ENNEMIS_SC', listeEnn);
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
    socket.on('SAVE_BD_DEBUG_CS', function () {
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
        var ans = cManagers[pManagers[id].GetIdSalleEnCours()].AttaqueDeGoules();
        
        // informe le manager de perso des dégats
        var degatsInfliges = pManagers[id].DiminuerSante(ans["degats"]);

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
    	// personnages
    	for(var idUser in pManagers) 
    	{
    		// si c'est pas le perso qui à créé l'event et si le perso en cours est dans la meme salle
    		if(idUser != id && pManagers[idUser].GetIdSalleEnCours() == pManagers[id].GetIdSalleEnCours())
    		{ 
    			// si l'user correspondant au perso est de la meme équipe
    			if (uManagers[id].GetNumEquipe() == uManagers[idUser].GetNumEquipe())
    			{
    				pManagers[idUser].AddMessage("L'allié " + uManagers[id].GetPseudo() + evenement);
    			}
    			// sinon 
    			else 
    			{
    				pManagers[idUser].AddMessage("Un ennemi " + evenement);
    			}
    			if(usersOnline[idUser])
				{
					for(var i in usersOnline[idUser].sockets)
					{
						
						//////////////
						var ans = GetNbPersonnages_Case();
				    	usersOnline[idUser].sockets[i].emit('INFO_PERSONNAGE_SC', pManagers[idUser].GetCopiePerso());
						usersOnline[idUser].sockets[i].emit('INFO_CASE_SC', cManagers[pManagers[id].GetIdSalleEnCours()].GetCopieCase(), ans["nbAllies"],  ans["nbEnnemis"]);
					}
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
		var tmpUManagers = uManagers.slice();
		var tmpPManagers = pManagers.slice();
		var tmpCManagers = cManagers.slice();
		
    	// utilisateurs
    	for(var idUser in tmpUManagers) 
    	{
    		tmpUManagers[idUser].Save();
    	}
    	
    	// personnages
    	for(var idUser in tmpPManagers) 
    	{
    		tmpPManagers[idUser].Save();
    	}
    	
    	// cases
    	for(var idCase in tmpCManagers) 
    	{
    		tmpCManagers[idCase].Save();
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
     * FONCTION POUR COMPTER LE NOMBRE D'ENNEMIS ET ALLIES DANS UNE CASE
     */
    function GetNbPersonnages_Case()
    {
    	// nbrAllies = -1 car le personnage qui fait la demande va être compté
		var nbrAllies = -1, nbrEnnemis = 0;
		// construction de la liste
    	for(var idUser2 in pManagers) 
    	{
    		// si le perso en cours est dans la meme salle
    		if(pManagers[idUser2].GetIdSalleEnCours() == pManagers[id].GetIdSalleEnCours())
    		{
    			// si l'user correspondant au perso est de la meme équipe
    			if (uManagers[id].GetNumEquipe() == uManagers[idUser2].GetNumEquipe())
    			{
    				nbrAllies++;
    			}
    			// sinon et si il n'est pas caché
    			else if (pManagers[idUser2].GetMode != 2)
    			{
    				nbrEnnemis++;
    			}
    		}
    	}
    	
        var a = {
            "nbAllies"	: nbrAllies,
            "nbEnnemis" : nbrEnnemis,
        };
    return a;
    }

    
    /******************************************************************************************************************
     * FONCTION DE TEST SI UNE FOUILLE PERMET DE DECOUVRIR OU ITEM OU UNE PERSONNE
     * return [actionOk, degats]
     */

    /***************************************************************************
     * RECEPTION D'UNE DEMANDE SI UN UTILISATEUR EST CONNECTE
     */
    /*socket.on('USER_CONNECTED_CS', function () {
        socket.get('session_user_id', function (error, id) {
            if (id == null)
                socket.emit('USER_CONNECTED_CS', false);
            else
                socket.emit('USER_CONNECTED_CS', true);
        }); 
    });*/
    
    

});


// server.listen(8080);
app.on('close', function () { // On écoute l'évènement close
    console.log('Bye bye !');
});

console.log("SERVEUR : Script lancé ! sur http://127.0.0.1:8080");
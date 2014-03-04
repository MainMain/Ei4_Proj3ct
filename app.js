/*
 * *************************** 1 - IMPORTATION DES MODULES REQUIS ***************************
 */
var oDatabase	= require('./model/database');

var url         = require("url");
var querystring = require('querystring');
var express     = require('express'),
    routes      = require('./routes'),
    http        = require('http'),
    path        = require('path');
var app         = express();
var server      = http.createServer(app);
var oEventLog    = require('./model/EventLog');

// require objets
var oCarte	= require('./model/object/Carte');

//require persistance
var oCase_BD       = require('./persistance/Case_BD');
var oUtilisateur_BD  = require('./persistance/Utilisateur_BD');

// require manager
var oPersonnage_Manager  = require('./manager/Personnage_Manager');
var oItem_Manager        = require('./manager/Item_Manager');
var oCase_Manager        = require('./manager/Case_Manager');
var oUtilisateur_Manager = require('./manager/Utilisateur_Manager');
var oScore_Manager       = require('./manager/Score_Manager');
var oSession_Manager	 = require('./manager/Session_Manager');

/*
 * *************************** 2 - CHARGEMENT EN MEMOIRE DES DONNES ***************************
 */
 
//Initialisation des log
oEventLog.init();

var dateLancementSrv = new Date();
oEventLog.log(dateLancementSrv);

//Tableau des utilisateur en ligne
var usersOnline = new Array();

//Initialisation de la base de données
oDatabase.Initialiser();

// FLORIAN : DEFINITION DE LA DIMENSION DE LA CARTE
oCarte.Initialiser(28, 17);

// Chargement des utilisateurs en mémoire
oUtilisateur_Manager.Load();

// Chargement des personnages en mémoire
// le callback est réservé pour la fin des fouilles...
// ... et rafraichi l'affichage
oPersonnage_Manager.Load(function(idUser)
{
	// actualiser joueurs, au cas où l'item est arrivé dans la case
	var idCase = oPersonnage_Manager.GetIdCase(idUser);
	
	
	ActualiserAllGlobal(idCase);
});

// Chargement de la liste des items en mémoire
oItem_Manager.Load();

// Chargement des cases en mémoire
oCase_Manager.Load();

//////////////TEST SESSIONJEU
var date = new Date(2016, 12, 1, 1, 1, 1, 1);
//oSession_Manager.demarrer(date);

// Chargement des sessions de jeu en mémoire
oSession_Manager.Load(function(idSession)
{
	oScore_Manager.Load(idSession);
});


/*
 * *************************** 3 - CONFIGURATION DU SERVEUR ***************************
 */


app.set('port', process.env.PORT || 25536);

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
app.use(function(req, res, next)
{
	res.status(404);
	
	res.send('Not found');
});


/*
 * *************************** 4 - CONFIGURATION DES ROUTES ***************************
 */

var optionAccueil = {
	"username": null,
	"errorLogin": null,
	"InfoInscription": null,
	"usernameInscription": null,
	"sessionID": null,
	"dateFinSession": null};

function restrict(req, res, next)
{
	var idSession = oSession_Manager.getIdSessionEnCours();
	oEventLog.log("IdSession : " + idSession + " ! ");
	if (req.session.username && idSession >= 0)
	{
		next();
	}
	else
	{
		if(!req.session.username)
		{
			optionAccueil.errorLogin = 'Veuillez vous connectez !';
		}
		else
		{
			optionAccueil.username = req.session.username;
		}
		
		if(idSession < 0)
		{
			optionAccueil.errorLogin = 'Aucune session en cours !';
		}
		else
		{
			optionAccueil.dateFinSession = req.session.username;
		}
		
		res.render('accueil', optionAccueil);
		
		optionAccueil.username = null;
		optionAccueil.errorLogin = null;
	}
}

function restrictAdmin(req, res, next)
{
	if(	   req.session.username == "a" 
		|| req.session.username == "Brendiche" 
		|| req.session.username == "MainMain" 
		|| req.session.username == "Flow" 
		|| req.session.username == "BibiBibouch" 
		|| req.session.username == "papa")
	{
		next();
	}
	else
	{
		res.status(404);
		
		res.send('Not found');
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

app.get('/admin', restrictAdmin, function fonctionAdmin(req, res)
{
	var s = req.session;
	var options = { "username" : s.username, "sessionID" : s.idUser, "dateDebut" : null, "dateFin" : null};

try
{	
	options.dateDebut = oSession_Manager.getDateDebut().toLocaleString();
	options.dateFin = oSession_Manager.getDateFin().toLocaleString();
}
catch(Err)
{
	oEventLog.error("Erreur acces admin : " + Err);
}	
	res.render('admin', options);
}
);

app.post('/admin', restrictAdmin, function fonctionAdmin(req, res)
{
	var s = req.session;
	var idUser = req.param("idUser");
	var options = { "username" : s.username, "sessionID" : s.idUser, "dateDebut" : null, "dateFin" : null};
	
try
{
	options.dateDebut = oSession_Manager.getDateDebut().toLocaleString();
	options.dateFin = oSession_Manager.getDateFin().toLocaleString();
}
catch(Err) {
oEventLog.error("ERREUR ADMIN");
}	
	oPersonnage_Manager.deletePerso(idUser);
	
	if(usersOnline[idUser])
	{
		for(var i in usersOnline[idUser].sockets)
		{
			usersOnline[idUser].sockets[i].emit("DECONEXION_SC", "Un administrateur a supprimé votre compte ! Vous allez être déconnecté.");
		}
	}
	
	res.render('admin', options);
});

app.put('/admin', restrictAdmin, function fonctionAdmin(req, res)
{
	var s		= req.session;
	var action	= req.param("action");
	var year	= parseInt(req.param("year"));
	var month	= parseInt(req.param("month"));
	var day		= parseInt(req.param("day"));
	var options = { "username" : s.username, "sessionID" : s.idUser, "dateDebut" : null, "dateFin" : null};

try
{	
	options.dateDebut = oSession_Manager.getDateDebut().toTimeString();
	options.dateFin = oSession_Manager.getDateFin().toLocaleString();
}
catch(Err)
{
	oEventLog.error("Erreur zone admin : " + Err);
}	
	var date = new Date(year, month, day, 0, 0, 0, 0);
	
	switch(action)
	{
		case "demarrer":
			oSession_Manager.demarrer(date);
			break;
		case "update":
			oSession_Manager.definirDateFin(date);
			break;
		case "stop":
			oSession_Manager.stopper();
			break;
		case "remplir":
			oCase_Manager.RemplirCases();
			break;
	}
	res.render('admin', options);
});

app.get('/jeu', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options;
	
	var isUpToDate = (oSession_Manager.getIdSessionEnCours() == oUtilisateur_Manager.getIdSession(s.idUser));
	options = { "username": s.username, "idEquipe": oUtilisateur_Manager.GetNumEquipe(s.idUser), "sessionID" : s.idUser, "isUpToDate" : isUpToDate};
	
	oEventLog.log("Id Session En Cours : " + oSession_Manager.getIdSessionEnCours());
	oEventLog.log("Id Session Du Joueur : " + oUtilisateur_Manager.getIdSession(s.idUser));
	
	res.render('game', options);
});

app.put('/jeu', restrict, function fonctionJeu(req, res)
{
	var b = req.body;
	var s = req.session;
	var idSession = oSession_Manager.getIdSessionEnCours();
	var isUpToDate = (idSession == oUtilisateur_Manager.getIdSession(s.idUser));
	var options = { 
		"username": s.username, 
		"idEquipe": oUtilisateur_Manager.GetNumEquipe(s.idUser), 
		"sessionID" : s.idUser,
		"isUpToDate" : isUpToDate
		};
	
	if(b.competence == "brute" || b.competence == "explorateur" || b.competence == "chercheur")
	{
		var idSession = oSession_Manager.getIdSessionEnCours();
		oUtilisateur_Manager.SetNumEquipe(s.idUser, b.equipe, idSession);
		oPersonnage_Manager.SetCompetence(s.idUser, b.competence, b.equipe);
		options.idEquipe = b.equipe;
		options.isUpToDate = (oSession_Manager.getIdSessionEnCours() == oUtilisateur_Manager.getIdSession(s.idUser));
	}
	
	res.render('game', options);
});

app.get('/tutoriel', function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username": s.username, 
		"sessionID" : s.idUser 
		};
	
	res.render('tutoriel', options);
});

app.get('/regles', function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username": s.username, 
		"sessionID" : s.idUser 
		};
	
	res.render('regles', options);
});

app.get('/chat-equipe', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var idSession = oSession_Manager.getIdSessionEnCours();
	var isUpToDate = (idSession == oUtilisateur_Manager.getIdSession(s.idUser));
	var options = { 
		"username": s.username, 
		"sessionID" : s.idUser, 
		"idEquipe": oUtilisateur_Manager.GetNumEquipe(s.idUser),
		"isUpToDate" : isUpToDate
		};
	
	res.render('chat-equipe', options);
});

app.get('/classement', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username":s.username, 
		"sessionID" : s.idUser, 
		"order" : 0 
		};
	
	res.render('classement', options);
});

app.get('/classement/:order([0-9])', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var order = req.param('order');
	var options = { 
		"username":s.username, 
		"sessionID" : s.idUser, 
		"order" : order 
		};
	
	oEventLog.log("order = " + order);
	
	res.render('classement', options);
});

app.get('/chat-general', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username": s.username, 
		"sessionID" : s.idUser 
		};
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
		oEventLog.log("REPONSE CONNEXION =" + reponseConnexion);
		
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
		// ajout de l'objet score pour la session de jeu en cours
		oScore_Manager.nouveauJoueur(reponseInscription, oSession_Manager.getIdSessionEnCours());
		
		res.render("accueil", optionAccueil);
		
		optionAccueil.usernameInscription = null;
	}
},

app.delete("/", function (req, res)
{
	oEventLog.log("OH : Deconnexion de " + req.session.username);
	req.session.destroy();
	res.render('accueil', optionAccueil);
});


/*
 * *************************** 5- LANCEMENT DU SERVEUR ***************************
 */
server.listen(app.get('port'), function ()
{
    oEventLog.log("Express server listening on port " + app.get('port'));
});


var io = require('socket.io').listen(server, { log: false });



/*
 * *************************** 6 - CONFIGURATION DES TCHATS ***************************
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
				oEventLog.log("L'utilisateur " + user + " s'est connecté au chat d'equipe.");
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
					oEventLog.log("Déconnexion de " + usersInTeamChat[id].username + " du chat");
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
			oEventLog.log("L'utilisateur " + user + " s'est connecté au chat.");
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
				oEventLog.log("Déconnexion de " + usersInGeneralChat[id].username + " du chat");
				delete usersInGeneralChat[id];
			}
			
			for(var i in usersInGeneralChat)
			{
				users[j] = usersInGeneralChat[i].username;
				oEventLog.log("User :" + usersInGeneralChat[i].username);
				j++;
			}
			chat.emit("USER_CONNECTED_SC", users);
		}
	});
});


/*
 * *************************** 7 - INTERACTIONS AVEC UN CLIENT CONNECTE ***************************
 */
io.sockets.on('connection', function (socket)
{
	var idUser = "";
	var pseudoUser;
    //test sessions
    socket.emit('MESSAGE_TEST', 'Vous êtes bien connecté !');
    socket.broadcast.emit('MESSAGE_TEST', 'Un autre client vient de se connecter !');
	
    oEventLog.log('SERVER : Un client est connecté !');
    //socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.GetIdCase());

	socket.on('INFO_USER_CS', function(sessionID, username, page, param)
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
		
		// charger le pseudo du joueur en mémoire
		pseudoUser = username;
		oEventLog.log(">>> Pseudo chargé en mémoire ! Utilisateur -> "+username);
		
		if(page == "classement")
		{
			scores = oScore_Manager.getScoreCurrentSession(param);
			socket.emit('CLASSEMENT_SC', scores);
		}
		

		

		if(page == "admin")
		{
			users = oUtilisateur_Manager.getUsers();
			socket.emit('USERS_ADMIN_SC', users);
		}
		
		if(page == "adminEdit")
		{
			user = oUtilisateur_Manager.getUser(param);
			socket.emit('EDIT_ADMIN_SC', user);
		}
		
		oEventLog.log("Connexion de " + user + " à la page " + page);

	});
	
	socket.on('disconnect', function()
	{
		if(usersOnline[idUser])
		{
			var user = usersOnline[idUser].username;
			var page = usersOnline[idUser].pages[socket];
			
			usersOnline[idUser].sockets.splice(usersOnline[idUser].sockets.indexOf(socket), 1);
			delete usersOnline[idUser].pages[socket];
			
			oEventLog.log("Déconnexion de " + user + " de la page " + page);
			
			if(usersOnline[idUser].sockets.length == 0)
			{
				oEventLog.log("Déconnexion de " + usersOnline[idUser].username);
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
     * return : oCase_Manager[oPersonnage_Manager[idUser].GetIdCase()].GetCopieCase() si ok
     * erreur : renvoi 0 si erreur de case
     * erreur : renvoi -1 si impossible de bouger 
     * erreur : -2 si aucun de Pts Mouvement
     * erreur : -3 si trop de goules
     * erreur : -4 si zone sure adverse
     * erreur : -100 si erreur interne
     * 
     */
    socket.on('MOVE_PERSONNAGE_CS', function (move)
	{
		oEventLog.log("****************** MOVE_PERSONNAGE_CS - EMETTEUR : " + pseudoUser +" ********************");
		
		//try
		//{
			var idCasePrecedente = oPersonnage_Manager.GetIdCase(idUser);
			var idCaseApsDepl;
			var reponseDeplacement = oPersonnage_Manager.Deplacement(idUser, move);
		
		// on ne rafraichit que si le deplacement à réussi
		if (reponseDeplacement || reponseDeplacement >= 0)
		{
			 idCaseApsDepl =  oPersonnage_Manager.GetIdCase(idUser);
			/* instruction suivante en commentaire car si le perso ne change pas de case...
			   ... le rafraichissement est inutile */
			//ActualiserAllInCase(idCasePrecedente);
			
			// si on chaque de case (pas pas que de sous case)
			if (idCasePrecedente != idCaseApsDepl)
			{
				InformerAllInCase(" vient de quitter la salle", idCasePrecedente);
				InformerAllInCase(" vient d'entrer dans la salle", idCaseApsDepl);
			}
			else
			{
				//ActualiserAllInCase(reponseDeplacement);
			}
		}
		
		oEventLog.log(pseudoUser + " - APP : Réponse déplacement " + reponseDeplacement);
		socket.emit('MOVE_PERSONNAGE_SC', reponseDeplacement);
		/*}
		catch(err)
		{

			oEventLog.log("/!\\ ERREUR : SERVEUR : MOVE_PERSONNAGE : " + err);

			oEventLog.error("/!\\ ERREUR : SERVEUR : MOVE_PERSONNAGE : " + err);

			return;
		}*/
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
		oEventLog.log("****************** INV_PERSONNAGE_CS - EMETTEUR : " + pseudoUser +" ********************");
		try
		{
		var currentItem = oItem_Manager.GetItem(id_item);
		var reponse;
		

		oEventLog.log("*******************************************************");
		

		if (type == "EQUIPER")
		{
			reponse = oPersonnage_Manager.equiper(idUser, id_item);
			socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, reponse);

			oEventLog.log("SERVEUR : INV_PERSONNAGE_CS : Equipement" + reponse);

			oEventLog.log(pseudoUser + " - APP : Réponse équipement " + reponse);

		}
		else if (type == "DESEQUIPER") 
		{
			reponse = oPersonnage_Manager.desequiper(idUser, id_item);
			socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem, reponse);

			oEventLog.log("SERVEUR : INV_PERSONNAGE_CS : Desequipement" + reponse);

			oEventLog.log(pseudoUser + " - APP : Réponse déquipement " + reponse);

		}
		
		// actualiser l'ihm pour les perso de la meme case connectés
		//ActualiserAllInCase();

		
		oEventLog.log("*******************************************************");

		}
		catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : INV_PERSONNAGE_CS : " + err);
			return;
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
		oEventLog.log("****************** INV_CASE - EMETTEUR : " + pseudoUser +" ********************");
		try
		{
		var currentItem = oItem_Manager.GetItem(id_item);
		var reponse;
		

		oEventLog.log("*******************************************************");
		
		oEventLog.log("SERVEUR : INV_CASE_CS : Demande pour " + type + " l'item : " + id_item);

		
		// délègue au manager
		reponse = oPersonnage_Manager.ramasserDeposer(idUser, type, currentItem);
		
		// répond au client
		socket.emit('INV_CASE_SC', type, reponse.reponseAction, id_item, reponse.degatSubis, reponse.nbrGoulesA);
		
		// actualiser l'ihm pour les perso de la meme case connectés
		ActualiserAllInCase();
		
		// informe les autres joueurs
		if (reponse.reponseAction > 0)
			{
				if (type == "RAMASSER") InformerAllInCase("vient de ramasser cet item : " + currentItem.nom);
				if (type == "DEPOSER")  InformerAllInCase("vient de déposer cet item : " + currentItem.nom);
			}

		
		
		oEventLog.log("*******************************************************");

		}
		catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : INV_CASE_CS : " + err);
		}
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
		oEventLog.log("****************** INFO_CASE_CS - EMETTEUR : " + pseudoUser +" ********************");
		try
		{
		var liste		= oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(idUser);
		var idSalle		= oPersonnage_Manager.GetIdCase(idUser);
		var idSousSalle = oPersonnage_Manager.GetIdSousCase(idUser);
		var maCase		= oCase_Manager.GetCopieCase(idSalle);
		

		oEventLog.log("SERVER : INFO_CASE() : Renvoi de l'id de case : " + idSalle + " - Sous case : " + idSousSalle);

		socket.emit('INFO_CASE_SC', maCase, liste.nbrAllies, liste.nbrEnnemis, idSousSalle);
		}
		catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : INFO_CASE_CS : " + err);
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
     * RECEPTION D'UNE DEMANDE D'INFO SUR LE PERSONNAGE
     */
    socket.on('INFO_PERSONNAGE_CS', function ()
	{
		oEventLog.log("****************** INFO_PERSONNAGE_CS - EMETTEUR : " + pseudoUser +" ********************");
		try
		{
			var monPerso = oPersonnage_Manager.GetCopiePerso(idUser);
			socket.emit('INFO_PERSONNAGE_SC', monPerso);
		}
		catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : INV_CASE_CS : " + err);
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
    	oEventLog.log("******************* PERSONNAGE_USE_CS - EMETTEUR : " + pseudoUser +" ***********************");
    	try
    	{

    	oEventLog.log("******************* UTILISER ***********************");

    	// délègue au manager et récupère le code retour
		var reponse = oPersonnage_Manager.Utiliser(idUser, id_item);
		
		// renvoi au client
		socket.emit('PERSONNAGE_USE_SC', id_item, reponse);
		
		// actualiser l'ihm pour les perso de la meme case connectés
		//ActualiserAllInCase();
		

		oEventLog.log("SERVEUR : UTILISER - " + idUser +" - Item " + id_item + " - Code : " + reponse);
		oEventLog.log("*******************************************************");

    	}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : PERSONNAGE_USE_CS : " + err);
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
		oEventLog.log("******************* PERSONNAGE_MODE_CS - EMETTEUR : " + pseudoUser +" ***********************");
		try
		{

        oEventLog.log("*******************************************************");

		
        // délègue au manager
        var reponse = oPersonnage_Manager.ChangementMode(idUser, mode);
		
		// renvoi au client
		socket.emit('PERSONNAGE_MODE_SC', mode, reponse.reponseChangement, reponse.degatsSubis, reponse.nbrGoules);
		
		// information avec message
		if (mode == 1) InformerAllInCase("commence à fouiller la salle");
		if (mode == 3) InformerAllInCase("se prépare au combat !");
		

		oEventLog.log("SERVEUR : CHGT MODE - " + idUser +" - Mode " + mode + " - Code : " + reponse.reponseChangement);
        oEventLog.log("*******************************************************");


		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : PERSONNAGE_MODE_CS : " + err);
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
    	oEventLog.log("******************* ACTION_FOUILLE_RAPIDE_CS - EMETTEUR : " + pseudoUser +" ***********************");
    	try
    	{

    		
    	oEventLog.log("***************** FOUILLE RAPIDE ******************************");

       
    	var reponse = oPersonnage_Manager.fouilleRapide(idUser);
    	
    	switch(reponse.codeRetour)
    	{
    		case 1 : 
    			oEventLog.log("SERVEUR : Fouille Rapide() : Fouille réussie ! Objet découvert : " + reponse.itemDecouvert.nom);
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', 1, reponse.itemDecouvert,
    					reponse.degatSubis, reponse.itemDansSac, reponse.nbrEnnemisDecouverts, reponse.nbrGoulesA);
    			// actualiser l'ihm pour les perso de la meme case connectés
    			ActualiserAllInCase();
    			break;
    		case -1 : 
    			oEventLog.log("SERVEUR : Fouille Rapide() : Fouille ratée !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -1, null, reponse.degatSubis, 0, 
    					reponse.nbrEnnemisDecouverts, reponse.nbrGoulesA);
    			break;
    			
    		case -5 : 
    			oEventLog.log("SERVEUR : Fouille Rapide() : Intercepté par goule !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -5, null, reponse.degatSubis, 
    					0, 0, reponse.nbrGoulesA);
    			break;
    			
    		case -10 : 
    			oEventLog.log("SERVEUR : Fouille Rapide() : Pas assez de PA !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -10, null, 0, 0, 0, 0);
    			break;
    		default :
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', 0, null, 0, 0, 0, 0);
    		break;
    	}

    	oEventLog.log("SERVEUR : FOUILLE_RAPIDE - " + idUser +" - item découvert : " + reponse.itemDecouvert);
    	oEventLog.log("***************************************************************");

    	}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : ACTION_FOUILLE_RAPIDE_CS : " + err);
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
		oEventLog.log("******************* ACTION_ATTAQUE_CS - EMETTEUR : " + pseudoUser +" ***********************");
		try
		{
    	// récupèration de l'id de l'user propriétaire de ce perso
    	var idCible = oUtilisateur_Manager.findIdUser(idPersonnageCible);
    	var idCase = oPersonnage_Manager.GetIdCase(idUser);
        
    	// délègue au manager
    	var ans = oPersonnage_Manager.Attaquer(idUser, idCible);
		
    	// renvoi au client
        socket.emit('ACTION_ATTAQUE_SC', ans.reponseAttaque, ans.degatsInfliges,  ans.degatsRecus, ans.degatSubisParGoules, ans.nbrGoules);
		
        // actualiser l'ihm pour les perso de la meme case connectés
		ActualiserAllInCase();
		
		// information des autres joueurs avec message
		InformerAllInCase("vient d'attaquer un autre joueur ! ");
		
		oEventLog.log("SERVER : idPersonnageCible attaqué : " + idPersonnageCible);
		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : ACTION_ATTAQUE_CS : " + err);
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
	 * erreur : -10 si pas assez de PA
	 * 
	 * ET degats reçus
	 * 
	 * ET nbr goules attaquantes
	 * 
	 */
    socket.on('ACTION_ATTAQUE_GOULE_CS', function ()
	{
		oEventLog.log("******************* ACTION_ATTAQUE_GOULE_CS - EMETTEUR : " + pseudoUser +" ***********************");
		try
		{

    	oEventLog.log("******************** ATTAQUE DE GOULES *****************");
    	// délègue au manager
    	var reponseManager 			= oPersonnage_Manager.AttaquerGoule(idUser);
		
    	// récupère les réponses
    	var code 					= reponseManager.code;
		var degatSubisParGoules	 	= reponseManager.degatSubisParGoules;
		var nbrGoulesAttaquantes 	= reponseManager.nbrGoulesAttaquantes;
		
		// réponse au canvas 
		socket.emit('ACTION_ATTAQUE_GOULE_SC', code, degatSubisParGoules, nbrGoulesAttaquantes);
				
		// informer les perso
		InformerAllInCase("a courageusement tué " + code + " goules ! ");
		
		// actualiser l'ihm pour les perso de la meme case connectés
		ActualiserAllInCase();
		
/*
			// délègue au manager
			var reponseManager 			= oPersonnage_Manager.AttaquerGoule(idUser);
			
			// récupère les réponses
			var code 					= reponseManager.code;
			var degatSubisParGoules	 	= reponseManager.degatSubisParGoules;
			var nbrGoulesAttaquantes 	= reponseManager.nbrGoulesAttaquantes;
			
			// réponse au canvas 
			socket.emit('ACTION_ATTAQUE_GOULE_SC', code, degatSubisParGoules, nbrGoulesAttaquantes);
					
			// informer les perso
			InformerAllInCase("a courageusement tué " + code + " goules ! ");
			
			// actualiser l'ihm pour les perso de la meme case connectés
			ActualiserAllInCase();
			
*/
		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : ACTION_ATTAQUE_GOULE_CS : " + err);
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
		oEventLog.log("******************* ACCUSE_LECTURE_MSG_CS - EMETTEUR : " + pseudoUser +" ***********************");
		try
		{
    	oEventLog.log("SERVEUR : Effacement des messages en attente du joueur " + oUtilisateur_Manager.getPseudo(idUser));
    	
    	// aquittement
    	oPersonnage_Manager.acquitterMsg(idUser);
    	
    	// si le perso est KO
    	if (oPersonnage_Manager.estMort(idUser))
    	{
        	// effacement des messages
        	oPersonnage_Manager.EffacerMessages(idUser);
        	
    		// retablissement de la sante et transfert en zone sure
    		oPersonnage_Manager.SeRetablir(idUser);
    	}
		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : ACCUSE_LECTURE_MSG_CS : " + err);
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
		oEventLog.log("******************* INFO_CASE_ALLIES_CS - EMETTEUR : " + pseudoUser +" ***********************");
		try
		{
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser, false);
    	socket.emit('INFO_CASE_ALLIES_SC', liste.Allies);
		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : INFO_CASE_ALLIES_CS : " + err);
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
	 * RECEPTION D'UNE DEMANDE POUR RENVOYER LA LISTE DES ENNEMIS DANS LA CASE
	 * 
	 * return liste des ennemis (tableau associatif) [idUtilisateur, personnageEnnemi]
	 * erreur : liste vide si aucun ennemis dans la case
	 */ 
    socket.on('INFO_CASE_ENNEMIS_CS', function ()
	{
		oEventLog.log("******************* INFO_CASE_ENNEMIS_CS - EMETTEUR : " + pseudoUser +" ***********************");
		try
		{
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser, true);
    	socket.emit('INFO_CASE_ENNEMIS_SC', liste.Ennemis);
		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : INFO_CASE_ENNEMIS_CS : " + err);
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
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE POUR TOUT SAUVEGARDER (DEBUG)
     * return [actionOk, degats]
     */
    socket.on('SAVE_BD_DEBUG_CS', function ()
	{
		try
		{
    	SauvegardeGlobale();
		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : SAVE_BD_DEBUG_CS : " + err);
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
   /******************************************************************************************************************
    * RENVOI DE LA DATE DE LANCEMENT DU SERVEUR
    * return date
    */
   socket.on('GET_DATE_CS', function ()
	{
		try
		{
		socket.emit('GET_DATE_SC', dateLancementSrv);
		}
    	catch(err)
		{
			oEventLog.error("/!\\ ERREUR : SERVEUR : GET_DATE_CS : " + err);
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
     * FONCTION POUR INFORMER LES AUTRES JOUEURS DE LA MEME CASE D'UN EVENEMENT
     */
    function InformerAllInCase(evenement, idCase)
    {
    	var liste;
    	// on récupère l'id de la case
    	if (typeof idCase === "undefined")
    	{
    		var idCase = oPersonnage_Manager.GetIdCase(idUser);
    		oEventLog.log("******************* [INFORMER-ALL-IN-CASE]   ("+idCase+"[AUTO]) - EMETTEUR : " + pseudoUser +" ***********************");
    		// on récupère la liste des persos de la case
    		liste = oPersonnage_Manager.GetAlliesEnnemisDansSalle(idUser);
    	}
    	else
    	{
    		oEventLog.log("******************* [INFORMER-ALL-IN-CASE]   ("+idCase+"[MANU]) - EMETTEUR : " + pseudoUser +" ***********************");
    		// on récupère la liste des persos de la case
    		liste = oPersonnage_Manager.GetAlliesEnnemisDansSalle(idUser, idCase);
    	}
    		
		var idCaseCurrentPerso;
		
		// pour chaque allié....
    	for(var i in liste.Allies) 
    	{
    		// on récupère son id
			var id = liste.Allies[i];
			
			// et son id de case
			idCaseCurrentPerso = oPersonnage_Manager.GetIdCase(id);
			
			/* si ce n'est pas l'user qui a crée l'event 
			 * et que le joueur n'est pas mort
			 * et que le joueur est dans la meme case
			 * */
			if (id != idUser && !oPersonnage_Manager.estMort(id) && idCase == idCaseCurrentPerso)
			{
				oPersonnage_Manager.AddMessage(id, "L'allié " + oUtilisateur_Manager.getPseudo(idUser) + " " + evenement);
			}
		}
    	
    	// pour chaque ennemi....
    	for(var i in liste.Ennemis) 
    	{
    		// on récupère son id
			var id = liste.Ennemis[i];
			
			// et son id de case
			idCaseCurrentPerso = oPersonnage_Manager.GetIdCase(id);
			
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
    	ActualiserAllInCase(idCase);
    }
	
    function ActualiserAllInCase(idCase)
    {
    	// on récupère l'id de la case
    	if (typeof idCase === "undefined")
    	{	
    		var idCase = oPersonnage_Manager.GetIdCase(idUser);
    		oEventLog.log("******************* [ACTUALISER-ALL-IN-CASE] ("+idCase+"[AUTO]) - EMETTEUR : " + pseudoUser +" ***********************");
    	}
    	else
    	{
    		oEventLog.log("******************* [ACTUALISER-ALL-IN-CASE] ("+idCase+"[MANU]) - EMETTEUR : " + pseudoUser +" ***********************");
    	}
		
    	// on récupère la liste des personnages de la case
    	var listePerso = oPersonnage_Manager.GetPersonnagesDansSalle(idCase);

    	// pour chaque perso de la case
    	for(var i in listePerso)
    	{
    		// on récupère son id
			var id = listePerso[i];
			// on récpère l'id de la case du perso
			var idCasePerso = oPersonnage_Manager.GetIdCase(id);
			// si meme case ET si en ligne ET différent de l'user qui a crée l'event
			if(idCase == idCasePerso && usersOnline[id] && !oPersonnage_Manager.estMort(id))
			{
				
				// on récupère son indice de ss-case
				var idSousCase = oPersonnage_Manager.GetIdSousCase(id);
				// on récupère les infos sur les peros de la case
				var res = oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
				// on envoi sur ttes les sockets
				for(var j in usersOnline[id].sockets)
				{
					usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id));
					usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(idCase), res.nbrAllies, res.nbrEnnemis, idSousCase);
				}
			}
		}
    }
});

function ActualiserAllGlobal(idCase)
{
	oEventLog.log("******************* [ACTUALISER-ALL-GLOBAL] ("+idCase+") - EMETTEUR : ***********************");
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
				usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(idCase), res.nbrAllies, res.nbrEnnemis, oPersonnage_Manager.GetIdSousCase(id));
			}
		}
	}
	
}


/*
 * *************************** 8 - CONFIGURATION DE LA SAUVEGARDE PERIODIQUE ***************************
 */
function SauvegardeGlobale()
{
	oEventLog.log("***************** SAUVEGARDE GLOBALE DES DONNEES *****************************");
   	var date = new Date();
   	oEventLog.log("[ ! ] Sauvegarde globale ! Date: " + date);
   				
	// regain des pts move et action
	oPersonnage_Manager.nouvelleJournee();
	// rajout des goules
	oCase_Manager.nouvelleJournee();
			
   	// sauvegarde de données
   	oUtilisateur_Manager.Save();
	oPersonnage_Manager.Save();
	oCase_Manager.Save();
	oScore_Manager.Save();
			
	// maj ihms des connectés
	for(var id in usersOnline)
	{
		for(var j in usersOnline[id].sockets)
		{
			//oPersonnage_Manager.AddMessage(id, "FLAAAAAAAAAAAAAAAAAAAAAAAAAAAASH ! ");
			var res 		= oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
			var idSousSalle = oPersonnage_Manager.GetIdSousCase(id);
			usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id));
			usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdCase(id)), res.nbrAllies, res.nbrEnnemis, idSousSalle);
		}
	}
}
setInterval(function() 
{ 
	SauvegardeGlobale();
	
},  1000 * 60 * 60  ); // (1000) millisec * 60 sec * 60 min



// server.listen(8080);
app.on('close', function () { // On écoute l'évènement close
    oEventLog.log('Bye bye !');
});


//oEventLog.log("SERVEUR : Script lancé ! sur http://127.0.0.1:8080");


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
var EventLog    = require('./model/EventLog');
var oScheduleEvent 	 = require('node-schedule');

var oNodeMailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = oNodeMailer.createTransport("SMTP",{
    service: "Yahoo",
    auth: {
        user: "zombistia@yahoo.fr",
        pass: "aBFJ_14&"
    }
});

////////////** TEST MAIL
/*
// pour envoyer les mails
var key = "11332178-c46b-41e6-9099-a8ac60d7f4b3";
var postmark = require("postmark")(key);
var ejs = require("ejs");

//TEST MAIL
postmark.send(
{
    "From": "psyko469@hotmail.fr",
    "To": "psyko469@hotmail.fr",
    "Subject": "Confirm your email address",
    "TextBody": "Test pour dév", //" +pseudo ,
    "HtmlBody": "http://testDev.com"
}, function (err, to)
{
    if (err)
    {
        EventLog.error("APP : Erreur envoi de mail : " + err);
        return;
    }
    console.log("Email sent to: %s", to);
});
// FIN TEST MAIL
*/
// require objets
var oCarte		= require('./model/object/Carte');
var GameRules	= require('./model/GameRules');

//require persistance
var oCase_BD       	= require('./persistance/Case_BD');
var oUtilisateur_BD = require('./persistance/Utilisateur_BD');

// require manager
var oPersonnage_Manager  = require('./manager/Personnage_Manager');
var oItem_Manager        = require('./manager/Item_Manager');
var oCase_Manager        = require('./manager/Case_Manager');
var oUtilisateur_Manager = require('./manager/Utilisateur_Manager');
var oScore_Manager       = require('./manager/Score_Manager');
var oSession_Manager	 = require('./manager/Session_Manager');


// ** TEST SCHEDULE
var rule = new oScheduleEvent.RecurrenceRule();
rule.hour = GameRules.heure_attaque();
rule.minute = GameRules.minute_attaque();

var eventAttaque = oScheduleEvent.scheduleJob(rule, SauvegardeGlobale);


/*
 * *************************** 2 - CHARGEMENT EN MEMOIRE DES DONNES ***************************
 */
 
//Initialisation des log
EventLog.init();
var dateLancement = new Date();
var dateLancementSrv = dateLancement;
var heureDerniereAttaque = dateLancement;

EventLog.log("Lancement du serveur - " + dateLancementSrv.toString());

//Tableau des utilisateur en ligne
var usersOnline = new Array();

//Initialisation de la base de données
oDatabase.Initialiser();

// FLORIAN : DEFINITION DE LA DIMENSION DE LA CARTE
oCarte.Initialiser(28, 17);

var usersChatTab = new Array();

// Chargement des utilisateurs en mémoire
oUtilisateur_Manager.Load(function(id, reponse){
	usersChatTab[id] = new Object;
	usersChatTab[id].username = reponse.getPseudo();
	usersChatTab[id].numEquipe = reponse.getNumEquipe();
	usersChatTab[id].socketsTeamChat = new Array();
	usersChatTab[id].socketsGeneralChat = new Array();
	usersChatTab[id].connectedToTeamChat = false;
	usersChatTab[id].connectedToGeneralChat = false;
});

// Chargement de la liste des items en mémoire
oItem_Manager.Load();

//Chargement des sessions de jeu en mémoire
oSession_Manager.Load(function(idSession)
{
	oScore_Manager.Load(idSession);
	
	//Chargement des personnages en mémoire
	//le callback est réservé pour la fin des fouilles...
	//... et rafraichir l'affichage
	oPersonnage_Manager.Load(callbackFinFouille);
});

// Chargement des cases en mémoire
oCase_Manager.Load();




function callbackFinFouille(idUser)
{
	EventLog.log("Fin de la fouille du personnage " + oUtilisateur_Manager.getPseudo(idUser));
	// actualiser joueurs, au cas où l'item est arrivé dans la case
	var idCase = oPersonnage_Manager.GetIdCase(idUser);
	
	ActualiserAllGlobal(idCase);
}

//////////////TEST SESSIONJEU
//var date = new Date(2016, 12, 1, 1, 1, 1, 1);
//oSession_Manager.demarrer(date);



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
	
	res.send('Page not found');
});


/*
 * *************************** 4 - CONFIGURATION DES ROUTES ***************************
 */

var options = {
	"username": null,
	"errorLogin": null,
	"InfoInscription": null,
	"usernameInscription": null,
	"sessionID": null,
	"dateFinSession": null,
	"heureLocale": null,
	"heureAttaque": null};

var optionAccueil;

function restrict(req, res, next)
{
	var idSession = oSession_Manager.getIdSessionEnCours();
	EventLog.log("IdSession : " + idSession + " ! ");
	if (req.session.username && idSession >= 0)
	{
		next();
	}
	else
	{
		if(!req.session.username)
		{
			options.errorLogin = 'Veuillez vous connectez !';
		}
		else
		{
			options.username = req.session.username;
		}
		
		if(idSession < 0)
		{
			options.errorLogin = 'Aucune session en cours !';
		}
		
		ajouterInfosHeures(options);
		res.render('accueil', options);
		
		options.username = null;
		options.errorLogin = null;
	}
}

function restrictAdmin(req, res, next)
{
	if(	   req.session.username == "a"
		|| req.session.username == "Brendiche"
		|| req.session.username == "MainMain"
		|| req.session.username == "Flow"
		|| req.session.username == "abelghalem"
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
	
	if(s.username)
	{
		options.username = s.username;
		options.sessionID = s.idUser;
		
		ajouterInfosHeures(options);
		res.render('accueil-connecte', options);
		
		options.username = null;
		options.sessionID = null;
	}
	else
	{
		res.render('accueil', options);
	}
});

app.get('/admin', restrictAdmin, function fonctionAdmin(req, res)
{
	var s = req.session;
	var options = { "username" : s.username, "idUser" : s.idUser, "dateDebut" : null, "dateFin" : null, "idSession" : null};
	
	if(oSession_Manager.getDateDebut() && oSession_Manager.getDateFin() && oSession_Manager.getIdSessionEnCours())
	{
		options.dateDebut = oSession_Manager.getDateDebut().toLocaleString();
		options.dateFin = oSession_Manager.getDateFin().toLocaleString();
		options.idSession = oSession_Manager.getIdSessionEnCours();
	}
	ajouterInfosHeures(options);
	res.render('admin', options);
}
);

app.post('/admin', restrictAdmin, function fonctionAdmin(req, res)
{
	var s = req.session;
	var idUser = req.param("idUser");
	var options = { "username" : s.username, "idUser" : s.idUser, "dateDebut" : null, "dateFin" : null, "idSession" : null};
	
	if(oSession_Manager.getDateDebut() && oSession_Manager.getDateFin() && oSession_Manager.getIdSessionEnCours())
	{
		options.dateDebut = oSession_Manager.getDateDebut().toLocaleString();
		options.dateFin = oSession_Manager.getDateFin().toLocaleString();
		options.idSession = oSession_Manager.getIdSessionEnCours();
	}
	
	oPersonnage_Manager.deletePerso(idUser);
	
	if(usersOnline[idUser])
	{
		for(var i in usersOnline[idUser].sockets)
		{
			usersOnline[idUser].sockets[i].emit("DECONEXION_SC", "Un administrateur a supprimé votre compte ! Vous allez être déconnecté.");
		}
	}
	ajouterInfosHeures(options);
	res.render('admin', options);
});

app.put('/admin', restrictAdmin, function fonctionAdmin(req, res)
{
	var s		= req.session;
	var action	= req.param("action");
	var year	= parseInt(req.param("year"));
	var month	= parseInt(req.param("month"));
	var day		= parseInt(req.param("day"));
	var options = { "username" : s.username, "idUser" : s.idUser, "dateDebut" : null, "dateFin" : null, "idSession" : null};
	
	if(oSession_Manager.getDateDebut() && oSession_Manager.getDateFin() && oSession_Manager.getIdSessionEnCours())
	{
		options.dateDebut = oSession_Manager.getDateDebut().toLocaleString();
		options.dateFin = oSession_Manager.getDateFin().toLocaleString();
		options.idSession = oSession_Manager.getIdSessionEnCours();
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
	ajouterInfosHeures(options);
	res.render('admin', options);
});

app.get('/jeu', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	
	EventLog.log("APP GET /jeu - Id session en cours  : " + oSession_Manager.getIdSessionEnCours());
	EventLog.log("APP GET /jeu - Id session du joueur : " + oUtilisateur_Manager.getIdSession(s.idUser));
	
	var options = getDonnesPageJeu(s.idUser, s.username);
	
	// si l'utilisateur n'est pas dans la bonne session
	console.log('options["isUpToDate"] = ' + options["isUpToDate"]);
	
	if (!options["isUpToDate"])
	{
		// on récupère le bilan des score de la derniere session
		options["bilanScores_last"] = oScore_Manager.getBilanScoreSession(s.idUser, oUtilisateur_Manager.getIdSession(s.idUser));
		
		// on récupère les dates de la derniere session
		oSession_Manager.getDatesSession(oUtilisateur_Manager.getIdSession(s.idUser), function(dates)
		{
			// attribution des dates
			options["dateLastSession"] = dates;
			// renvoi de la page
			ajouterInfosHeures(options);
			res.render('game', options);
		});
	}
	else
	{
		// renvoi de la page
		ajouterInfosHeures(options);
		res.render('game', options);
	}
});

app.put('/jeu', restrict, function fonctionJeu(req, res)
{
	var b = req.body;
	var s = req.session;
	
	EventLog.log("APP PUT /jeu - Id session en cours  : " + oSession_Manager.getIdSessionEnCours());
	EventLog.log("APP PUT /jeu - Id session du joueur : " + oUtilisateur_Manager.getIdSession(s.idUser));
	
	
	
	// l'équipe vient d'être choisie
	if(b.competence == "brute" || b.competence == "explorateur" || b.competence == "chercheur")
	{
		var idSession = oSession_Manager.getIdSessionEnCours();
		
		// on attribut le num d'équipe à l'utilisateur
		oUtilisateur_Manager.SetNumEquipe(s.idUser, b.equipe, idSession);
		
		usersChatTab[s.idUser].numEquipe = oUtilisateur_Manager.GetNumEquipe(s.idUser);
		
		// on attribut la compétence au personnage de l'utilisateur
		oPersonnage_Manager.nvPersonnageEnJeu(s.idUser, b.competence, b.equipe);
		
		// on crée le score en mémoire et en BD
		oScore_Manager.createScore(s.idUser, b.equipe, function()
		{
			// on remet à jour la structure
			/*options["idEquipe"] 		= b.equipe;
			options["isUpToDate"] 		= (oSession_Manager.getIdSessionEnCours() == oUtilisateur_Manager.getIdSession(s.idUser));
			options["idEquipe"]			= oUtilisateur_Manager.GetNumEquipe(s.idUser); 
			options["sessionID"]		= s.idUser;
			options["bilanScores"]		= oScore_Manager.getBilanScoreSession(s.idUser, oUtilisateur_Manager.getIdSession(s.idUser));
			options["sessionInfo"] 		= oSession_Manager.getDatesSessionEnCours();
			options["bilanScores_last"] = oScore_Manager.getBilanScoreSession(s.idUser, oUtilisateur_Manager.getIdSession(s.idUser));
			*/
			
			/*
			oSession_Manager.getDatesSession(oUtilisateur_Manager.getIdSession(s.idUser), function(dates)
			{
				options["dateLastSession"] = dates;
				res.render('game', options);
			});*/
			options = getDonnesPageJeu(s.idUser, s.username);
			ajouterInfosHeures(options);
			res.render('game', options);
		});
	}
	else
	{
		var options	= getDonnesPageJeu(s.idUser, s.username);
		res.render('game', options);
	}
});

app.get('/tutoriel', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username": s.username, 
		"sessionID" : s.idUser 
		};
	
	ajouterInfosHeures(options);
	res.render('tutoriel', options);
});

app.get('/regles', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username": s.username, 
		"sessionID" : s.idUser 
		};
	
	ajouterInfosHeures(options);
	res.render('regles', options);
});

app.get('/chat-equipe', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var idSession = oSession_Manager.getIdSessionEnCours();
	var isUpToDate = (idSession == oUtilisateur_Manager.getIdSession(s.idUser));
	var options = getDonnesPageJeu(s.idUser, s.username);
	
		// si l'utilisateur n'est pas dans la bonne session
		if (!options["isUpToDate"])
		{
			// on récupère le bilan des score de la derniere session
			options["bilanScores_last"] = oScore_Manager.getBilanScoreSession(s.idUser, oUtilisateur_Manager.getIdSession(s.idUser));
			// on récupère les dates de la derniere session
			oSession_Manager.getDatesSession(oUtilisateur_Manager.getIdSession(s.idUser), function(dates)
			{
				// attribution des dates
				options["dateLastSession"] = dates;
				// renvoi de la page
				ajouterInfosHeures(options);
				res.render('game', options);
			});
		}
		else
		{
			ajouterInfosHeures(options);
			// renvoi de la page
			res.render('chat-equipe', options);
		}
});

app.get('/classement', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username":s.username, 
		"sessionID" : s.idUser, 
		"order" : 0 
		};
	
	ajouterInfosHeures(options);
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
	
	EventLog.log("order = " + order);
	
	ajouterInfosHeures(options);
	res.render('classement', options);
});

app.get('/chat-general', restrict, function fonctionIndex(req, res)
{
	var s = req.session;
	var options = { 
		"username": s.username, 
		"sessionID" : s.idUser 
		};

	ajouterInfosHeures(options);
	res.render('chat', options);
});

app.get('/confirmerCompte/:idInscription', function fonctionIndex(req, res)
{
	oUtilisateur_Manager.confirmerCompte(req.param('idInscription'), function(reponse)
	{
		console.log("DEBUG : reponse = " + reponse);
		var options = 
		{ 
			// 1 : ok, -1 : compte inexistant, -2 : compte déja confirmé, -3 : erreur maj user
			"reponse": reponse,
			"sessionID" : req.session.idUser 
		};
		
		ajouterInfosHeures(options);
		res.render('confirmerCompte', options);
	});
});

app.post('/', function (req, res)
{
	var b = req.body;
	
	oUtilisateur_BD.Connexion(b.username, b.password, req, res, callbackConnexion);
});

ajouterInfosHeures = function(options)
{
	options["heureAttaque"] = new Date(0, 0, 0, GameRules.heure_attaque(), GameRules.minute_attaque(), 0, 0);
	options["heureLocale"] = new Date();
}
getDonnesPageJeu = function(idUser, userName)
{
	var options = 
	{ 
		"username"			: userName, 
		"idEquipe"			: oUtilisateur_Manager.GetNumEquipe(idUser), 
		"sessionID" 		: idUser, 
		"dateLastSession" 	: -1,
		"isUpToDate" 		: (oSession_Manager.getIdSessionEnCours() == oUtilisateur_Manager.getIdSession(idUser)),
		"bilanScores" 		: oScore_Manager.getBilanScoreSession(idUser, oUtilisateur_Manager.getIdSession(idUser)),
		"bilanScores_last" 	: -1,
		"sessionInfo" 		: oSession_Manager.getDatesSessionEnCours(),
		"heureAttaque" 		: new Date(0, 0, 0, GameRules.heure_attaque(), GameRules.minute_attaque(), 0, 0),
		"dureeCycle" 		: GameRules.dureeCycle() / (1000*3600)
	};
		
	return options;
},

callbackConnexion = function(reponseConnexion, req, res)
{
	var b = req.body;
	var s = req.session;
	// Si bon couple, on recoit l'id de l'user
	if (typeof reponseConnexion === 'string')
	{
		EventLog.log("REPONSE CONNEXION =" + reponseConnexion);
		
		s.username = b.username;
		s.idUser = reponseConnexion;
		
		options.username = s.username;
		options.sessionID = s.idUser;
		
		ajouterInfosHeures(options);
		res.render("accueil-connecte", options);
		
		options.sessionID = null;
		options.username = null;
		
	}
	else if(reponseConnexion == -1)
	{
		options.errorLogin = "Couple login/mot de passe incorrect.";
		
		res.render("accueil", options);
		
		options.errorLogin = null;
	}
	else if(reponseConnexion == -2)
	{
		options.errorLogin = "Compte non validé. Veuillez confirmer votre compte en cliquant sur le lien envoyé par mail " +
				"lors de votre inscription !";
		
		res.render("accueil", options);
		
		options.errorLogin = null;
	}
	
	else
	{
		options.errorLogin = "Erreur Interne";
		
		res.render("accueil", options);
		
		options.errorLogin = null;
	}
},

app.put('/', function (req, res)
{
	var b = req.body;
	var testsOk = false;
	// regex test email
	var regTestMailAngers = /.@etud.univ-angers.fr/;

	// test si c'est en bonne forme
	//if
	console.log(">>> TEST EMAIL : "+ b.email+" -> : " + regTestMailAngers.test(b.email) );
	if		(b.username.length < 4 && b.username.length > 10)		options.InfoInscription = "Login_nonConforme";
	else if (b.password.length < 6) 			options.InfoInscription = "Pass_nonConforme";
	//else if (!regTestMailAngers.test(b.email)) 	options.InfoInscription = "Mail_nonConforme";
	else
	{
		// si ok
		oUtilisateur_BD.Inscription(b.username, b.password, b.email, req, res, callbackInscription);
		testsOk = true;
	}
	// si test nok, on renvoi la page d'accueil
	if (!testsOk) res.render("accueil", options);
	

	
});
	
callbackInscription = function(reponseInscription, req, res, idInscription)
{
	var b = req.body;
	if (reponseInscription == -1)
	{
		options.InfoInscription = "Login";
		
		res.render("accueil", options);
		
		options.InfoInscription = null;
	}
	else if(reponseInscription == -2)
	{
		options.InfoInscription = "Email";
		
		res.render("accueil", options);
		
		options.InfoInscription = null;
	}
	else
	{
		// ENVOI D'UN MAIL DE CONFIRMATION
		var mailOptions = 
		{
   			from: "Staff Zomb'IstiA <zombistia@yahoo.fr>", // sender address
    		to: b.email, // list of receivers
    		subject: "Bienvenue sur Zomb'IstiA !", // Subject line
    		//text: "Hello world ✔", // plaintext body
    		html: "Bonjour " + b.username + "," // html body
    			+ "<br>Votre inscription a été prise en compte. Pour la confirmer, veuillez cliquer sur le lien ci contre : "
    			+ " <a href=\"http://localhost:25536/confirmerCompte/" + idInscription+"\">Confirmer mon compte </a>"
    			+ "<br>Ensuite, nous t'invitons a lire le tutoriel afin de mieux comprendre les mécanismes du jeu. Une fois prêt, "
    			+ "choisissez votre équipe, et lancez vous dans l'aventure !"
    			+" <br>Préparez vous, vous n'en sorterez pas indemme..."
    			+" <br><br>N'hésitez pas à nous contacter pour toutes question relative à votre compte ou au jeu en lui même."
    			+ "<br>L'équipe de Zomb'Istia"
		}

		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(error, response){
   		if(error)
   		{
       	 	EventLog.log(error);
    	}else{
        	EventLog.log("Message sent: " + response.message);
    	}
	});

		options.usernameInscription = b.username;
		
		oUtilisateur_Manager.LoadUser(reponseInscription, function(id, reponse) {
			usersChatTab[id] = new Object;
			usersChatTab[id].username = reponse.getPseudo();
			usersChatTab[id].numEquipe = reponse.getNumEquipe();
			usersChatTab[id].socketsTeamChat = new Array();
			usersChatTab[id].socketsGeneralChat = new Array();
			usersChatTab[id].connectedToTeamChat = false;
			usersChatTab[id].connectedToGeneralChat = false;
		});
		oPersonnage_Manager.LoadUser(reponseInscription);
		
		// ajout de l'objet score pour la session de jeu en cours
		//oScore_Manager.nouveauJoueur(reponseInscription, oSession_Manager.getIdSessionEnCours());
		
		res.render("accueil", options);
		
		options.usernameInscription = null;
	}
},

app.delete("/", function (req, res)
{
	EventLog.log("OH : Deconnexion de " + req.session.username);
	req.session.destroy();
	res.render('accueil', options);
});


/*
 * *************************** 5- LANCEMENT DU SERVEUR ***************************
 */
server.listen(app.get('port'), function ()
{
    EventLog.log("Express server listening on port " + app.get('port'));
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
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> _CHAT_EQUIPE_PAGE");
	
	socket.on('INFO_USER_CS', function(userID, user)
	{
		id = userID;
		onChatEquipe_INFO_USER(userID, user, socket);
	});
	
	// Reception d'un message
	socket.on('USER_MESSAGE_CS', function(user, message)
	{
		onChatEquipe_USER_MESSAGE(id, user, message);
	});
	
	socket.on('disconnect', function()
	{
		onChatEquipe_DISCONNECT(id, socket);
		id = "";
	});
});

onChatEquipe_INFO_USER = function(id, user, socket)
{
	var j = 0;
	var newUser = false;
	var tabUsername = new Array();
	var tabConnected = new Array();
	
	console.log("APP - CONNEXION D'UN UTILISATEUR A UN TCHAT EQUIPE : " + user);
	
	// si l'id de l'user existe
	if(oUtilisateur_Manager.exist(id))
	{
		console.log("connectedToTeamChat = " + usersChatTab[id].connectedToTeamChat);
		
		usersChatTab[id].socketsTeamChat.push(socket);
		usersChatTab[id].connectedToTeamChat = true;
		
		for(var i in usersChatTab)
		{
			if(oUtilisateur_Manager.MemeEquipe(i, id))
			{
				tabUsername[j] = usersChatTab[i].username;
				tabConnected[j] = usersChatTab[i].connectedToTeamChat;
				j++;
			}
		}
		
		//Pour chaque utilisateurs
		for(var i in usersChatTab)
		{
			// s'il appartient à la meme équipe 
			if(oUtilisateur_Manager.MemeEquipe(i, id))
			{
				EventLog.log("> ENVOI MESSAGE POUR AVERTIR NV USER");
				// on l'informe sur sa socket
				for(var k in usersChatTab[i].socketsTeamChat)
				{
					EventLog.log(">> ENVOI MESSAGE POUR AVERTIR NV USER : BOUCLE SOCKET ");
					usersChatTab[i].socketsTeamChat[k].emit('USER_CONNECTED_SC', tabUsername, tabConnected);
				}
			}
		}
	}
},

onChatEquipe_USER_MESSAGE = function(id, user, message)
{
	EventLog.log("> APP : RECEPTION MSG. id : " + id +" - user : " + user + " message : "+message);
	// si l'utilisateur qui envoi existe bien
	if(oUtilisateur_Manager.exist(id))
	{
		EventLog.log("> UTILISATEUR EXISTE ! ");
		//log
		EventLog.log(usersChatTab);
		// pour chaque utilisateur connecté au tchat d'équipe
		for(var i in usersChatTab)
		{
			EventLog.log("> PARCOURS DE BOUCLE DES USER TEAM. CURRENT USER : " + usersChatTab[i].username);
			// s'il appartient à la meme équipe 
			if(oUtilisateur_Manager.MemeEquipe(i, id))
			{
				// on l'informe sur ses sockets
				for(var k in usersChatTab[i].socketsTeamChat)
				{
					EventLog.log(">>> ENVOI MESSAGE SUR SOCKET DE USER " + usersChatTab[i].username);
					try
					{
						usersChatTab[i].socketsTeamChat[k].emit("USER_MESSAGE_SC", user, message);
					}catch(err)
					{
						EventLog.error(">>> - onChatEquipe_USER_MESSAGE() " + err);
					}
				}
			}
		}
	}
},

onChatEquipe_DISCONNECT = function(id, socket)
{
	var j = 0;
	var tabUsername = new Array();
	var tabConnected = new Array();
	
	if(usersChatTab[id])
	{
		console.log("ID = " + id);
		console.log("usersChatTab[id].sockets.length = " + usersChatTab[id].socketsTeamChat.length);
		
		usersChatTab[id].socketsTeamChat.splice(usersChatTab[id].socketsTeamChat.indexOf(socket), 1);
			
		console.log("ID = " + id);
		console.log("usersChatTab[id].sockets.length = " + usersChatTab[id].socketsTeamChat.length);
		
		// Si dernière socket déconnectée
		if(usersChatTab[id].socketsTeamChat.length == 0)
		{
			usersChatTab[id].connectedToTeamChat = false;
		}
		
		for(var i in usersChatTab)
		{
			if(oUtilisateur_Manager.MemeEquipe(i, id))
			{
				tabUsername[j] = usersChatTab[i].username;
				tabConnected[j] = usersChatTab[i].connectedToTeamChat;
				j++;
			}
		}
		
		for(var i in usersChatTab)
		{
			if(oUtilisateur_Manager.MemeEquipe(i, id))
			{
				for(var k in usersChatTab[i].socketsTeamChat)
				{
					usersChatTab[i].socketsTeamChat[k].emit('USER_CONNECTED_SC', tabUsername, tabConnected);
				}
			}
		}
		
		EventLog.log("Déconnexion de " + usersChatTab[id].username + " du chat");
	}
};

 //Client Connecté au chat général
var chat = io.of('/chat-general').on('connection', function (socket)
{
	var id = "";
	
	socket.on('INFO_USER_CS', function(userID, user)
	{
		var j = 0;
		var tabUsername = new Array();
		var tabConnected = new Array();
		
		id = userID;
		
		usersChatTab[id].socketsGeneralChat.push(socket);
		usersChatTab[id].connectedToGeneralChat = true;
		
		for(var i in usersChatTab)
		{
			console.log("i = " + i);
			console.log("oUtilisateur_Manager.isCompteConfirme(i) = " + oUtilisateur_Manager.isCompteConfirme(i));
			if(oUtilisateur_Manager.isCompteConfirme(i))
			{
				tabUsername[j] = usersChatTab[i].username;
				tabConnected[j] = usersChatTab[i].connectedToGeneralChat;
				j++;
			}
		}
		
		chat.emit('USER_CONNECTED_SC', tabUsername, tabConnected);
	});
	
	socket.on('USER_MESSAGE_CS', function(user, message)
	{
		console.log("usersChatTab[id].numEquipe = " + usersChatTab[id].numEquipe);
		switch(usersChatTab[id].numEquipe)
		{
			case 1:
			user = user + "  (AGI)";
			break;
			case 2:
			user = user + "  (QSF)";
			break;
			case 3:
			user = user + "  (INNO)";
			break;
			default:
			user = user + "  (Neutre)";
			break;
		}
		chat.emit("USER_MESSAGE_SC", user, message);
	});
	
	
	socket.on('disconnect', function()
	{
		var j = 0;
		var tabUsername = new Array();
		var tabConnected = new Array();
		
		if(usersChatTab[id])
		{
			usersChatTab[id].socketsGeneralChat.splice(usersChatTab[id].socketsGeneralChat.indexOf(socket), 1);
			
			if(usersChatTab[id].socketsGeneralChat.length == 0)
			{
				usersChatTab[id].connectedToGeneralChat = false;
		
				for(var i in usersChatTab)
				{
					tabUsername[j] = usersChatTab[i].username;
					tabConnected[j] = usersChatTab[i].connectedToGeneralChat;
					j++;
				}
				
				chat.emit('USER_CONNECTED_SC', tabUsername, tabConnected);
			}
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
	
    EventLog.log('SERVER : Un client est connecté !');
    //socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.GetIdCase());

	socket.on('INFO_USER_CHAT_CS', function(userID, user)
	{
		onChatEquipe_INFO_USER(userID, user, socket);
	});
	
	// Reception d'un message
	socket.on('USER_MESSAGE_CS', function(id, user, message)
	{
		onChatEquipe_USER_MESSAGE(id, user, message);
	});
	
	socket.on('disconnect', function()
	{
		onChatEquipe_DISCONNECT(socket);
	});
	
	socket.on('INFO_USER_CS', function(sessionID, username, page, param)
	{
		idUser = sessionID;
		user = username;
		
		users = new Array();
		j = 0;
		
		if(!usersOnline[idUser])
		{
			usersOnline[idUser] 		= new Object();
			usersOnline[idUser].sockets = new Array();
			usersOnline[idUser].pages 	= new Array();
		}
		usersOnline[idUser].username 	= user;
		usersOnline[idUser].pages[socket] = page;
		usersOnline[idUser].sockets.push(socket);
		
		// charger le pseudo du joueur en mémoire
		pseudoUser = username;
		EventLog.log(">>> Pseudo chargé en mémoire ! Utilisateur -> "+username);
		
		if(page == "classement")
		{
			console.log("param = " + param);
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
		
		EventLog.log("INFO - Connexion de " + user + " à la page " + page);
	});
	
	socket.on('disconnect', function()
	{
		if(usersOnline[idUser])
		{
			var user = usersOnline[idUser].username;
			var page = usersOnline[idUser].pages[socket];
			
			usersOnline[idUser].sockets.splice(usersOnline[idUser].sockets.indexOf(socket), 1);
			delete usersOnline[idUser].pages[socket];
			
			EventLog.log("Déconnexion de " + user + " de la page " + page);
			
			if(usersOnline[idUser].sockets.length == 0)
			{
				EventLog.log("Déconnexion de " + usersOnline[idUser].username);
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
		EventLog.log("****************** MOVE_PERSONNAGE_CS - EMETTEUR : " + pseudoUser +" ********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
			var idCasePrecedente = oPersonnage_Manager.GetIdCase(idUser);
			var idCaseApsDepl;
			var reponseDeplacement = oPersonnage_Manager.Deplacement(idUser, move);
		
		EventLog.log(pseudoUser + " - APP : Réponse déplacement " + reponseDeplacement);
		if (reponseDeplacement < 0) socket.emit('MOVE_PERSONNAGE_SC', reponseDeplacement);
		else 						socket.emit('MOVE_PERSONNAGE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdCase(idUser)).nom);
		
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

		EventLog.log("****************** INV_PERSONNAGE_CS - EMETTEUR : " + pseudoUser +" ********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
		var currentItem = oItem_Manager.GetItem(id_item);
		var reponse;

		if (type == "EQUIPER")
		{
			reponse = oPersonnage_Manager.equiper(idUser, id_item);
			
			socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, reponse, oPersonnage_Manager.GetCopiePerso(idUser));

			EventLog.log(pseudoUser + " - APP : Réponse équipement " + reponse);

		}
		else if (type == "DESEQUIPER") 
		{
			reponse = oPersonnage_Manager.desequiper(idUser, id_item);
			
			socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem, reponse, oPersonnage_Manager.GetCopiePerso(idUser));

			EventLog.log(pseudoUser + " - APP : Réponse déquipement " + reponse);

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
		EventLog.log("****************** INV_CASE - EMETTEUR : " + pseudoUser +" ********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		
		var currentItem = oItem_Manager.GetItem(id_item);
		var reponse;
		
		EventLog.log("SERVEUR : INV_CASE_CS : Demande pour " + type + " l'item : " + id_item);

		// délègue au manager
		reponse = oPersonnage_Manager.ramasserDeposer(idUser, type, currentItem);
		
		// répond au client
		socket.emit('INV_CASE_SC', type, reponse.reponseAction, id_item, reponse.degatSubis, reponse.nbrGoulesA,  oItem_Manager.GetItem(id_item));
		
		// actualiser l'ihm pour les perso de la meme case connectés
		ActualiserAllInCase();
		
		// informe les autres joueurs
		if (reponse.reponseAction > 0)
			{
				if (type == "RAMASSER") InformerAllInCase("vient de ramasser cet item : " + currentItem.nom);
				if (type == "DEPOSER")  InformerAllInCase("vient de déposer cet item : " + currentItem.nom);
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
		EventLog.log("****************** INFO_CASE_CS - EMETTEUR : " + pseudoUser +" ********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
		var liste		= oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(idUser);
		var idSalle		= oPersonnage_Manager.GetIdCase(idUser);
		var idSousSalle = oPersonnage_Manager.GetIdSousCase(idUser);
		var maCase		= oCase_Manager.GetCopieCase(idSalle);
		

		EventLog.log("SERVER : INFO_CASE() : Renvoi de l'id de case : " + idSalle + " - Sous case : " + idSousSalle);

		socket.emit('INFO_CASE_SC', maCase, liste.nbrAllies, liste.nbrEnnemis, idSousSalle);
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
		EventLog.log("****************** INFO_PERSONNAGE_CS - EMETTEUR : " + pseudoUser +" ********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
			var monPerso = oPersonnage_Manager.GetCopiePerso(idUser);
			socket.emit('INFO_PERSONNAGE_SC', monPerso, oUtilisateur_Manager.GetNumEquipe(idUser));
			//}
			//catch(err)
			//{
			//EventLog.error("/!\\ ERREUR : SERVEUR : INV_CASE_CS : " + err);
			//}
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
    	EventLog.log("******************* PERSONNAGE_USE_CS - EMETTEUR : " + pseudoUser +" ***********************");
    	// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
    	
    	//try
    	//{
    	// délègue au manager et récupère le code retour
		var reponse = oPersonnage_Manager.Utiliser(idUser, id_item);
		
		// renvoi au client
		socket.emit('PERSONNAGE_USE_SC', id_item, reponse, oItem_Manager.GetItem(id_item));
		
		// actualiser l'ihm pour les perso de la meme case connectés
		//ActualiserAllInCase();

		EventLog.log("SERVEUR : UTILISER - " + idUser +" - Item " + id_item + " - Code : " + reponse);

		//}
		//catch(err)
		//{
		//	EventLog.error("/!\\ ERREUR : SERVEUR : PERSONNAGE_USE_CS : " + err);
		//}
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
		EventLog.log("******************* PERSONNAGE_MODE_CS - EMETTEUR : " + pseudoUser +" ***********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		//try
		//{

        // délègue au manager
        var reponse = oPersonnage_Manager.ChangementMode(idUser, mode);
		
		// renvoi au client
		socket.emit('PERSONNAGE_MODE_SC', mode, reponse.reponseChangement, reponse.degatsSubis, reponse.nbrGoules);
		
		// information avec message
		if (mode == 1) InformerAllInCase("commence à fouiller la salle");
		if (mode == 3) InformerAllInCase("se prépare au combat !");
		

		EventLog.log("SERVEUR : CHGT MODE - " + idUser +" - Mode " + mode + " - Code : " + reponse.reponseChangement);
        EventLog.log("*******************************************************");


        //}
        //catch(err)
        //{
        //	EventLog.error("/!\\ ERREUR : SERVEUR : PERSONNAGE_MODE_CS : " + err);
        //}
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
    	EventLog.log("******************* ACTION_FOUILLE_RAPIDE_CS - EMETTEUR : " + pseudoUser +" ***********************");
    	
    	// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
    	//try
    	//{

    	var reponse = oPersonnage_Manager.fouilleRapide(idUser);
    	
    	switch(reponse.codeRetour)
    	{
    		case 1 : 
    			EventLog.log("SERVEUR : Fouille Rapide() : Fouille réussie ! Objet découvert : " + reponse.itemDecouvert.nom);
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', 1, reponse.itemDecouvert,
    					reponse.degatSubis, reponse.itemDansSac, reponse.nbrEnnemisDecouverts, reponse.nbrGoulesA);
    			// actualiser l'ihm pour les perso de la meme case connectés
    			ActualiserAllInCase();
    			break;
    		case -1 : 
    			EventLog.log("SERVEUR : Fouille Rapide() : Fouille ratée !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -1, null, reponse.degatSubis, 0, 
    					reponse.nbrEnnemisDecouverts, reponse.nbrGoulesA);
    			break;
    			
    		case -5 : 
    			EventLog.log("SERVEUR : Fouille Rapide() : Intercepté par goule !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -5, null, reponse.degatSubis, 
    					0, 0, reponse.nbrGoulesA);
    			break;
    			
    		case -10 : 
    			EventLog.log("SERVEUR : Fouille Rapide() : Pas assez de PA !");
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -10, null, 0, 0, 0, 0);
    			break;
    		default :
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', 0, null, 0, 0, 0, 0);
    		break;
    	}

    	EventLog.log("SERVEUR : FOUILLE_RAPIDE - " + idUser +" - item découvert : " + reponse.itemDecouvert);

    	//}
    	//catch(err)
    	//{
    	//	EventLog.error("/!\\ ERREUR : SERVEUR : ACTION_FOUILLE_RAPIDE_CS : " + err);
    	//}
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
		EventLog.log("******************* ACTION_ATTAQUE_CS - EMETTEUR : " + pseudoUser +" ***********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
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
		
		EventLog.log("SERVER : idPersonnageCible attaqué : " + idPersonnageCible);
		//}
		//catch(err)
		//{
		//	EventLog.error("/!\\ ERREUR : SERVEUR : ACTION_ATTAQUE_CS : " + err);
		//}
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
		EventLog.log("******************* ACTION_ATTAQUE_GOULE_CS - EMETTEUR : " + pseudoUser +" ***********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
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
		
		//}
    	//catch(err)
		//{
		//	EventLog.error("/!\\ ERREUR : SERVEUR : ACTION_ATTAQUE_GOULE_CS : " + err);
		//}
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
		EventLog.log("******************* ACCUSE_LECTURE_MSG_CS - EMETTEUR : " + pseudoUser +" ***********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
    	EventLog.log("SERVEUR : Effacement des messages en attente du joueur " + oUtilisateur_Manager.getPseudo(idUser));
    	
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
    	//}
    	//catch(err)
    	//{
    	//	EventLog.error("/!\\ ERREUR : SERVEUR : ACCUSE_LECTURE_MSG_CS : " + err);
    	//}
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
		EventLog.log("******************* INFO_CASE_ALLIES_CS - EMETTEUR : " + pseudoUser +" ***********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser, false);
    	if (oUtilisateur_Manager.GetNumEquipe(idUser) == 1)
    	{
    		socket.emit('INFO_CASE_ALLIES_SC', liste.AGI);
    		return;
    	}
    	else if (oUtilisateur_Manager.GetNumEquipe(idUser) == 2)
    	{
    		socket.emit('INFO_CASE_ALLIES_SC', liste.INNO);
    		return;
    	}
    	else if (oUtilisateur_Manager.GetNumEquipe(idUser) == 3)
    	{
    		socket.emit('INFO_CASE_ALLIES_SC', liste.QSF);
    		return;
    	}
    	//}
    	//catch(err)
    	//{
    	//	EventLog.error("/!\\ ERREUR : SERVEUR : INFO_CASE_ALLIES_CS : " + err);
    	//}
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
		EventLog.log("******************* INFO_CASE_ENNEMIS_CS - EMETTEUR : " + pseudoUser +" ***********************");
		
		// Sécurité contre les sockets non identifiées
		if (!SocketIdentified()) return;
		
		//try
		//{
    	var liste = oPersonnage_Manager.GetAlliesEnnemisDansSalleToDisplay(idUser, true);
		console.log(" 1 = " + liste.AGI.length + " 2 = " + liste.INNO.length +" 3 = " + liste.QSF.length);

    	if (oUtilisateur_Manager.GetNumEquipe(idUser) == 1)
    	{
    		socket.emit('INFO_CASE_ENNEMIS_SC', liste.QSF, liste.INNO, 1);
    		return;
    	}
    	else if (oUtilisateur_Manager.GetNumEquipe(idUser) == 2)
    	{
    		socket.emit('INFO_CASE_ENNEMIS_SC', liste.AGI, liste.QSF, 2);
    		return;
    	}
    	else if (oUtilisateur_Manager.GetNumEquipe(idUser) == 3)
    	{
    		socket.emit('INFO_CASE_ENNEMIS_SC', liste.AGI, liste.INNO, 3);
    		return;
    	}
    	//}
    	//catch(err)
    	//{
    	//	EventLog.error("/!\\ ERREUR : SERVEUR : INFO_CASE_ENNEMIS_CS : " + err);
    	//}
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
		//try
		//{
    	SauvegardeGlobale();
    	//}
    	//catch(err)
    	//{
    	//	EventLog.error("/!\\ ERREUR : SERVEUR : SAVE_BD_DEBUG_CS : " + err);
    	//}
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
		//try
		//{
		socket.emit('GET_DATE_SC', dateLancementSrv);
		//}
		////catch(err)
		//{
		//	EventLog.error("/!\\ ERREUR : SERVEUR : GET_DATE_CS : " + err);
			//}
   });
   
   /*
    * *************************** 8 - SECURITE CONTRE LES SOCKETS NON IDENTIFIEES (idUser = undefined) ***************************
    */

   function SocketIdentified()
   {
	   if (typeof pseudoUser === "undefined")
   		{
   			EventLog.error("Reception de données d'une socket non identifiée !");
   			return false;
   		}
   		else
   		{
   			return true;
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
     * FONCTION POUR INFORMER LES AUTRES JOUEURS DE LA MEME CASE D'UN EVENEMENT
     */
    function InformerAllInCase(evenement, idCase)
    {
    	var liste;
    	// on récupère l'id de la case
    	if (typeof idCase === "undefined")
    	{
    		var idCase = oPersonnage_Manager.GetIdCase(idUser);
    		EventLog.log("******************* [INFORMER-ALL-IN-CASE]   ("+idCase+"[AUTO]) - EMETTEUR : " + pseudoUser +" ***********************");
    		// on récupère la liste des persos de la case
    		liste = oPersonnage_Manager.GetAlliesEnnemisDansSalle(idUser);
    	}
    	else
    	{
    		EventLog.log("******************* [INFORMER-ALL-IN-CASE]   ("+idCase+"[MANU]) - EMETTEUR : " + pseudoUser +" ***********************");
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
    		EventLog.log("******************* [ACTUALISER-ALL-IN-CASE] ("+idCase+"[AUTO]) - EMETTEUR : " + pseudoUser +" ***********************");
    	}
    	else
    	{
    		EventLog.log("******************* [ACTUALISER-ALL-IN-CASE] ("+idCase+"[MANU]) - EMETTEUR : " + pseudoUser +" ***********************");
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
					usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id), oUtilisateur_Manager.GetNumEquipe(id));
					usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(idCase), res.nbrAllies, res.nbrEnnemis, idSousCase);
				}
			}
		}
    }
});

function ActualiserAllGlobal(idCase)
{
	EventLog.log("******************* [ACTUALISER-ALL-GLOBAL] ("+idCase+") - EMETTEUR : ***********************");
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
				usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id), oUtilisateur_Manager.GetNumEquipe(id));
				usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(idCase), res.nbrAllies, res.nbrEnnemis, oPersonnage_Manager.GetIdSousCase(id));
			}
		}
	}
	
}


/*
 * *************************** 9 - CONFIGURATION DE LA SAUVEGARDE PERIODIQUE ***************************
 */
function SauvegardeGlobale()
{
	EventLog.log("***************** SAUVEGARDE GLOBALE DES DONNEES *****************************");
   	var date = new Date();
   	
   	EventLog.log("[ ! ] Nouvelle journée ! Date: " + date);
	// attaque sur les joueurs et regain des pts move et action
	oPersonnage_Manager.nouvelleJournee();
	// rajout des goules
	oCase_Manager.nouvelleJournee();
		
	date = new Date();
	EventLog.log("[ ! ] Sauvegarde globale ! Date: " + date);
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
			//oPersonnage_Manager.AddMessage(i 	d, "FLAAAAAAAAAAAAAAAAAAAAAAAAAAAASH ! ");
			var res 		= oPersonnage_Manager.GetNbrAlliesEnemisDansSalle(id);
			var idSousSalle = oPersonnage_Manager.GetIdSousCase(id);
			usersOnline[id].sockets[j].emit('INFO_PERSONNAGE_SC', oPersonnage_Manager.GetCopiePerso(id), oUtilisateur_Manager.GetNumEquipe(id));
			//usersOnline[id].sockets[j].emit('INFO_CASE_SC', oCase_Manager.GetCopieCase(oPersonnage_Manager.GetIdCase(id)), res.nbrAllies, res.nbrEnnemis, idSousSalle, true);
			// prévenir les joueurs de l'attaque de la nuit
			usersOnline[id].sockets[j].emit('ATTAQUE_NUIT_SC');
		}
	}
}
/*setInterval(function() 
{ 
	SauvegardeGlobale();
	heureDerniereAttaque = new Date();
	
}, GameRules.dureeCycle()); // (1000) millisec * 60 sec * 60 min
*/


// server.listen(8080);
app.on('close', function () { // On écoute l'évènement close
    EventLog.log('Bye bye !');
});


//EventLog.log("SERVEUR : Script lancé ! sur http://127.0.0.1:8080");


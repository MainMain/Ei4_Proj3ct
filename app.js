//appel aux modules
//var http = require('http');
var url = require("url");
var querystring = require('querystring');
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');
var app = express();
var server = http.createServer(app);

// require model
var oDatabase = require('./model/database');

// require objets
//var oPersonnage = require('./model/object/Personnage');
//var oCarte = require('./model/object/Carte');

//require persistance
//var oCase_BD = require('./persistance/Case_BD');
//var oItem_BD = require('./persistance/Item_BD');
var oUtilisateur_BD = require('./persistance/Utilisateur_BD');
//var oPersonnage_BD = require('./persistance/Personnage_BD');

//require manager
var oPersonnage_Manager = require('./manager/Personnage_Manager');
var oItem_Manager = require('./manager/Item_Manager');
var oCase_Manager = require('./manager/Case_Manager');

var usersOnline = new Array();

//Initialisation de la base de données
oDatabase.Initialiser();

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
var iManager;
var pManager;
var cManager;

var optionAccueil = {"username": null, "errorLogin": null, "InfoInscription": null, "usernameInscription": null}

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
	optionAccueil.username = req.session.username;
	res.render('accueil', optionAccueil);
	optionAccueil.username = null;
});

app.get('/jeu', function fonctionIndex(req, res)
{
	if (typeof req.session.username === "undefined")
	{
		optionAccueil.errorLogin = "Vous devez vous connecter avant de jouer ! ";
		res.render('accueil', optionAccueil);
	}
	else
	{
		optionAccueil.username = req.session.username;
		res.render('game', optionAccueil);
	}
	optionAccueil.username = null;
	optionAccueil.errorLogin = null;
});

app.get('/regles', function fonctionIndex(req, res)
{
	res.render('regles');
});

app.get('/chat-equipe', restrict, function fonctionIndex(req, res)
{
	var options = { "username": req.session.username, "errorLogin": null };
	res.render('chat-equipe', options);
});

app.get('/classement', restrict, function fonctionIndex(req, res)
{
	var options = { "username": req.session.username, "errorLogin": null };
	res.render('classement', options);
});

app.get('/chat-general', restrict, function fonctionIndex(req, res)
{
	var options = { "username": req.session.username, "errorLogin": null, "users": usersOnline, "countUser": req.session.views };
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
	// Si bon couple, on recoi l'id de l'user
	if (typeof reponseConnexion === 'string')
	{
		req.session.username = b.username;
		
		optionAccueil.username = req.session.username;
		
		usersOnline.push(b.username);
		
		// redirige à la page d'accueil
		res.render("accueil", optionAccueil);
		
		// chargement de son personnage
		iManager = new oItem_Manager();
		pManager = new oPersonnage_Manager();
		cManager;
		callbackT = function()
		{
			cManager = new oCase_Manager(pManager.GetIdSalleEnCours());
			console.log("DEBUG : NOM SALLE EN COURS " + cManager.GetCopieCase().id);
		}

		pManager.Load(reponseConnexion, callbackT);
	}
	else if(reponseConnexion == -1)
	{
		optionAccueil.errorLogin = "Couple Login/Mot de passe incorrect";
		res.render("accueil", optionAccueil);
	}
	else
	{
		optionAccueil.errorLogin = "Erreur Interne";
		res.render("accueil", optionAccueil);
	}
	optionAccueil.username = null;
	optionAccueil.errorLogin = null;
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
	}
	else if(reponseInscription == -2)
	{
		optionAccueil.InfoInscription = "Email";
		res.render("accueil", optionAccueil);
	}
	else
	{
		optionAccueil.usernameInscription = b.username;
		res.render("accueil", optionAccueil);
	}
	optionAccueil.usernameInscription = null;
	optionAccueil.InfoInscription = null;
},

app.delete("/", function (req, res)
{
	usersOnline.splice(usersOnline.indexOf(req.session.username), 1);
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
var io = require('socket.io').listen(server, {
    log: false
});

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
/*
 * CONNEXION D'UN CLIENT
 */
io.sockets.on('connection', function (socket)
{
    //test sessions
    socket.emit('MESSAGE_TEST', 'Vous êtes bien connecté !');
    socket.broadcast.emit('MESSAGE_TEST', 'Un autre client vient de se connecter !');

    console.log('SERVER : Un client est connecté !');
    //socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.getIdSalleEnCours());

    /***************************************************************************
     * RECEPTION D'UNE DEMANDE DE DEPLACEMENT VERS UNE DIRECTION DONNEE Renvoi
     * la case avec MOVE_PERSONNAGE_SC 
     * return : cManager.GetCopieCase() si ok
     * erreur : renvoi 0 si erreur de case
     * erreur : renvoi -1 si impossible de bouger 
     * erreur : -3 si aucun de Pts Mouvement
     */
    socket.on('MOVE_PERSONNAGE_CS', function (move)
	{
		console.log("*******************************************************");
		// log
		console.log('SERVER : Déplacement du personnage demandé : ' + move);
		
		// déplacement du personnage
		var ansDeplacementOk = pManager.Deplacement(move);
		
		// si le déplacement a réussi
		if (ansDeplacementOk == 1) 
		{
			console.log('SERVER : deplacement ok envoi de la nouvelle position');
			
			// enregistre dans le manager
			cManager.ChangeCase(pManager.GetIdSalleEnCours());
			// récupère la salle en cours
			//var cManager.GetCopieCase() = oCase_BD.GetCaseById(pManager.GetIdSalleEnCours());
			//var cManager.GetCopieCase() = cManager.GetCopieCase(pManager.GetIdSalleEnCours());
			
			// renvoi la salle ou erreur
			if (cManager.GetCopieCase() == null)
				socket.emit('MOVE_PERSONNAGE_SC', 0);
			else
				socket.emit('MOVE_PERSONNAGE_SC', cManager.GetCopieCase());
		}
		// si le déplacement a raté
		else if (ansDeplacementOk == -1)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', -1);
		}
		// plus de pts de mouvement
		else if (ansDeplacementOk == -2)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', -2);
		}
		console.log("*******************************************************");
    });
	
    /***************************************************************************
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
		var existItemInSac = pManager.ExistItemInSac(currentItem);
		
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
			var reponse = pManager.SEquiper(currentItem);
			
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
			var r = pManager.SeDesequiper(currentItem);
			if (r == -1) 
				socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, -4);
			else
				socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, currentItem.type);
		}
		console.log("*******************************************************");
    });
    
    
    /***************************************************************************
     * RECEPTION D'UNE DEMANDE POUR RAMASSER OU DEPOSER UN ITEM return
     * poidsTotal si ok erreur : -1 si poids insufisant
     * erreur : -2 si objet n'est pas dans la case / le sac 
     * erreur : -3 si objet à déposer est équipé
     * erreur : -4 si autre
     */
    socket.on('INV_CASE_CS', function (type, id_item)
	{
		console.log("*******************************************************");
		
		// récupère la case en cours
		//var cManager.GetCopieCase() = oCase_BD.GetCaseById(pManager.GetIdSalleEnCours());

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
			//var existItemInSalle = cManager.GetCopieCase().existItemInSalle(currentItem);
			var existItemInSalle = cManager.ExistItem(currentItem);
			
			// si l'objet est bien dans la salle
			if (existItemInSalle == true)
			{
				//console.log("SERVER : poids sac : " + pManager.GetPoidsSac() + " - poids item : " + currentItem.poids + " - poids max : " + myPerso.poidsMax);
				
				// demande au manager de perso d'ajouter l'item
				var r = pManager.AjouterItemAuSac(currentItem);
				
				// ramassage ok
				if (r == 1)
				{
					console.log("SERVER : Demande de ramassage ok ");
						
					// suppression de l'objet de la case
					cManager.SupprimerItem(currentItem);
						
					// return au client
					socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, pManager.GetPoidsSac());
				}
				else
				{
				console.log("SERVER : Demande de ramassage impossible : poids max atteint");
					
				// return au client que l'objet ne peut être ajouté (poids insufisant)
				socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, -1);
				}
			} // fin if (existItemInSalle == true)
			// si l'objet n'est pas dans la case (! l'ihm n'a pas été mis à jour !)
			else
			{
				// return que l'objet n'est pas dans la case
				socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, -2);
			}
			
		}
		// si action de type depose
		else if (type == "DEPOSER") 
		{
		// log
		console.log("SERVER : Demande pour deposer l'currentItem : " + id_item + " - " + currentItem.nom);
			
		// check si l'objet à déposer n'est pas équipé
		if (pManager.IsItemEquipee(currentItem) == true)
			{
				console.log("APP : Objet à déposer est équipé !! ");
				socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, -3);
				return;
			}
		
		
		// check si currentItem est bien dans le sac
		var existItemInSac = pManager.ExistItemInSac(currentItem);

		// si l'item est bien dans le sac
		if (existItemInSac == true) {
			// ajout de l'item a la case
			cManager.GetCopieCase().ajouterItem(currentItem);
			
			// suppression de l'item au perso
			pManager.SupprimerDuSac(currentItem);
			
			// return au client
			socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, pManager.GetPoidsSac());
			}
			// si l'item n'est pas dans le sac (! l'ihm n'a pas été mis à jour !)
			else {
				// return que l'item n'est pas dans le sac
				socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, -2);
			}
		}
		console.log("*******************************************************");
    });
	
    /***************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFOS SUR UNE CASE Renvoi la case avec
     * INFO_CASE_SC Si erreur : renvoi NULL
     */
    socket.on('INFO_CASE_CS', function ()
	{
		console.log("*******************************************************");
		// récupère la salle en cours
		//var cManager.GetCopieCase() = oCase_BD.GetCaseById(pManager.GetIdSalleEnCours());
		// return selon la valeur de retour
		if (cManager.GetCopieCase() == null)
			socket.emit('INFO_CASE_SC', "ERREUR_CASE");
		else
			socket.emit('INFO_CASE_SC', cManager.GetCopieCase());
		console.log("*******************************************************");
    });


    /***************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFO SUR LE PERSONNAGE
     */
    socket.on('INFO_PERSONNAGE_CS', function ()
	{
		socket.emit('INFO_PERSONNAGE_SC', pManager.GetCopiePerso());
    });


    /***************************************************************************
     * RECEPTION D'UNE DEMANDE DE DECONNEXION
     * return : 1 si ok
     * Si erreur : renvoi 0
     */
    socket.on('DECONNEXION_CS', function () {
    	console.log("*******************************************************");
        // log
        console.log('SERVER : Demande Deconnexion !');

        socket.emit('DECONNEXION_SC', 1);
        console.log("*******************************************************");
    });


    /***************************************************************************
     * RECEPTION D'UNE DEMANDE DE CONNEXION Renvoi "CONNEXION_OK"
     * return : 1 si login / mdp ok
     * Si couple inconnu : renvoi 0
     * si erreur : renvoi -1
     */
	 /*
    socket.on('CONNEXION_CS', function (username, password)
	{
		console.log("*******************************************************");
        // log
        console.log('SERVER : Demande Connexion avec le couple : ' + username + ":" + password);
		
		oUtilisateur_BD.Connexion(username, password, callbackConnexion);
		console.log("*******************************************************");
    });
    
	/**************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR UTILISER UN ITEM
	 * return 1 si ok
	 * erreur : 0 si objet n'est pas dans le sac
	 * erreur : -1 si objet pas utilisable
	 */
    socket.on('PERSONNAGE_USE_CS', function (id_item)
    {
    	console.log("*******************************************************");
    	// recupere l'currentItem
    	var currentItem = iManager.GetItem(id_item);

    	// check si currentItem est bien dans le sac
  		var existItemInSac = pManager.ExistItemInSac(currentItem);
  		if (existItemInSac == false)
  		socket.emit('PERSONNAGE_USE_CS', currentItem, 0);

    	// le personnage tente d'utiliser l'item
    	var reponse = pManager.Utiliser(currentItem);
    		
    	// et selon le message renvoyé
    	switch (reponse) {
    	case 1:
    		console.log("SERVEUR : utilisation de l'item ok");
    		socket.emit('PERSONNAGE_USE_SC', 'EQUIPER', currentItem, 1);
    		break;
    	case -1:
    		console.log("SERVEUR : impossible d'utiliser cet item !");
    		socket.emit('PERSONNAGE_USE_SC', 'EQUIPER', currentItem, -1);
    		break;
    	}
    	console.log("*******************************************************");
    });
    
	
	/*callbackConnexion = function(reponse)
	{
		console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		console.log("SERVEUR : Reponse connexion : " + reponse);
		
        if (reponse == 1 || reponse == -1)
		{
            socket.emit('CONNEXION_SC', reponse);
        }
		else
		{
			socket.emit('CONNEXION_SC', 0);
		}

        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	}*/
	


    /***************************************************************************
     * RECEPTION D'UNE DEMANDE D'INSCRIPTION
     * Renvoi 1 si ok
     * si erreur : -1 pseudo deja pris
     * Si erreur : -2 email deja pris
     */
	/*
    socket.on('INSCRIPTION_CS', function (username, password, email)
	{
		console.log("*******************************************************");
        //Log
        console.log('SERVER : Demande inscription avec le couple : ' + username + ":" + password + " : " + email);
		
        oUtilisateur_BD.Inscription(username, password, email, callbackInscription);
        console.log("*******************************************************");
    });
	
	callbackInscription = function(reponse)
	{
		console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		console.log("SERVEUR : Reponse inscription : " + reponse);
		//si problème
        if (reponse == -1 || reponse == -2)
		{
            socket.emit('INSCRIPTION_SC', reponse);
        }
        // sinon, c'est un utilisateur, donc 
        else
		{
            console.log("SERVEUR : INSCRIPTION OK");
            // créer le personnage
            var myPerso = new oPersonnage(reponse.idPersonnage, 0, 0, 0, 0, 0, 0, 0, 0, null, null, null);
            oPersonnage_BD.SetPersonnage(myPerso);
            socket.emit('INSCRIPTION_SC', 1);
        }
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
	}
	*/

    //});

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
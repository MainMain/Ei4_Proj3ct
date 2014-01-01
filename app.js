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
		/*
		 * ABDOU : j'ai remplacé par "redirect", car sinon, l'url restait /jeu alors qu'on est sur l'accueil...
		 */
		
		//res.render('accueil', optionAccueil);
		res.redirect('/');
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
		pManager.Load(reponseConnexion, function()
				{
					cManager = new oCase_Manager(pManager.GetIdSalleEnCours());
					console.log("DEBUG : NOM SALLE EN COURS " + cManager.GetCopieCase().id);
				});
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

    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE DE DEPLACEMENT VERS UNE DIRECTION DONNEE Renvoi
     * la case avec MOVE_PERSONNAGE_SC 
     * return : cManager.GetCopieCase() si ok
     * erreur : renvoi 0 si erreur de case
     * erreur : renvoi -1 si impossible de bouger 
     * erreur : -2 si aucun de Pts Mouvement
     * erreur : -3 si trop de goules
     * erreur : -4 si zone sure adverse
     * erreur : -5 si raté à cause goule
     * 
     * ET return eventuels dégats infligés
     * 
     */
    socket.on('MOVE_PERSONNAGE_CS', function (move)
	{
		console.log("*******************************************************");
		// log
		console.log('SERVER : Déplacement du personnage demandé : ' + move);
		
		// test si pas zone sure adverse
		if (cManager.GetTestZoneSure(uManager.GetNumEquipe()))
			{
				socket.emit('MOVE_PERSONNAGE_SC', -4, 0);
				return;
			}
		
		// test si il y a trop de goules pour pouvoir se déplacer
		// -> calcul de goules
		var nbrGoules = cManager.GetNombreGoules();
		nbrGoules = nbrGoules - cManager.GetNombreAllies();
		
		if (pmanager.GetDeplacementPossible(nbrGoules) == false)
			{
				socket.emit('MOVE_PERSONNAGE_SC', -3, 0);
				return;
			}
		
    	// ********* algorithme de test de l'impact des goules *********
    	var restG = TestGoules();
    	console.log("degats ? " + restG["degats"]);
    	if (restG["actionOk"] == 0)
    		{
    			// log
    			console.log("deplacement ratée à cause des goules");
    			
    			// retrait des points de déplacement
    			pManager.PerteDeplacementParGoules();
    			
    			// renvoi de la réponse
    			socket.emit('MOVE_PERSONNAGE_SC', -5, restG["degats"]); 
    		}
    	// ***************************************************************

        
        // déplacement du personnage
		var ansDeplacementOk = pManager.Deplacement(move, nbrGoules);
		
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
				socket.emit('MOVE_PERSONNAGE_SC', 0, restG["degats"]);
			else
				socket.emit('MOVE_PERSONNAGE_SC', cManager.GetCopieCase(), restG["degats"]);
		}
		// si le déplacement a raté
		else if (ansDeplacementOk == -1)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', -1, restG["degats"]);
		}
		// plus de pts de mouvement
		else if (ansDeplacementOk == -2)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible : pu de PM');
			socket.emit('MOVE_PERSONNAGE_SC', -2, restG["degats"]);
		}
		// si trop de goules
		else if (ansDeplacementOk == -3)
		{
			console.log('SERVER : DEBUG envoi deplacement impossible : trop de goules');
			socket.emit('MOVE_PERSONNAGE_SC', -3, restG["degats"]);
		}
		console.log("*******************************************************");
    });
	
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
    
    
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE POUR RAMASSER OU DEPOSER UN ITEM 
     * return poidsTotal si ok erreur : -1 si poids insufisant
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
	
    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFOS SUR UNE CASE 
     * Renvoi la case 
     * Si erreur : renvoi NULL
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


    /******************************************************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFO SUR LE PERSONNAGE
     */
    socket.on('INFO_PERSONNAGE_CS', function ()
	{
		socket.emit('INFO_PERSONNAGE_SC', pManager.GetCopiePerso());
    });


    /******************************************************************************************************************
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


    /******************************************************************************************************************
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
    	if (reponse == 1) 
    	{
    		console.log("SERVEUR : utilisation de l'item ok");
    		socket.emit('PERSONNAGE_USE_SC', 'EQUIPER', currentItem, 1);
    	}
    	else{
    		console.log("SERVEUR : impossible d'utiliser cet item !");
    		socket.emit('PERSONNAGE_USE_SC', 'EQUIPER', currentItem, -1);
    	}
    	console.log("*******************************************************");
    });
    
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR CHANGER DE MODE
	 * return 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -4 si déja dans ce mode
	 * erreur : -5 si raté à cause goules
	 * 
	 * ET return dégats infligés
	 */
    socket.on('PERSONNAGE_MODE_CS', function (mode) {
        console.log("*******************************************************");
        console.log("SERVEUR : chgt de mode demandé, de " + pManager.GetMode() + " -> " + mode);
        // si déja dans ce mode
        if (pManager.GetMode() == mode)
        {
            socket.emit('PERSONNAGE_MODE_SC', mode, -4);
            return;
        }
        // si c'est un passage en mode défense
        if (mode == 3) {
            // changement de mode
            pManager.ChangementMode(mode);

            // réponse ok
            socket.emit('PERSONNAGE_MODE_SC', mode, 1);
            return;
        }
        // sinon :
        // ********* algorithme de test de l'impact des goules *********
    	var restG = TestGoules();
    	console.log("degats ? " + restG["degats"]);
    	if (restG["actionOk"] == 0)
    		{
    			// log
    			console.log("chgt de mode ratée à cause des goules");
    			
    			// renvoi de la réponse
    			socket.emit('MOVE_PERSONNAGE_SC', -5, restG["degats"]); 
    		}
    	// ***************************************************************

    	// chgt de mode du perso
        pManager.ChangementMode(mode);
    	console.log("chgt d emode ok");
    	socket.emit('PERSONNAGE_MODE_SC', 1, restG["degats"]);
    	 
        console.log("*******************************************************");
    });
	
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR EFFECTUER UNE FOUILLE RAPIDE
	 * 
	 * 
	 * return : 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -1 si fouille rate
	 * erreur : -5 si action raté
	 * 
	 * ET return éventuels item découvert
	 * 
	 * ET return éventuel dégats infligés
	 * 
	 * ET return 1 si objet ajouté au sac, 0 si a la salle
	 */
    socket.on('ACTION_FOUILLE_RAPIDE_CS', function ()
    {
    	console.log("***************** FOUILLE RAPIDE ******************************");
    	// ********* algorithme de test de l'impact des goules *********
    	var restG = TestGoules();
    	console.log("degats ? " + restG["degats"]);
    	if (restG["actionOk"] == 0)
    		{
    			// log
    			console.log("fouille ratée à cause des goules");
    			// retrait de points d'actions
    			pManager.PerteActionParGoules();
    			// renvoi de la réponse
    			socket.emit('ACTION_FOUILLE_RAPIDE_SC', -5, null, restG["degats"], null); 
    		}
    	// ***************************************************************
    	
        // calcul si la fouille reussie
        var fouilleFrutueuse = cManager.Fouille();
        
        // retrait des points d'actions
        pManager.FouilleRapide();
        
        // si fouille Fructueuse détermination de l'item trouvé
        if (fouilleFrutueuse)
        {
        	console.log("");
        	// tire un item aléatoire
        	var item = iManager.GetItemAleatoire(function(newItem)
        	{
        		// ajout au sac
        		var res = pManager.AjouterItemAuSac(item);
        	        		
        		// si la res est false, c'est que l'objet na pas pu être ajouté au sac
        		// donc ajout à la salle
        		if (!res)
        			cManager.AjouterItem(item);
        	        		
        		console.log("fouille fructueuse. Ajout au sac? " + res);
        		// si la fouille réussie
        		socket.emit('ACTION_FOUILLE_RAPIDE_SC',  1, item, restG["degats"], res); 
        	});
        }
        else
        {
        	console.log("fouille raté");
        	socket.emit('ACTION_FOUILLE_RAPIDE_SC',  -1, null, restG["degats"], null); 
        }
        console.log("*****************************************************************");
        
    });
    
    /******************************************************************************************************************
	 * RECEPTION D'UNE DEMANDE POUR ATTAQUER UN AUTRE JOUEUR
	 * return 1 si ok
	 * erreur : 0 si erreur interne
	 * erreur : -1 si joueur pu dans la salle
	 * erreur : -5 si raté à cause goules
	 * 
	 * 
	 * ET return dégats infligés
	 */
    socket.on('ACTION_ATTAQUE_CS', function (pseudoCible) {
    	
    });

    /******************************************************************************************************
     * FONCTION DE TEST DE L'IMPACT DES GOULES SUR LES ACTIONS / DEPLACEMENTS DES JOUEURS
     * return [actionOk, degats]
     */
    function TestGoules()
    {
    	 // calcul si blessé par goules
        var reponseDegatsParGoules = cManager.DegatsParGoules();
        
        // calcul si chgt mode réussi
        var reponseActionReussie = cManager.ActionReussieParGoules();
        
        var a;
        a["actionOk"] = reponseActionReussie;
        //a["degats"] = reponseDegatsParGoules;
        
        // informe le manager de perso des dégats
        var degatsInfliges = pManager.DiminuerSante(reponseDegatsParGoules);
        a["degats"] = degatsInfliges;
        return a;
    }
    
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
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

var oPersonnage = require('./model/object/Personnage');
var oCarte = require('./model/object/Carte');
var oCase_BD = require('./persistance/Case_BD');
var oItem_BD = require('./persistance/Item_BD');
var oUtilisateur_BD = require('./persistance/Utilisateur_BD');
var oPersonnage_BD = require('./persistance/Personnage_BD');
//var oDatabase = require('./model/database');

var usersOnline = new Array();

//Initialisation de la base de données
//oDatabase.Initialiser();

/*
 * CONFIGURATION DU SERVEUR
 */
app.set('port', process.env.PORT || 8081);
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

//middleware
/*app.use(express.bodyParser());
app.use(express.cookieParser('shhhh, very secret'));
app.use(express.session());
*//*
//Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});
/*
//dummy database
var users = {
  tj: { name: 'tj' }
};

//when you create a user, generate a salt
//and hash the password ('foobar' is the pass here)
hash('foobar', function(err, salt, hash){
if (err) throw err;
// store the salt & hash in the "db"
users.tj.salt = salt;
users.tj.hash = hash.toString();
});

//Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(new Error('cannot find user'));
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash(pass, user.salt, function(err, hash){
    if (err) return fn(err);
    if (hash.toString() == user.hash) return fn(null, user);
    fn(new Error('invalid password'));
  })
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/');
  }
}

function logged(req, res, next) {
	if (req.session != null) {
		next();
	} else {
		res.redirect('/');
	}
}


app.get('/restricted', logged, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.post('/login', function(req, res){
  authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation 
      req.session.regenerate(function(){
        // Store the user's primary key 
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('login');
    }
  });
});

/*
 * CONFIGURATION DES SESSIONS
 */
/*
// Allow parsing cookies from request headers
app.use(express.cookieParser());
// Session management
app.use(express.session({
    // Private crypting key
    "secret": "some private string",
    // Internal session data storage engine, this is the default engine embedded
    // with connect.
    // Much more can be found as external modules (Redis, Mongo, Mysql,
    // file...). look at "npm search connect session store"
    "store": new express.session.MemoryStore({
        reapInterval: 60000 * 10
    })
}));
*/
/** Middleware for limited access */
/*
function requireLogin(req, res, next) {
    if (req.session.username) {
        // User is authenticated, let him in
        next();
    } else {
        // Otherwise, we redirect him to login form
        res.redirect("/");
    }
};
*/

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
});

app.get('/jeu', restrict, function fonctionIndex(req, res)
{
	optionAccueil.username = req.session.username;
	res.render('game', options);
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
	// Si bon couple
	if (reponseConnexion == 1)
	{
		req.session.username = b.username;
		
		optionAccueil.username = req.session.username;
		
		usersOnline.push(b.username);
		
		res.render("accueil", optionAccueil);
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
}

app.put("/", function (req, res)
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
}
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
    log: true
});

/*
 * INITIALISATION DE LA BD
 * Comme il n'y a pas de BD pour le moment, on en simule une...
 */
oItem_BD.Initialiser();
oCarte.Initialiser(3, 4);
oCase_BD.Initialiser();

/*
 * INITIALISATION DU PERSONNAGE
 */

var sacADos = [oItem_BD.GetItemById(9), oItem_BD.GetItemById(10), oItem_BD.GetItemById(11)];
var myPerso = new oPersonnage(10, 100, 100, 20, 25, 10,
    15, 100, 0, null, null, sacADos);

/**
 * ********* EVENEMENTS LORS DE RECEPETION D'UNE COMMUNICATION CLIENT -> SERVEUR
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
     * la case avec MOVE_PERSONNAGE_SC Si erreur : renvoi "ERREUR_MOVE" si
     * impossible de bouger Si erreur : renvoi "ERREUR_CASE" si erreur de case
     */
    socket.on('MOVE_PERSONNAGE_CS', function (move)
	{
		// log
		console.log('SERVER : Déplacement du personnage demandé : ' + move);
		// déplacement du personnage
		var ansDeplacementOk = myPerso.deplacement(move);
		// si le déplacement a réussi
		if (ansDeplacementOk == true) {
			console.log('SERVER : DEBUG envoi de la nouvelle position');
			// récupère la salle en cours
			var currentCase = oCase_BD.GetCaseById(myPerso.idSalleEnCours);
			console.log("-------- DEBUG " + myPerso.id + " -- " + currentCase);
			// renvoi la salle ou erreur
			if (currentCase == null)
				socket.emit('MOVE_PERSONNAGE_SC', "ERREUR_CASE");
			else
				socket.emit('MOVE_PERSONNAGE_SC', currentCase);
		}
		// si le déplacement a raté
		else {
			console.log('SERVER : DEBUG envoi deplacement impossible');
			socket.emit('MOVE_PERSONNAGE_SC', "ERREUR_MOVE");
		}
    });
	
    /***************************************************************************
     * RECEPTION D'UNE DEMANDE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM return 1 si ok
     * erreur : 0 si objet n'est pas dans le sac
     * erreur : -1 si il y a déja une arme d'équipée
     * erreur : -2 si il y a déja une armure d'équipée
     * erreur : -3 si item n'est ni arme ni armure
     * erreur : -4 si l'item a dequiper n'est pas équipé au préalable
     */
    socket.on('INV_PERSONNAGE_CS', function (type, id_item)
	{
		// recupere l'currentItem
		var currentItem = oItem_BD.GetItemById(id_item);

		// check si currentItem est bien dans le sac
		var existItemInSac = myPerso.existItemInSac(currentItem);
		if (existItemInSac == false)
			socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, 0);

		// si c'est une demande pour s'équiper
		if (type == "EQUIPER") {
			// on équipe le perso
			var reponse = myPerso.sEquiperDunItem(currentItem);
			// et selon le message renvoyé
			switch (reponse) {
			case 1:
				socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, 1);
				break;
			case -1:
				socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, -1);
				break;
			case -2:
				socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, -2);
				break;
			case -3:
				socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem, -3);
				break;
			default:
				break;
			}
		} else if (type == "DEQUIPER") {
			// si le perso n'est pas équipe d'un item de cet idem
			if (myPerso.armeEquipee.id != currentItem.id || myPerso.armureEquipee.id != currentItem.id) {
				socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -4);
			}
			var reponse = myPerso.sDesequiperDunItem(currentItem);
			socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, 1);
		}
    });
    /***************************************************************************
     * RECEPTION D'UNE DEMANDE POUR RAMASSER OU DEPOSER UN ITEM return
     * poidsTotal si ok erreur : -1 si poids insufisant erreur : -2 si objet
     * n'est pas dans la case / le sac erreur : -3 si autre
     */
    socket.on('INV_CASE_CS', function (type, id_item)
	{
		// si pas de session
		if (myPerso == null) {
			console.log("WARNING - PAS DE SESSION !");
			return;
		}
		// récupère la case en cours
		var currentCase = oCase_BD.GetCaseById(myPerso.idSalleEnCours);

		// recupere l'currentItem
		var currentItem = oItem_BD.GetItemById(id_item);

		if (type == "RAMASSER") {

			// log
			console.log("SERVER : Demande pour ramasser l'currentItem : " + id_item + " - " + currentItem.nom);

			// check si currentItem est bien dans la salle
			var existItemInSalle = currentCase.existItemInSalle(currentItem);

			// si l'objet est bien dans la salle
			if (existItemInSalle == true) {
				// check si l'objet peut être ajouté au personnage
				console.log("SERVER : poids sac : " + myPerso.getPoidsSac() + " - poids item : " + currentItem.poids + " - poids max : " + myPerso.poidsMax);
				if ((myPerso.getPoidsSac() + currentItem.poids) < myPerso.poidsMax) {
					// ajout de l'currentItem au sac du perso
					myPerso.ajouterAuSac(currentItem);
					// suppression de l'objet de la case
					currentCase.supprimerItem(currentItem);
					// return au client
					socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, myPerso.getPoidsSac());
				} else {
					console.log("SERVER : Demande de ramassage impossible : poids max atteint");
					// return au client que l'objet ne peut être ajouté (poids
					// insufisant)
					socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, -1);
				}
			}
			// si l'objet n'est pas dans la case (! l'ihm n'a pas été mis à jour
			// !)
			else {
				// return que l'objet n'est pas dans la case
				socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, -2);
			}
		} else if (type == "DEPOSER") {
			// log
			console.log("SERVER : Demande pour deposer l'currentItem : " + id_item + " - " + currentItem.nom);

			// check si currentItem est bien dans le sac
			var existItemInSac = myPerso.existItemInSac(currentItem);

			// si l'item est bien dans le sac
			if (existItemInSac == true) {
				// ajout de l'item a la case
				currentCase.ajouterItem(currentItem);
				// suppression de l'item au perso
				myPerso.supprimerDuSac(currentItem);
				// return au client
				socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, myPerso.getPoidsSac());
			}
			// si l'item n'est pas dans le sac (! l'ihm n'a pas été mis à jour
			// !)
			else {
				// return que l'item n'est pas dans le sac
				socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, -2);
			}
		}
    });
	
    /***************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFOS SUR UNE CASE Renvoi la case avec
     * INFO_CASE_SC Si erreur : renvoi NULL
     */
    socket.on('INFO_CASE_CS', function ()
	{
		// récupère la salle en cours
		var currentCase = oCase_BD.GetCaseById(myPerso.idSalleEnCours);
		// return selon la valeur de retour
		if (currentCase == null)
			socket.emit('INFO_CASE_SC', "ERREUR_CASE");
		else
			socket.emit('INFO_CASE_SC', currentCase);
    });


    /***************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFO SUR LE PERSONNAGE
     */
    socket.on('INFO_PERSONNAGE_CS', function ()
	{
		socket.emit('INFO_PERSONNAGE_SC', myPerso);
    });


    /***************************************************************************
     * RECEPTION D'UNE DEMANDE DE DECONNEXION
     * return : 1 si ok
     * Si erreur : renvoi 0
     */
    socket.on('DECONNEXION_CS', function () {
        // log
        console.log('SERVER : Demande Deconnexion !');

        socket.emit('DECONNEXION_SC', 1);
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
        // log
        console.log('SERVER : Demande Connexion avec le couple : ' + username + ":" + password);
		
		oUtilisateur_BD.Connexion(username, password, callbackConnexion);
    });
	
	callbackConnexion = function(reponse)
	{
		console.log("SERVEUR : Reponse connexion : " + reponse);
		
        if (reponse == 1 || reponse == -1)
		{
            socket.emit('CONNEXION_SC', reponse);
        }
		else
		{
			socket.emit('CONNEXION_SC', 0);
		}
	}
	*/
    /***************************************************************************
     * RECEPTION D'UNE DEMANDE D'INSCRIPTION
     * Renvoi 1 si ok
     * si erreur : -1 pseudo deja pris
     * Si erreur : -2 email deja pris
     */
	/*
    socket.on('INSCRIPTION_CS', function (username, password, email)
	{
        //Log
        console.log('SERVER : Demande inscription avec le couple : ' + username + ":" + password + " : " + email);
		
        oUtilisateur_BD.Inscription(username, password, email, callbackInscription);
    });
	
	callbackInscription = function(reponse)
	{
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
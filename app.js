//appel aux modules
//var http = require('http');
var url = require("url");
var querystring = require('querystring');
var express = require('express'),
    routes = require('./routes')
    // , user = require('./routes/user')
    ,
    http = require('http'),
    path = require('path');
var app = express();
var server = http.createServer(app);

var oPersonnage = require('./model/object/Personnage');
var oCarte = require('./model/object/Carte');
var oCase_BD = require('./persistance/Case_BD');
var oItem_BD = require('./persistance/Item_BD');
var oUtilisateur_BD = require('./persistance/Utilisateur_BD');


/*
 * CONFIGURATION DU SERVEUR
 */
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/')));

/*
 * CONFIGURATION DES SESSIONS
 */
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

/** Middleware for limited access */
function requireLogin(req, res, next) {
    if (req.session.username) {
        // User is authenticated, let him in
        next();
    } else {
        // Otherwise, we redirect him to login form
        res.redirect("/");
    }
};


/*
 * CONFIGURATION DES ROUTES
 */
app.get('/', routes.index);
app.get('/jeu', routes.jeu);
app.get('/regles', routes.regles);
app.get('/chat-equipe', routes.chatEquipe);
app.get('/classement', routes.classement);
app.get('/chat-general', routes.chatGeneral);
app.get('/session-test', routes.sessiontest);

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
io.sockets.on('connection', function (socket) {
    console.log('SERVER : Un client est connecté !');
    socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.getIdSalleEnCours());

    /***************************************************************************
     * RECEPTION D'UNE DEMANDE DE DEPLACEMENT VERS UNE DIRECTION DONNEE Renvoi
     * la case avec MOVE_PERSONNAGE_SC Si erreur : renvoi "ERREUR_MOVE" si
     * impossible de bouger Si erreur : renvoi "ERREUR_CASE" si erreur de case
     */
    socket.on('MOVE_PERSONNAGE_CS', function (move) {
        // log
        console.log('SERVER : Déplacement du personnage demandé : ' + move);
        // déplacement du personnage
        var ansDeplacementOk = myPerso.deplacement(move);
        // si le déplacement a réussi
        if (ansDeplacementOk == true) {
            console.log('SERVER : DEBUG envoi de la nouvelle position');
            // récupère la salle en cours
            var currentCase = oCase_BD.GetCaseById(myPerso.idSalleEnCours);
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
     * RECEPTION D'UNE DEMANDE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM return
     * 1 si ok erreur : 0 si objet n'est pas dans le sac erreur : -1 si il y a
     * déja une arme d'équipée erreur : -2 si il y a déja une armure d'équipée
     * erreur : -3 si item n'est ni arme ni armure erreur : -4 si l'item a
     * dequiper n'est pas équipé au préalable
     */

    socket.on('INV_PERSONNAGE_CS', function (type, id_item) {
        // recupere l'currentItem
        var currentItem = oItem_BD.GetItemById(id_item);

        // check si currentItem est bien dans le sac
        var existItemInSac = myPerso.existItemInSac(currentItem);
        if (existItemInSac == false)
            socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, 0);

        // si c'est une demande pour s'équiper
        if (type == "EQUIPER") {
            // on équipe le perso
            var reponse = myPerso.sEquiperDunItem(currentItem);
            // et selon le message renvoyé
            switch (reponse) {
            case 1:
                socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, 1);
                break;
            case -1:
                socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -1);
                break;
            case -2:
                socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -2);
                break;
            case -3:
                socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -3);
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
    socket.on('INV_CASE_CS', function (type, id_item) {
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
    socket.on('INFO_CASE_CS', function () {
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
    socket.on('INFO_PERSONNAGE_CS', function () {
        socket.emit('INFO_PERSONNAGE_SC', myPerso);
    });


    /***************************************************************************
     * RECEPTION D'UNE DEMANDE DE CONNEXION Renvoi "CONNEXION_OK"
     * return : 1 si login / mdp ok
     * Si couple inconnu : renvoi 0
     * si erreur : renvoi -1
     */
    socket.on('CONNEXION_CS', function (username, password) {
    	socket.emit('CONNEXION_CS', 1); // utilisé pour tester ihm
        // log
        console.log('SERVER : Demande Connexion avec le couple : ' + username + ":" + password);
		/*
        // demande à la base de données
        var reponse = oUtilisateur_BD.Connexion(username, password);
		
        // si couple ok
        if (reponse == true) {
            socket.emit('CONNEXION_SC', 1);
        } else {
            socket.emit('CONNEXION_SC', 0);
        }
        socket.emit('CONNEXION_SC', -1);
		*/
		
		if(username == "John" && password == "azerty")
		{
            socket.emit('CONNEXION_SC', 1);
		}
		else
		{
            socket.emit('CONNEXION_SC', -1);
		}
    });


    /*
     * RECEPTION D'UNE DEMANDE D'INSCRIPTION
     * Renvoi 1 si ok 
     * Si erreur : renvoi 0
     */
    socket.on('INSCRIPTION_CS', function (username, password, email) {
    	//socket.emit('INSCRIPTION_SC', 1); // utilisé pour tester ihm
         // log
        console.log('SERVER : Demande inscription avec le couple : ' + username + ":" + password);
        /*
		var reponse = oUtilisateur_BD.Inscription(username, password, email);
        // si 1: : ok
        if (reponse == 1) {
        	socket.emit('INSCRIPTION_SC', 1);
        } 
        // si -1 : pseudo deja pris
        else  if (reponse == -1) {
        	socket.emit('INSCRIPTION_SC', -1);
        }
        // si -2 : email deja pris
        else  if (reponse == -2) {
        	socket.emit('INSCRIPTION_SC', -2);
        }
        else
        	socket.emit('INSCRIPTION_SC', 2);
        */
		
		if(username == "John")
		{
        	socket.emit('INSCRIPTION_SC', -1);
		}
		else if(email == "test@gmail.com")
		{
        	socket.emit('INSCRIPTION_SC', -2);
		}
		else
		{
			socket.emit('INSCRIPTION_SC', 1);
		}
    });

});




// server.listen(8080);
app.on('close', function () { // On écoute l'évènement close
    console.log('Bye bye !');
});

console.log("SERVEUR : Script lancé ! sur http://127.0.0.1:8080");
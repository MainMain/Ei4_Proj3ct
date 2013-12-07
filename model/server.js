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
var oCase_BD = require('../persistance/Case_BD');
var oItem_BD = require('../persistance/Item_BD');


//var eventjeu = new EventEmitter();

// Session
//app.use(express.cookieParser());
// app.use(express.session({secret: '1234567890QWERTY'}));

// lancement du serveur
oItem_BD.Initialiser();

oCarte.Initialiser(3, 4);
oCase_BD.Initialiser();


/*
 * LANCEMENT DU SERVEUR ET ENVOI DE LA PAGE D'ACCUEIL
 */
var server = http.createServer(function (req, res) {
    console.log("SERVEUR : initialisation du serveur");

    fs.readFile('../view/game.ejs', 'utf-8', function (error, content) {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(content);
    });
});
//Chargement de socket.io
var io = require('socket.io').listen(server, {
    log: false
});


/*
 * INITIALISATION DU PERSONNAGE
 */
var sacADos = [oItem_BD.GetItemById(9), oItem_BD.GetItemById(10), oItem_BD.GetItemById(11)];
var myPerso = new oPersonnage(10, 100, 100, 20, 25, 10,
    15, 100, 0, null, null, sacADos);


/*********** EVENEMENTS LORS DE RECEPETION D'UNE COMMUNICATION CLIENT -> SERVEUR **************/
/*
 * CONNEXION D'UN CLIENT
 */
io.sockets.on('connection', function (socket) {
    console.log('SERVER : Un client est connecté !');
    socket.emit('MESSAGE_SC', "Salle du perso : " + myPerso.getIdSalleEnCours());

    /*****************************************************************************************************
     * RECEPTION D'UNE DEMANDE DE DEPLACEMENT VERS UNE DIRECTION DONNEE
     * Renvoi la case avec MOVE_PERSONNAGE_SC
     * Si erreur : renvoi "ERREUR_MOVE" si impossible de bouger
     * Si erreur : renvoi "ERREUR_CASE" si erreur de case
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
    /*****************************************************************************************************
     * RECEPTION D'UNE DEMANDE POUR S'EQUIPER OU SE DESEQUIPER D'UN ITEM
     * return 1 si ok
     * erreur : 0 si objet n'est pas dans le sac
     * erreur : -1 si il y a déja une arme d'équipée
     * erreur : -2  si il y a déja une armure d'équipée
     * erreur : -3 si item n'est ni arme ni armure
     * erreur : -4 si l'item a dequiper n'est pas équipé au préalable
     */
    
    socket.on('INV_PERSONNAGE_CS', function(type, id_item)
    		{
    			// recupere l'currentItem
    	        var currentItem = oItem_BD.GetItemById(id_item);
    	        
    	        // check si currentItem est bien dans le sac
                var existItemInSac = myPerso.existItemInSac(currentItem);
                if (existItemInSac == false)
                	socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, 0);
                
    	        // si c'est une demande pour s'équiper
    	        if (type == "EQUIPER")
    	        	{
    	        		// on équipe le perso 
    	        		var reponse = myPerso.sEquiperDunItem(currentItem);
    	        		// et selon le message renvoyé
    	        		switch(reponse)
    	        		{
    	        			case 1 :  socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, 1); break;
    	        			case -1 : socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -1); break;
    	        			case -2 : socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -2);  break;
    	        			case -3 : socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -3); break;
    	        			default :  break;
    	        		}
    	        	}
    	        else if (type == "DEQUIPER")
    	        	{
    	        		// si le perso n'est pas équipe d'un item de cet idem
    	        		if (myPerso.armeEquipee.id != currentItem.id
    	        				|| myPerso.armureEquipee.id != currentItem.id)
    	        			{
    	        				socket.emit('INV_PERSONNAGE_SC', 'EQUIPER', currentItem.id, -4); 
    	        			}
    	        		var reponse = myPerso.sDesequiperDunItem(currentItem);
    	        		socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, 1);
    	        	}
    		});
    /*****************************************************************************************************
     * RECEPTION D'UNE DEMANDE POUR RAMASSER OU DEPOSER UN ITEM
     * return poidsTotal si ok
     * erreur : -1 si poids insufisant
     * erreur : -2 si objet n'est pas dans la case / le sac
     * erreur : -3 si autre
     */
    socket.on('INV_CASE_CS', function (type, id_item) {
    	// récupère la case en cours
        var currentCase = oCase_BD.GetCaseById(myPerso.idSalleEnCours);

        // recupere l'currentItem
        var currentItem = oItem_BD.GetItemById(id_item);
        
        if (type == "RAMASSER") 
        {
            // log
            console.log("SERVER : Demande pour ramasser l'currentItem : " + id_item + " - " + currentItem.nom);

            // check si currentItem est bien dans la salle
            var existItemInSalle = currentCase.existItemInSalle(currentItem);

            // si l'objet est bien dans la salle
            if (existItemInSalle == true) 
            {
                // check si l'objet peut être ajouté au personnage
                console.log("SERVER : poids sac : " + myPerso.getPoidsSac() + " - poids item : " + currentItem.poids + " - poids max : " + myPerso.poidsMax);
                if ((myPerso.getPoidsSac() + currentItem.poids) < myPerso.poidsMax) {
                    // ajout de l'currentItem au sac du perso
                    myPerso.ajouterAuSac(currentItem);
                    // suppression de l'objet de la case
                    currentCase.supprimerItem(currentItem);
                    // return au client
                    socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, myPerso.getPoidsSac());
                } 
                else 
                {
                    console.log("SERVER : Demande de ramassage impossible : poids max atteint");
                    // return au client que l'objet ne peut être ajouté (poids insufisant)
                    socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, -1);
                }
            }
            // si l'objet n'est pas dans la case (! l'ihm n'a pas été mis à jour !)
            else {
                // return que l'objet n'est pas dans la case
                socket.emit('INV_CASE_SC', 'RAMASSER', currentItem.id, -2);
            }
        }
        else if (type == "DEPOSER")
        {
        	// log
            console.log("SERVER : Demande pour deposer l'currentItem : " + id_item + " - " + currentItem.nom);

            // check si currentItem est bien dans le sac
            var existItemInSac = myPerso.existItemInSac(currentItem);

            // si l'item est bien dans le sac
            if (existItemInSac == true) 
            {
            	// ajout de l'item a la case
            	currentCase.ajouterItem(currentItem);
            	// suppression de l'item au perso
            	myPerso.supprimerDuSac(currentItem);
            	// return au client
            	 socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, myPerso.getPoidsSac());
            }
            // si l'item n'est pas dans le sac (! l'ihm n'a pas été mis à jour !)
            else
            	{
            		 // return que l'item n'est pas dans le sac
                    socket.emit('INV_CASE_SC', 'DEPOSER', currentItem.id, -2);
            	}
        }
    });
    /*****************************************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFOS SUR UNE CASE
     * Renvoi la case avec INFO_CASE_SC
     * Si erreur : renvoi NULL
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

    /*****************************************************************************************************
     * RECEPTION D'UNE DEMANDE D'INFO SUR LE PERSONNAGE
     */
    socket.on('INFO_PERSONNAGE_CS', function () {
        socket.emit('INFO_PERSONNAGE_SC', myPerso);
    });

});




//server.listen(8080);
server.on('close', function () { // On écoute l'évènement close
    console.log('Bye bye !');
});

console.log("SERVEUR : Script lancé ! sur http://127.0.0.1:8080");

server.listen(8080);

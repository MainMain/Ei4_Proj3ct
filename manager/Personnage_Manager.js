// includes
var oPersonnage = require('../model/Object/Personnage');
var oPersonnage_BD = require('../persistance/Personnage_BD');


/**
 * PERSONNAGE MANAGER : RELIE LE SERVEUR AUX OBJETS ET GERE LES SAUVEGARDES
 *
 * @class Personnage_Manager
 */
var Personnage_Manager = (function () {
        'use strict';

        // --- ATTRIBUTS DE CLASSE ---
        Personnage_Manager.personnage;

        // --- METHODE DE CLASSE
        Personnage_Manager.build = function (idUser) {
        	this.personnage = 0;
        	
            return new Personnage_Manager();
        };

        function Personnage_Manager(idUser) {
        	var context = this;
        	oPersonnage_BD.GetPersonnageByIdUser(idUser, function(reponse) {context.callbackGetPersonnageByIdUser(reponse); });
        }
        // --- METHODES D'INSTANCE
        Personnage_Manager.prototype = {

        	callbackGetPersonnageByIdUser : function (reponse) {
        		console.log("PERSO MANAGER : reponse perso by user : " + reponse);
                if (reponse == -1) this.personnage = null;
                else if (reponse == -2) this.personnage = null;
                else {
                    this.personnage = reponse;
                }
            },
            
            callbackSetPersonnage : function(reponse)
            {
            	if (reponse == -1) console.log("!!!!! WARNING : PMANAGER : erreur ecriture ");
            	else if (reponse == -2) console.log("!!!!! WARNING :PMANAGER : erreur ecriture ");
            	else console.log("PMANAGER : ecriture ok");
            },
            
            Deplacement : function (move) {
            	// deplace le personnage
                var reponse = this.personnage.deplacement(move);
                
                //si le deplacement est ok, on enregistre
                if (reponse == 1) oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
                return reponse;
            },
            
            AjouterItemAuSac : function (item) {
            	if ((this.personnage.getPoidsSac() + item.poids) < this.personnage.poidsMax)
            	{
					// ajout de l'currentItem au sac du perso
					this.personnage.ajouterAuSac(item);
					
					// save dans la BD
					oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
					
					return 1;
            	}
            },
            
            SupprimerDuSac : function (item) {
            	this.personnage.supprimerDuSac(item);
            	
            	// save dans la BD
				oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            },
            
            ExistItemInSac : function (currentItem) {
            	return this.personnage.existItemInSac(currentItem);
            },
            
            SEquiper : function (currentItem) {
            	// equipe le perso
            	var reponse = this.personnage.sEquiperDunItem(currentItem);
            	// si equipage ok, on enregistre
            	if (reponse == 1)  oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            	return reponse;
            },
            
            SeDesequiper : function (item) {
            	// si le perso n'est pas équipe d'un item de cet idem
    			if (item.type == 1 && (this.personnage.armeEquipee == null || this.personnage.armeEquipee.id != item.id))
    				socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, -1);
    			if (item.type == 2 && (this.personnage.armureEquipee == null || this.personnage.armureEquipee.id != item.id))
    				socket.emit('INV_PERSONNAGE_SC', 'DEQUIPER', currentItem.id, -1);
    			
    			// desequipage
    			this.personnage.sDesequiperDunItem(item);
    			
    			// save dans la BD
				oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
				
    			// return
    			return 1;
            },
            
            Utiliser : function () {
            	// save dans la BD
				oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            },
            GetPoidsSac : function () {
            	return this.personnage.getPoidsSac();
            },
            GetIdSalleEnCours : function () {
            	return this.personnage.idSalleEnCours;
            },
            
            GetCopiePerso : function()
            {
            	return this.personnage;
            }
        };
        return Personnage_Manager;
}());


module.exports = Personnage_Manager;
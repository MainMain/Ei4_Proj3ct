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
        Personnage_Manager.build = function (idUser) { return new Personnage_Manager(); };

        function Personnage_Manager() {
        }
        
        // --- METHODES D'INSTANCE
        Personnage_Manager.prototype = {

        	callbackGetPersonnageByIdUser : function (reponse, c) {
        		console.log("PERSO MANAGER : reponse perso by user : " + reponse);
                if (reponse == -1) this.personnage = null;
                else if (reponse == -2) this.personnage = null;
                else {
                    this.personnage = reponse;
                }
                c();
            },
            
            callbackSetPersonnage : function(reponse)
            {
            	if (reponse == -1) console.log("!!!!! WARNING : PMANAGER : erreur ecriture ");
            	else if (reponse == -2) console.log("!!!!! WARNING :PMANAGER : erreur ecriture ");
            	else console.log("PMANAGER : ecriture ok");
            },
            
            Load : function(idUser, callback)
            {
            	var context = this;
            	oPersonnage_BD.GetPersonnageByIdUser(idUser, function(reponse) {context.callbackGetPersonnageByIdUser(reponse, callback); });
            	console.log("PMANAGER : Actif !");
            	
            },
            
			SetCompetence : function(competence)
			{
				this.personnage.competence = competence;
				
				/*** - CALCUL SUR LES MULTI POINTS - ***/
				
				/*** - CALCUL SUR LES MULTI POINTS - ***/
				
				oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
			},
			
            Deplacement : function (move, nbrGoules) {
            	// deplace le personnage
            	
                var reponse = this.personnage.deplacement(move, nbrGoules);
                console.log("PMANAGER : deplacement reponse : " + reponse);
                
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
					
					return true;
            	}
            	return false;
            },
            
            SupprimerDuSac : function (item) {
            	this.personnage.supprimerDuSac(item);
            	
            	// save dans la BD
				oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
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
            
            Utiliser : function (item) {
            	var res = this.personnage.utiliser(item);
            	if (res == 1)
            	// save dans la BD
				oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
				
				return res;
            },
            
            DiminuerSante : function (degats) {
            	// diminution des degats grace à l'armure
            	degats -= this.personnage.getValeurArmure();
            	
            	// si en mode defense
            	if (this.personnage.mode == 3) degats * 0.75;
            	
            	if (degats > 0){
            		this.personnage.ptSante -= degats;
            		oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            	}
            	return degats;
            },
            
            ChangementMode : function(mode)
            {
            	this.personnage.changerMode(mode);
            	oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            },
            
            FouilleRapide : function()
            {
            	this.personnage.ptActions -= 4;
            	oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            },
            
            PerteActionParGoules : function()
            {
            	this.personnage.ptActions -= 3;
            	oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            },
            
            PerteDeplacementParGoules : function()
            {
            	this.personnage.ptDeplacement -= 1;
            	oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
            },
        	
        	
            /***************** LECTURE *****************/
            ExistItemInSac : function (currentItem) {
            	return this.personnage.existItemInSac(currentItem);
            },
            
            GetPoidsSac : function () {
            	return this.personnage.getPoidsSac();
            },
            
            GetIdSalleEnCours : function () {
            	console.log("PM : id salle en cours : " + this.personnage.idSalleEnCours);
            	return this.personnage.idSalleEnCours;
            },
            
            GetCopiePerso : function()
            {
            	return this.personnage;
            },
            
            IsItemEquipee : function(item)
            {
            	console.log("id item = " + item.id + " nom item = " + item.nom);
            	if (item.type == 1)
            		{
            			if (this.personnage.armeEquipee == null) return false;
            			else if (this.personnage.armeEquipee.id == item.id) return true;
            			else return false;
            		}
            	else if (item.type == 2)
        		{
        			if (this.personnage.armureEquipee == null) return false;
        			else if (this.personnage.armureEquipee.id == item.id) return true;
        			else return false;
        		}
            	return false;

            },
            
            GetMode : function()
            {
            	return this.personnage.mode;
            },
            
            TestDeplacementPossible : function(nbrGoules)
            {
            	// si pu de PM
            	if (this.personnage.ptDeplacement <= 0)
    				return -2;
            	
            	// si trop de goules, on peut s'arreter là
    			if (nbrGoules > this.personnage.goulesMax)
    				return -3;
    			
    			//
    			return 1;
            },
            
            GetPtsDeplacement : function()
            {
            	return this.personnage.ptDeplacement;
            },
            
            AucunPtActions : function()
            {
            	if (this.personnage.ptActions <= 0) return true;
            	else return false;
            },
        };
        return Personnage_Manager;
}());


module.exports = Personnage_Manager;
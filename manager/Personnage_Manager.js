 // includes
var oPersonnage = require('../model/Object/Personnage');
var oPersonnage_BD = require('../persistance/Personnage_BD');
var oCarte = require('../model/object/Carte');

/**
 * PERSONNAGE MANAGER : RELIE LE SERVEUR AUX OBJETS ET GERE LES SAUVEGARDES
 *
 * @class Personnage_Manager
 */
var Personnage_Manager = (function () {
        'use strict';

        // --- ATTRIBUTS DE CLASSE ---
        Personnage_Manager.personnage;
        Personnage_Manager.coutFouilleRapide;
        Personnage_Manager.coutAttaqueEnnemi;
        Personnage_Manager.coutAttaqueGoule;
        Personnage_Manager.coutInterceptionGoule;
        Personnage_Manager.coutChgtMode;
        
        // --- METHODE DE CLASSE
        Personnage_Manager.build = function (idUser) { return new Personnage_Manager(); };

        function Personnage_Manager() {
            this.coutFouilleRapide = 4;
            this.coutAttaqueEnnemi = 7;
            this.coutAttaqueGoule = 3;
            this.coutInterceptionGoule = 2;
            this.coutChgtMode = 2;
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
            
            Load : function(idUser)
            {
            	var context = this;
            	oPersonnage_BD.GetPersonnageByIdUser(idUser, function(reponse) {context.callbackGetPersonnageByIdUser(reponse); });
            	console.log("PMANAGER : Actif !");
            	
            },
            
			SetCompetence : function(competence)
			{				
				/*** - CALCUL SUR LES MULTI POINTS - ***/
				if(competence == "brute")
				{
					this.personnage.ptSante = 140;
					this.personnage.ptSanteMax = 140;
					this.personnage.ptDeplacement = 15;
					this.personnage.ptDeplacementMax = 15;
					this.personnage.ptActions = 20;
					this.personnage.ptActionsMax = 20;
					
					this.personnage.multiPtsAttaque = 2;
					this.personnage.multiPtsDefense = 2;
					this.personnage.multiProbaCache = 0.5;
					this.personnage.multiProbaFouille = 1;
					
					this.personnage.goulesMax = 2;
				}
				else if(competence == "explorateur")
				{
					this.personnage.ptSante = 100;
					this.personnage.ptSanteMax = 100;
					this.personnage.ptDeplacement = 25;
					this.personnage.ptDeplacementMax = 25;
					this.personnage.ptActions = 20;
					this.personnage.ptActionsMax = 20;
					
					this.personnage.multiPtsAttaque = 1;
					this.personnage.multiPtsDefense = 0.3;
					this.personnage.multiProbaFouille = 1;
					this.personnage.multiProbaCache = 3;
					
					this.personnage.goulesMax = 5;
				}
				else if(competence == "chercheur")
				{
					this.personnage.ptSante = 100;
					this.personnage.ptSanteMax = 100;
					this.personnage.ptDeplacement = 15;
					this.personnage.ptDeplacementMax = 15;
					this.personnage.ptActions = 30;
					this.personnage.ptActionsMax = 30;
					
					this.personnage.multiPtsAttaque = 0.5;
					this.personnage.multiPtsDefense = 1.5;
					this.personnage.multiProbaFouille = 3;
					this.personnage.multiProbaCache = 0.5;
					
					this.personnage.goulesMax = 3;
				}
				
				this.personnage.competence = competence;
			},
			
            Deplacement : function (move, nbrGoules) {
            	// deplace le personnage
            	
                var reponse = this.personnage.deplacement(move, nbrGoules);
                console.log("PMANAGER : deplacement reponse : " + reponse);
                
                //si le deplacement est ok, on enregistre
                if (reponse == 1) //oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
                return reponse;
            },
            
            AjouterItemAuSac : function (item) {
            	if ((this.personnage.getPoidsSac() + item.poids) < this.personnage.poidsMax)
            	{
					// ajout de l'currentItem au sac du perso
					this.personnage.ajouterAuSac(item);
					
					return true;
            	}
            	return false;
            },
            
            SupprimerDuSac : function (item) {
            	this.personnage.supprimerDuSac(item);
            },
            
            SEquiper : function (currentItem) {
            	// equipe le perso
            	var reponse = this.personnage.sEquiperDunItem(currentItem);
            	// si equipage ok, on enregistre
            	if (reponse == 1)  //oPersonnage_BD.SetPersonnage(this.personnage, this.callbackSetPersonnage);
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
    			// return
    			return 1;
            },
            
            Utiliser : function (item) {
            	var res = this.personnage.utiliser(item);

            	return res;
            },
            
            DiminuerSante : function (degats) {
            	console.log("PM : DiminuerSante : Degats recus : " + degats);
            	// diminution des degats grace à l'armure
            	degats -= this.personnage.getValeurArmure();
            	
            	// si en mode defense
            	if (this.personnage.mode == 3) degats * 0.75;
            	
            	if (degats > 0) this.personnage.ptSante -= degats;
            	else if (degats < 0) degats = 0;
            	
            	console.log("PM : DiminuerSante : Baisse de vie : " + degats);
            	return degats;
            },
            
            ChangementMode : function(mode)
            {
            	this.personnage.changerMode(mode);
            },
            
            FouilleRapide : function()
            {
            	this.personnage.ptActions -= this.coutFouilleRapide;
            },
            
            PerteActionParGoules : function()
            {
            	this.personnage.ptActions -= this.coutInterceptionGoule;
            	if (this.personnage.ptActions < 0) this.personnage.ptActions = 0;
            },
            
            PerteDeplacementParGoules : function()
            {
            	this.personnage.ptDeplacement -= 1;
            },
        	
            AddMessage : function(msg)
            {
            	console.log("PERSONNAGE_MANAGER : Ajout du message " + msg);
            	this.personnage.listeMsgAtt.push(msg);
            },
            
            EffacerMessages : function()
            {
            	console.log("PERSONNAGE_MANAGER : Effacement de la liste des messages");
            	this.personnage.listeMsgAtt = new Array();
            },
            
            Attaquer : function(managerPersoEnn)
            {
            	var degatsRecus;
            	var degatsInfliges;
            	
            	// diminution ptAction
            	this.personnage.ptActions -= this.coutAttaqueEnnemi;
            	
            	degatsInfliges = this.personnage.GetPtsAttaque() - this.managerPersoEnn.GetPtsDefense();
            	degatsRecus = this.managerPersoEnn.GetPtsAttaque() - this.personnage.GetPtsDefense();
            	
            	this.DiminuerSante(degatsRecus);
            	managerPersoEnn.DiminuerSante(degatsInfliges);
            	managerPersoEnn.AddMessage("Attaqué par un ennemi ! Degats subis : " + degatsInfliges
            			+ " -degats infligés en riposte : " + degatsRecus);
            	
                var a = {
                    "degatsRecus"	: degatsRecus,
                    "degatsInflges" : degatsInfliges,
                };
                return a;
            },
            
            AttaquerGoule : function()
            {
            	// diminution ptAction
            	this.personnage.ptActions -= this.coutAttaqueGoule;
            },

            
            Decouvert : function()
            {
            	console.log("PERSONNAGE_MANAGER : Le perso " + this.id + " a été découvert !" );
            	// add msg
            	this.personnage.listeMsgAtt.push("Vous avez été découvert ! Votre planque est foute !");
            	this.personnage.mode = 0;
            },
            /***************** LECTURE *****************/
            GetListMsgAtt : function()
            {
            	return this.personnage.listeMsgAtt;
            },
            
            GetPtsAttaque : function()
            {
            	return this.personnage.armeEquipe.valeur * this.personnage.multiPtsAttaque;
            },
            
            GetPtsDefense : function()
            {
            	return this.personnage.armureEquipee.valeur * this.personnage.multiPtsDefense;
            },
            
            ExistItemInSac : function (currentItem) {
            	return this.personnage.existItemInSac(currentItem);
            },
            
            GetPoidsSac : function () {
            	return this.personnage.getPoidsSac();
            },
            
            GetIdSalleEnCours : function () {
            	//console.log("PM : id salle en cours : " + this.personnage.idSalleEnCours);
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
            
            TestDeplacementPossible : function(nbrGoules, direction)
            {
            	console.log("PM : TEST DEPLACEMENT POSSIBLE");
            	// si pu de PM
            	if (this.personnage.ptDeplacement <= 0)
    				return -2;
            	
            	// force le passage à  1
            	console.log("PM : last mvt : " + this.personnage.dernierMvt);
            	if (
            			direction == "OUEST" && this.personnage.dernierMvt == "EST" ||
            			direction == "EST" && this.personnage.dernierMvt == "OUEST" ||
            			direction == "NORD" && this.personnage.dernierMvt == "SUD" ||
            			direction == "SUD" && this.personnage.dernierMvt == "NORD"
            	)
            		return 1;
            	
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
            
            GetMultiFouille : function()
            {
            	return this.personnage.multiProbaFouille;
            },
            GetMultiCache : function()
            {
            	return this.personnage.multiProbaCache;
            },
            
            GetMode : function()
            {
            	return this.personnage.mode;
            },
            
            TestPtActions : function(typeAction)
            {
            	if (typeAction == "fouilleRapide" && this.personnage.ptActions - this.coutFouilleRapide < 0) return true;
            	else if (typeAction == "attaqueGoule" && this.personnage.ptActions - this.coutAttaqueGoule < 0) return true;
            	else if (typeAction == "attaqueEnnemi" && this.personnage.ptActions - this.coutAttaqueEnnemi < 0) return true;
            	else if (typeAction == "chgtMode" && this.personnage.ptActions - this.coutChgtMode < 0) return true;
            	else return false;
            },
            
            getPersonnageToDisplay : function()
    		{
    			var comPoidsSac = this.personnage.getPoidsSac() / this.personnage.poidsMax;
    				
    			console.log("PM : approximation poids sac : " + comPoidsSac +" %");
    			var perso = new oPersonnage(new oPersonnage(
                        this.personnage.id, 		this.personnage.ptSante, 	this.personnage.ptSanteMax,
                        -1,							-1 							-1,
                        -1,							-1, 						-1,
                        this.personnage.competence, -1, 						this.personnage.mode,
                        -1,  						-1,  						-1  ,
                        -1,							this.personnage.armeEquipe,	this.personnage.armureEquipe,
                        comPoidsSac,				-1,							-1		));
    			
    			return perso;
    		},
    		
    		GetIdNextSalle : function(direction)
    		{
    			return oCarte.GetIdSalleSuivante(this.personnage.idSalleEnCours, direction);
    		}
        };
        return Personnage_Manager;
}());


module.exports = Personnage_Manager;
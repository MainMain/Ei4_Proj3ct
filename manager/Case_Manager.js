// includes
var oCase = require('../model/Object/Case');
var oCase_BD = require('../persistance/Case_BD');
var oCarte = require('../model/object/Carte');
var oCase_BD = require('../persistance/Case_BD');

/**
 * PERSONNAGE MANAGER : RELIE LE SERVEUR AUX CASES ET GERE LES SAUVEGARDES
 *
 * @class Case_Manager
 */
var Case_Manager = (function() {
	'use strict';

    // --- ATTRIBUTS DE CLASSE ---
	Case_Manager.caseCourante;
    Case_Manager.idZoneSure1;
    Case_Manager.idZoneSure2;
    
	// --- METHODE DE CLASSE
	Case_Manager.build = function() {return new Case_Manager();};

	function Case_Manager() 
	{
		this.idZoneSure1 = 0;
		this.idZoneSure2 = 5;
	}
	// --- METHODES D'INSTANCE
	Case_Manager.prototype = {
		callbackInitCase : function(reponse) {
			if (reponse == -1)
				console.log("!!!!! WARNING : CMANAGER : erreur lecture ");
			else if (reponse == -2)
				console.log("!!!!! WARNING :CMANAGER : erreur lecture ");
			else
			{
				this.caseCourante = reponse;
				console.log("CMANAGER : lecture ok");
				console.log("CMANAGER case -> id : " + this.caseCourante.id + " : Actif ! Nom : "
						+ this.caseCourante.nom + " Image : " 
						+ this.caseCourante.pathImg +" Nbr Goules : "
						+ this.caseCourante.nbrGoules +" Description : "
						+ this.caseCourante.description +" ProbaObjet : "
						+ this.caseCourante.probaObjet);
				for (var i = 0; i < this.caseCourante.listeItems; i++)
					{
						console.log("Objet : " + this.listeItems[i].nom);
					}
			}
		},
		
		callbackSetCase : function(reponse) {
			if (reponse == -1)
				console.log("!!!!! WARNING : CMANAGER : erreur ecriture ");
			else if (reponse == -2)
				console.log("!!!!! WARNING :CMANAGER : erreur ecriture ");
			else
				console.log("CMANAGER : ecriture ok");
		},
		
		Load : function(idCase)
		{
			console.log("CASE MANAGER : création de la case : " + idCase);
			// chargement de la case
			var context = this;
			this.caseCourante = oCase_BD.GetCaseById(idCase,  function(reponse) {context.callbackInitCase(reponse); });
		},

		/************************* ECRITURE *******************************/
		AjouterItem : function(item)
		{
			// ajoute de l'objet case
			this.caseCourante.ajouterItem(item);
		},
		
		SupprimerItem : function(item)
		{
			// suprime de l'objet case
			this.caseCourante.supprimerItem(item);
		},
		
		AttaqueGoule : function()
		{
			// détermine si on tue une ou deux goules
			var proba = Math.floor(Math.random() * 100);
			var goulesTues;
			
			if (proba > 85) 
			{
				this.caseCourante.nbrGoules -= 2;
				if (this.caseCourante.nbrGoules < 0) this.caseCourante.nbrGoules = 0; // pour ne être inférieur à 0
				goulesTues = 2;
			}
			else
			{
				this.caseCourante.nbrGoules -= 1;
				goulesTues = 1;
			}
			
			// return nbr goules tués
			return goulesTues;
		},
		

		/************************* LECTURE *******************************/
		GetCopieCase : function(idCase)
		{
			console.log("CASE_MANAGER : copie case : " + this.caseCourante.id + " - " + this.caseCourante.nom);
			return this.caseCourante;
		},
		
		ExistItem : function(item)
		{
			return this.caseCourante.existItemInSalle(item);
		},
		
		AttaqueDeGoules : function()
		{
			// attaque des goules
			var degatsGoules = Math.floor(Math.random() * 4 + 1);
			var nbrGoulesAttaquantes = Math.floor(Math.random() * this.caseCourante.nbrGoules);
			var total = degatsGoules * nbrGoulesAttaquantes;
			console.log("CASE_MAN : degats goules  " + degatsGoules + " - nb attaques : " + nbrGoulesAttaquantes + " - total : " +total);
			
			// action raté ou non
			var chance = Math.floor(Math.random()  * 10);
			chance -= nbrGoulesAttaquantes * 0.3;
			var actionOk;
			if (chance >= 5) actionOk = false;
			else actionOk = true;
			
			if (this.caseCourante.nbrGoules == 0) actionOk = true;
			
			//console.log("CM - Attaque de goules : total : " + total);
			 var a = {
		            "degats"	: total,
		            "nbrGoulesA" : nbrGoulesAttaquantes,
		            "actionOk" 	: actionOk,
		        };
		    return a;
		},
		
		Fouille : function(probaObjetPerso)
		{
			var proba = Math.floor(Math.random() * 100);
			var probaObjetCase = this.caseCourante.probaObjet * probaObjetPerso;

			console.log("CASE_MANAGER : Fouille() : proba = "+proba+" - probaObjetCase  => brut = "+this.caseCourante.probaObjet+" - net = "+probaObjetCase);
			if (proba < probaObjetCase) return true;
			else return false;
		},
		
		DecouverteEnnemi : function(probaObjetPerso, probaCacheEnn)
		{

			console.log("CASE_MANAGER : DecouverteEnnemi() : proba "+ this.caseCourante.probaObjet +" - multi :" +probaObjetPerso);
			
			var proba = Math.floor(Math.random() * 100);
			var probaDecouverte = this.caseCourante.probaObjet * probaObjetPerso;
			var probaDecouverte2 = probaDecouverte / probaCacheEnn;
			
			console.log("CASE_MANAGER : DecouverteEnnemi() : proba = "+proba+" - probaDecouverte  => brut = "+probaDecouverte+" - net = "+probaDecouverte2);
			if (proba < probaDecouverte) return true;
			else return false;
		},
		
		GetNombreGoules : function()
		{
			return this.caseCourante.nbrGoules;
		},
		
		GetNombreAllies : function()
		{
			return 0;
		},
		
		GetTestZoneSure : function(numEquipe)
		{
			console.log("CASE_MANAGER : GetTestZoneSure()/ numEquipe = "+numEquipe + " id case destination : " + this.caseCourante.id + "id zone sure 2 = " + this.idZoneSure2);
			if ( 
					(numEquipe == 1 && this.caseCourante.id == this.idZoneSure2) ||
					(numEquipe == 2 && this.caseCourante.id == this.idZoneSure1))
				return true;
			else
				return false;	
		},
		
		Save : function()
		{
			oCase_BD.SetCase(this.caseCourante, this.callbackSetCase);
		},

	};
	return Case_Manager;
}());

module.exports = Case_Manager;
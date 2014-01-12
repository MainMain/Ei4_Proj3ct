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
    
	// --- METHODE DE CLASSE
	Case_Manager.build = function(idUser) {return new Case_Manager();};

	function Case_Manager(idCase) {

		oCase_BD.Initialiser();
		console.log("CASE MANAGER : id case : " + idCase);
		this.caseCourante = oCase_BD.GetCaseById(idCase);
		console.log("CMANAGER : Actif !");
	}
	// --- METHODES D'INSTANCE
	Case_Manager.prototype = {

		callbackSetCase : function(reponse) {
			if (reponse == -1)
				console.log("!!!!! WARNING : CMANAGER : erreur ecriture ");
			else if (reponse == -2)
				console.log("!!!!! WARNING :CMANAGER : erreur ecriture ");
			else
				console.log("CMANAGER : ecriture ok");
		},
		

		/************************* ECRITURE *******************************/
		AjouterItem : function(item)
		{
			// ajoute de l'objet case
			this.caseCourante.ajouterItem(item);
			
			// écrit les nouveautés dans la BD
			oCase_BD.SetCase(this.caseCourante, this.callbackSetCase);
		},
		
		SupprimerItem : function(item)
		{
			// suprime de l'objet case
			this.caseCourante.supprimerItem(item);
			
			// écrit les nouveautés dans la BD
			oCase_BD.SetCase(this.caseCourante, this.callbackSetCase);
		},
		
		AttaqueGoule : function()
		{
			// détermine si on tue une ou deux goules
			var proba = Math.floor(Math.random() * 100);
			var goulesTues;
			
			if (proba > 85) 
			{
				this.caseCourante.nbrGoules -= 2;
				goulesTues = 2;
			}
			else
			{
				this.caseCourante.nbrGoules -= 1;
				goulesTues = 1;
			}
			
			// écrit les nouveautés dans la BD
			oCase_BD.SetCase(this.caseCourante, this.callbackSetCase);
			
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
		
		ChangeCase : function(idCase)
		{
			this.caseCourante = oCase_BD.GetCaseById(idCase);
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
		
		/*ActionRateeParGoules : function()
		{
			var chance = Math.floor(Math.random()  * 2);
			if (chance >= 1)
				return false;
			else
				return true;
		},*/
		

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
			return false;
		},

	};
	return Case_Manager;
}());

module.exports = Case_Manager;
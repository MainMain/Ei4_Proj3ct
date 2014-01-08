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
		// FLORIAN : DEFINITION DE LA DIMENSION DE LA CARTE
		oCarte.Initialiser(6, 6);
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
		
		DegatsParGoules : function()
		{
			var degatsGoules = Math.floor(Math.random() * 2);
			var nbrGoulesAttaquantes = Math.floor(Math.random() * this.caseCourante.nbrGoules);
			
			return degatsGoules * nbrGoulesAttaquantes;
		},
		
		ActionRateeParGoules : function()
		{
			var chance = Math.floor(Math.random()  * 2);
			if (chance >= 1)
				return false;
			else
				return true;
		},
		
		Fouille : function()
		{
			return true;
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
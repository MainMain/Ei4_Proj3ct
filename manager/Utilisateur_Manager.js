// includes
var oUtilisateur = require('../model/Object/Utilisateur');
var oUtilisateur_BD = require('../persistance/Utilisateur_BD');


/**
 * PERSONNAGE MANAGER : RELIE LE SERVEUR AUX OBJETS ET GERE LES SAUVEGARDES
 *
 * @class Utilisateur_Manager
 */
var Utilisateur_Manager = (function () {
        'use strict';

        // --- ATTRIBUTS DE CLASSE ---
        Utilisateur_Manager.Utilisateur;

        // --- METHODE DE CLASSE
        Utilisateur_Manager.build = function (idUser) { return new Utilisateur_Manager(); };

        function Utilisateur_Manager() { }
        

        
        
        // --- METHODES D'INSTANCE
        Utilisateur_Manager.prototype =
        {
        	
            callbackGetUser : function(reponse)
            {
            	if (reponse == -1) console.log("!!!!! WARNING : PMANAGER : erreur ecriture ");
            	else if (reponse == -2) console.log("!!!!! WARNING :PMANAGER : erreur ecriture ");
            	else 
            		{
            			console.log("UMANAGER : Chargement de l'user dans le manager ok");
            			this.Utilisateur = reponse;
            		}
            },
			
			
			callbackSetEquipe : function(reponse)
			{
            	if (reponse == -1) console.log("!!!!! WARNING : PMANAGER : erreur ecriture ");
            	else console.log("UMANAGER : MAJ de l'equipe OK !");
			},
            
            Load : function(idUser)
            {
            	var context = this;
            	oUtilisateur_BD.GetUtilisateur(idUser, function(reponse) {context.callbackGetUser(reponse); });
            	console.log("UMANAGER : Actif !");
            	
            },
        
        	GetNumEquipe : function()
        	{
        		return this.Utilisateur.numEquipe;
        	},
			
			SetNumEquipe : function(numEquipe)
			{
				var context = this;
				context.Utilisateur.numEquipe = numEquipe;
            	oUtilisateur_BD.SetUtilisateur(context.Utilisateur, function(reponse) {context.callbackSetEquipe(reponse); });
			}
        };
        return Utilisateur_Manager;
        
        
}());


module.exports = Utilisateur_Manager;
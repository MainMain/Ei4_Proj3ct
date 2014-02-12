// inclusion des règles
var GameRules	= require('../model/GameRules');

var oScore_Manager = require('./Score_Manager');

var oSession_BD = require('../persistance/Session_BD');

var idSessionEnCours;
var dateDebut;
var dateFin;

function Session_Manager(){}

Session_Manager.Load = function(callback)
{
	// init
	this.idSessionEnCours = -1;
	this.dateDebut = new Date();
	this.dateFin = new Date();
	
	// récupérer la date
	var myDate = new Date();
	
	var context = this;
	// récupérer le dernier élément de la table session
	oSession_BD.GetLastSessionId(function(lastId)
	{
		if (typeof lastId === "undefined")
		{
			context.idSessionEnCours 	= -1;
			context.dateDebut			= null;
			context.dateFin 			= null;
		}
		else
		{
			oSession_BD.GetSession(lastId, function(idSession, dateDeb, dateFin)
			{
				// si dateFin de cet élément est après la date courante
				// entrer les attributs
				var today = new Date();
				if(dateFin > today)
				{
					context.idSessionEnCours 	= idSession;
					context.dateDebut			= dateDeb;
					context.dateFin 			= dateFin;
					callback(context.idSessionEnCours);
				}
				else
				{
					context.idSessionEnCours 	= -1;
					context.dateDebut			= null;
					context.dateFin 			= null;
				}
			});
		}
	});
},

Session_Manager.demarrer = function(dateFin)
{
	var today = new Date();
	var context = this;
	
	if(dateFin > today)
	{
		// récupérer le dernier élément de la table session
		oSession_BD.GetLastSessionId(function(lastId)
		{
			if (typeof lastId === "undefined") lastId = 0;
			// attribuer l'id du dernier element + 1
			context.idSessionEnCours = lastId + 1;
			
			console.log("lastId : " + lastId);
			console.log("idSessionEnCours : " + context.idSessionEnCours);
			
			// attribuer les dates
			context.dateDebut = today;
			context.dateFin = dateFin;
		
			// initialiser les scores
			oScore_Manager.nouvelleSession(context.idSessionEnCours);
		
			// créer en BD
			oSession_BD.Creation(context.idSessionEnCours, context.dateDebut, context.dateFin);
		});
	}
},

Session_Manager.stopper = function()
{
	console.log("STOP LE TABOUN DE MAMAK ET LALAK!");
	this.idSessionEnCours = -1;
	this.dateDebut = null;
	this.dateFin = null;
},

Session_Manager.definirDateFin = function(date)
{
	var today = new Date();
	
	if(date > today)
	{
		this.dateFin = date;
		oSession_BD.SetSession(this.idSessionEnCours, this.dateDebut, this.dateFin);
		return true;
	}
	return false;
},

Session_Manager.existeSessionEnCours = function()
{
	return (this.idSessionEnCours >= 0) ? true : false;
},

Session_Manager.getIdSessionEnCours = function()
{
	return this.idSessionEnCours;
},

module.exports = Session_Manager;
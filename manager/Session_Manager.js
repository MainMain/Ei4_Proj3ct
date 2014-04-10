// inclusion des règles
var GameRules	= require('../model/GameRules');
var EventLog    = require('../model/EventLog');
var oScore_Manager = require('./Score_Manager');
var oCase_Manager = require('./Case_Manager');

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
			callback(context.idSessionEnCours);
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
				}
				else
				{
					context.idSessionEnCours 	= -1;
					context.dateDebut			= null;
					context.dateFin 			= null;
				}
				EventLog.log("SESSION_MANAGER : Load() - id Session en cours = " +context.idSessionEnCours);
				callback(context.idSessionEnCours);
			});
		}
	});
},

Session_Manager.demarrer = function(dateFin)
{
	// fin de la session en cours
	this.stopper();
	
	var today = new Date();
	var context = this;
	
	if(dateFin > today)
	{
		// 1: Enregistrer en BD
		// récupérer le dernier élément de la table session
		oSession_BD.GetLastSessionId(function(lastId)
		{
			if (typeof lastId === "undefined") lastId = 0;
			// attribuer l'id du dernier element + 1
			context.idSessionEnCours = lastId + 1;
			
			EventLog.log("SESSION_MANAGER() : lastId : " + lastId);
			EventLog.log("SESSION_MANAGER() : idSessionEnCours : " + context.idSessionEnCours);
			
			// attribuer les dates
			context.dateDebut = today;
			context.dateFin = dateFin;
		
			// initialiser les scores
			oScore_Manager.nouvelleSession(context.idSessionEnCours);
		
			// créer en BD
			oSession_BD.Creation(context.idSessionEnCours, context.dateDebut, context.dateFin);
		});
		
		// lecture du fichier et chargement en mémoire
		//oCase_Manager.Load();
	}
},

Session_Manager.stopper = function()
{
	EventLog.log("SESSION_MANAGER() : Stop session !");
	
	// mettre a jour dans la BD la fin de la session qui vient d'être arrêtée
	oSession_BD.SetSession(this.idSessionEnCours, this.dateDebut, new Date());
	
	// initialiser les attributs
	this.idSessionEnCours = -1;
	this.dateDebut = null;
	this.dateFin = null;
	
	// 2: Réinitialiser les cases
	oCase_Manager.reinitialiser();
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

Session_Manager.getDateDebut = function()
{
	return this.dateDebut;
},

Session_Manager.getDateFin = function()
{
	return this.dateFin;
},

Session_Manager.getDatesSession = function(idSession, callback)
{
	if (idSession == -1) callback(null);
	oSession_BD.GetSession(idSession, function(idSession, dateDebut, dateFin)
	{
		var struct = 
		{
			"dateDebut"	: dateDebut, //.toDateString() + " à " +  dateDebut.toLocaleTimeString(),
			"dateFin" 	: dateFin //.toDateString() + " à " +  dateFin.toLocaleTimeString()
		};
		
		console.log("getDatesSession");
		console.log(struct);
		callback(struct);
	});
},

Session_Manager.getDatesSessionEnCours = function()
{
	var struct = 
	{
		"id"		: this.idSessionEnCours,
		"dateDebut"	: this.dateDebut,
		"dateFin" 	: this.dateFin
	};
	
	console.log(struct);
	return struct;
},

module.exports = Session_Manager;
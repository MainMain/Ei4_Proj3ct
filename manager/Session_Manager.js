// inclusion des règles
var GameRules	= require('../model/GameRules');

var oScore_Manager = require('./Score_Manager');

var oSession_BD = require('../persistance/Session_BD');

var idSessionEnCours;
var dateDebut;
var dateFin;

function Session_Manager(){}

Session_Manager.Load = function()
{
	// récupérer la date
	var myDate = new Date();
	var datelaseSession;
	
	// récupérer le dernier élément de la table session
	oSession_BD.GetLastSessionId(function(lastId)
	{
		oSession_BD.GetSession(lastId, function(idSession, dateDeb, dateFin)
		{
			// si dateFin de cet élément est après la date courante
				// entrer les attributs
				this.idSessionEnCours 	= idSession;
				this.dateDebut			= dateDeb;
				this.dateFin 			= dateFin;
			// sinon
				// tout mettre à null	
		});
	});
},

Session_Manager.demarrer = function(dateFin)
{
	var myDate = new Date();
	// récupérer le dernier élément de la table session
	oSession_BD.GetLastSessionId(function(lastId)
	{
		if (typeof lastId === "undefined") lastId = 0;
		// attribuer l'id du dernier element + 1
		this.idSessionEnCours = lastId + 1;
	
		// attribuer les dates
		this.dateDebut = myDate.toLocaleString();
		this.dateFin = dateFin;
	
		// initialiser les scores
		oScore_Manager.nouvelleSession(this.idSessionEnCours);
	
		// créer en BD
		oSession_BD.Creation(this.idSessionEnCours, this.dateDebut, this.dateFin);
	});
},

Session_Manager.stopper = function()
{
	this.idSessionEnCours = -1;
	this.dateDebut = null;
	this.dateFin = null;
},

Session_Manager.definirDateFin = function(jour, mois, annee)
{
	// if date donnée est dans le futur
		// faire modif
		// return true
	
	// sinon
		// return false
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
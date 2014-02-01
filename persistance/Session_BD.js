// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');

function Session_BD() {
    if (false === (this instanceof Session_BD)) {
        return new Session_BD();
    }
};

Session_BD.GetLastSessionId = function(callback)
{
	var Sessionmodel = mongoose.model('Session'); 				
	var tabId = new Array();
	
	Sessionmodel.find({}, function(err, session)
	{
		if(err)
		{
			throw err;
		}
		for(var i in session)
		{
			tabId = session[i].id;
		}
		
		
		callback(tabId);
	});
},

Session_BD.GetSession = function(idSession, callbackGetSession) {
	
	var Sessionmodel = mongoose.model('Session');
		
	Sessionmodel.find({id : idSession},function (err, Session)
	{
		if (err)  
		{
			throw err;
		}
		
		if (typeof Session[0] === "undefined")
		{
			console.log("Get Session : undefined");
			callbackGetSession(idSession, -1);	
		}
		else
		{
			console.log("UTILISATEUR_BD : Chargement de la derniere session : " + Session[0].dateDebut +" -> " + Session[0].dateFin);
			callbackGetSession(Session[0].id, Session[0].dateDebut, Session[0].dateFin);
		}
	});
	
},

Session_BD.SetSession = function (sessionToSave, callbackSetSession)
{
    var SessionModel = mongoose.model('Session');
    var newSession = SessionModel();

    SessionModel.find({id: session.id}, function (err, newSession) 
    {
        if (err) 
        {
            console.log("SESSION_BD : SetSession() : erreur ! ");
            throw err;
        }

        if (typeof newSession[0] === "undefined") {
            console.log("SESSION_BD : SetSession() : undefined ! ");
            callbackSetPersonnage(-1);
        } 
        else 
        {
        	SessionModel.update({id: session.id}, 
        	{
        		idSessionEnCours	: sessionToSave.idSessionEnCours,
        		dateDebut			: sessionToSave.dateDebut,
        		dateFin				: sessionToSave.dateFin,
            },
            function (err) 
            {
            	if (err)
                {
                	throw err;
                }
					
                console.log("SESSION_BD : Mis à jour de la session : " + Session[0].dateDebut +" -> " + Session[0].dateFin);
				callbackSetPersonnage(1);
            });
        }

    });
},

Session_BD.Creation = function (idSession, dateDebut, dateFin) {

    var SessionModel = mongoose.model('Session');
    var newSession = new SessionModel();

    newSession.id			= idSession;
    newSession.dateDebut	= dateDebut;
    newSession.dateFin		= dateFin;

    newSession.save(function (err) {
        if (err) {
            throw err;
        }
        
        console.log('BASE DE DONNEES : Creation d une Session !');

    });
    return newSession;
},

Session_BD.GetLastSessionId = function(callback)
{
	var SessionModel = mongoose.model('Session');				
	var lastId;
	
	SessionModel.find({}, function(err, sessions)
	{
		if(err)
		{
			throw err;
		}
		for(var i in sessions)
		{
			lastId = sessions[i].id;
		}
		callback(lastId);
	});
},


module.exports = Session_BD;

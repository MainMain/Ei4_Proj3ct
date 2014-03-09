// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var EventLog    = require('../model/EventLog');

function Session_BD() {
    if (false === (this instanceof Session_BD)) {
        return new Session_BD();
    }
};

Session_BD.GetLastSessionId = function(callback)
{
	var Sessionmodel = mongoose.model('Session'); 				
	var id = 0;
	
	Sessionmodel.find({}, function(err, session)
	{
		if(err)
		{
			throw err;
		}
		for(var i in session)
		{
			if (id <  session[i].id) id = session[i].id;
		}
		callback(id);
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
			EventLog.log("Get Session : undefined");
			callbackGetSession(idSession, -1);	
		}
		else
		{
			EventLog.log("SESSION_BD : Chargement de la derniere session : " + " -> " + Session[0].id + " -> " + Session[0].dateDebut +" -> " + Session[0].dateFin);
			callbackGetSession(Session[0].id, Session[0].dateDebut, Session[0].dateFin);
		}
	});
	
},

Session_BD.SetSession = function (idSessionSet, dateDebutSet, dateFinSet)
{
    var SessionModel = mongoose.model('Session');
    var newSession = SessionModel();

    SessionModel.find({id: idSessionSet}, function (err, newSession) 
    {
        if (err) 
        {
            EventLog.log("SESSION_BD : SetSession() : erreur ! ");
            throw err;
        }

        if (typeof newSession[0] === "undefined")
		{
            EventLog.log("SESSION_BD : SetSession() : undefined ! ");
        } 
        else 
        {
        	SessionModel.update({id: idSessionSet}, 
        	{
        		idSessionEnCours	: idSessionSet,
        		dateDebut			: dateDebutSet,
        		dateFin				: dateFinSet
            },
            function (err) 
            {
            	if (err)
                {
                	throw err;
                }
                EventLog.log("SESSION_BD : Mis à jour de la session : " + newSession[0].dateDebut +" -> " + newSession[0].dateFin);
            });
        }
    });
},

Session_BD.Creation = function (idSession, dateDebut, dateFin) {

	EventLog.log("SESSION_BD_CREATION");
    var SessionModel = mongoose.model('Session');
    var newSession = new SessionModel();

    newSession.id			= idSession;
    newSession.dateDebut	= dateDebut;
    newSession.dateFin		= dateFin;

    newSession.save(function (err) {
        if (err) {
            throw err;
        }
        
        EventLog.log('BASE DE DONNEES : Creation d une Session !');

    });
    return newSession;
},




module.exports = Session_BD;

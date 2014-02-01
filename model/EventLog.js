//  Singleton
function EventLog() {
	if (false === (this instanceof EventLog)) {
		return new EventLog();
	}
};

//********** ID DES ZONES SURES **********
EventLog.log = function(event, code) 						
{
	
},

EventLog.warning = function(event) 						
{ 
	
},

EventLog.error = function(event) 						
{ 
	
},


// export
module.exports = EventLog;
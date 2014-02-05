//  Singleton
function EventLog() {
	if (false === (this instanceof EventLog)) {
		return new EventLog();
	}
};

//********** ID DES ZONES SURES **********
EventLog.log = function(event, code) 						
{
	console.log(event);
},

EventLog.warning = function(event) 						
{ 
	console.log("/!\\" + event);
},

EventLog.error = function(event) 						
{ 
	console.log("/!\\" + event);
},


// export
module.exports = EventLog;
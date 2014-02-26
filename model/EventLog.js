var fs = require('fs');
var date = new Date();

var day = date.getDate();
var month = parseInt(date.getMonth()) + 1;
var year = date.getFullYear();
var hour = date.getHours();
var minutes = date.getMinutes();

var file = "";
//  Singleton
function EventLog() {
	if (false === (this instanceof EventLog)) {
		return new EventLog();
	}
};

//********** ID DES ZONES SURES **********
EventLog.log = function(event) 						
{	

	console.log(event );
	fs.appendFile(this.file + '.log','code - '+event);
},

EventLog.warning = function(event) 						
{ 
	console.log("/!\\" + event);
},

EventLog.error = function(event) 						
{ 
	console.log("/!\\" + event);
	fs.appendFile(this.file + '.log','code - '+event);
	fs.appendFile(this.file + '.error','code - '+event);

},

EventLog.init = function()
{
	this.file = './log/' + day + '-' + month + '-' + year + ' ' + hour + '-' + minutes;
	if (!fs.existsSync('./log'))
	{	
		fs.mkdir('./log');
	}
	
	fs.open(this.file + '.log', 'w+', function(err, fd)
	{
	});
	fs.open(this.file + '.error', 'w+', function(err, fd)
	{
	});
	
}

// export
module.exports = EventLog;
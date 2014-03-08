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

	console.log(this.getDate() +" : "+event );
	fs.appendFile(this.file + '.log',this.getDate() + ' - code - '+event+'\n');
},

EventLog.warning = function(event) 						
{ 
	console.log("/!\\" + event);
},

EventLog.error = function(event) 						
{ 
	console.log("/!\\ : "+ this.getDate() +" : " + event);
	fs.appendFile(this.file + '.log', this.getDate() + ' - code - '+event+'\n');
	fs.appendFile(this.file + '.error',this.getDate() + ' - code - '+event+'\n');

},

EventLog.init = function()
{
	this.file = './log/' + day + '-' + month + '-' + year + ' ' + hour + '-' + minutes;
	if (!fs.existsSync('./log'))
	{	
		fs.mkdir('./log');
	}
	
	fs.open(this.file + '.log', 'w+', function(err, fd) { });
	fs.open(this.file + '.error', 'w+', function(err, fd) { });
	
},

EventLog.getDate = function()
{
	var myDate = new Date();
	var time = myDate.toLocaleTimeString();
	var date = myDate.toDateString(); 
	
	return date +" - " + time;
},


// export
module.exports = EventLog;
(function() {

var ButtonPad = function(label, color, width, height) {
  this.initialize(label, color, width, height);
};
var p = ButtonPad.prototype = new createjs.Container(); // inherit from Container

p.label;
p.background;
p.count = 0;

p.Container_initialize = p.initialize;
p.initialize = function(label, color, width, height) {
	this.Container_initialize();
	
	this.label = label;
	if (!color) { color = "#CCC"; }
	
	var text = new createjs.Text(label, "12px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	this.background = new createjs.Shape();
	this.background.graphics.beginStroke("#FFF").beginFill(color).drawRect(0,0,width,height,10);
	
	text.x = width/2;
	text.y = height/2;
	
	this.addChild(this.background,text);
};

/*p.onClick = function() {
	alert("You clicked on a ButtonPadMoveMove: ");
};*/

p.onTick = function() {
	this.alpha = Math.cos(this.count++*0.1)*0.4+0.6;
};

window.ButtonPad = ButtonPad;
}());
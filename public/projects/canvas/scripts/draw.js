//variables
var bPenDown = false; //used to check if pen is down to draw or not
var rgbLineColor = 'ffffff'; // default line color
var lLineWidth = 1; //default line width

//canvas and context of canvas
var oCan;
var oCon;

var myPen ={}; //tracks pen while it is down

window.onload = init; //loads defaults when form loads

//initialize oCan and events needed
function init() {
	//grab oCan obj
	oCan = document.getElementById('myCanvas');
	//set oCon to 2d drawing
	oCon = oCan.getContext('2d');
	//set fill to default
	oCon.fillStyle = '#' + rgbLineColor;
	//set selector for pen + color
	document.getElementById('penWidth').selectedIndex = 1;
	document.getElementById('penColor').selectedIndex = 0;
	//set init pen width
	lLineWidth = 3;
	//rest of events
	registerEvents();
}

//main events setup to easy vars
function registerEvents() {
	//mouse events
	oCan.onmousedown = mouseDownListener;
	oCan.onmousemove = mouseMoveListener;
	oCan.onmouseup = mouseUpListener;

	//change pen width if new pen is requested
	document.getElementById('penWidth').onchange = penWidthListener;
	document.getElementById('penColor').onchange = penColorListener;
}

/*

MAIN EVENTS

*/
function mouseDownListener(arg) {
	// when mouse is clicked in the oCan, get the coords, and turn on bool for mouse is down

	//grab event obj containing mouse coords
	var event = arg || window.event; //apparently IE is different

	//math to get proper coords
	var tempRect = oCan.getBoundingClientRect();
	var x = event.clientX - tempRect.left;
	var y = event.clientY - tempRect.top;

	//send coords to the penDown to keep for l8r
	penDown(x,y);
}

function mouseMoveListener(arg) {
	//track mouse movement
	var event = arg || window.event;

	//math
	var tempRect = oCan.getBoundingClientRect();
	var x = event.clientX - tempRect.left;
	var y = event.clientY - tempRect.top;

	//draw line with the end coords
	penMove(x,y);
}

function mouseUpListener(arg) {
	//when mouse button is released
	//tell the drawing and pen bool that we are done drawing
	penUp();
}

function penDown(coorX,coorY) {
	//when pen is down start drawing and save coords as start of line
	bPenDown = true;
	myPen.x = coorX;
	myPen.y = coorY;
}

function penMove(coorX,coorY) {
	//when pen moves, get coords and set as endpoint for drawing line
	//check if pen is down
	if(bPenDown){
		//draw line
		drawLine(rgbLineColor,lLineWidth, myPen.x, myPen.y, coorX, coorY);
		//switch last point in as start of new line
		myPen.x = coorX;
		myPen.y = coorY;
	}
}

function penUp() {
	//switch bool as to not draw when mouse is not clicked
	bPenDown = false;
}

function drawLine(color,thickness,x1,y1,x2,y2) {
	//draw the line and apply color and thickness
	oCon.strokeStyle = '#' + color;
	oCon.lineWidth = thickness;

	//many small lines to make curves is the key here
	oCon.beginPath();
	oCon.moveTo(x1,y1);
	oCon.lineTo(x2,y2);
	oCon.stroke();
}

function Clear_Down() {
	//clear screen of oCan and clear coords from table
	oCon.clearRect(0,0,oCan.width,oCan.height);
}

function penWidthListener(arg) {
	//when user selects new pen, adjust size
	lLineWidth = this.options[this.selectedIndex].value;
}

function penColorListener(arg) {
	rgbLineColor = this.options[this.selectedIndex].value;
}
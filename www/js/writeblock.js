// $("#board").redraw();


function draw_path( dp )
{
	/*
	if (writeblock && writeblock.getContext) {
		wbctx = writeblock.getContext("2d");
		// background
		wbctx.fillStyle = "#F1F1F1";
		wbctx.fillRect(0, 0, writeblock.width, writeblock.height);
	}
	*/
	wbctx.strokeStyle = "green"
	wbctx.lineWidth = 1.0;
	wbctx.lineCap = "round";
	wbctx.lineJoin = "round";
	for( var i=0; i < dp.length-1; i++ )
	{
		var p = dp[i];
		wbctx.beginPath();
		wbctx.moveTo(p.x,p.y);
		wbctx.lineTo(dp[i+1].x,dp[i+1].y)	
		wbctx.stroke();
		wbctx.closePath();
	}
	wbctx.strokeStyle = "red"
	wbctx.lineWidth = 5.0;
}

var paths = [];
var path = [];
var gutter = 50;

console.log("WINDOW: width = "+window.innerWidth+" height = "+window.innerHeight);

var writeblock = document.getElementById("write-block");
console.log("WRITEBLOCK: width = "+writeblock.width+" height = "+writeblock.height);
writeblock.width = window.innerWidth-24;
writeblock.height = 150; // writeblock.innerHeight; // window.innerHeight-24;

var board = document.getElementById("board");
console.log("BOARD: width = "+board.width+" height = "+board.height);
board.width = window.innerWidth-24;
board.height = window.innerHeight-174;

var zoom = 1.0
var wbctx = null;
var wbx, wby = 0;
var bbx, bby = 0;
	
if (writeblock && writeblock.getContext) {
	wbctx = writeblock.getContext("2d");
	// background
	// wbctx.fillStyle = "#F1F1F1";
	// wbctx.fillRect(0, 0, writeblock.width, writeblock.height);
}
wbctx.strokeStyle = "red"
wbctx.lineWidth = 5.0;
wbctx.lineCap = "round";
wbctx.lineJoin = "round";

if (board && board.getContext) {
	bbctx = board.getContext("2d");
	// background
	// bbctx.fillStyle = "#F1F1F1";
	// bbctx.fillRect(0, 0, board.width, board.height);
}
bbctx.strokeStyle = "green"
bbctx.lineWidth = 1.0;
bbctx.lineCap = "round";
bbctx.lineJoin = "round";

function sendArray( m )
{
	socket.emit("message",m)
}

bs = 0.4;
bbcsrx = 0;
bbcsry = 0;
function draw_start(evt)
{
		writeblock.style.cursor = 'default';
		if (evt.which == 3) return;
		x = evt.offsetX ? evt.offsetX : (evt.pageX - evt.target.offsetLeft);
		y = evt.offsetY ? evt.offsetY : (evt.pageY - evt.target.offsetTop);
		touches = evt.changedTouches;
		if( touches )
		{
			t = touches[0]
			x = t.offsetX ? t.offsetX : (t.pageX - evt.target.offsetLeft);
			y = t.offsetY ? t.offsetY : (t.pageY - evt.target.offsetTop);
		}
		x = 1/zoom*x;
		y = 1/zoom*y;
		// do not register if right mouse button is pressed.
		writeblock.addEventListener("mousemove", draw_move, false);
		writeblock.addEventListener("touchmove", draw_move, false);
		writeblock.addEventListener("mouseup", draw_end, false);
		writeblock.addEventListener("touchend", draw_end, false);
}

function draw_move(evt)
{
	if (wbctx && bbctx) {
		wbctx.beginPath();
		bbctx.beginPath();
		path.push({"x":x,"y":y})
		wbctx.moveTo(x, y);
		bbctx.moveTo(x*bs+bbcsrx, y*bs+bbcsry);
		newx = evt.offsetX ? evt.offsetX : (evt.pageX - evt.target.offsetLeft);
		newy = evt.offsetY ? evt.offsetY : (evt.pageY - evt.target.offsetTop);
		touches = evt.changedTouches;
		if( touches )
		{
			t = touches[0]
			newx = t.offsetX ? t.offsetX : (t.pageX - evt.target.offsetLeft);
			newy = t.offsetY ? t.offsetY : (t.pageY - evt.target.offsetTop);
		}
		// console.log(evt.offsetX+" "+evt.pageX+" "+evt.target.offsetLeft);
		x = 1/zoom*newx;
		y = 1/zoom*newy;
		wbctx.lineTo(x, y);
		bbctx.lineTo(x*bs+bbcsrx, y*bs+bbcsry);
		path.push({x,y})
		wbctx.stroke();
		bbctx.stroke();
		wbctx.closePath();
		bbctx.stroke();
		document.getElementById("write-block").style.cursor = 'default !important';
	}
	// sendArray(path)
	path = []
}

function draw_end(evt)
{
	writeblock.removeEventListener("mousemove", draw_move, false);
	writeblock.removeEventListener("touchmove", draw_move, false);
	// console.log("x = "+x)
	if( x > writeblock.width-gutter)
	{
		shift();
		bbcsrx += (writeblock.width-gutter) * bs;
	}
}

function shift()
{
	var imageData = wbctx.getImageData(writeblock.width-gutter,0,writeblock.width,writeblock.height);
	wbctx.clearRect(0,0,writeblock.width,writeblock.height);
	wbctx.putImageData(imageData,0,0);
}

writeblock.onmousedown = draw_start;
writeblock.addEventListener("touchstart",draw_start,false);
	
board.onmousewheel = function (event){
	var wheel = event.wheelDelta/33;//n or -n
	if(wheel < 0)
	{
		zoom = zoom -0.1;
	}
	else
	{
		zoom = zoom + 0.1;
	}
	document.body.style.zoom=(zoom*100)+"%";
}

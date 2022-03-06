var scale = 3.5;
var zoom = 1.0;
var boardscale = 1.0/scale;
var bcsrx = 0;
var bcsry = 0;
var linespacing = 100/scale;
var gridsize = 100/scale;
var gutteroffset = 10;
var leftgridoffset = gridsize/2;
var gutter = 0;
var endcap = 0;
var spans = 0;
var writeblock_guide_width = 0;

$("#board").css({"background-size":($("#writeblock").height()/scale)});
$("#writeblock-guide").css({"height":($("#writeblock").height()/scale)});
var board = document.getElementById("board");
var rect = board.getBoundingClientRect();
board.width = window.innerWidth-2*rect.y;
board.height = window.innerHeight*0.8;
console.log("board("+rect.x+", "+rect.y+", "+board.width+","+board.height+")");
var bctx = board.getContext("2d");
bctx.strokeStyle = "blue"
bctx.lineWidth = 1.0;
bctx.lineCap = "round";
bctx.lineJoin = "round";

var writeblock = document.getElementById("writeblock");
writeblock.width = (board.width)/scale
writeblock.height = $("#writeblock").height()/scale;
var wbctx = writeblock.getContext("2d");
wbctx.strokeStyle = "red"
wbctx.lineWidth = 1.0;
wbctx.lineCap = "round";
wbctx.lineJoin = "round";

console.log(writeblock.width);

endcap = (writeblock.width-leftgridoffset) % gridsize;
console.log("endcap = "+endcap);

gutter = gutteroffset + endcap;
console.log("gutter = "+gutter);
formatgutterguide();
console.log(gutter);

// var boardendwidth = (writeblock.width - (board.width % writeblock.width));
$("#mask").css({top: board.height+26});

writeblock_guide_width = writeblock.width;
$("#writeblock-guide").css({width:writeblock_guide_width});

function formatgutterguide()
{
	$("#gutter").css({width: gutter*scale, top: board.height+26, left: scale*((writeblock.width)-gutter)+gutteroffset+leftgridoffset-8});
}

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
	if (wbctx && bctx) {
		bctx.beginPath();
		bctx.moveTo(x*boardscale+bcsrx, y*boardscale+bcsry);
		newx = evt.offsetX ? evt.offsetX : (evt.pageX - evt.target.offsetLeft);
		newy = evt.offsetY ? evt.offsetY : (evt.pageY - evt.target.offsetTop);
		touches = evt.changedTouches;
		if( touches )
		{
			t = touches[0]
			newx = t.offsetX ? t.offsetX : (t.pageX - evt.target.offsetLeft);
			newy = t.offsetY ? t.offsetY : (t.pageY - evt.target.offsetTop);
		}
		x = 1/zoom*newx;
		y = 1/zoom*newy;
		bctx.lineTo(x*boardscale+bcsrx, y*boardscale+bcsry);
		bctx.stroke();
		document.getElementById("writeblock").style.cursor = 'default !important';
		wbctx.clearRect(0,0,writeblock.width,writeblock.height);
		wbctx.drawImage(board,bcsrx,bcsry,writeblock.width,writeblock.height,0,0,writeblock.width,writeblock.height);
	}
}

function draw_end(evt)
{
	writeblock.removeEventListener("mousemove", draw_move, false);
	writeblock.removeEventListener("touchmove", draw_move, false);
	if( x/scale > writeblock.width-gutter)
	{
		bcsrx += writeblock.width-leftgridoffset-endcap;
		console.log("bcsrx = "+bcsrx);
		console.log("board.width = "+board.width);
		if( bcsrx > (board.width - 15) )
		{
			bcsry = bcsry + linespacing;
			carriage_return();
		}
		else
		{
			shift_writing();
			console.log("board.width-writeblock.width = "+(board.width-writeblock.width));
			if( bcsrx > board.width-writeblock.width )
			{
				writeblock_guide_width = (board.width-writeblock.width);
				gutter = bcsrx - (board.width-writeblock.width)+leftgridoffset;
				console.log("gutter = "+gutter);
				formatgutterguide();
				$("#mask").css({visibility:"visible", width: (gutter-leftgridoffset)*scale});
			}
		}
	}
}
function shift_writing()
{
	$("#writeblock-guide").css({left:bcsrx+8, top:bcsry+8, "width":writeblock_guide_width});
	var imageData = wbctx.getImageData(writeblock.width-leftgridoffset-endcap,0,leftgridoffset+endcap,writeblock.height);
	wbctx.clearRect(0,0,writeblock.width,writeblock.height);
	wbctx.putImageData(imageData,0,0);
	wbctx.drawImage(board,bcsrx,bcsry,writeblock.width,writeblock.height,0,0,writeblock.width,writeblock.height);
}

function carriage_return()
{
	writeblock_guide_width = writeblock.width;
	bcsrx = 0;
	gutter = gutteroffset + endcap;
	formatgutterguide();
	shift_writing();
	$("#mask").css({visibility:"hidden"});
}

// wbctx.drawImage(board,0,0,scale*writeblock.width,scale*scale*writeblock.height);
$("#newline").mouseup(function(event)
{
	bcsry = bcsry + linespacing;
	carriage_return();
});

$("#oldline").mouseup(function(event)
{
	if( bcsry != 0 )
	{
		bcsry = bcsry - linespacing;
		carriage_return();
	}
});

$("#move-left").mouseup(function(event)
{
	if( bcsrx != 0 )
	{
		bcsrx -= writeblock.width-leftgridoffset-endcap
		shift_writing();
	}
});

$("#erase").mouseup(function(event)
{
	bctx.globalCompositeOperation = 'destination-out';
	bctx.lineWidth = 5;
});

function change_pen_color( color )
{
	bctx.globalCompositeOperation = 'source-over';
	bctx.lineWidth = 1;
	bctx.strokeStyle = color;
}

$("#black-pen").mouseup( function(event) { change_pen_color("black"); } );
$("#blue-pen").mouseup( function(event) { change_pen_color("blue"); } );
$("#red-pen").mouseup( function(event) { change_pen_color("red"); } );
$("#green-pen").mouseup( function(event) { change_pen_color("green"); } );

writeblock.onmousedown = draw_start;
writeblock.addEventListener("touchstart",draw_start,false);



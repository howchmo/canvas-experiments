// var id = window.location.href.split("#")[1]

var scale = 5.0;
var zoom = 1.0;
var boardscale = zoom/scale;
var board_cursor_x = 0;
var board_cursor_y = 0;
var gridsize = 100/scale/2;
console.log("gridsize = "+gridsize);

var board = document.getElementById("board");
var rect = board.getBoundingClientRect();
board.width = window.innerWidth-2*rect.y;
board.height = window.innerHeight;
console.log("board .height = "+board.height);
var board_context = board.getContext("2d");
board_context.lineWidth = 1.0;
board_context.lineCap = "round";
board_context.lineJoin = "round";

var writeblock = document.getElementById("writeblock");
var writeblock_context = writeblock.getContext("2d");
var writeblock_guide = $("#writeblock_guide");
writeblock.width = board.width/scale;
console.log("writeblock .height = "+writeblock.height);
// writeblock.height = 2*writeblock.height/scale
console.log("writeblock .height = "+writeblock.height);
var leftgridoffset = gridsize/2;
var rightgridoffset = (writeblock.width-leftgridoffset) % gridsize;
var default_gutter_width = $("#gutter").width();
var gutter_width = default_gutter_width;

var current_color = "white";
var erasing = false;

var x = 0;
var y = 0;

function load_image()
{
	var image = new Image();
	image.onload = function() {
		board_context.drawImage(image,0,0);
		writeblock_context.drawImage(board,board_cursor_x,board_cursor_y,writeblock.width,writeblock.height,0,0,writeblock.width,writeblock.height*1.9);
	};
	image.src = "/retrieve/"+id;
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
		y = y-1200;
		}
		x = x;
		y = y;
		// do not register if right mouse button is pressed.
		// writeblock.addEventListener("mousemove", draw_move, false);
		// writeblock.addEventListener("mouseup", draw_end, false);
		writeblock.addEventListener("touchmove", draw_move, false);
		writeblock.addEventListener("touchend", draw_end, false);
}

function draw_move(evt)
{
	if (writeblock_context && board_context)
	{
		board_context.beginPath();
		if( erasing == true )
			board_context.globalCompositeOperation="destination-out";
		else
			board_context.globalCompositeOperation="source-over";
		board_context.moveTo(x*boardscale+board_cursor_x, y*boardscale+board_cursor_y);
		newx = evt.offsetX ? evt.offsetX : (evt.pageX - evt.target.offsetLeft);
		newy = evt.offsetY ? evt.offsetY : (evt.pageY - evt.target.offsetTop);
		touches = evt.changedTouches;
		if( touches )
		{
			t = touches[0]
			newx = t.offsetX ? t.offsetX : (t.pageX - evt.target.offsetLeft);
			newy = t.offsetY ? t.offsetY : (t.pageY - evt.target.offsetTop);
			newy = newy - 1200;
		}
		x = newx;
		y = newy;
		var bx = newx*boardscale+board_cursor_x;
		var by = newy*boardscale+board_cursor_y;
		board_context.lineTo(bx, by);
		board_context.stroke();
		writeblock.style.cursor = 'default !important';
		writeblock_context.clearRect(0,0,writeblock.width,writeblock.height);
		writeblock_context.drawImage(board,board_cursor_x,board_cursor_y,writeblock.width,writeblock.height,0,0,writeblock.width,writeblock.height*1.9);
		board_context.closePath();
	}
}

function calc_new_board_cursor_x( multiplier )
{
	num_grids = Math.floor(writeblock.width/gridsize);
	console.log("num_grids = "+num_grids);
	// I have no idea why I need this 3 here
	board_cursor_x += multiplier * (num_grids-3)*gridsize;
	return( board_cursor_x );
}

function calc_new_board_cursor_y( multiplier )
{
	// num_grids = Math.floor(writeblock.height/gridsize);
	board_cursor_y += multiplier * 4*gridsize;
	return( board_cursor_y );
}

time = 0
function draw_end(evt)
{
	if (writeblock_context && board_context)
	{
		board_context.beginPath();
		if( erasing == true )
			board_context.globalCompositeOperation="destination-out";
		else
			board_context.globalCompositeOperation="source-over";
		board_context.moveTo(x*boardscale+board_cursor_x, y*boardscale+board_cursor_y);
		newx = evt.offsetX ? evt.offsetX : (evt.pageX - evt.target.offsetLeft);
		newy = evt.offsetY ? evt.offsetY : (evt.pageY - evt.target.offsetTop);
		touches = evt.changedTouches;
		if( touches )
		{
			t = touches[0]
			newx = t.offsetX ? t.offsetX : (t.pageX - evt.target.offsetLeft);
			newy = t.offsetY ? t.offsetY : (t.pageY - evt.target.offsetTop);
			newy = newy - 1200;
		}
		x = newx;
		y = newy;
		var bx = newx*boardscale+board_cursor_x;
		var by = newy*boardscale+board_cursor_y;
		board_context.fillStyle = current_color;
		board_context.fillRect(bx, by, 2, 2);
		writeblock.style.cursor = 'default !important';
		writeblock_context.clearRect(0,0,writeblock.width,writeblock.height);
		writeblock_context.drawImage(board,board_cursor_x,board_cursor_y,writeblock.width,writeblock.height,0,0,writeblock.width,writeblock.height*1.9);
		board_context.closePath();
	}

	writeblock.addEventListener("touchend", draw_end, false);
	writeblock.removeEventListener("touchmove", draw_move, false);
	console.log("x="+x+" ?> "+writeblock.width*scale+" - "+gutter_width);
	if( x > writeblock.width*scale-gutter_width)
	{
		board_cursor_x = calc_new_board_cursor_x(1);
		console.log("board_cursor_x = "+board.width);
		if( board_cursor_x > (board.width - gutter_width) )
		{
			down();
		}
		else
		{
			shift_writing();
			console.log("board.width-writeblock.width = "+(board.width-writeblock.width));
			if( board_cursor_x > board.width-writeblock.width )
			{
				console.log("gutter_width = "+gutter_width);
				format_gutter();
				var mask_width = writeblock.width*scale - scale*(board.width - board_cursor_x);
				$("#mask").css({visibility:"visible", width: mask_width});
			}
		}
	}
}

function format_gutter()
{
	var gutteroffset = 0;
	var leftover = board.width - board_cursor_x;
	console.log("leftover = "+leftover);
	console.log("writeblock.width = "+writeblock.width*scale);
	gutter_width = writeblock.width*scale - leftover*scale + 100;
	$("#gutter").css({width:gutter_width});
}

function shift_writing()
{
		$("#writeblock-guide").css({left:board_cursor_x+8, top:board_cursor_y+8, "width":$("#writeblock-guide").width()});
		writeblock_context.clearRect(0,0,writeblock.width,writeblock.height);
		var imageData = writeblock_context.getImageData(writeblock.width-leftgridoffset-rightgridoffset,0,leftgridoffset+rightgridoffset,writeblock.height);
		writeblock_context.putImageData(imageData,0,0);
		writeblock_context.drawImage(board,board_cursor_x,board_cursor_y,writeblock.width,writeblock.height,0,0,writeblock.width,writeblock.height*1.9);
}

function down()
{
	board_cursor_x = 0;
	board_cursor_y = calc_new_board_cursor_y(1);
	shift_writing();
	reset_writeblock();
	save_image();
}

function cr()
{
	down();
	save_image();
}

function reset_writeblock()
{
	$("#mask").css({visibility:"hidden"});
	gutter_width = default_gutter_width;
	$("#gutter").css({width:gutter_width});
}

function up()
{
	board_cursor_y = calc_new_board_cursor_y(-1);
	shift_writing();
}

function backspace( evt )
{
	if( board_cursor_x != 0 )
	{
		board_cursor_x = calc_new_board_cursor_x(-1);
		shift_writing();
	}
	reset_writeblock();
}

function set_pen_color( c )
{
	console.log(c);
	current_color = c;
	board_context.strokeStyle = current_color;
	if( erasing )
		board_context.lineWidth = 6;
	else
		board_context.lineWidth = 2;
}
set_pen_color(current_color);

function save_image()
{
	url = board.toDataURL();
	$.ajax({
		type: "POST",
		url: "/save/"+id,
		data:{
			imageBase64: url
		}
	}).done(function() {
		console.log('sent');
	});
}

$("#save").mouseup(save_image);

$("#backspace").mouseup(backspace);
$("#carriagereturn").mouseup(down);
$("#up").mouseup(up);
$(".pen#black").mouseup(function( e ) { erasing = false; set_pen_color("white"); } );
$(".pen#blue").mouseup(function( e ) { erasing = false; set_pen_color("blue"); } );
$(".pen#red").mouseup(function( e ) { erasing = false; set_pen_color("red"); } );
$(".pen#green").mouseup(function( e ) { erasing = false; set_pen_color("green"); } );
$(".pen#clear").mouseup(function( e ) { erasing = true; set_pen_color("white"); } );

var writer = document.getElementById("writer");
writer.onmousedown = draw_start;
writer.addEventListener("touchstart",draw_start,false);
// I am doing this as a total hack to make this work
// otheruise it has the strange behavor where I can
// never return to the color it started out with
set_pen_color("black");
board_context.beginPath();
board_context.moveTo(0,0);
board_context.lineTo(1,1);
board_context.stroke();
board_context.closePath();
set_pen_color("white");

load_image();



$("#header-new-note-button").mouseup( function() {
	w = window.open("/wrtrw/note");
});

// load the directory of files
$.get( "notes", function( data ) {
	console.log( data );
	for(const date in data)
	{
		file = data[date]
		$("<div class=\"note\" id=\""+file+"\"><div class=\"note-rep\" style=\"background:url(\'/wrtrw/retrieve/"+file+"\');\"></div><div class=\"note-date\">"+date+"</div>\n").prependTo("#notes-list");
	}
	$(".note").mouseup( function( e ) {
		e.stopPropagation();
		console.log(e.currentTarget.id);
		w = window.open("/wrtrw/note/"+e.currentTarget.id, e.currentTarget.id);
	});
});


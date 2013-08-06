(function() {
	var multiplex = Reveal.getConfig().multiplex;
	var socketId = multiplex.id;
	var socket = io.connect(multiplex.url);

	socket.on(multiplex.id, function(data) {
		// ignore data from sockets that aren't ours
		if (data.socketId !== socketId) { return; }
		if( window.location.host === 'localhost:1947' ) return;

        if (data.type && data.type === 'slidechanged') {
    		Reveal.slide(data.indexh, data.indexv, data.indexf, 'remote');
        }
        else if (data.type && data.type === 'codechanged') {
            var event = document.createEvent( "HTMLEvents", 1, 2 ),
                target = document.getElementById(data.id);
                
    	    event.initEvent( 'keypress', true, true );
    	    
            target.innerHTML = data.html;
            target.dispatchEvent(event);
        }
	});
}());

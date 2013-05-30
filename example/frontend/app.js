var Push;

$( document ).ready(function() {

    Push = new Octopush("http://localhost:3001")
    Push.on("my_event", function(data) {
	$("div#messages").append("<p>" + JSON.stringify(data) + "</p>");
    });

});

var Push = new Octopush("http://localhost:3001");
Push.on("humidity", function(data) {
    $("div#messages").html("<p>Relative humidity is " + parseInt(data.humid) + "%</p>");
});


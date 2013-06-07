//-*- mode:javascript; tab-width:4; intent-tabs-mode:nil;  -*-

if (typeof exports == "undefined") {
  var exports = this.octopush = {};
}

exports.Octopush = function Octopush(url, cookie) {

    var browser = typeof document != "undefined";

    this.events = {};
    this.channels = [];
    this.cookie = cookie || browser ? document.cookie : null;

    //Base setup
    var that = this;
    this.init = function() {
        that.socket = io.connect(url);
        that.socket.on("message", function(data) {
            if(typeof(that.events[data.e]) === "function")
                that.events[data.e](data.p);
        });

        //Internal states and error handling
        that.socket.on("error", function(data) {
            if(typeof(console) !== "undefined") {
                console.error(data);
            }
        });
        that.socket.on("auth", function(data) {
            if(typeof(console) !== "undefined") {
                switch(data) {

                case 0:
                    console.log("Authenticated");
                    break;

                case 1:
                    console.error("Authentication failed");
                    break;

                case 2:
                    console.error("Server not configured for auth");
                    break;

                default:
                    console.error("Unknown error code for auth: " + data);

                }
            }
        });
        that.socket.on("chans", function(data) {
            that.chans = data;
        });
    };

    //Include socketio
    if (browser) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.onload = this.init;
      script.type = 'text/javascript';
      script.src = url.replace(/\/$/, "") + "/socket.io/socket.io.js";
      head.appendChild(script);
    } else {
      var io = require('socket.io-client');
      this.init();
    }

    //User functions
    this.on = function(event, callback) {
        that.events[event] = callback;
    };

    this.join = function(channel) {
        var obj = {chan: channel};
        if(channel[0] === "!")
            obj.cookie = that.cookie;
        that.socket.emit("join", {chan: channel});
    };

    this.part = function(channel) {
        that.socket.emit("part", channel);
    };

    this.auth = function() {
        that.socket.emit("auth", that.cookie);
    };
};

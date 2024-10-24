// req > request
// res > response

var path = require("path");
var express = require("express");

module.exports = function(app){
    // folders
    app.use("/styles", express.static(path.resolve(".") + '/node_modules/bootstrap/dist/css')); 
    app.use("/dist", express.static(path.resolve(".") + '/dist'));
    app.use("/assets", express.static(path.resolve(".") + '/dist/assets')); 

    // scripts
    app.use("/scripts/bootstrap", express.static(path.resolve(".") + '/node_modules/bootstrap/dist/js'));
    app.use("/scripts/popper", express.static(path.resolve(".") + '/node_modules/popper.js/dist'));
    app.use("/scripts/jquery", express.static(path.resolve(".") + '/node_modules/jquery/dist')); 

    app.use("/dist", express.static(path.resolve(".") + '/dist')); // Serve the dist folder
    app.get("/", function(req, res) {
	      res.sendFile(path.resolve(".") + "/index.html"); // Serve static index.html
    });
}





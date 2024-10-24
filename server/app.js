// var http = require('http');
var express =    require("express");
var bodyParser = require("body-parser");
var cors = require("cors"); // cors permet de setup les headers pour effectuer des appels cross-domain

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var routes = require("./routes/routes.js")(app);

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});

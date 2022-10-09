var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
//var data = require("data-service.js")
app.use(express.static('public'));
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
   
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    // send the html view with our form to the client
    res.sendFile(path.join(__dirname, "views/home.html"));
}
,
app.get("/about", (req, res) => {
  // send the html view with our form to the client
  res.sendFile(path.join(__dirname, "views/about.html"));
}
,
app.get("/deaprtments", (req, res) => {
  // send the html view with our form to the client
  res.sendFile(path.join(__dirname, "data/departments.json"));
}

)));

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);
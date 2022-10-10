/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _____Ali Asadullah_____ Student ID: _174606210
__ Date: __10/09/2022__
*
* Your app’s URL (from Cyclic) :https://faithful-coat-bear.cyclic.app/
*
*************************************************************************/ 
const fs= require("fs");
var express = require("express");
var HTTP_PORT = process.env.PORT || 8080;
var data = require('./data-service');
var app = express();
var path = require("path");
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
app.get("/employees",function (req,res) {
data.geAlltEmployees()
.then((data) => res.json(data))
.catch((err)=> res.json({"message": err}))
}
,
app.get("/managers",function (req,res) {
  data.getManagers()
  .then((data) => res.json(data))
  .catch((err)=> res.json({"message": err}))
  }
  ,
  app.get("/departments",function (req,res) {
    data.getDepartments()
    .then((data) => res.json(data))
    .catch((err)=> res.json({"message": err}))
    }
  
)))));

app.use((req, res) => {
  res.status(404).send("error 404 page not found!");
});


// setup http server to listen on HTTP_PORT

data.initialize()
.then((data)=>{
  app.listen(HTTP_PORT, onHttpStart);
})
.catch(()=>{
  console.log("error")
})
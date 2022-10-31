/*************************************************************************
* BTI325– Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: ________Ali Asadullah____________________ Student ID: _____174606210_________ Date: ___10/31/2022____
*
* Your app’s URL (from  Heroku) that I can click to see your application:
* https://aliasadullahassignment3.herokuapp.com/
*
*************************************************************************/

var bodyParser = require("body-parser");
const fs= require("fs");
var express = require("express");
var HTTP_PORT = process.env.PORT || 8080;
var data = require('./data-service');
var app = express();
var path = require("path");
var multer = require("multer");
const storage = multer.diskStorage({
  destination : "./public/images/uploaded", 
  filename: function(req, file, cb){
      cb(null, Date.now() + path.extname(file.originalname)); 
  }

});

var upload = multer({storage : storage});
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
app.get("/employees/add", (req, res) => {
  // send the html view with our form to the client
  res.sendFile(path.join(__dirname, "views/addEmployee.html"));
}
,
app.get("/images/add", (req, res) => {
  // send the html view with our form to the client
  res.sendFile(path.join(__dirname, "views//addImage.html"));
}
,
app.get('/employees', (req, res) => {
  if(req.query.status) {
      data.getEmployeesByStatus(req.query.status)
          .then((data) => res.json(data))
          .catch((err) => res.json({"message": err}))
  }else if(req.query.manager){
      data.getEmployeesByManager(req.query.manager)
          .then((data) => res.json(data))
          .catch((err) => res.json({"message": err}))
  }else if(req.query.department){
      data.getEmployeesByDepartment(req.query.department)
          .then((data) => res.json(data))
          .catch((err) => res.json({"message": err}))
  }else{
      data.geAlltEmployees()
          .then((data) => res.json(data))
          .catch((err) => res.json({"message": err}))
  }
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
    ,
    app.post("/images/add", upload.single("imageFile"), function(req, res){
      res.redirect("/images")
    
    }
,
app.get("/images",  function(req, res){

  fs.readdir("./public/images/uploaded", function(err, items){


     res.send("ITEMS : " + items)

     if (err)
     console.log(err);

  })

}
,
app.post('/employees/add', function(req, res) {
  data.addEmployee(req.body)
      .then(res.redirect('/employees'))
      .catch((err) => res.json({"message": err}))   
}
,
app.get('/employee/:employeeNum', (req, res) => {
  data.getEmployeesByNum(req.params.employeeNum)
  .then((data) => {
      res.json(data);
  })
}
  
)))))))))));

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
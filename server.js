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
var exphbs = require("express-handlebars");
var multer = require("multer");
const storage = multer.diskStorage({
  destination : "./public/images/uploaded", 

  filename: function(req, file, cb){
      cb(null, Date.now() + path.extname(file.originalname)); 
  }

});

app.engine('.hbs', exphbs.engine({extname : ".hbs",  

helpers: {

    navLink : function(url, options){ 
    
            return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';},
          
    equal   : function (lvalue, rvalue, options) {

              if (arguments.length < 3)

              throw new Error("Handlebars Helper equal needs 2 parameters");
              
              if (lvalue != rvalue) {
                return options.inverse(this);} 
              
              else {
                
                return options.fn(this);}

    }
}


})) 


var upload = multer({storage : storage});
app.set('view engine', '.hbs');
app.use(express.static('public'));
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  app.use(function(req,res,next){ //adds property activeRoute to app.locals. I don't fully understand this  function, more research needed

    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
  
  });
  // body-parser: for form without file upload
  app.use(bodyParser.urlencoded({extended:true}));
// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    // send the html view with our form to the client
    res.render('home');
}
,
app.get("/about", (req, res) => {
  // send the html view with our form to the client
  res.render("about");
}
,
app.get("/employees/add", (req, res) => {
  // send the html view with our form to the client
  res.render("addEmployee");
}
,
app.get("/images/add", (req, res) => {
  // send the html view with our form to the client
  res.render("addimage");
}
,
app.get('/employees', (req, res) => {
  if(req.query.status) {
      data.getEmployeesByStatus(req.query.status)
          .then((data) =>  res.render("employees" , {data: data}))
          .catch(() => res.render({message: "no results"}));
  }else if(req.query.manager){
      data.getEmployeesByManager(req.query.manager)
          .then((data) => res.render("employees" , {data: data}))
         
          .catch(() =>res.render({message: "no results"}));
  }else if(req.query.department){
      data.getEmployeesByDepartment(req.query.department)
          .then((data) =>  res.render("employees" , {data: data}))
          .catch(() => res.render({message: "no results"}));
  }else{
      data.geAlltEmployees()
          .then((data) =>  res.render("employees" , {data: data}))
          .catch(() =>  res.render({message: "no results"}));
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
    data.getDepartments().then(function(data){
      res.render("departments" , {data: data});
  })
  .catch(function(err){
      res.render("departments" , {data: err});
  })

}

    
    ,
    app.post("/images/add", upload.single("imageFile"), function(req, res){
      res.redirect("/images")
    
    }
,
app.get("/images",  function(req, res){

  fs.readdir("./public/images/uploaded", function(err, items){


    console.log("ITEMS : " + items)
    res.render("images", {data: items});

     if (err){
      res.send("IMAGE RETRIVIAL ERROR :" + err);
      console.log(err);
     }

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
  data.getEmployeesByNum(req.params).then(function(data){
    
    res.render("employee", {emp: data[0]});
  
  }).catch(function(err){
    console.log("ERROR : " + err);
    res.render("employee", {error: err});
  
  })
  }
,
app.post("/employee/update", (req, res) => {
  console.log(req.body);
  res.redirect("/employees");
 })
  
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
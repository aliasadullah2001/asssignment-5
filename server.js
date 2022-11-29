/*************************************************************************
* BTI325– Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: ________Ali Asadullah____________________ Student ID: _____174606210_________ Date: ___11/28/2022____
*
* Online ( Cyclic) Link: ________________________________________________________
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
  //res.sendFile(path.join(__dirname+"/views/addEmployee.html"));
  data.getDepartments()
  .then((data)=>res.render("addEmployee",{departments:data}))
  .catch(()=>res.render("addEmployee",{departments:[]})) 
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
      .then((data) => {
          if(data.length>0) res.render("employees",{employees:data});
          else res.render("employees",{message: "no results"})
      })
      .catch(() => res.render("employees",{message: "no results"}))
  }else if(req.query.manager){
      data.getEmployeesByManager(req.query.manager)
      .then((data) => {
          if(data.length>0) res.render("employees",{employees:data});
          else res.render("employees",{message: "no results"})
      })
      .catch(() => res.render("employees",{message: "no results"}))
  }else if(req.query.department){
      data.getEmployeesByDepartment(req.query.department)
      .then((data) => {
          if(data.length>0) res.render("employees",{employees:data});
          else res.render("employees",{message: "no results"})
      })
      .catch(() => res.render("employees",{message: "no results"}))
  }else{
      data.getAllEmployees()
      .then((data) => {
          if(data.length>0) res.render("employees",{employees:data});
          else res.render("employees",{message: "no results"})
      })
      .catch(() => res.render("employees",{message: "no results"}))
  }
}
,
app.get("/managers", function(req, res){

  data.getManagers().then(function(data){
    //res.json(data);
    if (data.length > 0){
      res.render("managers", {data : data});
    }
    else{
      res.render("managers", {data : "No results"});
    }
})
.catch(function(err){
   res.render("managers" , {data: err});
})


}
  ,

  app.get("/departments", function(req, res){

    data.getDepartments().then(function(data){

      if (data.length > 0){
        res.render("departments", {data : data});
      }
      else{
        res.render("departments", {data : "No results"});
      }
      
  }
    )
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
app.get("/employees/add", function(req,res){



  data.getDepartments().then(function(array_of_depts){

    res.render("addEmployee", {departments : array_of_depts});
    

  }).catch(function(err){


    res.render("addEmployee", {departments : []});

  })

  


}
,
app.get("/employees/:num", function(req, res){

  
  let viewData = {};

  data_services.getEmployees(req.params).then((data) => {
      if (data) {
  
          viewData.employee = data; 
      } else {
          viewData.employee = null;
      }
  }).catch(() => {
      viewData.employee = null; 
  }).then(data_services.getDepartments)
  .then((data) => {
      viewData.departments = data; 

      

      for (let i = 0; i < viewData.departments.length; i++) {
          if (viewData.departments[i].departmentId == viewData.employee[0].dataValues.department) {
              viewData.departments[i].selected = true;
          }
      }

  }).catch(() => {
      viewData.departments = []; 
  }).then(() => {
      if (viewData.employee == null) { 
          res.status(404).send("Employee Not Found");
      } else {
        console.log(viewData.employee);
          res.render("employee", { viewData: viewData }); 
      }
  })
}
,
app.post("/employee/update", (req, res) => {
  console.log(req.body);
  res.redirect("/employees");
 })
 ,
 app.post("/departments/add", function(req,res){
  
  data.addDepartment(req.body).then(function(){
      res.redirect("/departments");
  }).catch(function(err){

    res.send("ERROR :  " + err);


  })


})
,
app.post("/department/update", function(req,res){


    data.updateDepartment(req.body).then(function(){
      res.redirect("/departments")
    }).catch(function(err){
      res.send("ERROR : " + err);
    })


}),
app.get("/departments/add", function(req,res){

  res.render("addDepartment");

})
,

app.get("/department/:departmentId", function(req,res){

data.getDepartmentById(req.params).then(function(dept){

  //res.json(dept);
   res.render("department", {data: dept})

}).catch(function(err){
  res.send("ERROR :  " + err);
})

})
,
app.get('/employee/delete/:employeeNum', function(req, res){

  data.deleteEmployeeByNum(req.params).then(function(){

    res.redirect("/employees")

  }).catch(function(err){

    res.send("ERROR : " + err);

  })


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
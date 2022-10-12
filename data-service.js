
const fs = require ('fs');
var employees = new Array();
var departments = new Array();
var exports = module.exports={};


exports.initialize = ()=>{

return new Promise((resolve, reject)=>{

    fs.readFile('data/employees.json',(err,data)=>{
        if (err){reject("Failure to read file!");
    } else{
        employees = JSON.parse(data);      
    }});
   fs.readFile('data/departments.json',(err,data)=>{
    
        if (err){reject("Failure to read file!");
            }  else{ departments = JSON.parse(data);
            }
               
                
            });
            resolve();
        });

    }


 
exports.getDepartments= ()=>{
    return new Promise((resolve , reject)=>{
        if (departments.length != 0)
        resolve(departments);
        reject("no results returned");
    });
}


exports.geAlltEmployees = ()=>{
    return new Promise((resolve, reject)=>{
        if(employees.length !=0)
        resolve(employees);
        reject("no reuslts returned");
    }
    );
}
   


exports.getManagers= ()=>{
 return new Promise ((resolve, reject)=>{
var managers= employees.filter(employee =>employee.ismanager==true);
if(managers.length==0){
    reject("no results returned");
}
resolve(managers);
 });
}

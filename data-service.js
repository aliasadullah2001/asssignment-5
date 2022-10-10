
const fs = require ('fs');
var employees = new Array();
var departments = new Array();
var exports = module.exports={};


exports.initialize = ()=>{

return new Promise((resolve, reject)=>{

    fs.readFile('data/employees.json',(err,data)=>{
        if (err){reject("Failure to read file!")
    } else{
        employees = JSON.parse(data);      
    }});
        fs.readFile('data/departments.json',(err,data)=>{
    
                if (err){reject("Failure to read file!")
            }  else{ departments = JSON.parse(data);
            }
               
                
            })
            resolve();
        })

    };


 
exports.geAlltEmployees= ()=>{
    return new Promise((resolve , reject)=>{
        if (employees.length != 0)
        resolve(employees);
        reject("no results returned");
    })
}


exports.getDepartments = ()=>{
    return new promise((resolve, reject)=>{
        if(departments.length==0)
        reject("no results returned");
      
        else
        resolve(departments);
    
    })
};

exports.getManagers= ()=>{
 return new promise ((resolve, reject)=>{
var managers= employees.filter(employee =>employee.ismanager==true);
if(managers.length==0){
    reject("no results returned");
}
resolve(managers);
 })
};

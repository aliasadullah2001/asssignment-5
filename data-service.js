
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
   


exports.getManagers = function(){
    return new Promise((resolve, reject)=>{
        let managers=[];
       /* for (let i=0; i<employees.length; i++)
            {
                if (employees[i].isManager)
                    managers.push(employees[i]);
            }
        */
            employees.forEach(function (employee) {
                if (employee.isManager) {
                    managers.push(employee);
                }
            });
            
        if (managers.length>0)
            resolve(managers);
        else
            reject("No results returned.");
    });
}
exports.addEmployee = function(employeeData){
    if(!employeeData.isManager) employeeData.isManager = false;
    else employeeData.isManager = true;
    employeeData.employeeNum = employees.length+1;
    employees.push(employeeData);
    return new Promise((resolve, reject) => {
        resolve(employees);
        if(employees.length == 0)
        reject("no results returned");
    });
};

exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        let filteredEmployees = employees.filter(employees => employees.status == status);
        resolve(filteredEmployees);
        if(filteredEmployees.length == 0)
        reject("no results returned");
    });
}

exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        let filteredEmployees = employees.filter(employees => employees.department == department);
        resolve(filteredEmployees);
        if(filteredEmployees.length == 0)
        reject("no results returned");
    });
}

exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        let filteredEmployees = employees.filter(employees => employees.employeeManagerNum == manager);
        resolve(filteredEmployees);
        if(filteredEmployees.length == 0)
        reject("no results returned");
    });
}

exports.getEmployeesByNum = function(num){
    return new Promise((resolve, reject) => {
        let filteredEmployees = employees.filter(employees => employees.employeeNum == num);
        resolve(filteredEmployees);
        if(filteredEmployees.length == 0)
        reject("no results returned");
    });
}
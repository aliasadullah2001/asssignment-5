

var exports = module.exports={};

const Sequelize = require('sequelize');
var sequelize = new Sequelize('zzbodbwj','zzbodbwj','KTMZLDmWxJ-hsxz873tjCGD5OPbR_1jd',{
    host:'heffalump.db.elephantsql.com',
    dialect:'postgres',
    port: 5432,
    dialectOptions:{
        ssl: true
    }

});

sequelize.authenticate().then(()=>console.log('Connection success.')).catch((err)=>console.log("Unable to connect to DB.", err));

 var Employee = sequelize.define('Employee',{

    empNum : {
        
        type: Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true    },
    
    firstName          : Sequelize.STRING,
    lastName           : Sequelize.STRING,
    email              : Sequelize.STRING,
    SSN                : Sequelize.STRING,
    addressStreet      : Sequelize.STRING,
    addressCity        : Sequelize.STRING,
    addressState       : Sequelize.STRING,
    addressPostal      : Sequelize.STRING,
    maritalStatus      : Sequelize.STRING,
    isManager          : Sequelize.BOOLEAN,
    employeeManagerNum : Sequelize.INTEGER,
    status             : Sequelize.STRING,
    department         : Sequelize.INTEGER,
    hireDate           : Sequelize.STRING

 });

 var Department = sequelize.define('Department', {


    departmentId : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },

    departmentName : Sequelize.STRING

 })

exports.initialize = function(){

    return new Promise(function(resolve, reject){

            sequelize.sync().then(function(){
                console.log("Initialize function was able to sync with database ;3")
                    resolve();

           

            }).catch(function(err){

                reject("Unable to sync data from Initialize :" + err)
            }) 
            
        })
    
    
      


    }

  


 
exports.getDepartments = function(){
    return new Promise((resolve, reject) => {
        Department.findAll()
        .then(()=>resolve(Department.findAll()))
        .catch(()=>reject("no results returned"))
    });
};  


exports.getAllEmployees = function(){


    return new Promise(function(resolve , reject){

        sequelize.sync().then(function(){

            Employee.findAll({order: ['empNum']}).then(function(array_of_emps){

                    resolve(array_of_emps);
            }).catch(function(err){

                reject("No results or error : " + err)

            })


        }).catch(function(err){
            reject("Sync Error in getAllEmployees ):");
        })


    })

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
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for(prop in employeeData){
        if(prop=="") prop=null;
    }
    return new Promise((resolve, reject) => {
        Employee.create(employeeData)
        .then(()=>resolve())
        .catch(()=>reject("unable to create employee"))
    });
};


exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                status: status
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                status: status
            }
        })))
        .catch(()=>reject("no results returned")) 
    });
}

exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                department: department
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                department: department
            }
        })))
        .catch(()=>reject("no results returned")) 
    });
}

exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                employeeManagerNum: manager
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                employeeManagerNum: manager
            }
        })))
        .catch(()=>reject("no results returned")) 
    });
}

exports.getEmployeeByNum = function(num){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where:{
                employeeNum: num
            }
        })
        .then(()=>resolve(Employee.findAll({
            where:{
                employeeNum: num
            }
        })))
        .catch(()=>reject("no results returned")) 
    });
}


exports.updateEmployee = function(employeeData){
    employeeData.isManager = (employeeData.isManager) ? true : false;
    for(prop in employeeData){
        if(prop=="") prop=null;
    }
    return new Promise((resolve, reject) => {
        Employee.update(employeeData,{where: {employeeNum:employeeData.employeeNum}}) 
        .then(()=>resolve(Employee.update(employeeData,{where: {employeeNum:employeeData.employeeNum}}) ))
        .catch(()=>reject("unable to update employee"))
    });
};
exports.addDepartment = function(data){


    return new Promise(function(resolve, reject){
        
        sequelize.sync().then(function(){

            CheckIfAttributesExist(data);

            Department.create({

                departmentName : data.departmentName

            }).then(function(dept_obj){

                resolve();

            }).catch(function(err){


                reject("Error with Dept Create : " + err);

            })


        }).catch(function(err){
            reject("ERROR : " +  err)
        })
    })
}
exports.updateDepartment = function(data){
    

    return new Promise(function(resolve, reject){

        sequelize.sync().then(function(){

            console.log(data);
            Department.update({
    
                departmentName : data.departmentName
    
            }, {where : {departmentId : data.departmentId}}).then(function(){
                resolve()
            }).catch(function(err){
                reject("error : " + err);
            })
    
        }).catch(function(err){
    
            reject("Error in Department Sync : " + err);
        })


    })
    

}
exports.getDepartmentById = function(data){


    return new Promise(function(resolve, reject){

        sequelize.sync().then(function(){

            Department.findAll({where : {departmentId : data.departmentId}}).then(function(dept_obj){

                    resolve(dept_obj[0]);

            }).catch(function(err){

                reject("Error with findAll depts : " + err);

            })

        }).catch(function(err){

            reject("ERROR with sync in getDeptById : " + err);
        })

    })





}
exports.deleteEmployeeByNum = function(data){

    return new Promise(function(resolve, reject){

        sequelize.sync().then(function(){

            Employee.destroy({where : {empNum : data.employeeNum}}).then(function(){
                resolve();
            }).catch(function(err){
                reject("Err with delete emp : " + err);
            })


        }).catch(function(err){

            reject("Issue with Sync in  deleteEmpy : " + err)
        })

    })

}
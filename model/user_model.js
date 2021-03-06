const app = require('../app');
const moment = require('moment');
let database = app.db;
let userCollection = database.collection('users');
let bcyrpt=require('bcrypt-nodejs');
let salt = bcyrpt.genSaltSync(10);
let ObjectId = require('mongodb').ObjectID;

updatePasswordAdmin=(Password)=>{
  return new Promise((resolve,reject)=>{
      let hashedPassword=bcyrpt.hashSync(Password);
      userCollection.updateOne({_id: ObjectId("59a66e42598d9711d0bb64a0")},{ $set:
          {
              Password:hashedPassword
          }
      }, function(err, result) {
          if(err){
              reject(err);
          }else {
              resolve(result);
          }
      });
  });
};
updateRfidSiswa=(query)=>{
  return new Promise((resolve,reject)=>{
      userCollection.updateOne({_id: ObjectId(query._id)},
          {
              $push:{rf_id:query.RFID}
          }
      , function(err, result) {
          if(err){
              reject(err);
          }else {
              resolve(result);
          }
      });
  });
};
checkLoginUser=(query)=>{
    return new Promise((resolve,reject)=>{
        var Username = new RegExp(["^", query.Entity, "$"].join(""), "i");
        var NoInduk=query.Entity;
       userCollection.findOne({
         $or:[
             {Username:Username},
             {no_induk:NoInduk}
         ]
       },function (err,result) {
           if(err)reject(err);
           else {
               if (result){
                   resolve(result);
               }else {
                   resolve(false);
               }
           }
       });
    });
};
checkIfAdmin=(IDUser)=>{
    return new Promise((resolve,reject)=>{
        userCollection.findOne({
             _id:ObjectId(IDUser)
       },function (err,result) {
           if(err)reject(err);
           else {
               if (result){
                   if(result.RoleID===0){
                       resolve(result);
                   }else {
                       resolve(false);
                   }
               }else {
                   resolve(false);
               }
           }
       });
    });
};
getListSiswa = () => {
    return new Promise((resolve, reject)=>{
        userCollection.find({RoleID:2}).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
getListGuru = () => {
    return new Promise((resolve, reject)=>{
        userCollection.find({RoleID:0}).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
findUserByString = (SearchString) => {
    return new Promise((resolve, reject)=>{
        console.log(SearchString);
        userCollection.find({
            RoleID:2,
            $text:{
                $search:  SearchString
            }
        }).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
findGuruByString = (SearchString) => {
    return new Promise((resolve, reject)=>{
        console.log(SearchString);
        userCollection.find({
            RoleID:0,
            $text:{
                $search:  SearchString
            }
        }).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
insertUserSiswa = (query) => {
    return new Promise((resolve, reject)=>{
        let userQuery={
            NISLokal:query.NoInduk,
            NamaSiswa:query.Nama.toUpperCase(),
            JenisKelamin:query.JenisKelamin,
            RoleID:2,
            Password:bcyrpt.hashSync(query.Password, salt)
        };
        userCollection.insertOne(userQuery,function (err,result) {
           if(err)reject(err);
           else resolve(result);
        });
    });
};
insertUserGuru = (query) => {
    return new Promise((resolve, reject)=>{
        let userQuery={
            NoInduk:query.NoInduk,
            NamaGuru:query.Nama.toUpperCase(),
            JenisKelamin:query.JenisKelamin,
            RoleID:0,
            Password:bcyrpt.hashSync(query.Password, salt)
        };
        userCollection.insertOne(userQuery,function (err,result) {
           if(err)reject(err);
           else resolve(result);
        });
    });
};
updateUserSiswa = (query) => {
    return new Promise((resolve,reject)=>{
        userCollection.updateOne({_id: ObjectId(query._idEdit)},{ $set:
            {
                NamaSiswa:query.NamaEdit,
                NISLokal:query.NoIndukEdit,
                JenisKelamin:query.JenisKelaminEdit
            }
        }, function(err, result) {
            if(err){
                reject(err);
            }else {
                resolve(result);
            }
        });
    });
};
updateUserGuru = (query) => {
    return new Promise((resolve,reject)=>{
        userCollection.updateOne({_id: ObjectId(query._idEdit)},{ $set:
            {
                NamaGuru:query.NamaEdit,
                NoInduk:query.NoIndukEdit,
                JenisKelamin:query.JenisKelaminEdit
            }
        }, function(err, result) {
            if(err){
                reject(err);
            }else {
                resolve(result);
            }
        });
    });
};
checkRFID = (rf_id) => {
    return new Promise((resolve, reject)=>{
        userCollection.findOne({rf_id:rf_id},function (err,result) {
            if(err)reject(err);
            else {
                if(result)resolve(true);
                else resolve(false);
            }
        });
    });
};
deleteUserFromDocument=(UseriD)=>{
    return new Promise((resolve,reject)=>{
        userCollection.removeOne({_id:ObjectId(UseriD)},function (err,result) {
            if(err)reject(err);
            else resolve(result);
        });
    }) ;
};
getListRfidSiswa = () => {
    return new Promise((resolve, reject)=>{
        userCollection.find({RoleID:2},{rf_id:1}).toArray( (err, results) => {
            if(err)reject(err);
            else {
                iterateListRfidSiswa(results,function (err,iteratedResults) {
                   if(err)reject(err);
                   else resolve(iteratedResults);
                });
            }
        });
    });
};
function iterateListRfidSiswa(items,callback) {
        let arrAbsen=[];
        let maxCount = (items.length > 0) ? items.length-1 : 0;
        let countProccess=0;
        items.forEach(function (index) {
            if(index.rf_id!==undefined){
                let rf_id=index.rf_id[0];
                arrAbsen.push(rf_id);
            }
            if (countProccess === maxCount) {
               callback(null,arrAbsen);
            }
            countProccess++;
        });
}
module.exports = {
    updatePasswordAdmin:updatePasswordAdmin,
    checkLoginUser:checkLoginUser,
    getListSiswa:getListSiswa,
    findUserByString:findUserByString,
    checkIfAdmin:checkIfAdmin,
    insertUserSiswa:insertUserSiswa,
    checkRFID:checkRFID,
    updateRfidSiswa:updateRfidSiswa,
    deleteUserFromDocument:deleteUserFromDocument,
    updateUserSiswa:updateUserSiswa,
    insertUserGuru:insertUserGuru,
    getListGuru:getListGuru,
    updateUserGuru:updateUserGuru,
    findGuruByString:findGuruByString,
    getListRfidSiswa:getListRfidSiswa
};
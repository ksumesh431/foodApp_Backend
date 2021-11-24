const UserModel = require("../models/UserModel")
const express = require("express")
const {protectedRoute,authorizeUser} = require("./authHelper");
const factory=require("../helpers/factory")
const createUser=factory.createElement(UserModel);
const deleteUser=factory.deleteElement(UserModel);
const updateUser=factory.updateElement(UserModel);
const getUsers=factory.getElement(UserModel);
const getUserById=factory.getElementById(UserModel);
// const authorizeUser=require("./authHelper")

const userRouter = express.Router();
userRouter
    .route("/")
    .get(protectedRoute,authorizeUser(['admin', 'manager']), getUsers)
    .post(createUser);


userRouter
    .route("/:id")
    .get(authorizeUser(['admin', 'manager']), getUserById)
    .patch(updateUser)
    .delete(deleteUser)



// async function createUser(req,res){
//     try{
//         let userInput=req.body;
//         if(userInput){
//             let user=await userModel.create(userInput);
//             res.status(200).json({
//                 user:user
//             })
//         }else{
//             res.status(500).json({
//                 message:"Please enter user data"
//             })
//         }
//     }catch (err) {
//         res.status(500).json({
//             error: err.message,
//             "message": "error creating users"
//         })
//     }
// }
// async function getUser(req, res) {
//     try {
//         let users = await userModel.find();

//         res.status(200).json({
//             "message": "List of all the users ",
//             "users": users
//         })
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//             "message": "can't get users"
//         })
//     }
// }

//``````````````````````````````

// function updateUser(req, res) {
//     let obj = req.body;
//     for (let key in obj) {
//         user[key] = obj[key];
//     }
//     res.status(200).json(user);
// }
// function deleteUser(req, res) {
//     user = []
//     res.status(200).json(user);
// }
// async function getUserById(req, res) {
//     try {
//         // console.log("this is request of getuserbyid:",req);
//         let reqID = req.params.id;
//         if (reqID) {
//             let user = await userModel.findById(reqID);
//             res.status(200).json({
//                 user
//             })
//         } else {
//             res.status(500).json({
//                 "message": "invalid request"
//             })
//         }
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//             errorType: "getUserByIdError"

//         })
//     }

// }

// function authorizeUser(rolesArr) {
//     return async function (req, res, next) {
//         try {
//             let uid = req.body.uid;
//             console.log(uid);

//             //get the role of the person from database
//             let { role } = await userModel.findById(uid);

//             let isAuthorized = rolesArr.includes(role);
//             if (isAuthorized) {
//                 console.log("AUTHORIZED")
//                 next();
//             } else {
//                 console.log("UNAUTHORIZED")
//                 return res.status(403).json({
//                     message: "user not authorized contact admin"
//                 })
//             }
//         } catch (err) {
//             res.status(500).json({
//                 error: err.message
//             })
//         }

//     }
// }

module.exports = userRouter;
const mongoose = require("mongoose")
let { DB_LINK } = require("../secrets")


//conection
mongoose.connect(DB_LINK)
    .then(function (db) {
        console.log(`coonnected to review db successful`);
    })
    .catch(function (err) {
        console.log("err", err);
    });


//Schema Creation
const ReviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,"Review can't be empty"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"Review must contain some rating"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"UserModel",
        required:[true,"Review must belong to a user"]
    },
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:"PlanModel",
        required:[true,"Review must belong to a plan"]
    }
})

//Model 
const ReviewModel=mongoose.model("reviewModel",ReviewSchema)

//export
module.exports=ReviewModel
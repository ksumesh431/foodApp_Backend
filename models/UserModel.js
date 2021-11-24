const mongoose = require("mongoose");
const emailValidator = require("email-validator")
let { DB_LINK } = require("../secrets")

//connection formation
mongoose.connect(DB_LINK)
    .then(function (db) {
        console.log(`connection to user db successful`);
    })
    .catch(function (err) {
        console.log("err", err);
    })



//syntax 
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            return emailValidator.validate(this.email)
        }
    },
    age: Number,
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 7,
        validate: function () {
            return this.password === this.confirmPassword
        }
    },
    createdAt: Date,
    token: String,

    role: {
        type: String,
        enum: ['admin', 'user', 'manager'],
        default: 'user'
    },
    bookings:{
        type:[mongoose.Schema.ObjectId],
        ref:"bookingModel"
    }
})


// this works before sending data to db.. and removes the confirm Password 
UserSchema.pre("save", function () {
    // db confirm password will not be saved
    console.log("Hello");
    this.confirmPassword = undefined;
})

//creating manual method/function on the users using userSchema.methods
UserSchema.methods.resetHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;

    //make tokne reuse impossible
    this.token = undefined;

}

//`````````````````````````````````````````````````````

//this is to get access of the userModel in the database
const UserModel = mongoose.model("userModel", UserSchema);

module.exports = UserModel;


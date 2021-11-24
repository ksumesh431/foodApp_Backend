const UserModel = require("../models/UserModel")
const express = require("express")
let emailSender = require("../helpers/emailSender")

const { JWT_KEY } = require("../secrets")
const jwt = require("jsonwebtoken")

const authRouter = express.Router();
authRouter
    .post("/signup", setCreatedAt, signupUser)
    .post("/login", loginUser)
    .post("/forgetPassword", forgetPassword)
    .post("/resetPassword", resetPassword)

//middleware
function setCreatedAt(req, res, next) {
    try {
        //can also set a check for empty request sent
        let body = req.body;
        let length = Object.keys(body).length;
        if (length === 0) {
            return res.status(400).json({
                message: "can't create user when body is empty"
            })
        }


        req.body.createdAt = new Date().toISOString();
        next();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message

        })
    }

}
async function signupUser(req, res) {
    try {
        let userObj = req.body;

        //send the object recieved from postman to database using UserModel
        let user = await UserModel.create(userObj);
        console.log("user:", user)

        res.status(200).json({
            message: "user created",
            createdUser: user
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

async function loginUser(req, res) {
    try {
        console.log("Enetered login Function")
        if (req.body.email) {
            let user = await UserModel.findOne({ email: req.body.email });

            if (user) {
                if (user.password === req.body.password) {

                    let payload = user["_id"]
                    // console.log("Payload is==>  ", payload);
                    let token = jwt.sign({ id: payload }, JWT_KEY);

                    res.cookie("jwt", token, { httpOnly: true, maxAge: 99999999999 });//that is it will expire in 10 sec
                    res.status(200).json({
                        message: "User logged in successfully"
                    })
                } else {
                    return res.status(403).json({
                        message: "Email or password is wrong"
                    })
                }
            } else {
                return res.status(403).json({
                    message: "Email or password is wrong"
                })
            }
        } else {
            return res.status(403).json({
                message: "Email is not present"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message

        })
    }
}

async function forgetPassword(req, res) {
    let email = req.body.email;

    //random 4 digit otp
    let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

    try {
        if (email) {
            //1st update user object with the otp/seq in database using updateOne(email)
            await UserModel.updateOne({ email }, { token: seq });

            //send email using nodemailer
            // service gmail

            let user = await UserModel.findOne({ email });
            await emailSender(seq, user.email)

            if (user?.token) {
                return res.status(200).json({
                    message: "Email sent with token" + seq
                })
            } else {
                return res.status(404).json({
                    message: "user not found"
                })
            }
        } else {
            return res.status(400).json({
                message: "kindly enter email"
            })
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }


}
async function resetPassword(req, res) {
    let { token, password, confirmPassword } = req.body

    try {
        if (token) {
            //first get user from database and store in variable locally
            let user = await UserModel.findOne({ token });
            if (user) {
                user.resetHandler(password, confirmPassword);

                //now send request to databse to save new user object using .save
                await user.save();

                res.status(200).json({
                    message: "user password changed"
                })
            } else {
                return res.status(404).json({
                    message: "incorrect token"
                })
            }

        } else {
            return res.status(404).json({
                message: "token not found"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }
}


module.exports = authRouter;




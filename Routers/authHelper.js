const jwt = require("jsonwebtoken")
const { JWT_KEY } = require("../secrets")

module.exports.protectedRoute = function protectedRoute(req, res, next) {
    console.log("entered protectedRoute function")
    try {
        if (req.cookies.jwt) {
            let decryptedToken = jwt.verify(req.cookies.jwt, JWT_KEY);
            if (decryptedToken) {
                let userId = decryptedToken._id;
                req.uid = userId;
                next();
            }
        } else {
            res.status(401).json({
                message: "You are not allowed"
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "server error"

        })
    }
}

module.exports.authorizeUser = function authorizeUser(rolesArr) {
    return async function (req, res, next) {
        try {
            let uid = req.body.uid;
            console.log(uid);

            //get the role of the person from database
            let { role } = await userModel.findById(uid);

            let isAuthorized = rolesArr.includes(role);
            if (isAuthorized) {
                console.log("AUTHORIZED")
                next();
            } else {
                console.log("UNAUTHORIZED")
                return res.status(403).json({
                    message: "user not authorized contact admin"
                })
            }
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }

    }
}

module.exports.bodyChecker = function bodyChecker(req, res, next) {
    console.log("reached body checker");
    let isPresent = Object.keys(req.body).length;
    console.log("ispresent", isPresent)
    if (isPresent) {
        next();
    } else {
        res.send("kind send details in body ");
    }
}
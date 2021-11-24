const express = require("express");
const cookieParser = require("cookie-parser");
const port = 8080


//server init
const app = express();

//makes files in public folder accessible to frontend/user
app.use(express.static('public'))

//middleware for accepting incoming request object as JSON object i.e takes json inputs from user in "request"/req
app.use(express.json()); 

//NEEDED FOR HAVING COOKIE FUNCTION
app.use(cookieParser());


const userRouter = require("./Routers/userRouter")
const authRouter = require("./Routers/authRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
const bookingRouter = require("./Routers/bookingRouter");


//mounting routes in express
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use("/api/plan", planRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);
app.use(function (req, res) {
    res.status(404).json({
        message:"Page not found"
    })
})


//localhost:8080
app.listen(port, function () {
    console.log(`server started at port ${port}`)
})





























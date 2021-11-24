const mongoose = require("mongoose");
let { DB_LINK } = require("../secrets")

//connection formation
mongoose.connect(DB_LINK)
    .then(function (db) {
        console.log(`connection to booking db successful`);
    })
    .catch(function (err) {
        console.log("err", err);
    })

//syntax 

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Please enter user"]
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Please enter plan"]
    },
    bookedAt: {
        type: Date
    },
    priceAtThatTime: {
        type: Number,
        required: [true, "Please enter price at the time of buying"]
    },
    status: {
        type: String,
        required: [true, "a status is necessary"],
        enum: ["pending", "failed", "success"],
        default:"pending"
    }

})

const BookingModel = new mongoose.model("bookingModel", BookingSchema);

module.exports = BookingModel;
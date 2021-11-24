const BookingModel = require("../models/BookingModel.js")
const UserModel = require("../models/UserModel")
const express = require("express")
const { protectedRoute } = require("./authHelper")
const bookingRouter = express.Router();


const initiateBooking = async (req, res) => {
    try {
        let booking = await BookingModel.create(req.body);

        //add booking id in userModel
        let bookingId = booking["_id"];
        let userId = req.body.user;
        let user = await UserModel.findById(userId);
        user.bookings.push(bookingId);
        await user.save();

        res.status(200).json({
            message: "Booking created successfully",
            booking: booking
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const deleteBooking = async (req, res) => {
    try {
        let booking = await BookingModel.findByIdAndDelete(req.body.id);

        let userId = booking.user;
        let user = await UserModel.findById(userId);
        let idxOfBooking = user.bookings.indexOf(booking["_id"]);
        user.booking.splice(idxOfBooking, 1);
        await user.save();
        res.status(200).json({
            messgae: "Booking deleted",
            booking
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}

bookingRouter.use(protectedRoute)

bookingRouter
    .route("/:id")

bookingRouter
    .route("/")
    .post(initiateBooking)

module.exports = bookingRouter;


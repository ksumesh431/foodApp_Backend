const express = require("express")
const reviewRouter = express.Router();
const {protectedRoute} = require("./authHelper")
const ReviewModel = require("../models/ReviewModel")
const factory = require("../helpers/factory")
const PlanModel = require("../models/PlanModel")

// const createReview = factory.createElement(ReviewModel)
const getReview = factory.getElement(ReviewModel)
const updateReview = factory.updateElement(ReviewModel)
// const deleteReview = factory.deleteElement(ReviewModel)
const getReviewById = factory.getElementById(ReviewModel);

const createReview = async (req, res) => {
    try {
        let review = await ReviewModel.create(req.body);
        console.log("review", review);

        let planId = review.plan;
        let plan = await PlanModel.findById(planId);

        // find average rating and store in plan model while adding new review
        if (plan.averageRating) {
            let sum = plan.averageRating * plan.reviews.length;
            let finalAvgRating =
                (sum + review.rating) / (plan.reviews.length + 1);
            plan.averageRating=finalAvgRating;
        } else {
            plan.averageRating = review.rating
        }


        plan.reviews.push(review["_id"]);
        await plan.save();
        res.status(200).json({
            messgae: "Review created successfully",
            review
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;
        let review = await ReviewModel.findByIdAndDelete(id);
        console.log("review", review);

        let planId = review.plan;
        let plan = await PlanModel.findById(planId);
        let indexOfReview = plan.reviews.indexOf(review["_id"]);

        plan.reviews.splice(indexOfReview, 1);
        await plan.save();
        res.status(200).json({
            message: "Review Deleted successfully",
            deletedReview: review
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

reviewRouter.use(protectedRoute);
reviewRouter
    .route("/:id")
    .get(getReviewById)
    .patch(updateReview)
    .delete(deleteReview);

reviewRouter
    .route("/")
    .get(getReview)
    .post(createReview);

module.exports = reviewRouter;


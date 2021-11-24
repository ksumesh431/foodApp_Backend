const PlanModel = require("../models/PlanModel")
const express = require("express")
const { protectedRoute } = require("./authHelper")
const planRouter = express.Router();
const factory = require("../helpers/factory");
const createPlan = factory.createElement(PlanModel);
const deletePlan = factory.deleteElement(PlanModel);
const updatePlan = factory.updateElement(PlanModel);
const getPlan = factory.getElement(PlanModel);
const getPlanById = factory.getElementById(PlanModel);


const getTop3Plans = async (req, res) => {
    try {
        let plans = await PlanModel.find()
            .sort("-averageRating")
            .limit(3)
            .populate({
                path: "reviews",
                select: "review rating"
            });
        console.log(plans);
        res.status(200).json({
            plans
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
}

planRouter.use(protectedRoute)

planRouter
    .route("/top3Plans")
    .get(getTop3Plans)

planRouter
    .route("/:id")
    .get(getPlanById)
    .patch(updatePlan)
    .delete(deletePlan);

planRouter
    .route("/")
    .get(getPlan)
    .post(createPlan)


module.exports = planRouter;



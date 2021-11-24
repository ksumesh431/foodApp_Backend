const mongoose = require("mongoose");
let { DB_LINK } = require("../secrets")

//connection formation
mongoose.connect(DB_LINK)
    .then(function (db) {
        console.log(`connection to plan db successful`);
    })
    .catch(function (err) {
        console.log("err", err);
    })

//syntax 

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly pass the name"],
        unique: true,
        maxlength: [40, 'Your plan length is more than 40 characters']
    },
    duration: {
        type: Number,
        required: [true, "You need to provide duration"]
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price
            },
            //message if validator returns false
            message: "Discount must be less than the actual price",
        }
    },
    reviews: {
        //array of objectids
        type: [mongoose.Schema.ObjectId],
        ref: "reviewModel"
    },
    averageRating: Number

})

const PlanModel = new mongoose.model("planModel", PlanSchema);

module.exports = PlanModel;
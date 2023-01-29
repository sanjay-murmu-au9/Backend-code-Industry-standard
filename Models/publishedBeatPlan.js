const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

//schema;
const publishedBeatPlan = new Schema({
    'cityId': {
        type: 'String',
        enum: ['coimbatore', 'hydrabad', 'padappi', 'gummidipoondi', 'chennai', 'bangalore']
    },
    'beatPlanId': {
        type: String,
        required: true
    },
    'warehouseId': {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'distributors',
        autopopulate: {
            select: 'name'
        }
    }

}, { timestamps: true });

// creating indexes
publishedBeatPlan.index({
    'cityId': 1,
    'date': 1,
    'status': 1,
    'createdAt': 1
})

//Populate User Name for Steps Verification
publishedBeatPlan.plugin(autopopulate);
//exporting the entire module
module.exports = mongoose.model('publishedBeatPlan', publishedBeatPlan)
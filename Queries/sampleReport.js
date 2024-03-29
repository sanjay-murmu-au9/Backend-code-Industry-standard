const Model = require('../Models/sampleReport')
const BeatPlanModel = require('../Models/publishedBeatPlan')

class Report {
    async getReport(from, to) {
        try {
            let searchObj = {}
            searchObj = {
                'isDeleted': 0,
                'salesOrganization': distributor.salesOrg.toString(),
                'distributionChennel': distributor.distributionChennel.toString(),
                'plant': distributor.plant.toString(),
                'dateOfOrderPlacing': {
                    $gte: from,
                    $lte: to
                }
            };

            let fieldToProject = {
                '_id': 1,
                'dateOfOrderPlacing': 1,
                'createdAt': 1,
                'dateOfPlaceing': { $dateToString: { format: '%Y-%m-%d', date: "$dateOfPlaceing", timezone: "+05:30" } },
                'orderPlacedTime': { $dateToString: { format: '%H:%M:%S', date: "$orderPlacedTime", timezone: "+05:30" } },
                'customerId': 1,
                'salesmanId': 1,
                'paymentStatus': 1,
                'salesOrderId': 1,
                'shippingCharges': 1,
                'deliveryCharge': 1,
                'totalAmount': 1,
                'totalAmountWithoutTax': 1,
                'totalTaxAmount': 1,
                'orderType': 1,


                'salesmanId': 1,
                'fulfillmentStatus': 1,
                'dateOfDelivery': 1,
                'application_Form': 1,
                'goFrugalError': 1,
                'orderType': 1,
                'salemanObj': 1,
                'goFrugalId': 1,
                'ship_to_party': 1,
                'sold_to_party': { $int: '$sold_to_party' },
                "item": 1,
                'saleOrderObj.deliveryDate': 1,
                'saleOrderObj.paymentMode': 1,
                'saleOrderObj.discount_amount': 1,
                'saleOrderObj.customerId': 1,
                'saleOrderObj.customerName': 1,
                'saleOrderObj.customerEmail': 1,
                'saleOrderObj.customerAddressLine1': 1,
                'saleOrderObj.customerAddressLine2': 1,
                'isSOCancelled': { $ifNull: ['$isSOCancelled', 'NA'] }

            }
            let result = await Model.aggregate([
                {
                    $match: {
                        ...searchObj
                    }
                },
                {
                    $project: {
                        fieldToProject
                    }
                },
                {
                    "$unwind": {
                        path: '$items',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'customers',
                        let: { "custId": "$sold_to_party" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$goFrugalId', '$$custId'] }
                                }
                            },
                            { $project: { "_id": 1, 'name': 1, 'ownerName': 1, 'businessName': 1, 'application_from': 1, 'businessName': 1 } }
                        ],
                        as: "customrtDetails"
                    }
                },
                {
                    $lookup: {
                        from: 'salesmanagers',
                        let: { 'salesId': "$salesmanId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$salesId"] }
                                }
                            },
                            { $project: { "employeerName": 1, 'fullName': 1, 'employeeId': 1 } }
                        ],
                        as: "smDetails"
                    }
                },
                {
                    $unwind: "$smdetails",
                    preserveNullAndEmptyArrays: true
                }
            ]).allowDiskUse(true);
            return result;

        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    async beatplandata(startDate, endDate, employeeId) {
        let beatPlans = []
        try {
            let matchCondition = {
                isDeleted: 0,
                status: 1,
                dateOfBeatPlan: { '$gte': startDate, '$lte': endDate },
                'salesman.employeeId': { $in: employeeId }
            };
            let projectField = {
                day: 1,
                beatPlantId: 1,
                cityId: 1,
                salesexeid: '$saleman.employeeId',
                salesexename: '$salesman.fullName',
                dateOfBeatPlan: { $dateToString: { format: '%Y-%m-%d', date: "$dateOfBeatPlan", timezone: "+05:30" } },
                timeOfBeatPlan: { $dateToString: { format: '%H:%M:%S', date: "$dateOfBeatPlan", timezone: "+05:30" } }
            },
                beatPlans = await BeatPlanModel.aggregate([
                    {
                        $match: matchCondition
                    },
                    {
                        $project: projectField
                    }
                ]);
            return beatPlans;
        } catch (err) {
            err(err.message);
            throw new Error(err.message)
        }
    }

    async uploadCsvfile(file) {
        try {
            let upload = await Model.create(file)
            return upload;
        } catch (error) {
            console.log * error
        }
    }
}

module.exports = new Report;
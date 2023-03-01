const Model = require('../Models/productModel');
const Model2 = require('../Models/getOrderProduct')
const moment = require('moment');

class ProductQuery {
    async postingProduct(body) {
        return await Model.create(body)
    }

    async getAllProduct() {
        return await Model.find({})
    }

    async singleProd(id) {
        try {
            return await Model.findOne({ _id: id })
        } catch (error) {
            console.log(error)
        }
    }

    async getProductByType(sortBy) {
        if (sortBy) {
            const [field, order] = sortBy.split(':')
            return await Model.find({})
                .collation({ locale: 'en' })
                .sort({ [field]: order })
        }
        return await Model.find({})
    }

    // image upload
    async imageUpload(url) {
        return await Model.create({ imageUrl: url })
    }

    // allOrderProduct
    async getAllOrderProduct(customerId, invoiceNo, page, limit, skip, to, from) {
        try {

            let filter = {};
            if (customerId !== '' && customerId !== undefined) {
                filter = {
                    customerId: { $regex: customerId, $options: 'i' }
                }
            }

            if (to !== '' && to !== undefined && from !== '' && from !== undefined) {
                filter = {
                    dateOfOrderPlacing: {
                        $gte: moment(from).set({ h: 0, m: 0, s: 0, millisecond: 0 }).toDate(), $lte: moment(to).set({ h: 23, m: 59, s: 59, millisecond: 99 }).toDate()
                    }
                }
            }

            if (invoiceNo !== '' && invoiceNo !== undefined) {
                filter = {
                    'invoiceDetails.invoiceNo': {
                        $regex: invoiceNo, $options: 'i'
                    }
                }
            }

            let result = await Model2.aggregate([
                {
                    $match: {
                        ...filter
                    }
                },
                {
                    $project: {
                        customerId: 1,
                        customerName: 1,
                        invoiceDetails: { $ifNull: ["$invoiceDetails", [null]] },
                        items: 1,
                        dateOfOrderPlacing: 1,
                        createdAt: { $ifNull: ["$createdAt", 'N/A'] }
                    }
                },
                {
                    $unwind: {
                        path: "$invoiceDetails"
                    }
                },
                {
                    $facet:
                    {
                        resData: [
                            { $skip: skip },
                            { $limit: limit },
                        ],
                        count: [
                            { $count: 'totalCount' }
                        ]
                    }
                }
            ])
            return result;

        } catch (error) {
            console.log(error)
        }
    }

    async getCetainDataOnly() {
        try {
            return await Model.find({}, {

                'imageUrl': 1,
                'price': {

                    $cond: { if: { $gte: ["$price", 250] }, then: 30, else: 20 }

                }

            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new ProductQuery()
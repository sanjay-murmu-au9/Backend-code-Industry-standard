const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const allOrderProdct = new Schema({
    dateOfOrderPlacing: {
        type: String
    },
    salesOrderId: {
        type: String
    },
    customerName: {
        type: String
    },
    portal: {
        type: String
    },
    paymentMode: {
        type: String
    },
    soStatus: {
        type: Number
    },
    customerId: {
        type: String
    },
    plant: {
        type: Number
    },
    distributionChannel: {
        type: String
    },
    salesOrganization: {
        type: String
    },
    invoiceNo: {
        type: String
    },
    totalAmount: {
        type: Number
    },
    invoiceDetails: [
        {
            invoiceNo: {
                type: String
            },
            itemSupplied: [
                {
                    plant: {
                        type: Number
                    },
                    uom: {
                        type: String
                    },
                    quantity: {
                        type: Number
                    }
                }
            ]
        }
    ],
    items: [
        {
            details: [
                {
                    imageUrl: {
                        type: String
                    },
                    shortName: {
                        type: String
                    },
                    material_type: {
                        type: String
                    },
                    taxId: {
                        type: Number
                    },
                    inventory: {
                        stock: {
                            type: Number
                        },
                        orderQuantity: {
                            type: Number
                        }
                    },
                    name: {
                        type: String
                    },
                    moq: {
                        type: Number
                    },
                    conditionType: {
                        type: String
                    },
                    plant: {
                        type: String
                    },
                    available_stock: {
                        type: Number
                    }
                }
            ]
        }
    ]

}, {
    timestamps: true
})

// exporting the entire module
module.exports = mongoose.model('allOrderProduct', allOrderProdct)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SampleReport = new Schema({
    dateOfOrderPlacing: {
        type: String
    },
    dateOfPlacing: {
        type: Date
    },
    orderPlacedTime: {
        type: Date
    },
    customerId: {
        type: String
    },
    salesmanId: {
        type: String
    },
    paymentStatus: {
        type: String
    },
    salesOrderId: {
        type: String
    },
    shippingCharges: {
        type: String
    },
    deliveryCharge: {
        type: String
    },
    totalAmount: {
        type: String
    },
    totalAmountWithTax: {
        type: String
    },
    totalTaxAmount: {
        type: String
    },
    fulfillmentStatus: {
        type: String
    },
    dateOfDelivery: {
        type: Date
    },
    application_Form: {
        type: String
    },
    goFrugalError: {
        type: String
    },
    orderType: {
        type: String
    },
    salemanObj: {
        type: String
    },
    goFrugalId: {
        type: String
    },
    ship_to_party: {
        type: String
    },
    sold_to_party: {
        type: String
    },
    item: {
        type: String
    },
    saleOrderObj: [{
        deliveryDate: {
            type: Date
        },
        paymentMode: {
            type: String
        },
        discount_amount: {
            type: String
        },
        customerId: {
            type: String
        },
        customerName: {
            type: String
        },
        customerEmail: {
            type: String
        },
        customerAddressLine1: {
            type: String
        },
        customerAddressLine2: {
            type: String
        },
    }],
    isSOCancelled: {
        type: String
    }
})

module.exports = mongoose.model('sampleReport', SampleReport)
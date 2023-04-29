const cron = require('node-cron');
const customrtModel = require('../Models/productModel');

module.exports = {
    sendTestCustomerSms: async () => {
        cron.schedule("0 */30 * * * *", async () => {
            console.log('Running cron in every 30 min')
            const newOnboardedCustomers = await customrtModel.find(
                { $and: [{ application_from: "pd_waycool" }, { isMessageSend: 0 }, { isDuplicate: 0 }] }
            ).select({ "contactPerson.phoneNumber": 1, _id: 1, goFrugalId: 1 }).lean()
        })
    }
}
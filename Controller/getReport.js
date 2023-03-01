const Query = require('../Queries/sampleReport')
const __ = require('../Utilities/Response');
const moment = require('moment')
const dayinwords = ['', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const mime = require('mime-types')
const _ = require('lodash')
const { parse } = require('json2csv')
// const downloadCsv = require('download-csv');


class ProductCtrl {
    async getReport(req, res) {
        try {
            const from = moment(req.query.from, 'YYYY/MM/DD').set({
                h: 0,
                m: 0,
                s: 0,
                millisecond: 0
            }).toDate();
            const to = moment(req.query.to, 'YYYY/MM/DD').set({
                h: 23,
                m: 59,
                s: 0,
                millisecond: 999
            }).toDate();

            // from token
            let distributorName = req.dataForDistributor && req.dataForDistributor.nameToDisplay ? req.dataForDistributor.nameToDisplay : 'NA';
            let plant = req.dataForDistributor && req.dataForDistributor.plant ? req.dataForDistributor.plant : 'NA';
            // let csvData = [];
            const tempData = await Query.getReport(from, to,/* req.dataForDistributor */);
            // console.log(tempData, "<<<<<<tempData")
            let response = {
                status: 200,
                result: tempData
            }

            // return res.send(response)
            let saleExecutiveIds = new Set();

            tempData.forEach(element => {
                if (element.smdetails && element.smdetails.employeeId) {
                    saleExecutiveIds.add(element.smdetails.employeeId);
                }
            })
            let beatplandata = [];
            if (saleExecutiveIds && saleExecutiveIds.size > 0) {
                beatplandata = await Query.beatplandata(from, to, Array.from(saleExecutiveIds))
            }

            tempData.forEach(element => {

                // let source = '', beatPlan = "Not Mapped";
                let totalAmount = 0, salesOrderId = "N/A", discountAmt = 0, paymentMode = '', subtotal = 0;
                let ownerName = '', salesmanemployeer = '';
                let customerId = '', storeName = '', mobileNo = '', emailId = 'NA', address = '', deliveryDate = '';
                let dayoforder = '', itemizedamount = 0, effectiveUnitPrice = 0, itemizedDiscount = 0;
                let materialCode = '', materialName = '', itemUnitQuantity = 0.0, itemQuantity = 0, deliveryCharge = 0, payablePrice = 0, payableAmount = 0;


                // console.log(element.fieldToProject.paymentStatus, "<<<<<<<<<<<ELEMENT")
                paymentMode = element.fieldToProject.paymentStatus;
                if (paymentMode && (paymentMode == 'Cash-on-delivery' || paymentMode === 'cod')) {
                    paymentMode = 'Pay on Delivery';
                }

                if (element.fieldToProject.dateOfPlacing) {
                    dayoforder = dayinwords[element.dateOfPlacing];
                }

                // console.log(paymentMode, element.fieldToProject.paymentStatus, dayoforder, "<<<<dayoforder")
                // try {
                //     let goFrugaldata;
                //     if (element.goFrugaldata) {
                //         goFrugaldata = JSON.parse(element.goFrugalError);
                //         if (goFrugaldata.message == 'Success')
                //             salesOrderId = goFrugaldata.data.sales_order_no;
                //     } else {
                //         if (element.salesOrderId)
                //             salesOrderId = element.salesOrderId;
                //     }

                // } catch (err) {
                //     console.log('goFrugal is not in proper format:', err, element._id);
                // }

                // if (element.items.length > 0 && element.items.length == 1) {
                //     if (element.items[0].discount_amount != undefined)
                //         discountAmt = Math.abs(element.items[0].discount_amount);
                // } else if (element.items.length && element.items.length > 1) {
                //     // if items is more then one
                //     element.items.forEach((itemlm) => {
                //         if (itemlm.discount_amount != undefined)
                //             discountAmt = Math.abs(discountAmt + itemlm.discount_amount);
                //     });
                // }

                // if (element.orderType) {
                //     if (element.portal == 'salesmanOrder') {
                //         source = 'Saleman App';
                //         deliveryCharge = element.shippingCharges;
                //     }
                //     else if (element.orderType === 'pdwaycool') {
                //         source = 'Waycool App';
                //         deliveryCharge = element.deliveryCharge;
                //     }
                //     else if (element.orderType == 'distributor') {
                //         source = 'Distributor';
                //         deliveryCharge = element.deliveryCharge;
                //     }
                //     else if (element.orderType == 'callcenter' || element.orderType == 'callcenter')
                //         source = 'Call-Center';
                // } else {
                //     source = 'NA';
                // }


                // let isSOCancelled = element.soResult && element.soResult.isSOCancelled === 1 ? 'Cancelled' : 'Placed';
                let csvData = []
                csvData.push({
                    'Plant Code': plant || '1000',
                    'distributor Name': distributorName || "TEST",
                    'Order Date': element.orderPlacedDate ? element.orderPlacedDate : '',
                    'Order Time': element.orderPlacedTime ? element.orderPlacedTime : 'Not Maped',
                    'paymentMode': paymentMode,
                    //....
                    'Api Response': element.goFrugalError ? element.goFrugalError : "NA"
                });

                if (csvData && csvData.length) {
                    let csv = parse(csvData);
                    // console.log(csv, "CSVDATA++++++++++++++++++++++++++++++++++++++++++++++++++")

                    res.setHeader('Content-dispositio', `attachment; filename=soreport - ${req.query.from} - ${req.query.to}.csv`)
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(csv);
                } else {
                    __.errorMsg(req, res, 409, "No Data avaiable ${csv} at this moment, please try again!.");
                }


            })

            // const Product = await Query.postingProduct(allProduct)

            // return __.successMsg(req, res, 201, response, "Product created successfully");


        } catch (error) {
            __.errorMsg(req, res, 503, "Service unavailable.", error);

        }
    }

    async uploadReport(req, res, next) {
        try {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            let storage = multer.diskStorage({
                destination: function (req, file, cd) {
                    cd(null, './uploads/')
                },
                filename: function (req, file, cb) {
                    let datetimestamp = new Date()
                    cb(null, filename + "-" + datetimestamp + '-' + file.originalname.split('-')[file.originalname.split('-').length - 1])
                }
            });

            let upload = multer({
                storage: storage, fileFilter: function (req, file, cb) {
                    if (['xls', 'xlsx', 'csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
                        return cb(new Error('Wrong extension type'));
                    }
                    cb(null, true)
                }
            }).single('file')

            console.log('upload', upload, "<<<<<<upload")
            return;
            let excelltojson;
            // upload(req, res, function (err) {
            //     if (err) return res.json({ error_code: 1, err_desc: err })

            //     // multer give is file info in the req.file object
            //     if (!req.file) {
            //         res.json({ error_code: 1, err_desc: 'No file found' });
            //         return;
            //     }

            //     // checking the extension of the incoming file and use the appropriate module
            //     if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] == 'xlsx') {
            //         excelltojson = xlstojson;
            //     }

            //     try {

            //     } catch (error) {
            //         console.log(error)
            //         res.json({ error_code: 1, err_desc: 'Corrupted excel file!' })
            //     }
            // })


        } catch (error) {
            __.errorMsg(req, res, 503, "Service unavailable.", error);
        }
    }

    async uploadAnotherReport(req, res) {
        try {

            // console.log(req.file, "file")
            if (req.file) {
                let ext = mime.extension(req.file.mimetype); // csv
                console.log(ext, 'ext')
                let valid_ext = ['csv', 'xls'];
                let file
                //checking the file buffer and converting to string
                if (req.file.buffer.toString('utf-8').length > 0) {
                    if (valid_ext.indexOf(ext) >= 0) {
                        //converting the csv buffer to string of utf-8
                        let csvString = req.file.buffer.toString('utf-8')
                        file = await csv().fromString(csvString).subscribe(async (json) => {
                            if (!_.isEmpty(json))
                                new Promise((resolve, reject) => {
                                    return resolve(json);
                                })
                        })
                    }
                }
                console.log(file, "uploaded file")
                // let updateResult = await Query.uploadCsvfile(file)
                return __.successMsg(req, res, 200, file, "file showing in response successfully!")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async downloadReport(req, res) {
        try {


            return __.successMsg(req, res, 200, 'result', "file showing in response successfully!")

        } catch (error) {
            console.log(error, "<<<ERROR")
        }
    }
}

module.exports = new ProductCtrl;
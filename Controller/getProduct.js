const Query = require('../Queries/productQuery')
const __ = require('../Utilities/Response');
const AxiosApicall = require('../Utilities/axisApi')
const thirdPartyUrl = process.env.Api;


//third party api
async function thirdPartytoUpdate(data) {
    let response = AxiosApicall(thirdPartyUrl, method = "POST", data) // data -> will be 

}


// call this api where it is needed
thirdPartytoUpdate
class ProductCtrl {
    async postProduct(req, res) {
        try {
            const allProduct = {
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                price: req.body.price,
                description: req.body.description,
            }
            const Product = await Query.postingProduct(allProduct)
            return __.successMsg(req, res, 201, Product, "Product created successfully");


        } catch (error) {
            __.errorMsg(req, res, 503, "Service unavailable.", error);

        }
    }

    async getProduct(req, res,) {

        try {
            const Product = await Query.getAllProduct()
            if (Product == 0) {
                return __.customMsg(req, res, 201, "No Product exists!", {});
            }
            return __.successMsg(req, res, 200, Product, "All Product")

        } catch (error) {
            __.errorMsg(req, res, 503, "service unavailable.", error)

        }

    }

    async getSingleProduct(req, res) {
        try {
            const id = req.params.prodId;
            const Product = await Query.singleProd(id)

            return __.successMsg(req, res, 200, Product, "Product!!")
        } catch (error) {
            console.log(error)
            __.errorMsg(req, res, 503, "service unavailable.", error)
        }
    }

    async getProductbytype(req, res) {
        try {
            const sortBy = req.query.sortBy;

            // const sortbyObj = {};
            // const type = req.params.sortby;

            // sortbyObj[sortby] 

            const Product = await Query.getProductByType(sortBy)

            return __.successMsg(req, res, 200, Product, "Product get by type")


        } catch (error) {
            __.errorMsg(req, res, 503, "service unavailable.", error)

        }
    }

    async getAllOrder(req, res) {
        try {
            let page = parseInt(req.query.page) || 1;
            let recordPerPage = parseInt(req.query.recordPerPage) || 5;
            let skip = (page - 1) * recordPerPage;
            let customerId = req.query.customerId || '';
            let invoiceNo = req.query.invoiceNo || '';
            let to = req.query.to;
            let from = req.query.from;

            let result = await Query.getAllOrderProduct(customerId, invoiceNo, page, recordPerPage, skip, to, from)

            if (result.length == 0) {
                return __.customMsg(req, res, 204, 'No Matched result found!!')
            }


            return __.successMsg(req, res, 200, result[0], "All Order details!!")

        } catch (error) {
            __.errorMsg(req, res, 503, "service unavailable.", error)

        }
    }

    async testProd(req, res) {
        try {
            console.log('hi there')
            const data = await Query.getCetainDataOnly()

            return __.successMsg(req, res, 200, data, "All Order details!!")
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new ProductCtrl;
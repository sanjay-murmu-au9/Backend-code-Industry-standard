const { default: mongoose } = require('mongoose');
const Query = require('../Queries/productQuery')
const __ = require('../Utilities/Response');


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

}

module.exports = new ProductCtrl;
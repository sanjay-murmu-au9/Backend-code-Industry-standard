const Model = require('../Models/productModel');

class ProductQuery {
    async postingProduct(body){
        return await Model.create(body)
    }

    async getAllProduct(){
        return await Model.find({})
    }

    async getProductByType(sortBy){
        if(sortBy) {
            const [field, order] = sortBy.split(':')
            return await Model.find({})
            .collation({locale: 'en'})
            .sort({[field]: order})
        }
        return await Model.find({})
    }
}

module.exports = new ProductQuery()
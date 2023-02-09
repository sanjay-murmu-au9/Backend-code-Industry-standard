const Model = require('../Models/productModel');

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
}

module.exports = new ProductQuery()
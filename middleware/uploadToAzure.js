const multer = require('multer');
const path = require('path');
const MulterAzureStorage = require('multer-azure-storage')

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'localStorage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const uploadToAzure = multer({
    fileFilter: function (req, file, cb) {
        if (
            path.extname(file.originalname) == '.PNG' ||
            path.extname(file.originalname) == '.png' ||
            path.extname(file.originalname) == '.jpg' ||
            path.extname(file.originalname) == '.jpeg' ||
            path.extname(file.originalname) == '.pdf' ||
            path.extname(file.originalname) == '.svg'
        ) {
            return cb(null, true)
        };
        return cb('Only images are allowed!')
    },
    // storage: localStorage
    //upload using AzureStorage
    // storage: new MulterAzureStorage({
    //     azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    //     containerName: 'receivable',
    //     containerSecurity: 'blob'
    // })
})

module.exports = uploadToAzure;
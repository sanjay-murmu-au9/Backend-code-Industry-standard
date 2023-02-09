const express = require('express');
const ctrl = require('../Controller/uploadfile')
const uploadToAzure = require('../middleware/uploadToAzure')
const app = express.Router();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "SastaLens",
        // format: async (req, file) => 'png', 
    },
});

let upload = multer({ storage: storage });

app.post('/uplaodfile', uploadToAzure.single('file'), ctrl.fileUpload)

app.post('/uploadusingclodnary', upload.single('file'), ctrl.fileUploadUsingCloudanary)


module.exports = app;

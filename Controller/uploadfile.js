const Query = require('../Queries/productQuery')
const __ = require('../Utilities/Response')
const mime = require('mime-types')
const cloudinary = require("cloudinary").v2;

//Cloudinary Configuration
cloudinary.config({
    cloud_name: "dv03vohls",
    api_key: "129681625134471",
    api_secret: "kqx2Vj_icbqm4EMDVJqPLT4ZUss",
})


class Uploadfile {
    async fileUpload(req, res) {
        try {
            if (!req.file) {
                return __.customMsg(req, res, 406, 'Please select file')
            }

            //file to upload in the require format only;
            const validExt = process.env.validImageDocMimeTypes || []
            let ext = mime.extension(req.file.mimetype);
            if (validExt.indexOf(ext) >= 0) {
                let filePath = (req && req.file && req.file.path) || '';
                // console.log(">>>>>", req.file, "ext>>>", ext, "<<<path,ext")
                // let filePath = (new Date().getTime() + "_" + req.file.path + '.' + ext.join("")) || '';
                console.log(req.file, "<<<req.file")
                let details = {
                    fileName: req.file.originalname,
                    filePath: ('localhost:4000' + filePath)
                }
                // console.log("detail", details.filePath)
                return __.successMsg(req, res, 201, details.filePath, "image link created successfully");

            } else {
                return __.customMsg(req, res, 406, "Please select only valid image format")
            }

        } catch (error) {
            return __.errorMsg(req, res, 503, error) //return //! WHy not return
        }
    }

    async fileUploadUsingCloudanary(req, res) {
        try {
            if (req.file) {
                const validExt = ['png', 'PNG', 'jpg', 'jpeg'] || [];
                let localFilePath = req.file.path;
                const ext = mime.extension(req.file.mimetype) //v jgp,png
                if (validExt.indexOf(ext) >= 0) {

                    let result = await Query.imageUpload(localFilePath)

                    if (!result) {
                        return __.customMsg(req, res, 201, "Please try again Image could not be uploaded!", {});
                    }

                    return __.successMsg(req, res, 200, result.imageUrl, 'image uploaded successfully!')

                } else {
                    return __.customMsg(req, res, 201, "Only images are allowed!", {});
                }

            } else {
                return __.errorMsg(req, res, 406, 'Please select file')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new Uploadfile;
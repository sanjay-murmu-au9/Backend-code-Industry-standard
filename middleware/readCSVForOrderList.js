const multer = require("multer");

module.exports = async (req, res, next) => {
    try {
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
        upload(req, res, function (err) {
            if (err) return res.json({ error_code: 1, err_desc: err })

            // multer give is file info in the req.file object
            if (!req.file) {
                res.json({ error_code: 1, err_desc: 'No file found' });
                return;
            }

            // checking the extension of the incoming file and use the appropriate module
            if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] == 'xlsx') {
                excelltojson = xlstojson;
            }

            try {

            } catch (error) {
                console.log(error)
                res.json({ error_code: 1, err_desc: 'Corrupted excel file!' })
            }
        })

    } catch (error) {
        console.log(error)
        __.errorMsg(req, res, 503, "Service unavailable.", error);
    }
}
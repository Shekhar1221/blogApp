const multer = require("multer")

function createUploader(folderName) {
    console.log('postfileuploader')
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/'+folderName)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
    return multer({ storage: storage })
}

module.exports = {
    postUploader : createUploader("posts"),
    userUploader:createUploader("users")
}
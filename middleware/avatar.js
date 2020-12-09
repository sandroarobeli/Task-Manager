const multer = require('multer')

// Setting up multer to send uploads to 'avatars' directory
const upload = multer({
    limits: {
        fileSize: 1100000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return callback(new Error('File must be PNG, JPG or JPEG'))
        }
        callback(undefined, true)
    } 
})

// Handle file (image in this case) upload 
exports.imageUpload = (keyName) => upload.single(keyName)

// Handle error message display should Error be thrown
exports.errorMessage = (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}



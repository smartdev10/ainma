const express = require("express");
const router = express.Router();
const Image = require('../../controllers/adminControllers/image')
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./images/')
    },
    filename: function (req, file, cb) {
      cb(null, 'sokia_' + file.originalname )
    }
})
const multerUploads = multer({ storage }).single('sokia');
//admin routes
router.route("/:name").get(Image.getOneImage);
router.route("/sokia").post(multerUploads,Image.UploadImage);
router.route("/").delete(Image.deleteImage);


module.exports = router;

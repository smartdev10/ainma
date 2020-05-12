const express = require("express");
const router = express.Router();
const Image = require('../../controllers/adminControllers/image')
const multer = require('multer');
const path = require('path')
const FileType = require('file-type');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./images/')
    },
    filename: async function (req, file, cb) {
      const data = await FileType.fromFile(file.originalname)
      cb(null, 'sokia' + data.ext )
    }
})
const multerUploads = multer({ storage }).single('sokia');
//admin routes
router.route("/:name").get(Image.getOneImage);
router.route("/sokia").post(multerUploads,Image.UploadImage);


module.exports = router;

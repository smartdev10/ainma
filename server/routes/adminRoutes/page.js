const express = require("express");
const router = express.Router();
const Page = require('../../controllers/adminControllers/page')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./images/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
})
const multerUploads = multer({ storage }).single('sokia');
//admin routes
router.route("/").get(Page.getPages);
router.route("/").post(Page.createPage);
router.route("/sokia").post(multerUploads,Page.UploadSokia);
router.route("/").delete(Page.deletePage);
router.route("/:id").get(Page.getOnePage);
router.route("/:id").put(Page.updatePage);


module.exports = router;

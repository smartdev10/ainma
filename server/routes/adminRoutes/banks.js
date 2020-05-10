const express = require("express");
const router = express.Router();
const Bank = require('../../controllers/adminControllers/banks')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./images/banks')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname )
    }
})
const multerUploads = multer({ storage }).single('bank_image');

//admin routes
router.route("/").get(Bank.getBanks);
router.route("/").post(multerUploads,Bank.createBank);
router.route("/").delete(Bank.deleteBank);
router.route("/:id").get(Bank.getOneBank);
router.route("/:id").put(multerUploads,Bank.updateBank);


module.exports = router;

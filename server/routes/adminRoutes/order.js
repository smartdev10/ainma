const express = require("express");
const router = express.Router();
const Order = require('../../controllers/adminControllers/orders')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'../../images')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + '-' + file.originalname )
    }
})
const multerUploads = multer({ storage }).single('money_transfer_image');
//admin routes
router.route("/").get(Order.getOrders);
router.route("/").post(multerUploads,Order.createOrder);
router.route("/").delete(Order.deleteOrder);
router.route("/:id").get(Order.getOneOrder);
router.route("/:id").put(Order.updateOrder);


module.exports = router;

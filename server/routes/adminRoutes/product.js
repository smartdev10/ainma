const express = require("express");
const router = express.Router();
const Product = require('../../controllers/adminControllers/products')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./images/products')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname )
    }
})
const multerUploads = multer({ storage }).single('product_image');

//admin routes
router.route("/").get(Product.getproducts);
router.route("/").post(multerUploads,Product.createProduct);
router.route("/").delete(Product.deleteProduct);
router.route("/:id").get(Product.getOneProduct);
router.route("/:id").put(multerUploads,Product.updateProduct);


module.exports = router;

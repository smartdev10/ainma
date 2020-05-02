const express = require("express");
const router = express.Router();
const Product = require('../../controllers/adminControllers/products')

//admin routes
router.route("/").get(Product.getproducts);
router.route("/").post(Product.createProduct);
router.route("/").delete(Product.deleteProduct);
router.route("/:id").get(Product.getOneProduct);
router.route("/:id").put(Product.updateProduct);


module.exports = router;

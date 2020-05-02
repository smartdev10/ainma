const express = require("express");
const router = express.Router();
const Order = require('../../controllers/adminControllers/orders')

//admin routes
router.route("/").get(Order.getOrders);
router.route("/").post(Order.createOrder);
router.route("/").delete(Order.deleteOrder);
router.route("/:id").get(Order.getOneOrder);
router.route("/:id").put(Order.updateOrder);


module.exports = router;

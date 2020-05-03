const express = require("express");
const router = express.Router();
const Message = require('../../controllers/adminControllers/messages')

//admin routes
router.route("/").get(Message.getOrders);
router.route("/").post(Message.createOrder);
router.route("/").delete(Message.deleteOrder);
router.route("/:id").get(Message.getOneOrder);


module.exports = router;

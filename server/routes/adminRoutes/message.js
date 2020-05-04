const express = require("express");
const router = express.Router();
const Message = require('../../controllers/adminControllers/messages')

//admin routes
router.route("/").get(Message.getMessages);
router.route("/").post(Message.createMessage);
router.route("/").delete(Message.deleteMessage);
router.route("/:id").get(Message.getOneMessage);


module.exports = router;

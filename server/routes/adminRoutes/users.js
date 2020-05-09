const express = require("express");
const router = express.Router();
const usersController = require('../../controllers/adminControllers/users')

//admin routes
router.route("/").get(usersController.getListUsers);
router.route("/").delete(usersController.deleteUser);
router.route("/delete").delete(usersController.deleteAll);
router.route("/:id").get(usersController.getUserProfile);
router.route("/:id").put(usersController.updateUserProfile);
router.route("/:id/orders").get(usersController.getUserOrders);




module.exports = router;

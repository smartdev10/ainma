const express = require("express");
const router = express.Router();
const usersController = require('../../controllers/adminControllers/users')

//admin routes
router.route("/").get(usersController.getListUsers);
router.route("/").delete(usersController.deleteUser);
router.route("/:id").get(usersController.getOneUser);
router.route("/:id/notifications").get(usersController.getNotifications);
router.route("/notifications").delete(usersController.deleteNotif);
router.route("/position").put(usersController.updateUserLocation);
router.route("/profile").put(usersController.updateUserProfile);
router.route("/getdrivers").post(usersController.getListDrivers);




module.exports = router;

const express = require("express");
const router = express.Router();
const usersController = require('../../controllers/adminControllers/users')

//admin routes
router.route("/").get(usersController.getListUsers);
router.route("/").delete(usersController.deleteUser);
router.route("/:id").get(usersController.getOneUser);
router.route("/profile").put(usersController.updateUserProfile);




module.exports = router;

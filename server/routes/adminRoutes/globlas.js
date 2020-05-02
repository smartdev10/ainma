const express = require("express");
const router = express.Router();
const Globals = require('../../controllers/adminControllers/globals')

//admin routes
router.route("/").get(Globals.getGlobals);
router.route("/").post(Globals.createGlobals);
router.route("/").delete(Globals.deleteGlobal);
router.route("/:id").get(Globals.getOneGlobal);
router.route("/:id").put(Globals.updateGlobal);


module.exports = router;

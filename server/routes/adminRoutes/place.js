const express = require("express");
const router = express.Router();
const Place = require('../../controllers/adminControllers/places')

//admin routes
router.route("/").get(Place.getPlaces);
router.route("/").post(Place.createPlace);
router.route("/").delete(Place.deletePlace);
router.route("/:id").get(Place.getOnePlace);
router.route("/:id").put(Place.updatePlace);
router.route("/search/:q").get(Place.searchPlaces);


module.exports = router;

const express = require("express");
const router = express.Router();
const Promo = require('../../controllers/adminControllers/promos')

//admin routes
router.route("/").get(Promo.getPromos);
router.route("/").post(Promo.createPromos);
router.route("/").delete(Promo.deletePromo);
router.route("/validate").post(Promo.validatePromo);
router.route("/:id").get(Promo.getOnePromo);
router.route("/:id").put(Promo.updatePromo);


module.exports = router;

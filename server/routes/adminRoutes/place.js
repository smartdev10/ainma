const express = require("express");
const router = express.Router();
const carcatController = require('../../controllers/adminControllers/CarCategories')
const carComController = require('../../controllers/adminControllers/CarCompanies')

//admin routes
router.route("/companies").get(carComController.getCarCompanies);
router.route("/companies").post(carComController.createCarCompany);
router.route("/companies/:id").get(carComController.getOneCarCompany);
router.route("/companies/:id").put(carComController.updateCarCompany);
router.route("/companies").delete(carComController.deleteCarCompany);

//admin routes
router.route("/categories").get(carcatController.getCarCats);
router.route("/categories").post(carcatController.createCarCat);
router.route("/categories/:id").get(carcatController.getOneCarCat);
router.route("/categories/:id").put(carcatController.updateCarCat);
router.route("/categories").delete(carcatController.deleteCarCat);


module.exports = router;

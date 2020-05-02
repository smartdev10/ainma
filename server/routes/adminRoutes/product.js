const express = require("express");
const router = express.Router();
const documentController = require('../../controllers/adminControllers/documents')

//admin routes
router.route("/").get(documentController.getDocuments);
router.route("/").post(documentController.createDocuments);
router.route("/").delete(documentController.deleteDocuments);
router.route("/:id").get(documentController.getOneDocument);
router.route("/:id").put(documentController.updateDocument);


module.exports = router;

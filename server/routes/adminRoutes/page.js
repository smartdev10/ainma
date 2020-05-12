const express = require("express");
const router = express.Router();
const Page = require('../../controllers/adminControllers/page')

//admin routes
router.route("/").get(Page.getPages);
router.route("/").post(Page.createPage);
router.route("/").delete(Page.deletePage);
router.route("/:id").get(Page.getOnePage);
router.route("/:id").put(Page.updatePage);


module.exports = router;

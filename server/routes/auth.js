const express = require("express");
const UsersAuth = require('../controllers/authUser');
const AdminUsersAuth = require('../controllers/authAdmin');
const { multerUploads } = require('../utils/multerUploader');

const router = express.Router();

// admins
router.post("/admins/signin", AdminUsersAuth.signIn);
router.post("/admins/signup", AdminUsersAuth.signUp);
router.post("/admins/signout", AdminUsersAuth.logout);
router.post("/admins/refreshToken", AdminUsersAuth.refreshToken);

//users
router.post("/users/signin", UsersAuth.signIn);
router.post("/users/signup", UsersAuth.signUp);
router.post("/users/verify", UsersAuth.comfirm);


module.exports = router;

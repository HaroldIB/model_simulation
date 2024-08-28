const express = require("express");
const LoginController = require("../controllers/LoginController");
const router = express.Router();

router.get("/login", LoginController.login);
router.post("/login", LoginController.auth, LoginController.storeAdmin);
router.get("/register", LoginController.register);
router.post("/register", LoginController.storeUser);
router.get("/logout", LoginController.logout);
router.get("/store_admin", LoginController.storeAdmin);

module.exports = router;

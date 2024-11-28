const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/home_student", UserController.homeUser);

module.exports = router;

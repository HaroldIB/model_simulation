const express = require("express");
const AdminController = require("../controllers/AdminController");
const router = express.Router();

router.get("/home_admin", AdminController.homeAdmin);

module.exports = router;

const express = require("express");
const router = express.Router();
const indexController = require("../controllers/pages/index.controller");

/* GET home page. */
router.get("/", indexController.index);

module.exports = router;

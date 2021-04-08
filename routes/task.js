const express = require("express");
const router = express.Router();
const { create, all, findOne } = require("../controllers/task.controller");

router.route("/").post(create);
router.get("/:id", findOne);    

module.exports = router;

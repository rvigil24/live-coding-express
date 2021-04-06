const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("contact", { title: "Any suggestion?" })
});

module.exports = router;
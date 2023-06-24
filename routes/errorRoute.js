// Needed Resources 
const express = require("express");
const errorController = require("../controllers/errorController");
const router = new express.Router()

// Route to trigger an error
router.get("/error", errorController.triggerError);

module.exports = router;
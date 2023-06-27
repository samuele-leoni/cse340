// Needed Resources 
const express = require("express");
const utilities = require("../utilities")
const errorController = require("../controllers/errorController");
const router = new express.Router()

// Route to trigger an error
router.get("/error", utilities.handleErrors(errorController.triggerError));

module.exports = router;
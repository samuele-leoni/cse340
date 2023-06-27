// Needed Resources 
const express = require("express");
const errorController = require("../controllers/errorController");
const router = new express.Router()
const utilities = require("../utilities/")

// Route to trigger an error
router.get("/", utilities.handleErrors(errorController.triggerError))

module.exports = router;
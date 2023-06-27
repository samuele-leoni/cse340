// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route to build inventory by classification view
router.get("/account/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;
// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const { check } = require("express-validator")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the logout attempt
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Route to build the edit account view
router.get("/edit:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildEditAccount));

module.exports = router;
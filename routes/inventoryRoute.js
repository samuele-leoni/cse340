// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildInventoryDetail));

// Route to the inventory management view
router.get("/", utilities.handleErrors(invController.buildInventoryManagement));

// Route to the add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to add a new classification
router.post(
    "/add-classification",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

module.exports = router;
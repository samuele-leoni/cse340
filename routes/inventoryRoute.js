// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

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
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to the add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to add a new inventory
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

module.exports = router;
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
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildInventoryManagement));

// Route to the add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to add a new classification
router.post(
    "/add-classification",
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to the add inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Route to add a new inventory
router.post(
    "/add-inventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to the get inventory JSON
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

// Route to the edit inventory item
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory))

// Route to the update inventory item
router.post(
    "/update",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Route to the delete inventory item
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventory))

// Route to the delete inventory item
router.post(
    "/delete",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
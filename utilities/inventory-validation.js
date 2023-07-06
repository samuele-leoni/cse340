const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .matches("^(\\d|\\w)+$")
            .withMessage("Classification name cannot contain spaces or special characters."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    let thisYear = new Date().getFullYear()
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a make."),
        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a model."),
        body("inv_year")
            .isInt({ min: 1900, max: thisYear })
            .withMessage(`Please provide a year between 1900 and ${thisYear}.`),
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),
        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an image path."),
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path."),
        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),
        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage."),
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add inventory item
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classifications = await utilities.getClassifications(classification_id)
        let thisYear = new Date().getFullYear()
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            classifications,
            thisYear,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to edit inventory item
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classifications = await utilities.getClassifications(classification_id)
        let thisYear = new Date().getFullYear()
        const itemName = `${inv_make} ${inv_model}`
        res.render("./inventory/edit-inventory", {
            errors,
            title: `Edit ${itemName}`,
            nav,
            classifications,
            thisYear,
            inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        })
        return
    }
    next()
}

module.exports = validate

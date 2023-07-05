const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build the inventory detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryById(inv_id)
    const vehicleData = data[0]
    const vehicle = await utilities.buildInventoryDetails(vehicleData)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
        title: vehicleData.inv_year + " " + vehicleData.inv_make + " " + vehicleData.inv_model,
        nav,
        vehicle,
    })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = async function (req, res) {
    const nav = await utilities.getNav()
    const classifications = await utilities.getClassifications()
    res.render("./inventory/management", { title: "Inventory Management", nav, classifications })
}

/* ***************************
 *  Build inventory management view to add a new classification
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("./inventory/add-classification", { title: "Add Classification", nav, errors: null })
}

/* ***************************
 *  Add a new classification
 * ************************** */
invCont.addClassification = async (req, res) => {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const regResult = await invModel.addClassification(classification_name)

    if (regResult) {
        req.flash(
            "notice",
            `New classification ${classification_name} added successfully.`
        )
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, there was an error adding the classification.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        })
    }
}

/* ***************************
 *  Build inventory management view to add a new vehicle
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
    const nav = await utilities.getNav()
    const classifications = await utilities.getClassifications()
    let thisYear = new Date().getFullYear()
    res.render("./inventory/add-inventory", { title: "Add Vehicle", nav, errors: null, classifications, thisYear })
}

/* ***************************
 *  Add a new vehicle
 * ************************** */
invCont.addInventory = async (req, res) => {
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

    const regResult = await invModel.addInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

    if (regResult) {
        req.flash(
            "notice",
            `New Vehicle ${inv_year} ${inv_make} ${inv_model} added successfully.`
        )
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, there was an error adding the vehicle.")
        const classifications = await utilities.getClassifications()
        let thisYear = new Date().getFullYear()
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            errors: null,
            classifications,
            thisYear
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont
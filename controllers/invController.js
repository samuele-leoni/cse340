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
    const { classification_name } = req.body
    
    const regResult = await invModel.addClassification(classification_name)
    
    let nav = await utilities.getNav()
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
    const classifications = await utilities.getClassifications()
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const invData = await invModel.getInventoryById(inv_id)
    const vehicle = invData[0]
    const classifications = await utilities.getClassifications(vehicle.classification_id)
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`
    let thisYear = new Date().getFullYear()
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        thisYear,
        classifications,
        errors: null,
        inv_id: vehicle.inv_id,
        inv_make: vehicle.inv_make,
        inv_model: vehicle.inv_model,
        inv_year: vehicle.inv_year,
        inv_description: vehicle.inv_description,
        inv_image: vehicle.inv_image,
        inv_thumbnail: vehicle.inv_thumbnail,
        inv_price: vehicle.inv_price,
        inv_miles: vehicle.inv_miles,
        inv_color: vehicle.inv_color,
        classification_id: vehicle.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async (req, res) => {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

    const updateResult = await invModel.updateInventoryItem(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the insert failed.")
        const classifications = await utilities.getClassifications(classification_id)
        let thisYear = new Date().getFullYear()
        const itemName = `${inv_make} ${inv_model}`
        res.status(501).render("./inventory/edit-inventory", {
            title: `Edit ${itemName}`,
            nav,
            errors: null,
            classifications,
            thisYear,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const invData = await invModel.getInventoryById(inv_id)
    const vehicle = invData[0]
    const classifications = await utilities.getClassifications(vehicle.classification_id)
    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`
    let thisYear = new Date().getFullYear()
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        thisYear,
        classifications,
        errors: null,
        inv_id: vehicle.inv_id,
        inv_make: vehicle.inv_make,
        inv_model: vehicle.inv_model,
        inv_year: vehicle.inv_year,
        inv_price: vehicle.inv_price,
    })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async (req, res) => {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
        const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
        req.flash("notice", `The ${itemName} was successfully deleted.`)
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        const itemName = `${inv_make} ${inv_model}`
        res.status(501).render("./inventory/delete-confirm", {
            title: `Delete ${itemName}`,
            nav,
            errors: null,
            classifications,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price
        })
    }
}

module.exports = invCont
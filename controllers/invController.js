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
    res.render("./inventory/management", { title: "Inventory Management", nav })
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
    console.log("addClassification")
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

module.exports = invCont
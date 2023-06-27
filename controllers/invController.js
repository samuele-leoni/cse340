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

module.exports = invCont
const errorController = {}
const utilities = require("../utilities")

errorController.triggerError = async function (req, res) {
    utilities.handleErrors(new Error("Footer Error"))
}

module.exports = errorController
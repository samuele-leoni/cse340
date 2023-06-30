const errorController = {}

errorController.triggerError = async function (req, res, next) {
    try {
        throw new Error("Footer Error Triggered");
    } catch (error) {
        next(error);
    }
}

module.exports = errorController
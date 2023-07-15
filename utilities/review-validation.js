const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
    return [
        body("review_title")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a title."),
        body("review_text")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a review."),
        body("review_rating")
            .isInt({ min: 0, max: 10 })
            .withMessage("Please provide a valid rating."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add review
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
    const { review_title, review_text, review_rating, inv_id, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./review/add-review", {
            errors,
            title: "Add Review",
            nav,
            review_title, review_text, review_rating, inv_id, account_id
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to edit review
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { review_id, review_title, review_text, review_rating } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./review/edit-review", {
            errors,
            title: "Edit Review",
            nav,
            review_id, review_title, review_text, review_rating
        })
        return
    }
    next()
}

module.exports = validate

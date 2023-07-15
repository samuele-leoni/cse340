const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewController = {}

/* ******************************
 * Build create review view
 * ******************************/
reviewController.buildCreateReview = async function (req, res) {
    const nav = await utilities.getNav()
    const { account_id, inv_id } = req.params
    res.render("./review/add-review", { title: "Add Review", nav, errors: null, account_id, inv_id })
}

/* ******************************
 * Create a review
 * ******************************/
reviewController.createReview = async (req, res) => {
    let nav = await utilities.getNav()
    const { review_title, review_text, review_rating, account_id, inv_id } = req.body
    const review_creation = new Date()

    const result = await reviewModel.createReview(account_id, inv_id, review_title, review_rating, review_text, review_creation)

    if (result) {
        req.flash(
            "notice",
            "Review published successfully."
        )
        const review = await utilities.buildReviewDetails(result)

        res.render("./review/review-detail", { title: "Review Detail", nav, errors: null, review })
    } else {
        req.flash("notice", "Sorry, there was an error publishing your review.")
        res.status(501).render("./review/add-review", {
            title: "Add Review",
            nav,
            errors: null,
        })
    }
}

/* ******************************
 * Build delete review view
 * ******************************/
reviewController.buildDeleteReview = async function (req, res) {
    const nav = await utilities.getNav()
    const { review_id } = req.params
    const reviewData = await reviewModel.getReviewById(review_id)
    const review = await utilities.buildReviewDetails(reviewData, false)

    res.render("./review/delete-review", { title: "Delete Review", nav, errors: null, review_id, review })
}

/* ******************************
 * Delete a review
 * ******************************/
reviewController.deleteReview = async (req, res) => {
    let nav = await utilities.getNav()
    const { review_id, account_id } = req.body

    const deleteResult = await reviewModel.deleteReview(review_id)

    if (deleteResult) {
        req.flash("notice", `The review was successfully deleted.`)
        res.redirect("/review/myreviews/" + account_id)
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("./review/delete-review", {
            title: `Delete Review`,
            nav,
            errors: null,
            review_id, account_id
        })
    }
}

/* ******************************
 * Build edit review view
 * ******************************/
reviewController.buildEditReview = async function (req, res) {
    const nav = await utilities.getNav()
    const { review_id } = req.params
    const review = await reviewModel.getReviewById(review_id)
    res.render("./review/edit-review", {
        title: "Edit Review",
        nav,
        errors: null,
        review_id: review.review_id,
        review_title: review.review_title,
        review_text: review.review_text,
        review_rating: review.review_rating
    })
}

/* ******************************
 * Edit a review
 * ******************************/
reviewController.editReview = async (req, res) => {
    let nav = await utilities.getNav()
    const { review_id, review_title, review_text, review_rating } = req.body
    const review_modified = new Date()

    const result = await reviewModel.updateReview(review_id, review_title, review_rating, review_text, review_modified)

    if (result) {
        const reviews = await utilities.getReviews(result.account_id)
        req.flash(
            "notice",
            "Review edited successfully."
        )
        let nav = await utilities.getNav()
        res.status(201).render(`./review/myreviews`, {
            title: "My Reviews",
            nav,
            account_id: result.account_id,
            reviews
        })
    } else {
        req.flash("notice", "Sorry, there was an error editing your review.")
        res.status(501).render("./review/edit-review", {
            title: "Edit Review",
            nav,
            errors: null,
            review_id
        })
    }
}

/* ******************************
 * Build my reviews view
 * ******************************/
reviewController.buildMyReviews = async function (req, res) {
    const nav = await utilities.getNav()
    const { account_id } = req.params
    const reviews = await utilities.getReviews(account_id)
    res.render("./review/myreviews", { title: "My Reviews", nav, errors: null, reviews })
}

/* ******************************
 * Build review details view
 * ******************************/
reviewController.buildReviewDetail = async function (req, res) {
    const nav = await utilities.getNav()
    const { review_id } = req.params
    const reviewData = await reviewModel.getReviewById(review_id)
    const review = await utilities.buildReviewDetails(reviewData)

    res.render("review/review-detail", { title: "Review Detail", nav, errors: null, review })
}

module.exports = reviewController
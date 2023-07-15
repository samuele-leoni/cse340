// Needed Resources 
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const reviewValidate = require("../utilities/review-validation")
const utilities = require("../utilities/")

// Route to build the review management view
router.get("/myreviews/:account_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildMyReviews))

//Route to build the review edit view
router.get("/edit/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildEditReview))

// Route to update a review
router.post(
    "/edit",
    utilities.checkLogin,
    reviewValidate.reviewRules(),
    reviewValidate.checkUpdateData,
    utilities.handleErrors(reviewController.editReview)
)

// Route to build the review delete view
router.get("/delete/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildDeleteReview))

// Route to delete a review
router.post("/delete", utilities.checkLogin, utilities.handleErrors(reviewController.deleteReview))

// Route to create a review
router.get("/add/:account_id/:inv_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildCreateReview))

// Create a review
router.post(
    "/add",
    utilities.checkLogin,
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.createReview)
)

// Route to open the review detail view
router.get("/:review_id", utilities.handleErrors(reviewController.buildReviewDetail))

module.exports = router;
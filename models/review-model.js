const pool = require("../database/")

/* *****************************
 * Return review data using review_id
 * ***************************** */
async function getReviewById(review_id) {
    try {
        const result = await pool.query(
            'SELECT * FROM review WHERE review_id = $1',
            [review_id])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* *****************************
 * Return review data using account_id
 * ***************************** */
async function getReviewsByAccountId(account_id) {
    try {
        const result = await pool.query(
            'SELECT * FROM review WHERE account_id = $1',
            [account_id])
        return result.rows
    } catch (error) {
        return error.message
    }
}

/* *****************************
 * Return review data using inv_id
 * ***************************** */
async function getReviewsByInvId(inv_id) {
    try {
        const result = await pool.query(
            'SELECT * FROM review WHERE inv_id = $1',
            [inv_id])
        return result.rows
    } catch (error) {
        return error.message
    }
}

/* *****************************
 * Create a new review
 * ***************************** */
async function createReview(account_id, inv_id, review_title, review_rating, review_text, review_creation) {
    try {
        const result = await pool.query(
            'INSERT INTO review (account_id, inv_id, review_title, review_rating, review_text, review_creation) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [account_id, inv_id, review_title, review_rating, review_text, review_creation])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* *****************************
 * Update review data
 * ***************************** */
async function updateReview(review_id, review_title, review_rating, review_text, review_modified) {
    try {
        const result = await pool.query(
            'UPDATE review SET review_rating = $1, review_title = $2, review_text = $3, review_modified = $4 WHERE review_id = $5 RETURNING *',
            [review_rating, review_title, review_text, review_modified, review_id])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* *****************************
 * Delete review data
 * ***************************** */
async function deleteReview(review_id) {
    try {
        const result = await pool.query(
            'DELETE FROM review WHERE review_id = $1 RETURNING *',
            [review_id])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}


module.exports = { getReviewById, getReviewsByAccountId, getReviewsByInvId, createReview, updateReview, deleteReview }
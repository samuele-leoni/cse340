const { cookie } = require("express-validator")
const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildInventoryDetails = async function (data) {
    let formatter = new Intl.NumberFormat('en-US')
    let details
    if (data) {
        details = `<img id="details-img" src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}" >
        <div id="details-info">
            <h2>${data.inv_make} ${data.inv_model} Details</h2>
            <ul class="details-list">
                <li><strong>Price:</strong> $${formatter.format(data.inv_price)}</li>
                <li><strong>Description:</strong> ${data.inv_description}</li>
                <li><strong>Color:</strong> ${data.inv_color}</li>
                <li><strong>Miles:</strong> ${formatter.format(data.inv_miles)}</li>
            </ul>
        </div>`
    } else {
        details += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return details
}

/* **************************************
 * Build the review detail view HTML
 * ************************************ */
Util.buildReviewDetails = async function (data, showVehicle = true) {
    const vehicleData = await invModel.getInventoryById(data.inv_id)
    const vehicle = vehicleData[0]
    let details
    if (data) {
        details = `<h2>${vehicle.inv_make} - ${vehicle.inv_model}</h2>
        <div id="review-details">
        `
        if (showVehicle) {
            details += `<a class="link" href="/inv/detail/${data.inv_id}" title="Go back to vehicle details">Go back to the vehicle</a>`
        }
        details += `<h2>${data.review_title}</h2>
            <ul class="details-list">
                <li><strong>Rating:</strong> ${data.review_rating}</li>
                <li><strong>Review:</strong> ${data.review_text}</li>
            </ul>`
        if (data.review_modified) {
            details += `<p>Edited on ${new Date(data.review_modified).toLocaleDateString()}</p>`
        }
        details += `</div>`
    } else {
        details += '<p class="notice">Sorry, no matching reviews could be found.</p>'
    }
    return details
}

/* **************************************
* Build the classification options HTML
* ************************************ */
Util.getClassifications = async function (selected = -1) {
    let data = await invModel.getClassifications()
    let options = ''
    data.rows.forEach((row) => {
        options += `<option value="${row.classification_id}"`
        if (selected == row.classification_id) {
            options += ' selected'
        }
        options += `>${row.classification_name}</option>`
    })
    return options
}

/* **************************************
* Build the review list HTML
* ************************************ */
Util.getReviews = async function (account_id) {
    let data = await reviewModel.getReviewsByAccountId(account_id)
    if (data.length > 0) {
        let list = '<ul class="details-list">'
        data.forEach((row) => {
            list += '<li class="details-row">'
            list += `<p>${row.review_title}</p>`
            list += `<a class="link" href="/review/${row.review_id}" title="View Review">View</a>`
            list += `<a class="link" href="/review/edit/${row.review_id}" title="Edit Review">Edit</a>`
            list += `<a class="link" href="/review/delete/${row.review_id}" title="Delete Review">Delete</a>`
            list += '</li>'
        })
        list += '</ul>'
        return list
    } else {
        return '<p>There are no reviews for this account.</p>'
    }
}

/* **************************************
* Build the review list for a specific vehicle HTML
* ************************************ */
Util.getInvReviews = async function (inv_id, account_id) {
    let data = await reviewModel.getReviewsByInvId(inv_id)
    if (data.length > 0) {
        let average = 0
        let div = ''
        let list = '<ul class="details-list">'
        data.forEach((row) => {
            list += '<li class="details-row">'
            list += `<p><strong>${row.review_title}</strong></p>`
            list += '<p><strong>|</strong></p>'
            list += `<p>Rating: ${row.review_rating}</p>`
            list += '<p><strong>|</strong></p>'
            list += `<a class="link" href="/review/${row.review_id}" title="View Review">View Detail</a>`
            list += '</li>'
            average += row.review_rating
        })
        list += '</ul>'

        average = average / data.length
        div += `<p><strong>Average Rating:</strong> ${average.toFixed(1)}/10</p>`

        div += list
        return div
    }
    else {
        return '<p>There are no reviews for this vehicle.</p>'
    }
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 * Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
    if (res.locals.loggedin && (res.locals.accountData.account_type == "Admin" || res.locals.accountData.account_type == "Employee")) {
        next()
    } else {
        req.flash("notice", "You do not have permission to view this page.")
        return res.redirect("/account/login")
    }
}

module.exports = Util
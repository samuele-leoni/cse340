const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

async function buildEditAccount(req, res) {
  let nav = await utilities.getNav()
  let accountData = await accountModel.getAccountById(req.params.account_id)
  console.log(accountData)
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    const accountName = updateResult.account_firstname
    delete updateResult.account_password
    const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    req.flash("notice", `${accountName}'s account was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./account/edit-account", {
      title: `Edit Account`,
      nav,
      errors: null,
      account_id, account_firstname, account_lastname, account_email
    })
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id
    })
  }

  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

  if (updateResult) {
    const accountName = updateResult.account_firstname
    req.flash("notice", `${accountName}'s password was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./account/edit-account", {
      title: `Edit Account`,
      nav,
      errors: null,
      account_id
    })
  }
}

/* ****************************************
 * Build delete view
 * ************************************ */
async function buildDeleteAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id } = req.params
  res.render("account/delete-account", {
    title: "Delete Account",
    nav,
    errors: null,
    account_id
  })
}

/* ****************************************
 *  Process delete request
 * ************************************ */
async function deleteAccount(req, res) {
  let nav = await utilities.getNav()

  const { account_id, account_password } = req.body

  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("notice", "Something went wrong. Please try again.")
    res.status(400).render("./account/delete-account", {
      title: "Delete Account",
      nav,
      errors: null,
      account_id,
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      const deleteResult = await accountModel.deleteAccount(account_id)
      if (deleteResult) {
        req.flash("notice", "Your account was successfully deleted.")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("./account/delete-account", {
          title: `Delete Account`,
          nav,
          errors: null,
          account_id
        })
      }
    } else {
      req.flash("notice", "Wrong password. Please try again.")
      res.status(501).render("./account/delete-account", {
        title: `Delete Account`,
        nav,
        errors: null,
        account_id
      })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, buildEditAccount, updateAccount, updatePassword, buildDeleteAccount, deleteAccount }
const express = require('express');
const router = express.Router({ mergeParams: true });

const passport = require('passport');
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


// Register form
router.get('/register', userController.renderRegister);

// Handle register
router.post('/register', savedRedirectUrl, userController.register);


// Login form
router.get('/login', userController.renderLogin);

// Handle login
router.post(
    '/login', savedRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    userController.login
);

// Logout
router.get('/logout', userController.logout);

module.exports = router;

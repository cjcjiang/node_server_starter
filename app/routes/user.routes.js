/**
 * This route will handle actions related to users' accounts.
 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller.js');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('../config/passport.config.js');

router.get('/', passportConfig.isAuthenticated, controller.show_user_profile);
router.get('/login', controller.show_login_page);
router.post('/login', controller.post_login);
router.get('/logout', controller.logout);
router.get('/signup', controller.get_signup);
router.post('/signup', controller.post_signup);
router.post('/authorize_producer', passportConfig.isAuthenticated, controller.authorize_producer);

module.exports = router;


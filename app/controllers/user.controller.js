/**
 * This controller will realize functions related to users' accounts.
 */
const passport = require('passport');

const user_model = require('../models/users.model.js');

/**
 * GET /
 * Show user profile.
 */
exports.show_user_profile = (req, res) => {
    res.json({
        msg:'user has logged in',
        user_profile:req.user
    });
};

/**
 * GET /login
 * Show login page.
 */
exports.show_login_page = (req, res) => {
    if (req.user) {
        // User has already logged in
        // Redirect to the user page
        res.redirect('/user');
    } else {
        // User has not logged in
        // Show the login page
        res.render('user/login_page.ejs');
    }
};

/**
 * POST /login
 * Log in using email and password.
 */
exports.post_login = (req, res, next) => {
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('password', 'Password cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    // const errors = req.validationErrors();

    // if (errors) {
    //     req.flash('errors', errors);
    //     return res.redirect('/login');
    // }

    passport.authenticate('local', (err, user, info) => {
        // console.log("Server is in authenticate method.");
        // console.log(info);
        if (err) { return next(err); }
        if (!user) {
            // req.flash('errors', info);
            // console.log(info);
            return res.json({msg: 'authentication fail, incorrect email or password'})
        }
        // console.log(user);
        req.logIn(user, (err) => {
            // console.log(err);
            if (err) { return next(err); }
            // console.log("Server is in login method.");
            // req.flash('success', { msg: 'Success! You are logged in.' });
            return res.json({ msg: 'Success! You have logged in.' });
        });
    })(req, res, next);
    // res.json({ msg: 'Success! You are logged in.' });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    if (!req.user) {
        // User has not logged in
        // Redirect to the login page
        res.redirect('/user/login');
    } else {
        // User has already logged in
        req.logout();
        res.json({ msg: 'Success! You have logged out.' });
    }
};

/**
 * GET /signup
 * Show signup page.
 */
exports.get_signup = (req, res) => {
    if (req.user) {
        // User has already logged in
        // Redirect to the user profile page
        res.redirect('/user');
    } else {
        // User has not logged in
        // Show the signup page
        res.render('user/signup.ejs');
    }
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.post_signup = (req, res, next) => {
    // TODO: Error handling here
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('password', 'Password must be at least 4 characters long').len(4);
    // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    // req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    // const errors = req.validationErrors();

    // if (errors) {
    //     req.flash('errors', errors);
    //     return res.redirect('/signup');
    // }

    // const user = new user_model.user_model({
    //     email: req.body.email,
    //     password: req.body.password
    // });
    //
    // user_model.user_model.findOne({ email: req.body.email }, (err, existingUser) => {
    //     if (err) { return next(err); }
    //     if (existingUser) {
    //         // req.flash('errors', { msg: 'Account with that email address already exists.' });
    //         console.log("existingUser in post signup.");
    //         return res.json({msg: 'existing user'});
    //     }
    //     user.save((err) => {
    //         if (err) { return next(err); }
    //         // TODO: Use library passport
    //         // req.logIn(user, (err) => {
    //         //     if (err) {
    //         //         return next(err);
    //         //     }
    //         //     res.redirect('/');
    //         // });
    //         res.json({msg: 'signup success'});
    //     });
    // });

    user_model.user_model_signup(req, res, next, req.body.email, req.body.password);

};

/**
 * POST /authorize_producer
 * Authorize a new producer.
 */
exports.authorize_producer = (req, res) => {
    user_model.authorize_producer(req, res);
};

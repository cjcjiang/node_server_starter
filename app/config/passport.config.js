const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const user_model = require('../models/users.model.js');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// passport.deserializeUser((id, done) => {
//     user_model.findById(id, (err, user) => {
//         done(err, user);
//     });
// });

passport.deserializeUser((id, done) => {user_model.user_model_passport_deserialize(id, done)});

/**
 * Sign in using Email and Password.
 */
// passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//     user_model.findOne({ email: email.toLowerCase() }, (err, user) => {
//         if (err) { return done(err); }
//         if (!user) {
//             return done(null, false, { msg: `Email ${email} not found.` });
//         }
//         user.comparePassword(password, (isMatch) => {
//             if (isMatch) {
//                 return done(null, user, { msg: 'Auth success.' });
//             }
//             return done(null, false, { msg: 'Invalid email or password.' });
//         });
//     });
// }));

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    user_model.user_model_passport_login_check(email, password, done)
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({msg:'no permisson, login needed'});
};

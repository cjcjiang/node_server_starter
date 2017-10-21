const mongoose = require('./database.js');
const blockchain_adapter = require('../adapter/bigchaindb.adapter.js');

// const user_schema = new mongoose.Schema({
//     email: { type: String, unique: true },
//     password: String,
//     passwordResetToken: String,
//     passwordResetExpires: Date,
//
//     facebook: String,
//     twitter: String,
//     google: String,
//     github: String,
//     instagram: String,
//     linkedin: String,
//     steam: String,
//     tokens: Array,
//
//     profile: {
//         name: String,
//         gender: String,
//         location: String,
//         website: String,
//         picture: String
//     }
// }, { timestamps: true });

const user_schema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    private_key: String,
    public_key: String,
    producer: String
}, { timestamps: true });

/**
 * Helper method for validating user's password.
 */
user_schema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
    callback(candidatePassword===this.password);
};

const user_model = mongoose.model('User', user_schema);

const user_model_passport_deserialize = (id, done) => {
    user_model.findById(id, (err, user) => {
        done(err, user);
    });
};

const user_model_passport_login_check = (email, password, done) => {
    user_model.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
        }
        user.comparePassword(password, (isMatch) => {
            if (isMatch) {
                return done(null, user, { msg: 'Auth success.' });
            }
            return done(null, false, { msg: 'Invalid email or password.' });
        });
    });
};

const user_model_signup = (req, res, next, email, password) => {
    const key_pair = blockchain_adapter.get_key_pair();
    const user = new user_model({
        email: email,
        password: password,
        private_key: key_pair.privateKey,
        public_key: key_pair.publicKey,
        producer: 'no'
    });
    user_model.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            // req.flash('errors', { msg: 'Account with that email address already exists.' });
            console.log("existingUser in post signup.");
            return res.json({msg: 'existing user'});
        }
        user.save((err) => {
            if (err) { return next(err); }
            // TODO: Use library passport
            // req.logIn(user, (err) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.redirect('/');
            // });
            res.json({msg: 'signup success'});
        });
    });
};

const authorize_producer = (req, res) => {
    const user_email = req.user.email;
    const email = req.body.email;
    if(user_email==='admin'){
        user_model.findOneAndUpdate({email:email}, {producer:'yes'},() => {
            res.json({msg:'Authorization success.'})
        });
    }else{
        res.json({msg:'You are not allowed to authorize producer.'})
    }
};

module.exports = {
    user_model,
    user_model_passport_deserialize,
    user_model_passport_login_check,
    user_model_signup,
    authorize_producer
};
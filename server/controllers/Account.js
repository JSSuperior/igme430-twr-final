const models = require('../models');
const Account = models.Account;

// render login page
const loginPage = (req, res) => {
    return res.render('login');
};

// kill session and redirect to login
const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

// login user
const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/maker' });
    });
};

// sign up user, create account and redirect to main maker page
const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/maker' });
    } catch (err) {
        console.log(err);
        if (err.code == 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: 'An error occured!' });
    }
};

// 
const changePassword = async (req, res) => {
    const passOld = `${req.body.passOld}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    // check for all fields
    if (!pass || !pass2 || !passOld) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // make sure new passwords are the same
    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    // make sure new passwords is different
    if (passOld === pass) {
        return res.status(400).json({ error: 'Old password and new password cannot be the same' });
    }

    // hash new password and set it
    try {
        const hash = await Account.generateHash(pass);
        await Account.findOneAndUpdate(
            { _id: req.session.account._id },
            {
                $set: {
                    password: hash,
                }
            }
        );

        return res.status(200).json({ message: 'Password successfully updated!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured updating password!' });
    }
};

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    changePassword,
};
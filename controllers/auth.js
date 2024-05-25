const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user.js')

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})


router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            throw new Error('Username is already taken please Try again');
        }
        if (req.body.password !== req.body.confirmPassword) {
            throw new Error('Passwords dont Match.');

        }
        const hasUpperCase = /[A-Z]/.test(req.body.password);
        if (!hasUpperCase) {
            throw new Error('Password must contain at least one uppercase letter.')
        }
        if (req.body.password.length < 8) {
            throw new Error('Password must contain at least 8 characters')
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        req.body.password = hashedPassword

        if (req.body.shareYourTravel === 'on') {
            req.body.shareYourTravel = true
        } else {
            req.body.shareYourTravel = false
        }

        await User.create(req.body)
        res.redirect('/auth/sign-in')
    } catch (error) {
        res.render('auth/sign-up.ejs', {
            errorMessage: error.message,
        });
    }
})

router.post('/sign-in', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
            throw new Error('Login failed please try again')
        }

        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password,
        );

        if (!validPassword) {
            throw new Error('Login failed please try again')
        }
        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id,

        }
        res.redirect('/')
        
    } catch (error) {
        res.render('auth/sign-in.ejs', {
            errorMessage: error.message,
        });
    }
})

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})


module.exports = router;
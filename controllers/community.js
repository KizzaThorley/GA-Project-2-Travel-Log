const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

router.get('/', async(req, res) => {

try {
    const allUsers = await User.find()
    console.log(allUsers);

    res.render('community/community.ejs', {
 allUsers: allUsers
    })
} catch (error) {
    res.render('error/error.ejs', {
        errorMessage: error.message,
    });
}


router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const username =user.username
const destinations = user.destination
        res.render('community/users-log.ejs', {
            destinations: destinations,
            username: username,
        })

    } catch (error) {
        res.render('error/error.ejs', {
            errorMessage: error.message,
        });
    }
})

})

module.exports = router;
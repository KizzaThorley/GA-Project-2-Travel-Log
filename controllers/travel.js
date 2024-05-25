const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

router.get('/:userId', async (req, res) => {
    if (!req.session.user || req.session.user._id !== req.params.userId) {
        res.redirect('/')
    } else {
        try {
            if (!req.session.user || req.session.user._id !== req.params.userId) {
                res.redirect('/')
            }
            const currentUser = await User.findById(req.params.userId)

            res.render('./travel/users-log.ejs', {
                user: currentUser,
                destinations: currentUser.destination,
            })
        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }
    }
})

router.get('/:userId/add', async (req, res) => {
    if (!req.session.user || req.session.user._id !== req.params.userId) {
        res.redirect('/')
    } else {
        try {
            const currentUser = await User.findById(req.session.user._id)
            let destinations = currentUser.destination
            res.render('travel/add.ejs', {
                user: currentUser,
                destinations: destinations,
            })
        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }
    }
})

router.get('/:userId/edit/:editId', async (req, res) => {
if (req.session.user) {
   let locationId = req.params.editId
   const currentUser = await User.findById(req.session.user._id)
   const destination = currentUser.destination.id(locationId)
console.log(destination);
    res.render('travel/edit.ejs', {
        destination: destination,
        locationId: locationId,

    })
}
res.redirect('/auth/sign-in')
})



router.post('/:userId/add', async (req, res) => {
    if (req.session.user) {
        try {
            const currentUser = await User.findById(req.session.user._id)


            if (req.body.hasBeen === 'on') {
                req.body.hasBeen = true
            } else {
                req.body.hasBeen = false
            }
            currentUser.destination.push(req.body)
            await currentUser.save()

            res.redirect(`/travel/${req.session.user._id}`)

        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }
    } else {
        res.redirect('/auth/sign-in')
    }

})

module.exports = router;
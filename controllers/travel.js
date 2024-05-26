const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

router.get('/', async (req, res) => {
    if (req.session.user) {
        try {
            const currentUser = await User.findById(req.session.user._id)

            res.render('./travel/users-log.ejs', {
                user: currentUser,
                destinations: currentUser.destination,
            })
        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }
    } else {
        res.redirect('/auth/sign-in')
    }
})

router.get('/add', async (req, res) => {
    if (req.session.user) {
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
    } else {
        res.redirect('/auth/sign-in')
    }
})

router.get('/edit/:locaId', async (req, res) => {
    if (req.session.user) {
        try {
            const locationId = req.params.locaId
            const currentUser = await User.findById(req.session.user._id)
            const destination = currentUser.destination.id(locationId)

            res.render('travel/edit.ejs', {
                destination: destination,
                locationId: locationId,

            })
        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }
    } else {
        res.redirect('/auth/sign-in')
    }
})

router.delete('/:locaId/del', async (req, res) => {
    if (req.session.user) {
        try {
            const currentUser = await User.findById(req.session.user._id)
            const destination = currentUser.destination.id(req.params.locaId)
            destination.deleteOne()
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

router.put('/edit/:locaId', async (req, res) => {
    if (req.session.user) {

        try {
            const locationId = req.params.locaId
            const currentUser = await User.findById(req.session.user._id)
            const destination = currentUser.destination.id(locationId)
            destination.country = req.body.country
            destination.place = req.body.place
            if (req.body.hasBeen === 'on') {
                destination.hasBeen = true
            } else {
                destination.hasBeen = false
            }
            destination.review = req.body.review
            if (/^[0-9]*$/.test(req.body.rating) || !req.body.rating) {
                destination.rating = req.body.rating
            } else {
                throw new Error('the rating needs to be a number')
            }

            //! mongoose documention for some reason doesnt show as a function when implemented
            // destination.findOneAndUpdate(locationId, req.body)
            // currentUser.findOneAndUpdate({_id: locationId}, req.body, { new: true})
            await currentUser.save()
            res.redirect(`/travel/${req.session.user._id}/edit/${locationId}`)

        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }

    } else {
        res.redirect('/auth/sign-in')
    }
})


router.post('/add', async (req, res) => {
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

router.put('/shareyourtravel', async (req, res) => {
if (req.session.user) {
    try {
     const currentUser = await User.findById(req.session.user._id)
     if (req.body.shareYourTravel === 'on') {
        currentUser.shareYourTravel = true
    } else {
        currentUser.shareYourTravel = false
    }
currentUser.save()
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
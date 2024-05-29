const express = require('express');
const router = express.Router();

const User = require('../models/user.js')
const Message = require('../models/message.js')

router.get('/', async (req, res) => {

    try {
        const allUsers = await User.find()


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
            const username = user.username
            const userId = user._id
            const destinations = user.destination
            res.render('community/users-log.ejs', {
                destinations: destinations,
                username: username,
                userId: userId,
            })

        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }
    })
})

router.get('/:userId/message', async (req, res) => {
    if (req.session.user) {
        try {
            const messageUser = await User.findById(req.params.userId)
            const messageUsername = messageUser.username
            const messageUserId = req.params.userId
            const messages = await Message.find()
            

            res.render('community/message.ejs', {
                username: messageUsername,
                messages: messages,
                messageUserId: messageUserId,
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

router.post('/:userId/message', async (req, res) => {
if (req.session.user) {
    try {
       const messageTargetId = req.params.userId
    await Message.create(req.body)
    
    res.redirect(`/community/${messageTargetId}`)
        
    } catch (error) {
        res.render('error/error.ejs', {
            errorMessage: error.message,
        });
    }
} else {
    res.redirect('/auth/sign-in')
}

});

module.exports = router;
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
            const sessionUser = await User.findById(req.session.user._id)
            const sessionUsername = sessionUser.username

            const messageUser = await User.findById(req.params.userId)
            const messageUsername = messageUser.username
            const messageUserId = req.params.userId
            const messages = await Message.find()

            // let filteredMessages = []
            // messages.forEach(message => {
            //     if (message.target === messageUserId && message.username === sessionUsername) {
            //         filteredMessages.push(message)
            //     }
            // })

            let seenUsernames = []
            let seentargetUsernames = []
            let currentUsersMessages = []
            messages.forEach(message => {
                if (message.target === req.session.user._id ||
                    message.sessionUserId === req.session.user._id) {
                    if (seenUsernames.includes(message.username) ||
                        seentargetUsernames.includes(message.targetUsername)) {
                        return
                    } else {
                        seentargetUsernames.push(message.targetUsername)
                        seenUsernames.push(message.username)
                        currentUsersMessages.push(message)
                    }
                }
            })



            res.render('community/message.ejs', {
                username: messageUsername,
                messages: currentUsersMessages,
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

            res.redirect(`/community/${messageTargetId}/message/${req.session.user._id}`)

        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }
    } else {
        res.redirect('/auth/sign-in')
    }

});

router.delete('/:userId/message/:messageId', async (req, res) => {
    if (req.session.user) {
        try {
            const messageTargetId = req.params.userId
            await Message.findByIdAndDelete(req.params.messageId)

            res.redirect(`/community/${messageTargetId}/message/${req.session.user._id}`)
        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }

    } else {
        res.redirect('/auth/sign-in')
    }
})

router.get('/:userId/message/:sessionId', async (req, res) => {
    if (req.session.user) {
        try {

            const sessionUser = await User.findById(req.session.user._id)
            const sessionUsername = sessionUser.username

            const messageUser = await User.findById(req.params.userId)
            const messageUsername = messageUser.username
            const messageUserId = req.params.userId
            const messages = await Message.find()

            let sentMessages = []
            messages.forEach(message => {
                if (message.target === messageUserId && message.sessionUserId === req.session.user._id)
                    sentMessages.push(message)
            })

            let recievedMessages = []
            messages.forEach(message => {
                if (message.target === req.session.user._id && message.sessionUserId === messageUserId)
                    recievedMessages.push(message)
            })

            res.render('community/conversation.ejs', {
                messageUserId: messageUserId,
                username: messageUsername,
                sentMessages: sentMessages,
                recievedMessages: recievedMessages,
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

module.exports = router;
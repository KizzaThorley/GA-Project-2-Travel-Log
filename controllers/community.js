const express = require('express');
const router = express.Router();

const User = require('../models/user.js')
const Conversation = require('../models/conversation.js')

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




router.get('/:userId/message/:sessionId', async (req, res) => {
    if (req.session.user) {
        try {
            const conversations = await Conversation.find()

            const targetId = req.params.userId

            let usersConvos = []
            conversations.forEach(convo => {
                if (convo.userIdOne.toString() === req.session.user._id && convo.userIdTwo.toString() === targetId ||
                    convo.userIdTwo.toString() === req.session.user._id && convo.userIdOne.toString() === targetId
                ) {
                    usersConvos.push(convo)
                }
            });
            if (usersConvos.length === 0) {
                req.body.userIdOne = req.params.userId
                req.body.userIdTwo = req.session.user._id
                const newConvo = await Conversation.create(req.body)

                res.redirect(`/community/conversation/${newConvo._id}`)
            } else {
                res.redirect(`/community/conversation/${usersConvos[0]._id}`)

            }
        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }

    } else {
        res.redirect('/auth/sign-in')
    }
})


router.get('/:userId/message', async (req, res) => {
    if (req.session.user) {
        try {

            const conversations = await Conversation.find().populate('userIdOne', 'username').populate('userIdTwo', 'username')

            let usersConvos = []
            conversations.forEach(convo => {
                if (convo.userIdOne._id.toString() === req.session.user._id ||
                    convo.userIdTwo._id.toString() === req.session.user._id) {
                    usersConvos.push(convo)
                }
            });


            res.render('community/message.ejs', {
                conversations: usersConvos,
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

router.get('/conversation/:convoId', async (req, res) => {
    if (req.session.user) {
        try {
            const currentConvo = await Conversation.findById(req.params.convoId).populate('messages.sender').populate('userIdOne', 'username').populate('userIdTwo', 'username')
            const messages = currentConvo.messages

            let targetUsername = null
            if (currentConvo.userIdOne.username === req.session.user.username) {
                targetUsername = currentConvo.userIdTwo.username
            } else {
                targetUsername = currentConvo.userIdOne.username
            }


            res.render('community/conversation.ejs', {
                targetUsername: targetUsername,
                convoId: req.params.convoId,
                messages: messages,
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

router.post('/conversation/:convoId/message', async (req, res) => {
    if (req.session.user) {
        try {
            const currentConvo = await Conversation.findById(req.params.convoId)

            if (req.session.user._id === currentConvo.userIdOne.toString()) {
                req.body.sender = req.session.user._id
                req.body.reciever = currentConvo.userIdTwo.toString()
            } else {
                req.body.sender = req.session.user._id
                req.body.reciever = currentConvo.userIdOne.toString()
            }
            currentConvo.messages.push(req.body)

            await currentConvo.save()

            res.redirect(`/community/conversation/${req.params.convoId}`)

        } catch (error) {
            res.render('error/error.ejs', {
                errorMessage: error.message,
            });
        }

    } else {
        res.redirect('/auth/sign-in')
    }

})

router.delete('/conversation/:convoId/message/:messageId', async (req, res) => {
    if (req.session.user) {
        try {
            const currentConvo = await Conversation.findById(req.params.convoId)
            const messageId = req.params.messageId
            const message = currentConvo.messages.id(messageId)
             message.deleteOne()
             await currentConvo.save()
            res.redirect(`/community/conversation/${req.params.convoId}`)
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
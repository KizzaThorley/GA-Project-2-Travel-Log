const mongoose = require('mongoose')

// const User = require('./models/user.js')

const MessageSchema = new mongoose.Schema({
   message: { type: String, required: true },
    username: { type: String, required: true },
    target: { type: String, required: true },
}); 

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message;
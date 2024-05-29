const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
   message: { type: String, required: true },
    username: { type: String, required: true },
    sessionUserId: { type: String, required: true },
    target: { type: String, required: true },
    targetUsername: { type: String, required: true },
}); 

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message;


// const ConversationSchema = new mongoose.Scehma({
//     sessionUserId: { type: String, required: true },
//     targetId: { type: String, required: true },
//     messages: [MessageSchema],
    
// })
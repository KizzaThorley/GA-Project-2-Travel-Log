const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
   message: { type: String, required: true },
sender: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
reciever: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
   
}); 

const ConversationSchema = new mongoose.Schema({
    userIdOne: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
     userIdTwo: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
     messages: [MessageSchema],
     
 })

const Conversation = mongoose.model('Conversation', ConversationSchema)

module.exports = Conversation;



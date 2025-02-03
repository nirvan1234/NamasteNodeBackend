const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    message: String,
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
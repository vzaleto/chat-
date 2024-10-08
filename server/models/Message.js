const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender: String,
    content: String,
    timestamp:{type: Date, default: Date.now},
    timestampElse:String
})

module.exports = mongoose.model('Message', messageSchema)
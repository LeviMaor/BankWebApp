const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    senderEmail: {
        type: String,
        required: true
    },
    recipientEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);

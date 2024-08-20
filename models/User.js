const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                // Regular expression to validate the email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    balance: { type: Number, default: 1000 },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);

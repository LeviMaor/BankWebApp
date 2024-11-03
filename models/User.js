const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    balance: { type: Number, default: 1000 },
    isVerified: { type: Boolean, default: false },
    roles: { type: [String], default: ['user'] },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

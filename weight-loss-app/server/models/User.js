const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },    
    email: {
        type: String,
        unique: true,
        trim: true
    },
});

module.exports = mongoose.model('User', UserSchema);
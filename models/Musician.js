var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    performerName: { type: String, unique: true },
    userIds:  [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    contactName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipcode: String,
    phone: String,
    instruments: String,
    website: String,
    picture: String,
    biography: String,

    approved:  { type: Boolean, default: false },
    approvedDate: Date,
    signUpDate: Date,
    approvedBy: String,
    notes: [{
        noteDate: Date,
        noteText: String
    }]
});

module.exports = mongoose.model('Musician', userSchema);



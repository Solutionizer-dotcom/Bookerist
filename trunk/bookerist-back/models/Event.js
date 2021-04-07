const mongoose = require('mongoose');
const User = require('./User');

const eventSchema = mongoose.Schema({
    userEvent: { type: User, required: true },
    usersInvited: {type: Array, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    objet: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('event', eventSchema);
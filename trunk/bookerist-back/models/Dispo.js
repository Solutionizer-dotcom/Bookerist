const mongoose = require('mongoose');
const User = require('./User');

const dispoSchema = mongoose.schema({
    user: { type: User, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true }
});

module.exports = mongoose.model('Dispo', dispoSchema);
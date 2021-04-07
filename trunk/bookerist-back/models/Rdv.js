const mongoose = require('mongoose');
const User = require('./User');

const rdvSchema = mongoose.Schema({
    userDispo: { type: User, required: true },
    userRdv: { type: User, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    objet: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Rdv', rdvSchema);
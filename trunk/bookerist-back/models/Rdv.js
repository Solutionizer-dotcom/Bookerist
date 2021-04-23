const mongoose = require('mongoose');

const rdvSchema = mongoose.Schema({
    user_mail: { type: String, required: true },
    user_dispo_mail: { type: String, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    objet: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Rdv', rdvSchema);
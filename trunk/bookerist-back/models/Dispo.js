const mongoose = require('mongoose');

const dispoSchema = mongoose.Schema({
    user_mail: { type: String, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true }
});

module.exports = mongoose.model('Dispo', dispoSchema);
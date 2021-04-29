const mongoose = require('mongoose');

const evenementSchema = mongoose.Schema({
    user_mail: { type: String, required: true },
    users_invited: {type: Array, required: true },
    allDay: {type: Boolean, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    objet: { type: String, required: true },
    description: { type: String, required: false },
    color: { type: String },
    textColor: { type: String },
    type: { type: String }
});

module.exports = mongoose.model('evenement', evenementSchema);
const mongoose = require('mongoose');

const agendaEventSchema = mongoose.Schema({
    name: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    classes: { type: String, required: true }
});

module.exports = mongoose.model('agendaEvent', agendaEventSchema);
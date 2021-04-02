const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nom: { type: String, required: true},
    prenom: { type: String, required: true},
    mail: { type: String, required: true},
    mdp: { type: String, required: true},
});

module.exports = mongoose.model('User', userSchema);
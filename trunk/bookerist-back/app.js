const express = require('express');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');


mongoose.connect('mongodb+srv://bzalugas:Bookerist2021@cluster0.cjrzx.mongodb.net/Solutionzer?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie.'))
    .catch(() => console.log('Connexion à MongoDB echouée.'));

    const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

app.post('/inscription',  async (req, res, next) => {
    
        const salt =  10
        const hashPassword = await bcrypt.hash(req.body.mdp, salt)
        const user = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            mail: req.body.mail,
            mdp: hashPassword
        });   
    user.save()
    .then(() => res.status(201).json({ message: 'Utilisateur enregistré.' }))
    .catch(error => res.status(400).json({ error }));
});

const compareMdp = async (mdp, hash) => {
    try{
        //comparaison des mdp
        return await bcrypt.compare(mdp, hash);
    } catch (error) {
        console.log(error);
    }
    //retourne false si erreur
    return false;
}

app.post('/connect', async (req, res, next) => {
    User.findOne({ mail: req.body.mail })
    .then(async user => {
        if (user.length == 0)
            res.status(400).json({ message: 'Utilisateur introuvable.'})
        else {
            const mdpIsValid = await compareMdp(req.body.mdp, user.mdp);
            res.status(`${mdpIsValid ? 200 : 400}`).json({ message: `${mdpIsValid ? 'Connexion réussie' : 'Mot de passe incorrect'}`, name: user.nom, mail: user.mail});
        }
    })
    .catch(err => res.status(400).json({ message: err }));
})

module.exports = app;
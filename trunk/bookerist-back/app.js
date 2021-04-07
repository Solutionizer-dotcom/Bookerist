const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

//Connexion à la base de donnée MongoDB
mongoose.connect('mongodb+srv://bzalugas:Bookerist2021@cluster0.cjrzx.mongodb.net/Solutionzer?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie.'))
    .catch(() => console.log('Connexion à MongoDB échouée.'));

    const app = express();

    //autoriser les connexions à l'api depuis n'importe où
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

//Envoi des infos inscription dans la BDD
app.post('/inscription',  async (req, res, next) => {
    //vérification que le mail n'est pas encore enregistré
    User.find({ mail: req.body.mail })
    .then(async user => {
        //si la requête trouve un utilisateur avec le même mail
        if (user.length > 0){
            res.status(400).json({ message: 'L\'adresse mail existe déjà.'});
        }
        //si on ne trouve rien, alors le mail n'est pas encore enregistré
        else{
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
        }
    })
    .catch(err => res.status(400).json({ err }));
});

//Fonction de comparaison de mots de passe (utilisée pour connexion)
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

//Vérification des identifiants pour connexion
app.post('/connect', async (req, res, next) => {
    User.findOne({ mail: req.body.mail })
    .then(async user => {
        if (user == null){
            res.status(400).json({ message: 'Utilisateur introuvable.'})
        }
        else {
            const mdpIsValid = await compareMdp(req.body.mdp, user.mdp);
            res.status(`${mdpIsValid ? 200 : 400}`).json({ message: `${mdpIsValid ? 'Connexion réussie' : 'Mot de passe incorrect'}`, name: user.nom, mail: user.mail});
        }
    })
    .catch(err => res.status(400).json({ message: err }));
})

module.exports = app;
const express = require('express'); //serveur express
const mongoose = require('mongoose'); //utilitaire pour mongodb
const bcrypt = require('bcrypt'); //pour hasher les mdp
require('dotenv').config(); //pour utiliser un fichier .env au lieu d'écrire dans app les identifiants et mdp

const nodemailer = require('nodemailer'); //pour envoyer des mails
const { google } = require('googleapis'); //pour communiquer avec api google (pour envoi de mails)

const oAuth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

//modèles de la BDD
const User = require('./models/User');
// const AgendaEvent = require('./models/AgendaEvent');

//Connexion à la base de donnée MongoDB
mongoose.connect('mongodb+srv://bzalugas:Bookerist2021@cluster0.cjrzx.mongodb.net/Solutionzer?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie.'))
    .catch((error) => console.log('Connexion à MongoDB échouée : ', error));

    const app = express();

    //autoriser les connexions à l'api depuis n'importe où
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

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

//Vérification des identifiants pour connexion
app.post('/connect', async (req, res, next) => {
    User.findOne({ mail: req.body.mail })
    .then(async user => {
        if (user == null){
            res.status(400).json({ message: 'Utilisateur introuvable.'})
        }
        else {
            const mdpIsValid = await compareMdp(req.body.mdp, user.mdp);
            res.status(`${mdpIsValid ? 200 : 400}`).json({ message: `${mdpIsValid ? 'Connexion réussie' : 'Mot de passe incorrect'}`, prenom: user.prenom, nom: user.nom, mail: user.mail});
        }
    })
    .catch(err => res.status(400).json({ message: err }));
})

//Fonction d'envoi de mail
async function sendMail({from, to, objet, message}) { 
    try{
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: accessToken,
            }
        });

        const mailOptions = {
            from: from,
            to: to,
            subject: objet,
            text: message,
        }

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch(error){
        return error;
    }
}

//Envoi du message de l'utilisateur depuis la page contact
app.post('/contact', (req, res, next) => {
    const options = {
        from: req.body.prenom + " " + req.body.nom + ' <' + req.body.mail + '>', //le mail sera quand même celui utilisé pour l'envoi mais les nom et prénoms figureront dans l'expéditeur
        to: process.env.MAIL_USERNAME,
        objet: 'CONTACT FROM ' + req.body.prenom + " " + req.body.nom + ' <' + req.body.mail + '> - ' + req.body.objet,
        message: req.body.message,
    }
    sendMail(options)
    .then((result) => {
        console.log('mail envoyé : ', result);
        res.status(200).json({ message: 'Message bien envoyé. Nous vous répondrons dans les plus brefs délais.' });
    })
    .catch((error) => {
        console.log('erreur : ', error.message);
        res.json({ message: "Erreur lors de l'envoi du message." });
    });


    //Envoi des données d'event depuis l'agenda
    app.post('/event/save', (req, res, next) => {
        const event = new AgendaEvent({...req.body}); //changer model
        event.save()
        .then(res => res.status(200).json({ message: "event saved" }))
        .catch(error => res.status(400).json({ message: error }));
    });

    app.get('/events/get', (req, res, next) => {
        AgendaEvent.find() //changer le model
        .then(events => {
            if (events.length > 0){
                res.status(200).json({events})
            }
        })
        .catch(error => res.status(400).json({ message: error }));
    });

})

app.post('/forgotPass', (req,res,next)=>{
    const options = {
        from: 'Bookerist <solutionizer.bookerist@gmail.com>',
        to: req.body.mail,
        objet: 'Réinitialisation du mot de passe Bookerist',
        message: 'Bonjour, voici votre nouveau mot de passe : ' + mdp
    }
})

module.exports = app;
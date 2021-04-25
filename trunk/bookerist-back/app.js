const express = require('express'); //serveur express
const app = express();
const mongoose = require('mongoose'); //utilitaire pour mongodb
const bcrypt = require('bcrypt'); //pour hasher les mdp
const cors = require('cors');
require('dotenv').config(); //pour utiliser un fichier .env au lieu d'écrire dans app les identifiants et mdp

const nodemailer = require('nodemailer'); //pour envoyer des mails
const { google } = require('googleapis'); //pour communiquer avec api google (pour envoi de mails)

const oAuth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

//modèles de la BDD
const User = require('./models/User');
const Evenement = require('./models/Evenement');
const Dispo = require('./models/Dispo');
const Rdv = require('./models/Rdv');


//Connexion à la base de donnée MongoDB
mongoose.connect('mongodb+srv://bzalugas:Bookerist2021@cluster0.cjrzx.mongodb.net/Solutionzer?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie.'))
.catch((error) => console.log('Connexion à MongoDB échouée : ', error));

    
app.options('*', cors());


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


const hashMdp = async (mdp) => {
    try{
        const salt =  10
        return await bcrypt.hash(mdp, salt);
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
            const hashPassword = await hashMdp(req.body.mdp)
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

});
    //Envoi des données d'event depuis l'agenda vers la BDD
    app.post('/event/save', async (req, res, next) => {
        const type = req.body.event_parsed.type;
        let id = req.body.id;
        //Si la requete ne comporte pas d'id, alors l'event n'est pas encore enregistré dans la bdd
        if (id === '')
        {
            let event = undefined;
            switch(type){
                case 'evenement': event = new Evenement({...req.body.event_parsed});
                    break;
                case 'dispo': event = new Dispo({...req.body.event_parsed});
                    break;
                case 'rdv': event = new Rdv({...req.body.event_parsed});
                    break;
            };
            if (event !== undefined)
            {
                event.save()
                .then(() => res.status(201).json({ message: "sauvegarde reussie." }))
                .catch(err => res.status(400).json({ message: err }));
            }
        }
        //sinon, c'est qu'il doit juste etre modifié
        else
        {
            let updateReq;
            switch(type)
            {
                case 'evenement':
                    updateReq = await Evenement.replaceOne({ _id: id }, {...req.body.event_parsed});
                    break;
                case 'dispo':
                    updateReq = await Dispo.replaceOne({ _id: id }, {...req.body.event_parsed});
                    break;
                case 'rdv':
                    updateReq = await Rdv.replaceOne({ _id: id }, {...req.body.event_parsed});
                    break;
            };
        }
    });

    //Enregistrement modifications d'event
    app.post('/event/update', (req, res, next) => {

    })

    app.post('/events/get', async (req, res, next) => {
        let all_events = [];
        const mail = req.body.mail;
        let evenements = Evenement.find({ user_mail: mail });
        let dispos = Dispo.find({ user_mail: mail });
        let rdv = Rdv.find({ user_mail: mail }) //ajouter || user_dispo_mail: mail

        evenements = await evenements.exec();
        dispos = await dispos.exec();
        rdv = await rdv.exec();

        all_events = evenements.concat(dispos).concat(rdv);

        if (all_events.length > 0)
            res.status(200).json({ all_events, message: 'récupération réussie' });
        else
            res.status(200).json({ message: 'base vide' })
    });

// app.post('/forgotPass', async (req,res,next)=>{
    


//     const options = {
//         from: 'Bookerist <solutionizer.bookerist@gmail.com>',
//         to: req.body.mail,
//         objet: 'Réinitialisation du mot de passe Bookerist',
//         message: 'Bonjour, voici votre nouveau mot de passe : ' + mdp
//     }
// })

app.post("/params", async (req, res, next) => 
{
    User.findOne({mail: req.body.mail})
        .then(async user=> 
        {
            if (user === null)
            {
                res.status(400).json({ message: 'Utilisateur introuvable.'})
            }
            else 
            {
                const mdpIsValid = await compareMdp(req.body.mdp, user.mdp);
                if(mdpIsValid)
                {
                    let changeMdp = req.body.changeMdp
                    if(req.body.changeMail && req.body.changeMdp)
                    {
                        User.find({mail: req.body.newMail})
                        .then(async (user) => 
                            {
                                if (user.length > 0)
                                {
                                    res.status(400).json({ message: 'Le nouveau mail existe déjà.' })
                                }
                                else
                                {
                                    const hashPassword = await hashMdp(req.body.newMdp);
                                    User.updateOne({mail: req.body.mail}, {mail: req.body.newMail, mdp: hashPassword})
                                    .then(() => {
                                        res.status(200).json({ message: "Vos informations personnelles ont été mises à jour", mail: req.body.newMail })
                                    })
                                    .catch(error => {
                                        res.status(400).json({ message : JSON.stringify(error) })
                                    })
                                }
                            })
                        
                        .catch(error => res.status(400).json({ message : JSON.stringify(error) }))          
                        
                    }    
                
                    else if(req.body.changeMail)
                    {
                        User.findOne({mail: req.body.newMail})
                        .then(async user => 
                            {
                                if (user !== null)
                                    res.status(400).json({ message: 'Le nouveau mail existe déjà.' })
                                else
                                {
                                    User.updateOne({mail: req.body.mail}, {mail: req.body.newMail})
                                    .then(() => {
                                        res.status(200).json({ message: "Vos informations personnelles ont été mises à jour", mail: req.body.newMail })
                                    })
                                    .catch(error => {
                                        res.status(400).json({ message : JSON.stringify(error) })
                                    })
                                }
                            })
                        .catch(error => 
                        {
                            res.status(400).json({ message : JSON.stringify(error) })
                        })
                    }
                    
                    else if(changeMdp)
                    {
                        const hashPassword = await hashMdp(req.body.newMdp);
                        User.updateOne({mail: req.body.mail}, {mdp: hashPassword})
                        .then(() => {
                            res.status(200).json({ message: "Vos informations personnelles ont été mises à jour" })
                        })
                        .catch(error => {
                            res.status(400).json({ message : JSON.stringify(error) })
                        })
                    }
                }
                else
                {
                    res.status(400).json({message: "Mot de passe invalide"})
                }
            }
        })    
    
        .catch(error => res.status(400).json({ message : JSON.stringify(error) })) 
})








app.post('/users/get', (req, res, next) => {
    //Recherche de tous les utilisateurs exceptés ceux dont le mail correspond au mail de l'utilisateur courrant.
    User.find({ mail: { $not: { $regex: req.body.mail } } }, '_id prenom nom mail')
    .then(users => {        
        res.status(200).json(users)
    })
    .catch(error => res.status(400).json({ error }) );
})
module.exports = app;
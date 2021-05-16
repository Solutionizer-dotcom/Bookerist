const express = require('express'); //serveur express
const app = express();
const path = require('path');
const mongoose = require('mongoose'); //utilitaire pour mongodb
const bcrypt = require('bcrypt'); //pour hasher les mdp
const cors = require('cors');
require('dotenv').config(); //pour utiliser un fichier .env au lieu d'écrire dans app les identifiants et mdp
const nodemailer = require('nodemailer'); //pour envoyer des mails

//chargement des modèles de la BDD
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

//Autorisation des requêtes venant de toutes les origines
app.options('*', cors());

//autoriser les connexions à l'api depuis n'importe où
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

//Fonction de comparaison de mots de passe
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

//Fonction de chiffrement de mot de passe
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
        //si rien n'est trouvé, alors le mail n'est pas encore enregistré
        else{
            const hashPassword = await hashMdp(req.body.mdp)
            const user = new User({
                nom: req.body.nom,
                prenom: req.body.prenom,
                mail: req.body.mail,
                mdp: hashPassword
            });
            //Sauvegarde de l'utilisateur dans la BDD
            user.save()
            .then(() => res.status(201).json({ message: 'Inscription effectuée avec succès.' }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(err => res.status(400).json({ err }));
});

//Vérification des identifiants lors de la connexion
app.post('/connect', async (req, res, next) => {
    //Recherche dans la BD en fonction du mail
    User.findOne({ mail: req.body.mail })
    .then(async user => {
        if (user == null){
            //Si rien n'est trouvé alors le mail n'existe pas
            res.status(400).json({ message: 'Utilisateur introuvable.'})
        }
        else {
            //Sinon, vérification que le mot de passe est correct puis la réponse de la reqête est définie en conséquence
            const mdpIsValid = await compareMdp(req.body.mdp, user.mdp);
            res.status(`${mdpIsValid ? 200 : 400}`).json({ message: `${mdpIsValid ? 'Connexion réussie' : 'Mot de passe incorrect'}`, prenom: user.prenom, nom: user.nom, mail: user.mail});
        }
    })
    .catch(err => res.status(400).json({ message: err }));
})

//Fonction d'envoi de mail
async function sendMail({from, to, objet, message}) { 
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, //a changer en 587 pdt le développement
            secure: true, //a changer en false pendant le développement
            requireTLS: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_MDP,
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
        // console.log('mail envoyé : ', result);
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
    //sinon, c'est qu'il doit juste être modifié
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

//Suppression d'un event
app.post('/event/remove', async (req, res, next) => {
    const type = req.body.extendedProps.type;
    const id = req.body.id;
    let removeReq;
    try {
        switch(type)
        {
            case 'evenement':
                removeReq = await Evenement.deleteOne({ _id: id });
                break;
            case 'dispo':
                removeReq = await Dispo.deleteOne({ _id: id });
                break;
            case 'rdv':
                removeReq = await Rdv.deleteOne({ _id: id });
                break;
        };
        res.status(200).json({ message: "suppression correctement effectuée" });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
    

});

//Route de récupération des évènements
app.post('/events/get', async (req, res, next) => {
    let all_events = [];
    let all_events_invited = [];
    const mail = req.body.mail;
    let evenements = Evenement.find({ user_mail: mail });
    let evenements_invited = Evenement.find({ 'users_invited.mail': mail });
    let dispos = Dispo.find({ user_mail: mail });
    let rdv = Rdv.find({ user_mail: mail });
    let rdv_invited = Rdv.find({ user_dispo_mail: mail });

    //exécution des requêtes + parsing
    evenements = await evenements.exec();
    evenements = evenements.map((e) => {
        return ({
            editable: true,
            id: e._id,
            title: e.objet,
            extendedProps: {
                user_mail: e.user_mail,
                users_invited: e.users_invited,
                type: e.type,
                description: e.description
            },
            allDay: e.allDay,
            start: e.dateStart,
            end: e.dateEnd,
            color: 'rgb(177, 214, 153)',
            textColor: e.textColor,
        });
    })
    evenements_invited = await evenements_invited.exec();
    evenements_invited = evenements_invited.map((e) => {
        return ({
            editable: false,
            id: e._id,
            title: e.objet,
            extendedProps: {
                user_mail: e.user_mail,
                users_invited: e.users_invited,
                type: e.type,
                description: e.description
            },
            allDay: e.allDay,
            start: e.dateStart,
            end: e.dateEnd,
            color: 'rgb(248,163,39)',
            textColor: e.textColor,
        });
    })

    dispos = await dispos.exec();

    rdv = await rdv.exec();
    rdv_invited = await rdv_invited.exec();

    all_events = evenements.concat(dispos).concat(rdv);
    all_events_invited = evenements_invited.concat(rdv_invited);
    all_events = all_events.concat(all_events_invited);
    if (all_events.length > 0)
        res.status(200).json({ all_events, message: 'récupération réussie' });
    else
        res.status(200).json({ message: 'base vide' })
});

//Fonction de création aléatoire d'une chaîne de caractères pour créer un mot de passe
function randomPass(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*/.,!§@&+=';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * 
    charactersLength)));
    }
    return result.join('');
}

//Route de réinitialisation du mot de passe
app.post('/forgotPass', async (req,res,next)=>{ 
    const newForgotPass = randomPass(8);
    const hashForgotPass = await hashMdp(newForgotPass)
    const resultat = await User.updateOne({mail: req.body.mail}, {mdp: hashForgotPass })

    //Si le nombre de documents modifiés est supérieur à 0
    if(resultat.n > 0){
        const options = {
            from: 'Bookerist <solutionizer.bookerist@gmail.com>',
            to: req.body.mail,
            objet: 'Réinitialisation du mot de passe Bookerist',
            message: 'Bonjour, voici votre nouveau mot de passe : ' + newForgotPass
        }

        sendMail(options)
        .then((result) => {
            res.status(200).json({ message: "Le nouveau mot de passe vous a été envoyé par mail." });
        })
        .catch((error) => {
            console.log('erreur : ', error.message);
            res.json({ message: "Erreur lors de l'envoi du message." });
        });
    }
    //Sinon le mail n'a pas été trouvé
    else{
        res.status(400).json({message : "Le mail n'existe pas."})
    }
})

//Route de modification des paramètres de l'utilisateur
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
                    let changeMailSuccess = false;
                    let changeMdpSuccess = false;
                    if (req.body.changeMail)
                    {
                        let userWithNewMail = await User.findOne({ mail: req.body.newMail }).exec();
                        if (userWithNewMail !== null)
                        {
                            res.status(400).json({ message: 'Le nouveau mail existe déjà.' });
                            changeMailSuccess = false;
                        }
                        else 
                        {
                            await User.updateOne({ mail: req.body.mail }, { mail: req.body.newMail }).exec();
                            await Evenement.updateMany({ user_mail: req.body.mail }, { user_mail: req.body.newMail }).exec();
                            await Evenement.updateMany({ 'users_invited.mail': req.body.mail }, { "users_invited.$.mail": req.body.newMail }).exec();

                            changeMailSuccess = true;
                        }
                    }
                    if (req.body.changeMdp)
                    {
                        const hashPassword = await hashMdp(req.body.newMdp);
                        await User.updateOne({ mail: req.body.mail }, { mdp: hashPassword }).exec();
                        changeMdpSuccess = true;
                    }
                    res.status(200).json({
                        message: "Vos informations personnelles ont été mises à jour",
                        mail: req.body.changeMail && changeMailSuccess ? req.body.newMail : req.body.mail
                    });                    
                }
                else
                {
                    res.status(400).json({message: "Mot de passe invalide"})
                }
            }
        })    
    
        .catch(error => res.status(400).json({ message : JSON.stringify(error) })) 
})

//Route de récupération des autres utilisateurs
app.post('/users/get', (req, res, next) => {
    //Recherche de tous les utilisateurs exceptés ceux dont le mail correspond au mail de l'utilisateur courrant.
    User.find({ mail: { $not: { $regex: req.body.mail } } }, '_id prenom nom mail')
    .then(users => {        
        res.status(200).json(users)
    })
    .catch(error => res.status(400).json({ error }) );
})

module.exports = app;
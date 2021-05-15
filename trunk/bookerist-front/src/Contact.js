import React, { useState } from "react";
import './Contact.css';
import './Button.css';

//Composant permettant d'afficher et de gérer la page de contact
export default function Contact(props){
    const contact = "/contact";
    const API = props.API;
    const max = {
        objet: 70,
        message: 2000,
    }
    //utilisation du hook d'état, même utilisation que le state des classes mais pour les composants fonctionnels
    const [state, setState] = useState({
        objet: '',
        message: '',
        compteur_objet: max.objet,
        compteur_message: max.message,
    });

    //Fonction sauvegardant les valeurs des champs à chaque modification
    //Vérifie aussi que le texte ne dépasse la taille maximale prévue dans max
    //Paramètre : l'évènement javascript associé à l'appel de la fonction 
    function handleChange(e){
        const champ = e.target.name;
        const value = e.target.value;
        const nameCompteur = `compteur_${champ}`;
        const maxLength = `${champ === 'objet' ? max.objet : max.message}`;

        if (value.length <= maxLength){            
            setState(state => { 
                return {
                    ...state,
                    [champ]: value,
                    [nameCompteur]: maxLength - value.length,
                }
            });
        }
        else{
            const msg = "Nombre de caractères max atteint pour "`${champ === 'objet' ? "l'objet" : "le message."}`;
            alert(msg);
        }
    }

    //Fonction appelée à l'envoi du formulaire de l'objet et du message
    //Envoie la requête à l'API correspondant à l'envoie d'un mail
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    function handleSubmitMessage(e){
        e.preventDefault();

        const alreadySent = JSON.parse(window.localStorage.getItem('contactSent'));
        //on vérifie d'abord que l'utilisateur n'a pas encore envoyé de message pour éviter les spams.
        if (alreadySent !== null && alreadySent.sentContact === true){
            alert("Vous avez déjà envoyé un message de contact.");
            handleFinishContact();
        }
        else {
            let contactMessage = {
                mail: props.mail,
                prenom: props.prenom,
                nom: props.nom,
                objet: state.objet,
                message: state.message,
            }

            fetch(API + contact, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactMessage),
            })
            .then(res => res.json())
            .then(res => {
                alert(res.message);
                handleFinishContact();
            })
            .catch(err => {
                alert("Erreur : " + err);
            });
        }
    }
    
    //Fonction appelée lorsque le mail a été envoyé
    //Remet tous les champs à leurs valeurs par défaut et 
    //enregistre dans le stockage du navigateur que l'utilisateur a envoyé un message
    function handleFinishContact(){
        setState({
            objet: '',
            message: '',
            compteur_objet: max.objet,
            compteur_message: max.message,
        });
        window.localStorage.setItem('contactSent', JSON.stringify({ sentContact: true }));
        props.gotoMain();
    }

    //Fonction appelée lorsque le formulaire est réinitialisé par le bouton reset
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    function handleReset(e){
        e.preventDefault();
        setState({
            objet: '',
            message: '',
            compteur_objet: max.objet,
            compteur_message: max.message,
        })
    }
    //Affichage de la page de contact
    return(
        <div id="corps_contact">
            <h2 id="titre_contact">Contact</h2>
            <form method="post" className="Contact" id="formMessage" onSubmit={handleSubmitMessage} onReset={handleReset}>
                <p className="txtMessage">Pour nous contacter, écrivez-nous un message :</p>
                <br/>
                <div className="divObjet">
                    <textarea name="objet" id="objet" placeholder="Objet" value={state.objet} onChange={handleChange} required />
                    <span id="compteurObjet">{state.compteur_objet}</span>
                </div>
                <div className="divMessage">
                    <textarea name="message" id="message" placeholder="Message" value={state.message} onChange={handleChange} required />
                    <span id="compteurMessage">{state.compteur_message}</span>
                </div>
                <br/>
                <input className="bouton_contact" type="reset" value="Tout effacer"></input>
                <input className="bouton_contact" type="submit" value="Envoyer"></input>
            </form>
        </div>
    )
}
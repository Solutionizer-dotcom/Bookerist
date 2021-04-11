import React, { useState } from "react";
import './Contact.css';
import './Button.css';

export default function Contact(props){
    const baseURL = "http://localhost:3001";
    const max = {
        objet: 70,
        message: 2000,
    }
    const [state, setState] = useState({
        objet: '',
        message: '',
        compteur_objet: max.objet,
        compteur_message: max.message,
    });

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

    function handleSubmitMessage(e){
        e.preventDefault();

        const alreadySent = window.localStorage.getItem('contactSent');
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

            fetch(baseURL + "/contact", {
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
    
    function handleFinishContact(){
        setState({
            objet: '',
            message: '',
            compteur_objet: max.objet,
            compteur_message: max.message,
        });
        window.localStorage.setItem('contactSent', {sentContact: true});
        props.gotoMain();
    }

    function handleReset(e){
        e.preventDefault();
        setState({
            objet: '',
            message: '',
            compteur_objet: max.objet,
            compteur_message: max.message,
        })
    }
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
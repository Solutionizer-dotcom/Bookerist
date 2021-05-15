import React, { useState } from "react"
import "./ForgotPass.css"  

//Composant affichant et gérant la page de mot de passe oublié
const ForgotPass = (props)=>{
    const API = props.API;
    const forgot_pass = "/forgotPass";

    const [mail, setMail] = useState('');

    //Fonction appelée à chaque modification du champ de mail
    //Permet de sauvegarder dans l'état la valeur du champ de mail
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    function saveChanges(event){
        setMail(event.target.value.toLowerCase())
    }

    //Fonction envoyant la requête à l'adresse de l'API correspondant au mot de passe oublié
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    function handleForgetPass(event){
        event.preventDefault()
        fetch(API + forgot_pass,{ 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({mail})
        })
        .then(res => res.json())
        .then(res => {
            alert(res.message)
        })
        .catch(error => console.log(error))
    }

    //Affichage de la page de mot de passe oublié
    return(
        <div className="forgotPass">
            <h2>Mot de passe oublié </h2>
            <form id="formulaireMDP" onSubmit={handleForgetPass}>
            <br/>
            <input type="email" id="mailForgotPass" name="mailForgotPass" placeholder="e-mail" 
            onChange={saveChanges} 
            value={mail}
            required/>
            <br/>
            <input className="bouton_forgotPass" type="submit" value="Envoyer"></input>
            </form>
        </div>
    );

}
export default ForgotPass;
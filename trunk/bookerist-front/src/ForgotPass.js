import React, { useState } from "react"
import "./ForgotPass.css"  

const ForgotPass = (props)=>{
    const API = props.API;
    const forgot_pass = "/forgotPass";

    const [mail, setMail] = useState('');

    function saveChanges(event){
        setMail(event.target.value.toLowerCase())
    }

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
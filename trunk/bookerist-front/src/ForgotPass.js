import React, { useState } from "react"
import "./ForgotPass.css"  
const baseURL="http://localhost:3001/";

const ForgotPass = ()=>{
    const [mail, setMail] = useState('');

    function saveChanges(event){
        setMail(event.target.value.toLowerCase())
    }

    function handleForgetPass(event){
        event.preventDefault()
        fetch(baseURL+'/forgotPass',{ 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mail)
        })
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



        
  











 

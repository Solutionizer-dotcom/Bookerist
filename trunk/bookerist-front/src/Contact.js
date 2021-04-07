import React from "react"
import Header from "./Header"
import Test from "./Test"
import './Contact.css'
import './Button.css'

export default function contact(){
    return(
        <div id="corps_contact">
            <h2 id="titre_contact">Contact</h2>
            <form className="Contact">
                <label for="message" id="label">Pour nous contacter, écrivez nous un message ci-dessous :</label>
                <br/>
                <textarea name="message" id="message"></textarea>
                <br/>
                <input className="bouton_contact" type="reset" value="Tout effacer"></input>
                <input className="bouton_contact" type="submit" value="Envoyer"></input>
            </form>
        </div>
    )
}
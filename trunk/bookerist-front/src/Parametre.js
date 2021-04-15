import React, { Component } from "react";
import Header from "./Header"
import './Parametre.css'

class Parametre extends Component{
    render() {
        return(
        <div>
            <Header/>
        <div className="parametre">
            <h2>Paramètre</h2>
            <input className="inputParam" type="email" id="mail" name="mail" placeholder="e-mail" />
            <br/>
            <input className="bouton_modifier" id="modifMail" type="button" value="Modifier"></input>
            <br/>
            <input className="bouton_modifier" id="modifMdp" type="submit" value="Modifier mot de passe"></input>
            <br/>
            <input className="inputParamPass" type="password" id="mdp" name="mdp" placeholder="Ancien mot de passe" />
            <br/>
            <input className="inputParamPass" type="password" id="newMdp" name="newMdp" placeholder="Nouveau mot de passe" />
            <br/>
            <input className="inputParamPass" type="password" name="confirmer" placeholder="Confirmez mot de passe"></input>
            <br/>
            <input className="bouton_modifier" id="save" type="submit" value="Sauvegarder"></input>
        </div>
        </div>
        )
    }
}
export default Parametre;
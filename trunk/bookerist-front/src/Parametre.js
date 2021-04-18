import React, { Component } from "react";
import Header from "./Header"
import './Parametre.css'

class Parametre extends Component{

    constructor(props){
        super(props)
        this.state={
            mail: this.props.mail,
            mailVisible: false,
            mdpVisible: false,
        }
        this.handleModifMail= this.handleModifMail.bind(this)
        this.handleModifPass= this.handleModifPass.bind(this)
        this.handleMailChange= this.handleMailChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
    }

    handleModifMail(event) {
        this.setState({
            mailVisible: true,
        })
    }

    handleModifPass(event){
        this.setState({
            mdpVisible: true,
        })
    }

    handleMailChange(event){
        this.setState({
            mail: event.target.value.toLowerCase()
        })
    }

    handleReset(event){
        this.setState({
            mail: this.props.mail,
            mailVisible: false,
            mdpVisible: false,
        })
    }

    render() {       
        return(
        <div className="parametre">
            <h2>Paramètre</h2>
            <input className="inputParam" type="email" id="mail" name="mail" value={this.state.mail} onChange={this.handleMailChange}
            disabled= {!this.state.mailVisible} />
            <br/>
            <input className="bouton_modifier" id="modifMail" type="button" onClick={this.handleModifMail} value="Modifier"/>
            <br/>
            <input className="bouton_modifier" id="modifMdp" type="submit" onClick={this.handleModifPass} value="Modifier mot de passe"/>
            <br/>
            <input className="inputParamPass" type="password" id="mdp" name="mdp" placeholder="Ancien mot de passe" 
            disabled= {!this.state.mdpVisible}/>
            <br/>
            <input className="inputParamPass" type="password" id="newMdp" name="newMdp" placeholder="Nouveau mot de passe" 
            disabled= {!this.state.mdpVisible}/>
            <br/>
            <input className="inputParamPass" type="password" name="confirmer" placeholder="Confirmez mot de passe"
            disabled= {!this.state.mdpVisible}/>
            <br/>
            <input type="reset" className="bouton_modifier" value="Annuler" onClick={this.handleReset} />
            <input className="bouton_modifier" id="save" type="submit" value="Sauvegarder"/>
        </div>
        )
    }
}
export default Parametre;
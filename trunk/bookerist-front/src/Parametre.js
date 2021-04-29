import React, { Component } from "react";
import './Parametre.css'

const params = "/params";

class Parametre extends Component{

    constructor(props){
        super(props)
        this.state={
            mail: this.props.mail,
            newMail: this.props.mail,
            mdp: "",
            newMdp: "",
            confirmNewMdp: "",
            changeMail: false,
            changeMdp: false,
        }
        this.handleModifMail= this.handleModifMail.bind(this)
        this.handleModifPass= this.handleModifPass.bind(this)
        this.handleMailChange= this.handleMailChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleSubmitParams = this.handleSubmitParams.bind(this)
        this.handleChanges = this.handleChanges.bind(this)
        this.clearState = this.clearState.bind(this)
        this.handleNewInfos = this.handleNewInfos.bind(this)

        this.API = this.props.API;
    }

    componentDidUpdate(){
        if(this.props.mail !== this.state.mail){
            this.setState({
                mail: this.props.mail,
                newMail: this.props.mail,
            })
        }
    }

    clearState(){
        this.setState({
            mail: this.props.mail,
            newMail: this.props.mail,
            mdp: "",
            newMdp: "",
            confirmNewMdp: "",
            changeMail: false,
            changeMdp: false,
        })
    }

    handleModifMail(event) {
        this.setState({
            changeMail: true,
        })
    }

    handleModifPass(event){
        this.setState({
            changeMdp: true,
        })
    }

    handleMailChange(event){
        this.setState({
            newMail: event.target.value.toLowerCase()
        })
    }

    handleReset(event){
        this.clearState()
    }


    handleNewInfos(newMail){
        this.props.handleChangeParams(newMail)
    }


    handleSubmitParams(event){
        event.preventDefault()
        if(this.state.newMdp === this.state.confirmNewMdp){
            let userModif = {
                mail: this.state.mail,
                newMail: this.state.newMail,
                mdp: this.state.mdp,
                newMdp: this.state.newMdp,
                changeMail: this.state.changeMail,
                changeMdp: this.state.changeMdp,
            }
            this.clearState()
            fetch(this.API + params, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userModif)
            })
            .then(response => response.json().then(res => ({ status: response.status, data: res })))
            .then(res => {
                alert(res.data.message)
                if(res.status === 200)
                {
                    this.handleNewInfos(res.data.mail)
                }
            })
            .catch(error => console.log(error))
        }else {
            alert("Les deux mots de passes ne correspondent pas.")
        }
    }

    handleChanges(event){
        let name = event.target.name
        let value = event.target.value
        this.setState({
            [name]:value,
        })
    }

    render() {       
        return(
        <div className="parametre">
            <form id="formParams" method="post" onSubmit={this.handleSubmitParams}>
                <h2>Paramètre</h2>
                <input className="inputParam" type="email" id="mail" name="mail" placeholder="e-mail" value={this.state.newMail} onChange={this.handleMailChange}
                disabled= {!this.state.changeMail} required />
                <br/>
                <input className="bouton_modifier" id="modifMail" type="button" onClick={this.handleModifMail} value="Modifier"/>
                <br/>
                <input className="bouton_modifier" id="modifMdp" type="button" onClick={this.handleModifPass} value="Modifier mot de passe"/>
                <br/>
                <input className="inputParamPass" type="password" id="newMdp" name="newMdp" placeholder="Nouveau mot de passe" 
                disabled= {!this.state.changeMdp} required={this.state.changeMdp} value={this.state.newMdp} onChange={this.handleChanges}/>
                <br/>
                <input className="inputParamPass" type="password" name="confirmNewMdp" placeholder="Confirmez mot de passe"
                disabled= {!this.state.changeMdp} required={this.state.changeMdp} value={this.state.confirmNewMdp} onChange={this.handleChanges}/>
                <br/>
                <input className="inputParamPass" type="password" id="mdp" name="mdp" placeholder="Mot de passe" required onChange={this.handleChanges} value={this.state.mdp}/>
                <br />
                <input type="reset" className="bouton_modifier" id ="reset" value="Annuler" onClick={this.handleReset} />
                <input className="bouton_modifier" id="save" type="submit" value="Sauvegarder"/>
            </form>
        </div>
        )
    }
}
export default Parametre;
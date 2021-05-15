import React, { Component } from "react";
import './Parametre.css'

//Route de l'API pour enregistrer les changements de paramètres
const params = "/params";

//Composant affichant et gérant la page de paramètres de l'utilisateur
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
        this.handleSubmitParams = this.handleSubmitParams.bind(this)
        this.handleChanges = this.handleChanges.bind(this)
        this.clearState = this.clearState.bind(this)
        this.handleNewInfos = this.handleNewInfos.bind(this)

        this.API = this.props.API;
    }

    //Chaque fois que le composant est mis à jour on récupère le mail des props s'il a changé
    componentDidUpdate(){
        if(this.props.mail !== this.state.mail){
            this.setState({
                mail: this.props.mail,
                newMail: this.props.mail,
            })
        }
    }

    //Fonction permettant de remettre l'état local à ses valeurs par défaut
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

    //Fonction appelée au clic sur le bouton de modification du mail
    //Indique dans l'état local que l'utilisateur souhaite modifier le mail
    handleModifMail() {
        this.setState({
            changeMail: true,
        })
    }

    //Fonction appelée au clic sur le bouton de modification du mot de passe
    //Indique dans l'état local que l'utilisateur souhaite modifier le mot de passe
    handleModifPass(){
        this.setState({
            changeMdp: true,
        })
    }

    //Fonction appelée à chaque modification du champ de mail
    //Sauvegarde le nouveau mail dans l'état local
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    handleMailChange(event){
        this.setState({
            newMail: event.target.value.toLowerCase()
        })
    }

    //Fonction appelée lorsque les nouveaux paramètres ont été enregistrés
    //Permet de faire remonter le nouveau mail au composant App pour les autres composants en ayant besoin
    //Paramètre : la String du nouveau mail
    handleNewInfos(newMail){
        this.props.handleChangeParams(newMail)
    }

    //Fonction appelée lors de l'envoi du formulaire de paramètres
    //Envoie la requête contenant les nouvelles informations à l'API
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
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

    //Fonction appelée à chaque modification des champs des paramètres
    //Permet de contrôler les valeurs des champs, i.e. les enregistrer dans l'état local
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    handleChanges(event){
        let name = event.target.name
        let value = event.target.value
        this.setState({
            [name]:value,
        })
    }

    //Rendu des paramètres
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
                <input type="reset" className="bouton_modifier" id ="reset" value="Annuler" onClick={this.clearState} />
                <input className="bouton_modifier" id="save" type="submit" value="Sauvegarder"/>
            </form>
        </div>
        )
    }
}
export default Parametre;
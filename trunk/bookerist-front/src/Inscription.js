import './Inscription.css'
import React, { Component } from 'react'
import reactDom from 'react-dom'
import App from './App'
import './Button.css'

const inscription = "/inscription";

class Inscription extends Component {
    constructor(props){
        super(props);

        this.state = {
            nom: '',
            prenom: '',
            mail: '',
            mail2: '',
            mdp: '',
            mdp2: '',
            consentChecked: false,
        }

        this.API = this.props.API;
    }

    //fx flechée pour acceder au this
    saveChanges = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    handleMailUpdate = event => {
        //automatiquement mettre le mail en minuscules
        this.setState({ mail: event.target.value.toLowerCase() })
    }

    handleFirstNameUpdate = (event) => {
        let prenom = event.target.value;
        let prenomMaj = prenom.charAt(0).toUpperCase() + prenom.slice(1);
        this.setState({ prenom: prenomMaj });
    }

    handleLastNameUpdate = (event) => {
        this.setState({ nom: event.target.value.toUpperCase() });
    }

    handleCheckboxChanges = (event) => {
        this.setState({ consentChecked: event.target.checked });
    }

    handleInscriptionFinished = () => {
        this.props.gotoMain();
    }

    //fx flechée pour acceder au this
    sendInscription = event => {
        event.preventDefault()
        //destsructuration pour + de lisibilite
        const {nom, prenom, mail, mail2, mdp, mdp2, consentChecked} = this.state;

        if (mail !== mail2){
            alert("Les deux mails ne correspondent pas.");
        }
        if (mdp !== mdp2){
            alert("Les deux mots de passe ne correspondent pas.");
        }
        if (!consentChecked){
            alert("Vous devez accepter la collecte de vos données pour pouvoir vous inscrire.");
        }
        else if (mail === mail2 && mdp === mdp2 && consentChecked){
            let user = {
                nom: nom,
                prenom: prenom,
                mail: mail,
                mdp: mdp
            };
            fetch(this.API + inscription, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json().then(response => ({status: res.status, data: response})))
            .then(res => {
                alert(res.data.message);
                if (res.status === 201){
                    this.handleInscriptionFinished();
                    reactDom.render(
                        <App />,
                        document.getElementById('root')
                    );
                }
            })
            .catch(err => {
                // alert("Un problème est survenu lors de la connexion à la base de donnée. ")
                console.log(err);
            });
        }
    }

    render() {    
        return (
            <div className="Inscription">
                <form className="formInscription" name="formInscription" onSubmit={this.sendInscription}>
                    <fieldset>
                        <h2>Inscription</h2>

                        <input type="text" id="prenom" name="prenom" placeholder="Prénom" required
                        onChange={this.handleFirstNameUpdate}
                        value={this.state.prenom} />

                        <input type="text" id="nom" name="nom" placeholder="NOM" required
                        onChange={this.handleLastNameUpdate}
                        value={this.state.nom} />

                        <input type="email" id="mail" name="mail" placeholder="e-mail" required
                        onChange={this.handleMailUpdate}
                        value={this.state.mail} />

                        <input type="email" id="mail2" name="mail2" placeholder="confirmer e-mail" required 
                        onChange={this.saveChanges} />

                        <input type="password" id="mdp" name="mdp" placeholder="mot de passe" required
                        onChange={this.saveChanges} />

                        <input type="password" id="confirmMdp" name="mdp2" placeholder="confirmer mot de passe" required
                        onChange={this.saveChanges} />

                        <div id="divConsentement">                                
                            <input type="checkbox" id="consent" name="consentement" value="consentement" onChange={this.handleCheckboxChanges} />
                            <label htmlFor="consent" id="labelConsent">J'accepte que mes données soient collectées dans un but purement fonctionnel. Au cas où je souhaiterais les faire supprimer, je pourrai en faire la demande en passant par l'onglet "contact".</label>
                        </div>

                        <input type="submit" id="goInscription" value="Je m'inscris !" />
                        
                        

                    </fieldset>
                </form>
            </div>
        );
    }
}

export default Inscription;
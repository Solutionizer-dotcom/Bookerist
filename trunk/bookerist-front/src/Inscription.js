import './Inscription.css'
import React, { Component } from 'react'
import reactDom from 'react-dom'
import App from './App'
import './Button.css'

//route de l'API pour effectuer une inscription
const inscription = "/inscription";

//Composant affichant et gérant le page d'inscription
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

    //Fonction appelée à chaque modification des champs d'inscription
    //Permet de sauvegarder dans l'état local les valeurs des champs
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    saveChanges = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    //Fonction appelée lors de la modification du champ de mail
    //Force l'écriture en minuscule du champ et sauvegarde la valeur dans l'état local
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    handleMailUpdate = event => {
        //automatiquement mettre le mail en minuscules
        this.setState({ mail: event.target.value.toLowerCase() })
    }

    //Fonction appelée lors de la modification du champ de prénom
    //Force l'écriture de la première lettre en majuscule du champ et sauvegarde la valeur dans l'état local
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    handleFirstNameUpdate = (event) => {
        let prenom = event.target.value;
        let prenomMaj = prenom.charAt(0).toUpperCase() + prenom.slice(1);
        this.setState({ prenom: prenomMaj });
    }

    //Fonction appelée lors de la modification du champ de nom
    //Force l'écriture en majuscule du champ et sauvegarde la valeur dans l'état local
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    handleLastNameUpdate = (event) => {
        this.setState({ nom: event.target.value.toUpperCase() });
    }

    //Fonction appelée lors de la modification de la checkbox de consentement
    //Sauvegarde dans l'état local sa valeur
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    handleCheckboxChanges = (event) => {
        this.setState({ consentChecked: event.target.checked });
    }

    //Fonction appelée lorsque l'inscription est effectuée
    //Renvoie sur la page d'accueil
    handleInscriptionFinished = () => {
        this.props.gotoMain();
    }

    //Fonction appelée lors de l'envoi du formulaire d'inscription
    //Paramètre : l'évènement javascript associé à l'appel de la fonction
    sendInscription = event => {
        event.preventDefault()
        //destsructuration pour plus de lisibilité
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
                }
            })
            .catch(err => {
                alert("Un problème est survenu lors de la connexion à la base de donnée. ")
                console.log(err);
            });
        }
    }

    //Affichage de la page d'inscription
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
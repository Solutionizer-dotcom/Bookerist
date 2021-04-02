import './Inscription.css'
import React, { Component } from 'react'
import reactDom from 'react-dom'
import Accueil from './Accueil'
import './Button.css'

class Inscription extends Component {
    state = { nom: '', prenom: '', mail: '', mail2: '', mdp: '', mdp2: ''}

    //fx fleche pour acceder au this
    saveChanges = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    //Arrow fx for binding (gerer this)
    handleMailUpdate = event => {
        //automatiquement mettre le mail en minuscules
        this.setState({ mail: event.target.value.toLowerCase() })
    }

    //fonction en fleche afin de pouvoir acceder au bon this
    sendInscription = event => {
        event.preventDefault()
        //destsructuration pour + de lisibilite
        const {nom, prenom, mail, mail2, mdp, mdp2} = this.state;

        if (mail !== mail2){
            alert("Les deux mails ne correspondent pas.");
        }
        if (mdp !== mdp2){
            alert("Les deux mots de passe ne correspondent pas.");
        }
        else if (mail === mail2 && mdp === mdp2){
            let user = {
                nom: nom,
                prenom: prenom,
                mail: mail,
                mdp: mdp
            };
            fetch("http://localhost:3001/inscription", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(res => {
                console.log(res.message);
                alert("Inscription correctement effectuée !");
                reactDom.render(
                    <Accueil />,
                    document.getElementById('root')
                );
            })
            .catch(err => {
                alert("Un problème est survenu lors de la connexion à la base de donnée. ")
            })
        }
    }

    render() {    
        return (
                <div className="Inscription">
                    <form className="formInscription" name="formInscription" onSubmit={this.sendInscription}>
                        <fieldset>
                            <h2>Inscription</h2>

                            <input type="text" id="nom" name="nom" placeholder="NOM" required
                            onChange={this.saveChanges} />

                            <input type="text" id="prenom" name="prenom" placeholder="Prénom" required
                            onChange={this.saveChanges} />

                            <input type="email" id="mail" name="mail" placeholder="e-mail" required
                            onChange={this.handleMailUpdate}
                            value={this.state.mail} />

                            <input type="email" id="mail2" name="mail2" placeholder="confirmer e-mail" required 
                            onChange={this.saveChanges} />

                            <input type="password" id="mdp" name="mdp" placeholder="mot de passe" required
                            onChange={this.saveChanges} />

                            <input type="password" id="confirmMdp" name="mdp2" placeholder="confirmer mot de passe" required
                            onChange={this.saveChanges} />

                            <input type="submit" id="goInscription" value="Je m'inscris !" />

                        </fieldset>
                    </form>
                </div>
            );
    }
}

export default Inscription;
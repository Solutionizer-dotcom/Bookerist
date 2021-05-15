import React, {Component} from 'react';
import './Accueil.css';
import './Button.css';

//Adresse de l'API à appeler pour la requête de connexion
const connect = "/connect";

//Composant affichant et gérant la page d'accueil lorsque l'utilisateur n'est pas connecté
class Accueil extends Component {
    constructor(props){
        super(props);

        this.state = {
            mail: '', 
            mdp: ''
        };
        //adresse principale de l'API, définie dans App.js
        this.API = this.props.API;
    }

    //Fonction permettant d'utiliser la fonction handlePage de App pour aller directement dans l'inscription
    gotoInscription = () =>{
        this.props.handlePage({ inInscription: true });
    }
    //Fonction permettant d'utiliser la fonction handlePage de App pour aller directement dans le mot de passe oublié
    gotoForgotPass = (event) =>{
        event.preventDefault()
        this.props.handlePage({ inForgotPass: true });
    }
    //Fonction permettant de contrôler les champs de mail et de mot de passe (garder leur valeur dans l'état local)
    //paramètre : l'évènement javascript associé à l'appel de la fonction
    saveChanges = event => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value })
    }
    //Fonction utilisée lorsque l'authentification est réussie qui permet de 
    //sauvegarder les informations de l'utilisateur dans l'état local de App.js
    handleCanBeLogged = (prenom, nom, mail) => {
        this.props.setUserInfos(prenom, nom, mail);
        this.props.connect();
    }
    //Fonction utilisée lorsque l'utilisateur clique sur connexion.
    //Envoie les informations d'authentification à l'API pour en vérifier l'authenticité
    handleConnexion = event => {
        event.preventDefault();

        let user = {
            mail: this.state.mail,
            mdp: this.state.mdp
        }

        fetch(this.API + connect, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
         .then(response => response.json().then(res => ({ status: response.status, data: res })))
         .then(res => {
             if (res.status === 400)
                alert(res.data.message);
            if (res.status === 200)
                this.handleCanBeLogged(res.data.prenom, res.data.nom, res.data.mail);
        })
        .catch(err => {
            alert("Erreur : " + err);
        })
    }

    //rendu du visuel de l'accueil
    render() {
        return (
                <div className="corps">

                    <div className="formulaire">
                        <form name="formConnexion" id="formConnexion" onSubmit={this.handleConnexion}>

                            <input type="email" id="email" name="mail" placeholder="login (email)" required
                            onChange={this.saveChanges} /> <br />

                            <input type="password" id="pwd" name="mdp" placeholder="mot de passe" required
                            onChange={this.saveChanges} /> <br />

                            <input type="submit" id="connect" value="Connexion" /><br />

                            <a href="none" id="pwdforgot" onClick={this.gotoForgotPass} >Mot de passe oublié ?</a>

                            <div className="divInscription">
                                <button type="button" id="inscription" onClick={this.gotoInscription}>Inscription</button>
                            </div>
                        </form>
                    </div>
                </div>
        );
    }
}

export default Accueil;
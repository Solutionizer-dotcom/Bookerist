import React, {Component} from 'react';
import './Accueil.css';
import './Button.css';

const connect = "/connect";

class Accueil extends Component {
    constructor(props){
        super(props);

        this.state = {
            mail: '', 
            mdp: ''
        };
        this.API = this.props.API;
    }

    gotoInscription = () =>{
        this.props.handlePage({ inInscription: true });
    }
    gotoForgotPass = (event) =>{
        event.preventDefault()
        this.props.handlePage({ inForgotPass: true });
    }

    saveChanges = event => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value })
    }

    handleCanBeLogged = (prenom, nom, mail) => {
        this.props.setUserInfos(prenom, nom, mail);
        this.props.connect();
    }

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
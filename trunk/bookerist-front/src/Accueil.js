import React, {Component} from 'react';
import './Accueil.css';
// import reactDom from 'react-dom';
// import Inscription from './Inscription';
import Calendrier from './Calendrier';
import './Button.css';

class Accueil extends Component {
    constructor(props){
        super(props);
        this.state = {
            mail: '', 
            mdp: ''
        };
    }

    gotoInscription = () =>{
        this.props.handlePage({inInscription: true});
    }

    saveChanges = event => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({ [name]: value })
    }

    handleCanBeLogged = (name, mail) => {
        this.props.setNameAndMail(name, mail);
        this.props.handleLoginChange(true);
    }

    handleConnexion = event => {
        event.preventDefault();
        let user = {
            mail: this.state.mail,
            mdp: this.state.mdp
        }
        fetch("http://localhost:3001/connect", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
         .then(response => response.json().then(res => ({ status: response.status, data: res })))
         .then(res => {
            alert(res.data.message);
            if (res.status === 200)
                //console.log(res.data.name);
                this.handleCanBeLogged(res.data.name, res.data.mail);
        })
        .catch(err => {
            alert("Erreur : " + err);
        })
    }

    render() {
        //const loggedIn = this.props.loggedIn;
        return (
                <div className="corps">

                    <div className="formulaire">
                        <form name="formConnexion" id="formConnexion" onSubmit={this.handleConnexion}>

                            <input type="email" id="email" name="mail" placeholder="login (email)" required
                            onChange={this.saveChanges} /> <br />

                            <input type="password" id="pwd" name="mdp" placeholder="mot de passe" required
                            onChange={this.saveChanges} /> <br />

                            <input type="submit" id="connect" value="Connexion" /><br />

                            <a href="none" id="pwdforgot">Mot de passe oublié ?</a>

                            <div className="divInscription">
                                <button type="button" id="inscription" onClick={this.gotoInscription}>Inscription</button>
                            </div>
                        </form>
                    </div>

                    <div className="calendrier">
                        <Calendrier />
                    </div>
                </div>
        );
    }
}

export default Accueil;
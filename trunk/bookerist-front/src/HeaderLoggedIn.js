import './HeaderLoggedIn.css';
import './Button.css';
import reactDom from 'react-dom';
import logo from './logo.png';
import App from './App';
import React, { Component } from 'react';

class HeaderLoggedIn extends Component {
    constructor(props){
        super(props);

        this.state = {
            showMenu: false,
            userName: this.props.user,
        }
    }

    toggleMenu = () => {
        this.setState({showMenu: `${this.state.showMenu ? false : true}`})
        console.log(this.state.showMenu);
    }
    handleDisconnect = () => {
        this.props.handleLoginChange(false);
    }
    render(){
        return (
            <header className="header">
                <button onClick={this.toggleMenu}>
                    Menu
                </button>
                <button onClick={this.handleDisconnect}>
                    Se déconnecter
                </button>
            {this.state.showMenu ? (
                <div className="menu">
                    <button>Ajout créneau</button>
                    <button>Prendre rendez-vous</button>
                    <button>Ajout évènement</button>
                    <button>Manuel d'utilisation</button>
                    <button>Contact</button>
                </div>
            )
        : (null)}
                
                <img className="logo" src={logo} alt="logo" height="32" width="32" onClick={() => reactDom.render(<App />, document.getElementById('root'))}/>
            </header>
        );
    }
}

export default HeaderLoggedIn;
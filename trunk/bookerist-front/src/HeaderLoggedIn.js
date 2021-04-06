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
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu(e) {
        e.preventDefault();
        this.setState(state => ({
            showMenu: !state.showMenu
        }))
    }
    handleDisconnect = () => {
        this.props.handleLoginChange(false);
    }
    // componentDidUpdate(){
    //     console.log("showmenu: " + this.state.showMenu);
    // }

    // showMenu = (event) => {
    //     event.preventDefault();
    //     this.setState({ showMenu: true }, () => {
    //         document.header.addEventListener('click', this.closeMenu);
    //     });
    //     console.log(this.state.showMenu);
    // }
    // closeMenu = () => {
    //     console.log("Je viens la");
    //     this.setState({ showMenu: false }, () => {
    //         document.header.removeEventListener('click', this.closeMenu);
    //     });
    // }
    render(){
        return (
            <header className="header">
                <button 
                onClick={this.toggleMenu}
                className="menu"
                >
                    Menu
                </button>
                
            {
                this.state.showMenu
                ? (
                    <div className="windowMenu">
                        <button 
                        className="listMenu"
                        >
                            Ajout créneau
                        </button>

                        <button
                        className="listMenu"
                        >Prendre rendez-vous
                        </button>

                        <button
                        className="listMenu"
                        >Ajout évènement
                        </button>

                        <button
                        className="listMenu"
                        >Manuel d'utilisation
                        </button>
                        
                        <button
                        className="listMenu"
                        >Contact
                        </button>
                    </div>
                )
                : (null)
            }

            {/* <button onClick={this.handleDisconnect}>
                Se déconnecter
            </button>
                
            <img className="logo" src={logo} alt="logo" height="32" width="32" onClick={() => reactDom.render(<App />, document.getElementById('root'))}/> */}
            </header>
        );
    }
}

export default HeaderLoggedIn;
import './App.css';
import AccueilLoggedIn from './AccueilLoggedIn';
import Accueil from './Accueil';
import Header from './Header';
import HeaderLoggedIn from './HeaderLoggedIn';
import Inscription from './Inscription';
import React, { Component } from 'react';
//import Agenda from './AccueilLoggedIn';
import Contact from './Contact';
import ForgotPass from './ForgotPass';
// import Calendrier from './Calendrier';
import Parametre from './Parametre';

class App extends Component {
  constructor(props){
    super(props);

    this.state = ({

      menuOpened: false,
      profilOpened: false,

      prenom: '',
      nom: '',
      mail: '',

      loggedIn: false,
      inAccueil: true,
      inInscription: false,
      inForgotPass: false,
      inContact: false,
      inParams: false,      
      
    });
  }

  //Quand le composant est monté, il récupère l'état sauvegardé s'il existe
  componentDidMount() {
    let user = window.localStorage.getItem('userInfos');
    if (user != null){
      user = JSON.parse(user);
      this.setState(user);
    }
  }

  //Chaque fois que le composant est mis à jour, on enregistre l'état dans le stockage local
  componentDidUpdate() {
    let user = this.state;
    window.localStorage.setItem('userInfos', JSON.stringify(user));
  }

  //Utilisée lors de la connexion pour enregistrer directement les informations dans l'état
  setUserInfos = (prenom, nom, mail) => {
    this.setState({ prenom, nom, mail });
  }

  //fonction permettant de remettre le state à 0 (lors d'une déconnexion par exemple)
  clearState = () => {
    this.setState({
      menuOpened: false,
      profilOpened: false,

      prenom: '',
      nom: '',
      mail: '',

      loggedIn: false,
      inAccueil: true,
      inInscription: false,
      inForgotPass: false,
      inContact: false,
      inParams: false, 
    })
  }

  //Fonction pour gérer le status de l'utilisateur (connecté ou non)
  handleLoginChange = (loggedIn) => {
    this.setState({ loggedIn });
    if (!loggedIn){
      localStorage.clear();
      this.clearState();
      // this.handlePage({ inAccueil: true });
    }
  }

  //Fonction qui gère le changement de pages
  handlePage = (pages) => {
    //tableau contenant toutes les props éventuelles de pages
    const tab = ["inAccueil", "inInscription", "inForgotPass", "inContact", "inParams"];
    
    //on boucle sur les valeurs de l'objet pages. Si la prop est undefined, on la met a false:
    //ça permet de pouvoir passer en argument seulement la page qu'on veut changer.
    //on modifie l'état directement dans la boucle
    for(let prop of tab){
      pages[prop] = pages[prop] === undefined ? false : pages[prop];
      this.setState({ [prop]: pages[prop] });
    }
  }

  //Fonction pour partager l'état du menu entre la page et le header
  handleMenusAccueil = (menuState) => {
    //comme pour handlePage on fait un tableau pour modifier facilement le cas échéant
    //la boucle permet de ne jamais ouvrir les deux menus en même temps
    const tab = ["menuOpened", "profilOpened"];
    for(let prop of tab){
      menuState[prop] = menuState[prop] === undefined ? false : menuState[prop];
      this.setState({ [prop]: menuState[prop] });
    }
  }
  
  //Quand le composant va être démonté, on s'assure de vider le stockage local
  componentWillUnmount() {
    localStorage.clear();
  }

  render(){
    // const loggedIn = this.state.loggedIn;
    // const inInscription = this.state.inInscription;
    
    const { nom, prenom, mail, loggedIn, inAccueil, inInscription, inForgotPass, inContact, inParams } = this.state;
    let header = null;
    let page = null;

    loggedIn
    ? header = (
    <HeaderLoggedIn
    prenom={prenom}
    mail={mail}
    disconnect={() => this.handleLoginChange(false)}
    gotoMain={() => this.handlePage({ inAccueil: true })}
    handlePage={this.handlePage}
    handleMenus={this.handleMenusAccueil}
    />
    )
    : header = (
    <Header 
    gotoMain={() => this.handlePage({ inAccueil: true })} />
    );

    if (inAccueil){
      loggedIn
      ? page = (
      <AccueilLoggedIn
      menuOpened={this.state.menuOpened}
      profilOpened={this.state.profilOpened}
       />
      // <Calendrier />
      )
      : page = (
      <Accueil 
      handlePage={this.handlePage}
      setUserInfos={this.setUserInfos}
      connect={() => this.handleLoginChange(true)} />
      );
    }
    if (inInscription){
      page = (
        <Inscription 
        gotoMain={() => this.handlePage({ inAccueil: true })} />
      );
    }
    if (inForgotPass){
      page = (
        <ForgotPass />
      );
    }
    if (inContact){
      page = (
        <Contact 
        prenom={prenom}
        nom={nom}
        mail={mail}
        gotoMain={() => this.handlePage({ inAccueil: true })} />
      );
    }
    
    if (inParams){
      page = (
        <Parametre
        mail={mail}
        />
      );
    }

    return(
      <div className="App">
        {header}
        {page}
      </div>
    );
  }
}

export default App;

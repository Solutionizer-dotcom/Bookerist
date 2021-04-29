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

const API = "https://bookerist-back.herokuapp.com";

class App extends Component {
  constructor(props){
    super(props);

    this.state = ({
      eventType: '',
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
      eventType:'',
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

  handleEventType = ({ eventType }) => {
    this.setState({ eventType });
  }

  clearEventType = () => {
    this.setState({
      eventType: '',
    })
  }
  
  handleChangeParams = (newMail) =>{
    this.setState({
      mail: newMail,
    })
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
    giveEventType={this.handleEventType}
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
      API={API}
      menuOpened={this.state.menuOpened}
      profilOpened={this.state.profilOpened}
      eventType={this.state.eventType}
      clearEventType={this.clearEventType}
      mail={this.state.mail}
       />
      // <Calendrier />
      )
      : page = (
      <Accueil 
      API={API}
      handlePage={this.handlePage}
      setUserInfos={this.setUserInfos}
      connect={() => this.handleLoginChange(true)} />
      );
    }
    if (inInscription){
      page = (
        <Inscription 
        API={API}
        gotoMain={() => this.handlePage({ inAccueil: true })}
        />
      );
    }
    if (inForgotPass){
      page = (
        <ForgotPass 
        API={API}
        />
      );
    }
    if (inContact){
      page = (
        <Contact 
        API={API}
        prenom={prenom}
        nom={nom}
        mail={mail}
        gotoMain={() => this.handlePage({ inAccueil: true })} />
      );
    }
    
    if (inParams){
      page = (
        <Parametre
        API={API}
        mail={mail}
        handleChangeParams = {this.handleChangeParams}
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

import './App.css';
import AccueilLoggedIn from './AccueilLoggedIn';
import Accueil from './Accueil';
import Header from './Header';
import HeaderLoggedIn from './HeaderLoggedIn';
import Inscription from './Inscription';
import React, { Component } from 'react';
import Contact from './Contact';
import ForgotPass from './ForgotPass';
import Parametre from './Parametre';

//Adresse de l'api
const API = "https://bookerist-back.herokuapp.com";

//Composant gérant l'affichage de tous les composants
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

  //Chaque fois que le composant est mis à jour, enregistrement de l'état dans le stockage local
  componentDidUpdate() {
    let user = this.state;
    window.localStorage.setItem('userInfos', JSON.stringify(user));
  }

  //Utilisée lors de la connexion pour enregistrer directement les informations dans l'état
  setUserInfos = (prenom, nom, mail) => {
    this.setState({ prenom, nom, mail });
  }

  //fonction permettant de remettre l'état à sa valeur par défaut (lors d'une déconnexion par exemple)
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
  //paramètre : booléen
  handleLoginChange = (loggedIn) => {
    this.setState({ loggedIn });
    if (!loggedIn){
      localStorage.clear();
      this.clearState();
    }
  }

  //Fonction qui gère le changement de pages
  //Elle est passée à tous les composants afin qu'ils puissent faire remonter l'information de la page à afficher
  //paramètre : objet contenant le nom de la page demandée
  handlePage = (pages) => {
    //tableau contenant toutes les valeurs possibles de pages
    const tab = ["inAccueil", "inInscription", "inForgotPass", "inContact", "inParams"];
    
    //Boucle parcourant les valeurs de l'objet pages. Pour chaque valeur, si elle est undefined, on la met a false.
    //Permet de pouvoir passer en argument seulement la page que l'on veut changer.
    //Modification de l'état local directement dans la boucle
    for(let prop of tab){
      pages[prop] = pages[prop] === undefined ? false : pages[prop];
      this.setState({ [prop]: pages[prop] });
    }
  }

  //Fonction pour partager l'état des menus entre la page et le header (ouvert / fermé) permettant ainsi de jouer l'animation
  //de décalage de l'agenda vers la droite ou vers la gauche
  //paramètre : objet contenant l'état des différents menus
  handleMenusAccueil = (menuState) => {
    //comme pour handlePage, le tableau contient les valeurs possibles et permet de pouvoir en ajouter ou les modifier facilement
    const tab = ["menuOpened", "profilOpened"];

    for(let prop of tab){
      menuState[prop] = menuState[prop] === undefined ? false : menuState[prop];
      this.setState({ [prop]: menuState[prop] });
    }
  }

  //Appelée par HeaderLoggedIn, sert à envoyer l'information du type d'évènement à créer
  //pour le composant AgendaModal à l'intérieur d'Agenda à l'intérieur de AccueilLoggedIn
  //Utile dans le cas où plusieurs types d'évènements existent (projet initial)
  //paramètre : String correspondant au type d'évènement
  handleEventType = ({ eventType }) => {
    this.setState({ eventType });
  }

  //La propriété du type d'évènement est remise à sa valeur par défaut
  clearEventType = () => {
    this.setState({
      eventType: '',
    })
  }
  
  //Fonction appelée lorsque le mail de l'utilisateur est modifié dans les paramètres
  //paramètre : objet contenant la String correspondant au nouveau mail
  handleChangeParams = (newMail) =>{
    this.setState({
      mail: newMail,
    })
  }

  //Quand le composant va être démonté, le stockage local est vidé
  componentWillUnmount() {
    localStorage.clear();
  }

  //rendu conditionnel des pages
  render(){
    //destructuration des variable de l'état local pour une manipulation plus simple et plus lisible
    const { nom, prenom, mail, loggedIn, inAccueil, inInscription, inForgotPass, inContact, inParams } = this.state;
    let header = null; //Sa valeur est le composant à afficher en fonction du contexte (connecté ou non)
    let page = null; //Sa valeur est le composant à afficher en fonction de la page demandée et du contexte

    //Quand l'utilisateur est connecté, le HeaderLoggedIn est utilisé, Header sinon
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

    //Si la page demandée est l'accueil, on vérifie si l'utilisateur est connecté ou non pour afficher la bonne page d'accueil
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
      )
      : page = (
      <Accueil 
      API={API}
      handlePage={this.handlePage}
      setUserInfos={this.setUserInfos}
      connect={() => this.handleLoginChange(true)} />
      );
    }
    //Si page demandée = inscription
    if (inInscription){
      page = (
        <Inscription 
        API={API}
        gotoMain={() => this.handlePage({ inAccueil: true })}
        />
      );
    }
    //Si page demandée = mot de passe oublié
    if (inForgotPass){
      page = (
        <ForgotPass 
        API={API}
        />
      );
    }
    //Si page demandée = contact
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
    //Si page demandée = parametre
    if (inParams){
      page = (
        <Parametre
        API={API}
        mail={mail}
        handleChangeParams = {this.handleChangeParams}
        />
      );
    }

    //La valeur renvoyée (et donc injecté dans la page HTML) est toujours un header suivi d'une page, définis plus haut
    return(
      <div className="App">
        {header}
        {page}
      </div>
    );
  }
}

export default App;

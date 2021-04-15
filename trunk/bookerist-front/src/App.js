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
import Calendrier from './Calendrier';

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
      
    });
  }


  componentDidMount() {
    let user = window.localStorage.getItem('userInfos');
    if (user != null){
      user = JSON.parse(user);
      this.setState(user);
    }
  }

  componentDidUpdate() {
    let user = this.state;
    window.localStorage.setItem('userInfos', JSON.stringify(user));
  }

  setUserInfos = (prenom, nom, mail) => {
    this.setState({ prenom, nom, mail });
  }

  handleLoginChange = (loggedIn) => {
    this.setState({ loggedIn });
    if (!loggedIn){
      this.handlePage({ inAccueil: true });
    }
  }

  handlePage = (pages) => {
    //tableau contenant toutes les props éventuelles de pages
    const tab = ["inAccueil", "inInscription", "inForgotPass", "inContact"];
    
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
  
  // componentWillUnmount() {
  //   localStorage.clear();
  // }

  render(){
    // const loggedIn = this.state.loggedIn;
    // const inInscription = this.state.inInscription;
    
    const { nom, prenom, mail, loggedIn, inAccueil, inInscription, inForgotPass, inContact } = this.state;
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
    

    return(
      <div>
        {header}
        {page}
      </div>
    );





    // if(inInscription){
    //   return (
    //     <div>
    //     <Header 
    //     handlePage={this.handlePage} />
    //     <Inscription 
    //     handlePage={this.handlePage} />
    //     </div>
    //   );
    // }
    // return (
    //       <div className="main">
    //         {
    //         loggedIn
    //         ?(
    //         <div className="accLoggedIn">
    //           <HeaderLoggedIn 
    //           handlePage={this.handlePage}
    //           handleDisconnect={() => this.handleLoginChange(false)}
    //           nom={this.state.nom}
    //           mail={this.state.mail}/>

    //           <Agenda />
    //           {/* <AccueilLoggedIn
    //           name={this.state.name}
    //           mail={this.state.name}
    //           handleLoginChange={this.handleLoginChange} /> */}
    //         </div>
    //         )
    //         :(
    //         <div className="Accueil">
    //           <Header 
    //           handlePage={this.handlePage} />
    //           <Accueil
    //           setUserInfos={this.setUserInfos}
    //           handleLoginChange={this.handleLoginChange}
    //           handlePage={this.handlePage} />
    //         </div>
    //         )
    //         }
    //       </div>
    // );
  }
}

export default App;

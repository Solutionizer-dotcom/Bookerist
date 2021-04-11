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

class App extends Component {
  constructor(props){
    super(props);
    this.state = ({
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
      //console.log("user: ", user);
      user = JSON.parse(user);
      this.setState(user);
    }
  }

  componentDidUpdate(){
    window.localStorage.setItem('userInfos', JSON.stringify(this.state));
    //console.log(this.state);
  }

  setUserInfos = (prenom, nom, mail) => {
    this.setState({ prenom: prenom, nom: nom, mail: mail });
  }

  handleLoginChange = (loggedIn) => {
    console.log("login changed: " + loggedIn);
    this.setState({ loggedIn });
  }

  handlePage = ({inAccueil, inInscription, inForgotPass, inContact}) => {
    if (inAccueil){
      this.setState({inAccueil, inInscription: false, inForgotPass: false, inContact: false });
    }
    else if (inInscription){
      this.setState({inAccueil: false, inInscription, inForgotPass: false, inContact: false });
    }
    else if (inContact){
      this.setState({inAccueil: false, inInscription: false, inForgotPass: false, inContact });
    }
    else if (inForgotPass){
      this.setState({inAccueil: false, inInscription: false, inForgotPass, inContact: false });
    }
    // this.setState(inAccueil, inInscription, inForgotPass);
  }
  
  componentWillUnmount() {
    window.localStorage.removeItem('userInfos');
    window.localStorage.removeItem('contactSent');
  }

  render(){
    // const loggedIn = this.state.loggedIn;
    // const inInscription = this.state.inInscription;
    const {nom, prenom, mail, loggedIn, inAccueil, inInscription, inContact, inForgotPass} = this.state;
    let header = null;
    let page = null;

    loggedIn
    ? header = (
    <HeaderLoggedIn
    prenom={prenom}
    mail={mail}
    disconnect={() => this.handleLoginChange(false)}
    gotoMain={() => this.handlePage({ inAccueil: true })}
    handlePage={this.handlePage} />
    )
    : header = (
    <Header 
    gotoMain={() => this.handlePage({ inAccueil: true })} />
    );

    if (inAccueil){
      loggedIn
      ? page = (
      <AccueilLoggedIn
       />
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

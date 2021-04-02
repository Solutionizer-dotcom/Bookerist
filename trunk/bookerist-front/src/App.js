import './App.css';
import AccueilLoggedIn from './AccueilLoggedIn';
import Accueil from './Accueil';
import Header from './Header';
import HeaderLoggedIn from './HeaderLoggedIn';
import Inscription from './Inscription';
import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props);
    this.state = ({
      name: '',
      mail: '',
      loggedIn: false,
      inAccueil: false,
      inInscription: false,
      inForgotPass: false
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

  setNameAndMail = (name, mail) => {
    this.setState({ name: name, mail: mail});
  }

  handleLoginChange = (loggedIn) => {
    this.setState({ loggedIn });
  }

  handlePage = ({inAccueil, inInscription, inForgotPass}) => {
    if (inAccueil){
      this.setState({inAccueil, inInscription: false, inForgotPass: false});
    }
    else if (inInscription){
      this.setState({inAccueil: false, inInscription, inForgotPass: false});
    }
    else{
      this.setState({inAccueil: false, inInscription: false, inForgotPass});
    }
    
  }
  componentDidUpdate(){
    window.localStorage.setItem('userInfos', JSON.stringify(this.state));
    //console.log(this.state);
  }
  render(){
    const loggedIn = this.state.loggedIn;
    const inInscription = this.state.inInscription;
    if(inInscription){
      return (
        <div>
        <Header 
        handlePage={this.handlePage} />
        <Inscription />
        </div>
      );
    }
    return (
          <div className="main">
            {loggedIn
            ?(
            <div className="accLoggedIn">
              <HeaderLoggedIn 
              handlePage={this.handlePage}
              handleLoginChange={this.handleLoginChange}
              name={this.state.name}
              mail={this.state.name}/>
              <AccueilLoggedIn
              name={this.state.name}
              mail={this.state.name}
              handleLoginChange={this.handleLoginChange} />
            </div>)
            :(
            <div className="Accueil">
              <Header 
              handlePage={this.handlePage} />
              <Accueil
              setNameAndMail={this.setNameAndMail}
              handleLoginChange={this.handleLoginChange}
              handlePage={this.handlePage} />
            </div>)
            }
          </div>
    );
  }
}

export default App;

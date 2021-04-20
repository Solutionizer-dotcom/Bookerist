import './AccueilLoggedIn.css';
import React, { Component } from 'react';
import Agenda from './Agenda';


const baseURL = "http://localhost:3001";

class AccueilLoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      menuOpened: false,
      profilOpened: false,
    }
  }

 componentDidUpdate(prevState){
   const menuOpened = this.props.menuOpened;
   const profilOpened = this.props.profilOpened;
   if (prevState.menuOpened !== menuOpened || prevState.profilOpened !== profilOpened){
     this.setState({ menuOpened, profilOpened });
   }
   
 }

  render() {
    const divClass = this.state.menuOpened ? 'menuOpened' : (this.state.profilOpened ? 'profilOpened' : '');
    
    return (
    <div id="accLoggedIn" className={divClass}>
      <Agenda />
    </div>

    );
  }
}

export default AccueilLoggedIn;
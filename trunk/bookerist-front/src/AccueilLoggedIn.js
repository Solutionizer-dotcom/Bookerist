import './AccueilLoggedIn.css';
import React, { Component } from 'react';
import Agenda from './Agenda';


// const baseURL = "http://localhost:3001";

class AccueilLoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      mail: this.props.mail,
      eventType: '',
      menuOpened: false,
      profilOpened: false,
    }
  }
  
  componentDidUpdate(prevProps){
   const menuOpened = this.props.menuOpened;
   const profilOpened = this.props.profilOpened;
   if (prevProps.menuOpened !== menuOpened || prevProps.profilOpened !== profilOpened){
     this.setState({ menuOpened, profilOpened });
   }
  
   if (this.props.eventType !== this.state.eventType)
   {
      this.setState({ eventType: this.props.eventType });
   }
   if (prevProps.mail !== this.props.mail)
   {
     this.setState({ mail: this.props.mail });
   }
 }

 clearEventType = () => {
   this.setState({
     eventType: '',
   });
   this.props.clearEventType();
 }

  render() {
    const divClass = this.state.menuOpened ? 'menuOpened' : (this.state.profilOpened ? 'profilOpened' : '');
    
    return (
    <div id="accLoggedIn" className={divClass}>
      <Agenda
      eventType={this.state.eventType}
      clearEventType={this.clearEventType}
      mail={this.state.mail}
      />
    </div>

    );
  }
}

export default AccueilLoggedIn;
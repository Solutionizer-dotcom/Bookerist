import './AccueilLoggedIn.css';
import React, { Component } from 'react';
import Agenda from './Agenda';

//Composant affichant et gérant la page d'accueil une fois connecté
class AccueilLoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      mail: this.props.mail,
      eventType: '',
      menuOpened: false,
      profilOpened: false,
    }
    this.API= this.props.API
  }

  //Chaque fois que le composant est mis à jour, les propriétés sont actualisées dans l'état local si elles ont changé
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

 //Fonction remettant l'état du type de l'évènement à sa valeur par défaut
 clearEventType = () => {
   this.setState({
     eventType: '',
   });
   this.props.clearEventType();
 }
 
//rendu du visuel de l'accueil, i.e. l'agenda
  render() {
    const divClass = this.state.menuOpened ? 'menuOpened' : (this.state.profilOpened ? 'profilOpened' : '');
    
    return (
    <div id="accLoggedIn" className={divClass}>
      <Agenda
      API={this.API}
      eventType={this.state.eventType}
      clearEventType={this.clearEventType}
      mail={this.state.mail}
      />
    </div>

    );
  }
}

export default AccueilLoggedIn;
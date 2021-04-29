import './HeaderLoggedIn.css';
import './Button.css';
import logo from './img/logo.png';
import React, { useEffect, useState } from 'react';

export default function HeaderLoggedIn(props) {
  const [state, setState] = useState({
    menuOpened: false,
    profilOpened: false,
  });
  // const [eventType, setEventType] = useState("");

  // const {handleMenus} = props.handleMenus();
  //A chaque fois que le state est modifié et qu'un menu est ouvert, on vérifie si on clique en dehors du menu
  useEffect(() => {
    function handleCloseMenus(){
      props.handleMenus({ menuOpened: false, profilOpened: false});
      setState({
        ...state,
        menuOpened: false,
        profilOpened: false,
      });

    }

    if (state.profilOpened || state.menuOpened){
      window.addEventListener('click', handleCloseMenus);
    }
    return function (){
      window.removeEventListener('click', handleCloseMenus);
    }
  });

  function toggleProfil (event) {
    event.preventDefault();
    event.stopPropagation();
    props.handleMenus({ profilOpened : !state.profilOpened })
    setState(state => {
        return {
          ...state,
          profilOpened: !state.profilOpened,
        }
      });
  }

  function toggleMenu(event){
    event.preventDefault();
    event.stopPropagation();
    props.handleMenus({ menuOpened: !state.menuOpened });
    setState(state => {
      return {
        ...state,
        menuOpened: !state.menuOpened,
      }
    });
  }

  function handleDisconnect (e) {
    e.preventDefault();
    e.stopPropagation();

    //on supprime les données sauvegardées en local de l'utilisateur puis on le déconnecte
    localStorage.clear();
    props.disconnect();
  }

  function handleGotoMain(e) {
    e.preventDefault();
    e.stopPropagation();
    setState({
      menuOpened: false,
      profilOpened: false,
    });
    props.gotoMain();
    
  }

  function handlePageMenu(e){
    e.preventDefault();
    e.stopPropagation();
    const page = e.target.name;
    const pageName = `in${page}`
    setState({
      menuOpened: false,
      profilOpened: false,
    });
    props.handlePage({ [pageName]: true });
  }

  function handleEventMenu(e){
    e.preventDefault();
    // setEventType(e.target.name);

    props.giveEventType({eventType: e.target.name});
  }

  return (
    <header className="headerLoggedIn">

      

      <ul className="menu">
          <li id="liMenu">
            <a href='none' onClick={toggleMenu}>MENU</a>
              {state.menuOpened
              ? (
                <ul id="choixMenu">
                  <li>
                    <a href='none' name="Accueil" onClick={handlePageMenu}>Accueil</a>
                  </li>
                  {/* <li>      
                    <a href='none' name="dispo" onClick={handleEventMenu}>Ajout disponibilité</a>
                  </li>
                  <li>
                    <a href='none' name="rdv" onClick={handleEventMenu}>Prendre rendez-vous</a>
                  </li>         */}
                  <li>
                    <a href='none' name="evenement" onClick={handleEventMenu}>Créer évènement</a>
                  </li>
                  <li>
                    <a href='none' name="Manuel" onClick={handlePageMenu}>Manuel d'utilisation</a>
                  </li>
                  <li>
                    <a href='none' name="Contact" onClick={handlePageMenu}>Contact</a>
                  </li>        
                </ul>
              )
              : (null)
              }
          </li>
          <li>
            <img id="logoLoggedIn" src={logo} alt="logo" width="32" height="32"
            onClick={handleGotoMain} />
          </li>
          <li id="liProfil">
            <a href="none" onClick={toggleProfil}>{props.prenom.toUpperCase()} ({props.mail})</a>
            {state.profilOpened
            ? (
              <ul id="choixProfil">
              <li>
                <a href="none" name="Params" onClick={handlePageMenu}>Paramètres</a>
              </li>
              <li>
                <a href="none" onClick={handleDisconnect}>Se déconnecter</a>
              </li>
            </ul>
            )
            : (null)
            }
          </li>
        </ul>
    </header>
  );
}
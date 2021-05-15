import './HeaderLoggedIn.css';
import './Button.css';
import logo from './img/logo.png';
import React, { useEffect, useState } from 'react';

//Composant affichant et gérant le header une fois connecté
export default function HeaderLoggedIn(props) {
  const [state, setState] = useState({
    menuOpened: false,
    profilOpened: false,
  });

  //A chaque fois que le state est modifié et qu'un menu est ouvert, écoute d'un clic en dehors du menu
  //Si un clic en dehors des menus est capté alors le menu est fermé
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

  //Fonction permettant d'ouvrir ou fermer le profil
  //Paramètre : l'évènement javascript associé à l'appel de la fonction
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

  //Fonction permettant d'ouvrir ou fermer le menu
  //Paramètre : l'évènement javascript associé à l'appel de la fonction
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

  //Fonction appelée au clic sur déconnexion
  //Déconnecte l'utilisateur et supprime toutes les informations stockées dans le stockage local
  function handleDisconnect (e) {
    e.preventDefault();
    e.stopPropagation();

    //Suppression des données sauvegardées en local de l'utilisateur puis déconnexion
    localStorage.clear();
    props.disconnect();
  }

  //Fonction permettant de retourner à l'accueil
  //Paramètre : l'évènement javascript associé à l'appel de la fonction
  function handleGotoMain(e) {
    e.preventDefault();
    e.stopPropagation();
    setState({
      menuOpened: false,
      profilOpened: false,
    });
    props.gotoMain();
  }

  //Fonction permettant d'aller à la page choisie depuis le menu
  //Elle est automatisée pour renvoyer vers la page de même nom que l'attribut name de la balise depuis laquelle elle est appelée
  //Paramètre : l'évènement javascript associé à l'appel de la fonction
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

  //Fonction appelée au clic sur ajouter évènement
  //Permet de faire remonter le type d'évènement à créer au menu de création d'évènement
  //dans le cas où plusieurs types d'évènements existent
  //Paramètre : l'évènement javascript associé à l'appel de la fonction
  function handleEventMenu(e){
    e.preventDefault();
    props.giveEventType({eventType: e.target.name});
  }

  //Affichage du header une fois connecté
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
                    <a href="https://github.com/Solutionizer-dotcom/Bookerist/tree/master/bookerist_manuel_utilisation.pdf" target="_blank" rel="noreferrer" download="Bookerist_manuel_utilisation.pdf" name="Manuel" >Manuel d'utilisation</a>
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
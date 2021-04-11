import './HeaderLoggedIn.css';
import './Button.css';
import logo from './logo.png';
import React, { useEffect, useState } from 'react';

export default function HeaderLoggedIn(props) {
  const [state, setState] = useState({
    menuOpen: false,
    profilOpen: false,
  });

  //A chaque fois que le state est modifié, on vérifie si on clique en dehors du menu
  useEffect(() => {
    if (state.profilOpen){
      window.addEventListener('click', toggleProfil);
    }
    return function (){
      window.removeEventListener('click', toggleProfil);
    }
  }, [state]);

  useEffect(() => {
    if (state.menuOpen){
      window.addEventListener('click', toggleMenu);
    }
    return function (){
      window.removeEventListener('click', toggleMenu);
    }
  }, [state]);

  function toggleProfil (event) {
    event.preventDefault();
    event.stopPropagation();
    setState((state) => {
        return {
          ...state,
          profilOpen: !state.profilOpen,
          menuOpen: state.menuOpen
        };
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
    props.gotoMain();
    setState(false);
  }

  function handlePageMenu(e){
    e.preventDefault();
    e.stopPropagation();
    const page = e.target.name;
    const pageName = `in${page}`
    setState(false);
    props.handlePage({ [pageName]: true });
  }

  function toggleMenu(event){
    event.preventDefault();
    event.stopPropagation();
    setState(state => {
      return {
        ...state,
        menuOpen: !state.menuOpen,
      }
    })
  }
  return (
    <header className="headerLoggedIn">

      <img id="logoLoggedIn" src={logo} alt="logo" width="32" height="32"
      onClick={handleGotoMain} />

      <ul className="menu">
          <li id="liMenu">
            <a href='none' onClick={toggleMenu}>MENU</a>
              {state.menuOpen
              ? (
                <ul id="choixMenu">
                  <li>
                    <a href='none' onClick={handleGotoMain}>Accueil</a>
                  </li>
                  <li>      
                    <a href='none' name="Creneau" onClick={handlePageMenu}>Ajout créneau</a>
                  </li>
                  <li>
                    <a href='none' name="Rdv" onClick={handlePageMenu}>Prendre rendez-vous</a>
                  </li>        
                  <li>
                    <a href='none' name="Event" onClick={handlePageMenu}>Créer évènement</a>
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
          <li id="liProfil">
            <a href="none" onClick={toggleProfil}>{props.prenom.toUpperCase()} ({props.mail})</a>
            {state.profilOpen
            ? (
              <ul id="choixProfil">
              <li>
                <a href="none" name="Settings" onClick={handlePageMenu}>Paramètres</a>
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
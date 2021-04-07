import React from 'react'
import ReactDOM from 'react-dom'
import App from './App';
import HeaderLoggedIn from './HeaderLoggedIn';
import reportWebVitals from './reportWebVitals'
//import Test from './Test';
import Header from './Header'
//import Accueil from './Accueil'
import Inscription from './Inscription';

ReactDOM.render(
  <div>
    <App />
    {/* <HeaderLoggedIn name="Yanis" mail="mail@mail.fr"/> */}
  </div>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import logo from './img/logo.png';
import './Header.css';

//Composant affichant le header
const Header = (props) => {
    
    //Fonction appelant la fonction gotoMain passée en propriété
    //du composant permettant de retourner à la page d'accueil
    function handleGotoMain(){
        props.gotoMain();
    }

    //Affichage du header
    return (
        <header className="header">
            <img className="logo" src={logo} alt="logo" height="32" width="32" onClick={handleGotoMain}/>
            <h1 id="titreHeader">BOOKERIST</h1>
        </header>
    )
}

export default Header;
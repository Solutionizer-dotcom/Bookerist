import logo from './logo.png';
import './Header.css';

const Header = (props) => {
    const handleGotoMain = () => {
        props.gotoMain();
    }
    return (
        <header className="header">
            <img className="logo" src={logo} alt="logo" height="32" width="32" onClick={handleGotoMain}/>
            <h1 id="titreHeader">BOOKERIST</h1>
        </header>
    )
}

export default Header;
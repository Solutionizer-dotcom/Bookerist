import './AccueilLoggedIn.css'
import './Button.css'

const AccueilLoggedIn = (props) => {
    return(
        <div className="AccLoggedIn">
        
        <h1>Bonjour {props.name} !</h1>
        </div>
    );
}

export default AccueilLoggedIn;
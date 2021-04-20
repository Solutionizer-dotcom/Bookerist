import React, { Component } from 'react';
import './AgendaModal.css';
import './Button.css';

let eventId = 0;

//Composant permettant d'afficher le modal pour créer un évènement dans l'agenda
export default class AgendaModal extends Component {
    constructor(props){
        super(props);

        //Définission de l'état, par défaut le eventType sera disponibilité
        this.state = {
            eventType: this.props.eventType ? this.props.eventType : "dispo",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            getProps: false, //pour ne récupérer les props qu'une fois
        }
    }
    componentDidUpdate(){
        console.log("update, getProps: " + this.state.getProps);
        const listProps = ["startDate", "startTime", "endDate", "endTime"];
        if (!this.state.getProps)
        {
            for(let prop of listProps)
            {
                this.setState({
                    [prop]: this.props[prop] ? this.props[prop] : ''
                });
            }
            this.setState({ getProps: true});
        }
        
        // let modal = document.getElementById("modal");
        // this.state.openModal ? modal.style.display = "block" : modal.style.display = "none";
    }

    clearState(){
        this.setState({
            eventType: this.props.eventType ? this.props.eventType : "dispo",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            getProps: false,
        })
    }

    //On génère le texte pour le header du modal en fonction de l'objet à créer
    //Fonction fléchée pour accéder au this
    getHeaderTxt = () => {
        const eventTxt = {
            dispo: "Créer une nouvelle disponibilité",
            rdv: "Créer un nouveau rendez-vous",
            evenement: "Créer un nouvel évènement",
        };
        return eventTxt[this.state.eventType];
    }

    //fonction fléchée pour accéder au this
    handleChanges = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value,
        });
    }
    //fonction fléchée pour accéder au this
    handleCheckboxChanges = (e) => {
        //pour l'instant seulement pour le allDay
        const name = e.target.name;
        const value = e.target.checked;
        if (value === true)
            this.setState({
                startTime: '',
                endTime: '',
            });
        this.setState({
            [name]: value,
        })
    }

    handleReset = (e) => {
        this.setState({
            eventType: "dispo",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
        })
    }

    handleClose = (e) => {
        // var modal = document.getElementById("modal");
        // modal.style.display = "none";
        this.props.handleCloseModal();
    }
    
    handleSave = () => {
        const event = {
            id: eventId++,
            title: this.state.eventType === "dispo" ? "disponibilité" : this.state.objet,
            extendedProps: this.state.description ? {
                description: this.state.description
            } : null,
            allDay: this.state.allDay,
            start: (this.state.startDate + (!this.state.allDay ? "T" + this.state.startTime : '')),
            end: (this.state.endDate + (!this.state.allDay ? "T" + this.state.endTime : ''))
        }
        this.clearState();
        this.props.handleAddEvent(event);
        this.handleClose();
    }

    render(){
        const headerTxt = this.getHeaderTxt();
        const eventType = this.state.eventType ? this.state.eventType : "dispo";
        return (
            //L'ensemble du modal
            <div className="agendaModal" id="modal">

                {/* Le contenu du modal */}
                <div className="agendaModal" id="modal-content">
                    <header>
                        <span className="close" onClick={this.handleClose}>&times;</span>
                        <h1>{headerTxt}</h1>
                    </header>
                    <form id="formInfosEvent">
                        <div id="type">
                            <label htmlFor="eventType" id="labelType">Type : </label>
                            <select name="eventType" className="listeType" id={eventType} onChange={this.handleChanges}>
                                <option value="dispo">disponibilité</option>
                                <option value="rdv">rendez-vous</option>
                                <option value="evenement">évènement</option>
                            </select>
                        </div>
                        <div id="all-day">
                            <input type="checkbox" name="allDay" id="allDay" value="allDay" onChange={this.handleCheckboxChanges}/>
                            <label htmlFor="allDay" name="labelAllDay" id="labelAllDay">Toute la journée</label>
                        </div>
                        {this.renderEventTypeContent()}
                        <footer>
                            {/* <button type="button" name="reset" className="modalButton" id="reset" onClick={this.handleReset}>Réinitialiser</button> */}
                            <input type="reset" name="reset" className="modalButton" value="Réinitialiser" onClick={this.handleReset}/>
                            <button type="button" name="save" className="modalButton" id="save" onClick={this.handleSave}>Sauvegarder</button>
                        </footer>
                    </form>
                </div>

            </div>
        );
    };

    //fonction pour afficher les informations à remplir en fontion du type d'objet à créer
    //fonction fléchée pour accéder au this
    renderEventTypeContent = () => {
        let content = null;
        // let startDate = this.props.startDate ? this.props.startDate : '';
        // let startTime = this.props.startTime ? this.props.startTime : '';
        // let endDate = this.props.endDate ? this.props.endDate : '';
        // let endTime = this.props.endTime ? this.props.endTime : '';

        if(this.state.eventType === false || this.state.eventType === "dispo")
        {
            content = (
                <div className="eventTypeContent">
                    <table className="tableEventTypeContent">
                        <tbody>
                            <tr className="startDate">
                                <td>
                                    <label htmlFor="startDate">Date de début : </label>
                                </td>
                                <td>
                                    <input type="date" name="startDate" onChange={this.handleChanges}
                                    value={this.state.startDate} />
                                    <input type="time" name="startTime" onChange={this.handleChanges}
                                    value={this.state.startTime} disabled={this.state.allDay}/>
                                </td>
                            </tr>
                            <tr className="endDate">
                                <td>
                                    <label htmlFor="endDate">Date de fin : </label>
                                </td>
                                <td>
                                    <input type="date" name="endDate" onChange={this.handleChanges}
                                    value={this.state.endDate} />
                                    <input type="time" name="endTime" onChange={this.handleChanges}
                                    value={this.state.endTime} disabled={this.state.allDay}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
        return content;
    }
}
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin, { toMoment } from '@fullcalendar/moment';
import React, { Component } from 'react'
import './Agenda.css';
import AgendaModal from './AgendaModal';

//Différentes routes utilisées pour les requêtes à l'API
const events_get = "/events/get";
const event_save = "/event/save";
const event_remove = "/event/remove";

//Classe affichant et gérant l'agenda et le menu de modification d'évènements
export default class Agenda extends Component {
    constructor(props){
        super(props);

        this.state = {
            mail: this.props.mail,
            eventType: '',
            openModal: false,
            objet: '',
            description: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            allDay: false,
            eventId: '',
            users_invited: [],
            modifier: false,
            editable: true,
            user_events: [],
            getEvents: false, //doit-on récupérer les evenements dans la bdd ?
        }
        this.API = this.props.API;
    }
    calendarRef = React.createRef(); //Création d'une référence pour le calendrier pour pouvoir utiliser les methodes la nécessitant

    //Au montage du composant, récupération dans la base de données de tous les évènements
    componentDidMount(){
        this.setState({ getEvents: true });
    }

    //Après mise à jour du composant, récupération des propriétés différentes des précédentes
    //Si getEvents est à true, les évènements n'ont pas encore été récupérés, alors requête envoyée à l'API puis enregistrement
    componentDidUpdate(prevProps){
        if(this.props.eventType && this.props.eventType !== this.state.eventType)
        {
            this.setState({
                eventType: this.props.eventType,
                openModal: true,
            });
        }
        if (prevProps && prevProps.mail !== this.props.mail)
        {
            this.setState({ mail: this.props.mail });
        }

        //Récupération de tous les events dans la bdd
        if (this.state.getEvents)
        {
            this.setState({ getEvents: false });
            fetch(this.API + events_get, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({mail: this.state.mail })
            })
            .then((res) => {
                if (res.ok)
                {
                    res.json().then((res) => {
                        //récupération des events crées par l'utilisateur + où l'utilisateur est invité
                        let all_events = res.all_events;
                        this.setState({ user_events: all_events });
                        // console.log("fetch réussi : ", res.message);
                    })
                }
                else{
                    res.json().then(res => {
                        console.log("Mauvaise réponse réseau : ", res.message);
                    });
                    
                }
            })
            .catch(err => console.log("erreur lors de la récupération des events dans la BDD : " + err.message));
        }
    }

    //Fonction remettant l'état local à ses valeurs par défaut
    clearState(){
        this.setState({
            eventType: '',
            openModal: false,
            objet: '',
            description: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            allDay: false,
            eventId: '',
            users_invited: [],
            modifier: false,
            editable: true,
        })
    }

    //Fonction permettant de fermer le menu de modification d'évènements
    handleCloseModal = () => {
        this.props.clearEventType();
        this.clearState();
    }
    
    // handleModalChanges = (state) => {
    //     this.setState(state);
    // }


    //Fonction appelée lors de la sélection de date directement sur le calendrier
    //Permet d'enregistrer dans l'état local les informations des dates sélectionnées
    //et de donner l'information dans l'état local qu'il faut ouvrir le menu de modificiation d'évènements
    //paramètre : informations sur la sélection
    handleDateSelection = (selectionInfo) => {
        this.setState({ openModal: true });
        let calendar = selectionInfo.view.calendar;
        calendar.unselect();
        let start = toMoment(selectionInfo.start, calendar);
        let end = toMoment(selectionInfo.end, calendar);
        this.setState({
            startDate: start.format("YYYY-MM-DD"),
            startTime: start.format("HH:mm"),
            endDate: end.format("YYYY-MM-DD"),
            endTime: end.format("HH:mm"),
        });
    }

    //Fonction appelée par le menu de modification d'évènements
    //Permet d'ajouter l'évènement paramétré par l'utilisateur au calendrier
    //Paramètre : évènement à ajouter
    handleAddEvent = (event) => {
        let calendar = this.calendarRef.current.getApi();
        calendar.addEvent(event);
        this.clearState();
    }

    //Fonction appelée lorsque l'agenda détecte l'ajout d'un évènement
    //Permet de convertir l'évènement pour le stocker dans la base de données et de l'envoyer à l'API
    //paramètre : informations sur l'évènement ajouté
    handleSaveEvent = (addInfo) => {
        this.clearState();
        let event = addInfo.event;
        let event_parsed = {
            user_mail: event.extendedProps.user_mail,
            users_invited: event.extendedProps.users_invited,
            allDay: event.allDay,
            dateStart: event.startStr,
            dateEnd: event.endStr,
            objet: event.title,
            description: event.extendedProps.description,
            color: event.backgroundColor,
            textColor: event.textColor,
            type: event.extendedProps.type
        }
        let id = event.id;
        fetch(this.API + event_save, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_parsed, id })
        })
        .then(res => {
            if (res.ok)
                res.json().then(res => {
                    console.log("envoi reussi : " + res.message);
                })
            else
                res.json().then(res => {
                    console.log("Mauvaise reponse reseau : " + res.message);
                })
        })
        .catch(err => console.log("erreur lors de l'envoi d'un event dans BDD : " + err));
    }

    //Fonction appelée lorsque l'agenda détecte la modification d'un évènement
    //Appelle la fonction handleSaveEvent avec les nouvelles informations
    //Paramètre : informations sur l'évènement modifié
    handleEventChanged = (changeInfo) => {
        this.handleSaveEvent(changeInfo);
    }

    //Fonction appelée par le menu de modification d'évènement lorsqu'un évènement est modifié par son intermédiaire
    //modifie les informations qui ont changé
    //Paramètre : informations sur l'évènement modifié
    changeEvent = (eventInfos) => {
        let old_event = this.calendarRef.current.getApi().getEventById(eventInfos.id);
        let new_event = eventInfos;
        
        if (new_event.title !== old_event.title)
            old_event.setProp('title', new_event.title);
        if (new_event.extendedProps.description !== old_event.extendedProps.description)
            old_event.setExtendedProp('description', new_event.extendedProps.description);
        if (new_event.start !== old_event.start || new_event.end !== old_event.end || new_event.allDay !== old_event.allDay)
        {
            let options = {allDay: new_event.allDay};
            old_event.setDates(new_event.start, new_event.end, options);
        }
        if (new_event.extendedProps.users_invited !== old_event.extendedProps.users_invited)
            old_event.setExtendedProp('users_invited', new_event.extendedProps.users_invited);
    }

    //Fonction appelée par le menu de modification d'évènement lorsqu'un évènement est supprimé
    //Supprime un évènement de l'agenda
    //Paramètre : l'identifiant de l'évènement à supprimer
    removeEvent = ({eventId}) => {
        let event = this.calendarRef.current.getApi().getEventById(eventId);
        event.remove();
    }

    //Fonction appelée lorsque l'agenda détecte la suppression d'un évènement
    //Si l'évènement a bien été créé par l'utilisateur, envoie un requête de suppression à l'API
    //Paramètre : les informations sur l'évènement supprimé
    handleEventRemoved = (removeInfo) => {
        let event = removeInfo.event
        //Vérification de la possibilité de suppression par l'utilisateur
        //S'il n'a pas le droit, c'est qu'il était seulement invité à l'évènement
        //Dans ce cas,  l'évènement ne doit pas être supprimé de la base de données
        if (event.startEditable)
        {
            fetch(this.API + event_remove, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            })
            .then(res => {
                if (res.ok)
                    res.json().then(res => {
                        console.log("suppression reussie : " + res.message);
                    })
                else
                    res.json().then(res => {
                        console.log("Mauvaise reponse reseau : " + res.message);
                    })
            })
            .catch(err => console.log("erreur lors de la suppression d'un event dans BDD : " + err));
        }
    }

    //Fonction appelée lorsque l'agenda détecte un clic sur un évènement
    //Donne l'information qu'il faut ouvrir le menu de modification d'évènement
    //et sauvegarde les informations dans l'état local afin qu'elle puissent être passées au menu
    //Paramètre : informations de l'évènement cliqué
    handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        let event = info.event;
        this.setState({ openModal: true, eventType: event.extendedProps.type, modifier: true, editable: event.startEditable });
        let start = toMoment(event.start, info.view.calendar);
        let end = toMoment(event.end, info.view.calendar);
        this.setState({
            objet: event.title,
            description: event.extendedProps.description,
            allDay: event.allDay,
            startDate: start.format("YYYY-MM-DD"),
            startTime: start.format("HH:mm"),
            endDate: end.format("YYYY-MM-DD"),
            endTime: end.format("HH:mm"),
            eventId: event.id,
            users_invited: event.extendedProps.users_invited,
        });
    }

    //Rendu de l'agenda et du menu de modification d'évènement le cas échéant
    render() {
        const modal = this.state.openModal
                        ?(
                            <AgendaModal 
                            API={this.API}
                            handleCloseModal={this.handleCloseModal}
                            handleAddEvent={this.handleAddEvent}
                            handleRemove={this.removeEvent}
                            handleRemoveInvitation={this.removeInvitation}
                            handleChangeEvent={this.changeEvent}
                            editable={this.state.editable}
                            eventId={this.state.eventId}
                            objet={this.state.objet}
                            description={this.state.description}
                            startDate={this.state.startDate}
                            startTime={this.state.startTime}
                            endDate={this.state.endDate}
                            endTime={this.state.endTime}
                            allDay={this.state.allDay}
                            eventType={this.state.eventType}
                            modifier={this.state.modifier}
                            users_invited={this.state.users_invited}
                            mail={this.state.mail}
                            />
                        )
                        : null;

        return (
            <div className="divFullCalendar">

                {modal}
                <FullCalendar
                ref={this.calendarRef}
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin ]}
                initialView="dayGridMonth"
                locale='fr'
                firstDay={1}
                events={this.state.user_events}
                buttonText={{
                    today: "aujourd'hui",
                    month: "mois",
                    week: "semaine",
                    day: "jour"
                }}
                headerToolbar={{
                    start: 'prev,next,today',
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                businessHours={[
                    {
                        daysOfWeek: [1, 2, 3, 4, 5],
                        startTime: '08:00',
                        endTime: '19:00'
                    }
                ]}
                selectable={true}
                selectMirror={true}
                editable={true}
                eventResizableFromStart={true}
                select={this.handleDateSelection}
                eventAdd={this.handleSaveEvent}
                eventChange={this.handleEventChanged}
                eventRemove={this.handleEventRemoved}
                eventClick={this.handleEventClick}
                />
            </div>
        )
    }
}

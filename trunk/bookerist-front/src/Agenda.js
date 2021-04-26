import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin, { toMoment } from '@fullcalendar/moment';
// import moment from 'moment';
import React, { Component } from 'react'
import './Agenda.css';
import AgendaModal from './AgendaModal';

const baseURL = "http://localhost:3001";

export default class Agenda extends Component {
    constructor(props){
        super(props);

        this.state = {
            
            mail: this.props.mail,
            eventType: '',
            openModal: false,
            openEventClickMenu: false,
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
    }
    calendarRef = React.createRef(); //on donne cette reference au calendrier pour toujours l'avoir et pouvoir utiliser les methodes de l'api

    componentDidMount(){
        //quand le composant est monté, on veut récupérer les données d'events dans la bdd
        this.setState({ getEvents: true });
    }

    componentDidUpdate(prevProps, prevState){
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
            fetch(baseURL + "/events/get", {
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

    clearState(){
        this.setState({
            eventType: '',
            openModal: false,
            openEventClickMenu: false,
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
    //fonction fléchée pour accéder au this
    handleCloseModal = () => {
        this.props.clearEventType();
        this.clearState();
    }

    handleModalChanges = (state) => {
        this.setState(state);
    }

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

    handleAddEvent = (event) => {
        let calendar = this.calendarRef.current.getApi();
        calendar.addEvent(event);
        this.clearState();
    }

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
        fetch(baseURL + "/event/save", {
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

    handleEventChanged = (changeInfo) => {
        this.handleSaveEvent(changeInfo);
    }

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

    removeEvent = ({eventId}) => {
        let event = this.calendarRef.current.getApi().getEventById(eventId);
        event.remove();
    }

    removeInvitation = ({eventId}) => {
        let event = this.calendarRef.current.getApi().getEventById(eventId);

    }

    handleEventRemoved = (removeInfo) => {
        let event = removeInfo.event
        if (event.startEditable)
        {
            fetch(baseURL + "/event/remove", {
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

    render() {
        const modal = this.state.openModal
                        ?(
                            <AgendaModal 
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

        // const eventClickMenu = this.state.openEventClickMenu ? this.renderEventClickMenu() : null;

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
                // eventsSet={this.handleEventsSet}
                eventAdd={this.handleSaveEvent}
                eventChange={this.handleEventChanged}
                eventRemove={this.handleEventRemoved}
                eventClick={this.handleEventClick}
                />
            </div>
        )
    }
}

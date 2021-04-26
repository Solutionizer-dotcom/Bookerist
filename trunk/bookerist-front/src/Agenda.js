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
                        if (res.all_events)
                        {
                            let evenements = [];
                            let dispos = [];
                            let rdvs = [];
                            let all_events = [];
                            res.all_events.forEach(e => {
                                if (e.type === 'evenement')
                                    evenements.push({
                                        id: e._id,
                                        title: e.objet,
                                        extendedProps: {
                                            user_mail: e.user_mail,
                                            users_invited: e.users_invited,
                                            type: e.type,
                                            description: e.description
                                        },
                                        allDay: e.allDay,
                                        start: e.dateStart,
                                        end: e.dateEnd,
                                        color: e.color,
                                        textColor: e.textColor
                                    });
                                // else if (e.type === 'dispo')
                                //     dispos.push(dispo);
                                // else if (e.type === 'rdv')
                                //     rdvs.push(e);
                            })
                            all_events = evenements.concat(dispos).concat(rdvs);
                            this.setState({ user_events: all_events });

                        }
                        console.log("fetch réussi : ", res.message);
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
            modifier: false
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
        console.log("save event, id :" + event.id);
        fetch(baseURL + "/event/save", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_parsed, id })
        })
        .then(res => {
            console.log("dans le fetch");
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
        console.log("changed : ", changeInfo.event);
        this.handleSaveEvent(changeInfo);
    }

    changeEvent = (eventInfos) => {
        console.log("event a changer, allDay : ", eventInfos.allDay);
        let old_event = this.calendarRef.current.getApi().getEventById(eventInfos.id);
        let new_event = eventInfos;
        // const modifs = ["title", "extendedProps.description", "allDay", "start", "end", "extendedProps.users_invited"];
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

    RemoveEvent = ({eventId}) => {
        let event = this.calendarRef.current.getApi().getEventById(eventId);
        event.remove();
    }

    handleEventRemoved = (removeInfo) => {
        let event = removeInfo.event
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

    handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        let event = info.event;
        this.setState({ openModal: true, eventType: event.extendedProps.type, modifier: true });
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
        console.log("event click, allDay: " + event.allDay);
    }

    render() {
        const modal = this.state.openModal
                        ?(
                            <AgendaModal 
                            handleCloseModal={this.handleCloseModal}
                            handleAddEvent={this.handleAddEvent}
                            handleRemove={this.RemoveEvent}
                            handleChangeEvent={this.changeEvent}
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

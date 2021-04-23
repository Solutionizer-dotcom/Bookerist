import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin, { toMoment } from '@fullcalendar/moment';
// import moment from 'moment';
import React, { Component } from 'react'
import './Agenda.css';
import AgendaModal from './AgendaModal';

// function generateEventId(){
//     let key = moment().format('x');
//     return (Math.floor(Math.random() * key) + 1);
// }
const baseURL = "http://localhost:3001";

export default class Agenda extends Component {
    constructor(props){
        super(props);

        this.state = {
            
            mail: this.props.mail,
            eventType: '',
            openModal: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            user_events: [],
            getEvents: true, //doit-on récupérer les evenements dans la bdd ?
            putEvents: false, //doit-on envoyer les evenements locaux dans la bdd ?
        }
    }
    calendarRef = React.createRef(); //on donne cette reference au calendrier pour toujours l'avoir et pouvoir utiliser les methodes de l'api

    componentDidMount(){
        //Récupération de tous les events dans la bdd
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
                            console.log("events fetched : ", res.all_events);
                            let evenements = [];
                            let dispos = [];
                            let rdvs = [];
                            let all_events = [];
                            res.all_events.forEach(e => {
                                if (e.type === 'evenement')
                                    evenements.push({
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
        console.log(this.state.user_events);
        
        // if (prevState.user_events.length !== this.state.user_events.length)
        // {

        // }

    }

    clearState(){
        this.setState({
            eventType: '',
            openModal: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
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

    handleSendEvents = (addInfo) => {
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
        console.log("avant fetch : " + event.color);
        fetch(baseURL + "/event/save", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event_parsed)
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

    // handleEventsSet = (events) => {
    //     this.setState({
    //         user_events: events
    //     });
    // }

    render() {
        const modal = this.state.openModal
                        ?(
                            <AgendaModal 
                            handleCloseModal={this.handleCloseModal}
                            handleAddEvent={this.handleAddEvent}
                            startDate={this.state.startDate}
                            startTime={this.state.startTime}
                            endDate={this.state.endDate}
                            endTime={this.state.endTime}
                            eventType={this.state.eventType}
                            mail={this.state.mail}
                            />
                        )
                        : null
        return (
            <div className="divFullCalendar">

                {/* <AgendaModal
                openModal={this.state.openModal}
                handleCloseModal={this.handleCloseModal}
                handleChanges={this.handleModalChanges}
                handleAddEvent={this.handleAddEvent}
                startDate={this.state.startDate}
                startTime={this.state.startTime}
                endDate={this.state.endDate}
                endTime={this.state.endTime}
                /> */}
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
                select={this.handleDateSelection}
                // eventsSet={this.handleEventsSet}
                eventAdd={this.handleSendEvents}
                />
            </div>
        )
    }
}

import FullCalendar, { CalendarApi, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentPlugin, { toMoment } from '@fullcalendar/moment';
import React, { Component } from 'react'
import './Agenda.css';
import AgendaModal from './AgendaModal';

export default class Agenda extends Component {
    constructor(props){
        super(props);

        this.state = {
            eventType: '',
            openModal: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            calendarAPI: null,
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.eventType !== this.state.eventType)
        {
            console.log("Agenda, type : " + this.props.eventType);
            this.setState({
                eventType: this.props.eventType,
                openModal: true,
            });
        }

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
            calendarAPI: calendar,
        });
    }

    handleAddEvent = (event) => {
       let calendar = this.state.calendarAPI;
       calendar.addEvent(event);
       this.clearState();
    }

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
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin ]}
                initialView="dayGridMonth"
                locale='fr'
                firstDay={1}
                buttonText={{
                    today: "aujourd'hui",
                    month: "mois",
                    week: "semaine",
                    day: "jour"
                }}
                // customButtons={{
                //     addEvent: {
                //         Text: 'Ajouter',
                //         click: this.setState({ openModal: true })
                //     }
                // }}
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
                select={this.handleDateSelection}
                />
            </div>
        )
    }
}

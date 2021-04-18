import FullCalendar, { CalendarApi, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { Component } from 'react'
import './Agenda.css';

let eventId = 0;

export default class Agenda extends Component {
    constructor(props){
        super(props);

    }

    handleDateSelection = (selectionInfo) => {
        let calendar = selectionInfo.view.calendar;
        let objet = prompt("Objet : ");
        let description = prompt("Description : ");
        calendar.unselect();
        if (objet && description){
            calendar.addEvent({
            id: eventId++,
            title: objet,
            extendedProps: {
                description
            },
            allDay: selectionInfo.allDay,
            start: selectionInfo.start,
            end: selectionInfo.end,
            backgroundColor: 'red',
        })
        }
        
        // alert("début : " + selectionInfo.start.toLocaleString() + "\n" + "fin : " + selectionInfo.end.toLocaleString());

    }

    render() {
        return (
            <div className="divFullCalendar">
                <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
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
                //         click: this.handleAddEvent
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
                    },
                    {
                        daysOfWeek: [6],
                        startTime: '08:00',
                        endTime: '13:00'
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

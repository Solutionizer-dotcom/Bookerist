import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React, { Component } from 'react'
import './Agenda.css';

export default class Agenda extends Component {

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
                />
            </div>
        )
    }
}

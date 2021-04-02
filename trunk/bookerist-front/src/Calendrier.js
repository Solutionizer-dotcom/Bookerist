import Calendar from 'react-calendar'
import React, { useState } from 'react'
import './Calendar.css'

function Calendrier() {
    const [value, onChange] = useState(new Date());

    return <Calendar value={value} onChange={onChange} />;
}

export default Calendrier
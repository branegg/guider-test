import './Calendar.css';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import CalendarItem from './CalendarItem/CalendarItem';

const Calendar = () => {
  const [week, setWeek] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [activeDate, setActiveDate] = useState();

  const availableDates = availability && availability.map(date => date.date);

  useEffect(() => {
    let currentWeek = [];
    for (let i = -3; i <= 3; i++) {
      currentWeek.push(DateTime.local().plus({ days: i }));
    }
    setWeek(currentWeek);

    fetch('/availability')
      .then(res => res.json())
      .then(res => setAvailability(res));
  }, []);

  const renderDays = () =>
    week.map(day => {
      const isAvailable = availableDates.includes(day.toLocaleString());
      return (
        <CalendarItem
          key={day.ts}
          dayObject={day}
          isAvailable={isAvailable}
          onClick={() => handleDateClick(day.ts)}
          isActive={activeDate === day.ts}
        />
      );
    });

  const handleDateClick = key => {
    console.log(key);
    setActiveDate(key);
  };

  return (
    <div className='Calendar'>
      <p className='Calendar__header'>Your timezone: {DateTime.local().zoneName}</p>
      <section className='Calendar__wrapper'>{renderDays()}</section>
    </div>
  );
};

export default Calendar;

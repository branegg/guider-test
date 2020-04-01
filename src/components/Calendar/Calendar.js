import './Calendar.css';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import CalendarItem from './CalendarItem/CalendarItem';

const Calendar = () => {
  const [week, setWeek] = useState([]);
  useEffect(() => {
    let currentWeek = [];

    for (let i = -3; i <= 3; i++) {
      currentWeek.push(DateTime.local().plus({ days: i }));
    }

    setWeek(currentWeek);
  }, []);

  const renderDays = () => week.map(day => <CalendarItem key={day.ts} dayObject={day} />);

  return (
    <div className='Calendar'>
      <p className='Calendar__header'>Your timezone: {DateTime.local().zoneName}</p>
      <section className='Calendar__wrapper'>{renderDays()}</section>
    </div>
  );
};

export default Calendar;

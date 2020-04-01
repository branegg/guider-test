import './Calendar.css';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import CalendarItem from './CalendarItem/CalendarItem';
import classNames from 'classnames';

import loadingSpinner from './../../assets/images/loading.gif';

const Calendar = () => {
  const [week, setWeek] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [activeDate, setActiveDate] = useState();
  const [availableHours, setAvailableHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const availableDates = availability && availability.map(date => date.date);
  const hours = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00'
  ];

  useEffect(() => {
    let currentWeek = [];
    for (let i = -3; i <= 3; i++) {
      currentWeek.push(DateTime.local().plus({ days: i }));
    }
    setWeek(currentWeek);

    fetch('/availability')
      .then(res => res.json())
      .then(res => {
        setAvailability(res);
        setIsLoading(false);
      });
  }, []);

  const renderDays = () =>
    week.map(day => {
      const isAvailable = availableDates.includes(day.toLocaleString());
      return (
        <CalendarItem
          key={day.ts}
          dayObject={day}
          isAvailable={isAvailable}
          onClick={() => isAvailable && handleDateClick(day.ts)}
          isActive={activeDate === day.ts}
        />
      );
    });

  const renderHours = () =>
    hours.map((hour, index) => (
      <p
        key={index}
        className={classNames({ Calendar__hour: true, 'Calendar__hour--active': availableHours.includes(hour) })}
      >
        {hour}
      </p>
    ));

  const renderLoadingSpinner = () => (
    <div className='Calendar__loading'>
      <img className='Calendar__spinner' src={loadingSpinner} alt='Loading...' />
    </div>
  );

  const handleDateClick = key => {
    const activeDate = week.filter(day => day.ts === key).toLocaleString();
    setActiveDate(key);
    const availableSlots = availability.filter(date => date.date === activeDate)[0].availableSlots;
    setAvailableHours(availableSlots.map(slot => slot.startTime));
  };

  return (
    <div className='Calendar'>
      {isLoading && renderLoadingSpinner()}
      <h2 className='Calendar__header'>Your timezone: {DateTime.local().zoneName}</h2>
      <section className='Calendar__wrapper'>{renderDays()}</section>
      <section className='Calendar__hours'>{renderHours()}</section>
    </div>
  );
};

export default Calendar;

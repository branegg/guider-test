import './Calendar.scss';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import CalendarItem from './CalendarItem/CalendarItem';
import classNames from 'classnames';

import loadingSpinner from './../../assets/images/loading.gif';

const Calendar = () => {
  const [week, setWeek] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [activeDate, setActiveDate] = useState();
  const [hours, setHours] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const availableDates = availability && availability.map((date) => date.date);

  useEffect(() => {
    let currentWeek = [];
    for (let i = 0; i <= 6; i++) {
      currentWeek.push(DateTime.local().startOf('week').plus({ days: i }));
    }
    setWeek(currentWeek);

    const dayStart = '08:00';
    const dayEnd = '17:00';
    let hours = [];

    for (
      let i = dayStart;
      i !== dayEnd;
      i = DateTime.fromISO(i).plus({ hours: 1 }).toLocaleString(DateTime.TIME_24_SIMPLE)
    ) {
      hours.push(i);
    }

    setHours(hours);

    fetch('/availability')
      .then((res) => res.json())
      .then((res) => {
        setAvailability(res);
        setIsLoading(false);
      });
  }, []);

  const renderDays = () => {
    return week.map((day) => {
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
  };

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

  const handleDateClick = (key) => {
    const activeDate = week.filter((day) => day.ts === key).toLocaleString();
    setActiveDate(key);
    const availableSlots = availability.filter((date) => date.date === activeDate)[0].availableSlots;
    setAvailableHours(availableSlots.map((slot) => slot.startTime));
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

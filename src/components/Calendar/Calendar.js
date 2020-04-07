import './Calendar.scss';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import CalendarItem from './CalendarItem/CalendarItem';
import classNames from 'classnames';
import axios from 'axios';

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
    prepareWeek();
    prepareHours();
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const response = await axios.get('/availability');
    const data = response.data;
    setAvailability(data);
    setIsLoading(false);
  };

  const prepareWeek = () => {
    let currentWeek = [];
    for (let i = 0; i <= 6; i++) {
      currentWeek.push(DateTime.local().startOf('week').plus({ days: i }));
    }
    setWeek(currentWeek);
  };

  const prepareHours = () => {
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
  };

  const renderDays = () => {
    return week.map((day) => {
      const isAvailable = availableDates.includes(day.toFormat('dd/MM/yyyy'));
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
        data-testid='calendar-hour'
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
    const activeDate = week.filter((day) => day.ts === key)[0].toFormat('dd/MM/yyyy');
    setActiveDate(key);
    const availableSlots = availability.filter((date) => date.date === activeDate)[0].availableSlots;
    setAvailableHours(availableSlots.map((slot) => slot.startTime));
  };

  return (
    <div className='Calendar'>
      {isLoading && renderLoadingSpinner()}
      <h2 className='Calendar__header'>Your timezone: {DateTime.local().zoneName}</h2>
      <section className='Calendar__wrapper' data-testid='calendar-wrapper'>
        {renderDays()}
      </section>
      <section className='Calendar__hours'>{renderHours()}</section>
    </div>
  );
};

export default Calendar;

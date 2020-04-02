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
  const [hours, setHours] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const availableDates = availability && availability.map(date => date.date);

  useEffect(() => {
    let currentWeek = [];
    for (let i = 0; i <= 6; i++) {
      currentWeek.push(
        DateTime.local()
          .startOf('week')
          .plus({ days: i })
      );
    }
    setWeek(currentWeek);
    // console.log(currentWeek);

    fetch('/availability')
      .then(res => res.json())
      .then(res => {
        const workingHours = res[0].workingHours;
        const dayStart = DateTime.fromISO(workingHours.startTime).toLocaleString(DateTime.TIME_24_SIMPLE);
        const dayEnd = DateTime.fromISO(workingHours.endTime).toLocaleString(DateTime.TIME_24_SIMPLE);
        const scheduleItems = res[0].scheduleItems;
        const dates = scheduleItems.map(item => DateTime.fromISO(item.start.dateTime).toLocaleString());
        const uniqueDates = [...new Set(dates)];

        let hours = [];

        for (
          let i = dayStart;
          i !== dayEnd;
          i = DateTime.fromISO(i)
            .plus({ hours: 1 })
            .toLocaleString(DateTime.TIME_24_SIMPLE)
        ) {
          hours.push(i);
        }

        setHours(hours);

        let availableSlots = hours.map(hour => {
          return {
            startTime: hour,
            endTime: DateTime.fromISO(hour)
              .plus({ hours: 1 })
              .toLocaleString(DateTime.TIME_24_SIMPLE)
          };
        });

        let resObj = uniqueDates.map(date => {
          return {
            date,
            availableSlots
          };
        });

        const scheduleItemsSorted = scheduleItems.map(item => {
          const date = DateTime.fromISO(item.start.dateTime).toLocaleString();

          const startTime = DateTime.fromISO(item.start.dateTime).toLocaleString(DateTime.TIME_24_SIMPLE);
          const endTime = DateTime.fromISO(item.end.dateTime).toLocaleString(DateTime.TIME_24_SIMPLE);

          return { date, startTime, endTime };
        });

        console.log(scheduleItemsSorted);

        // return false;
        setAvailability(resObj);
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

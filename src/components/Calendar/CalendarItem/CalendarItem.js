import React from 'react';
import classNames from 'classnames';

const CalendarItem = ({ dayObject, isAvailable, onClick, isActive }) => {
  const { day, weekdayLong, weekdayShort } = dayObject;
  const dayLength = day.toString().length;
  const lastDayChar = day.toString()[dayLength - 1];
  let dateSufix = 'th';

  switch (lastDayChar) {
    case '1':
      dateSufix = 'st';
      break;
    case '2':
      dateSufix = 'nd';
      break;
    case '3':
      dateSufix = 'rd';
      break;
    default:
      break;
  }

  return (
    <div
      label={weekdayLong}
      data-testid='calendar-item'
      className={classNames({
        Calendar__item: true,
        'Calendar__item--available': isAvailable,
        'Calendar__item--active': isActive,
      })}
      onClick={() => onClick()}
    >
      <p className='Calendar__date'>
        {day}
        <span data-testid='date-sufix' className='Calendar__date--small'>
          {dateSufix}
        </span>
      </p>
      <p data-testid='calendar-day' className='Calendar__day'>
        {weekdayShort}
      </p>
    </div>
  );
};

export default CalendarItem;

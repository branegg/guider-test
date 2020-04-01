import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

const CalendarItem = ({ dayObject }) => {
  useEffect(() => {}, []);

  const { day, weekdayShort } = dayObject;
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
  }

  return (
    <div className='Calendar__item'>
      <p className='Calendar__date'>
        {day}
        <span className='Calendar__date--small'>{dateSufix}</span>
      </p>
      <p className='Calendar__day'>{weekdayShort}</p>
    </div>
  );
};

export default CalendarItem;

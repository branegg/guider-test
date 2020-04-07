const { Settings, DateTime } = require('luxon');
const { generateOffice365Schedule } = require('./utils/schedule');
const { now } = require('./utils/dateHelper');

const express = require('express');
const app = express();
const port = 8080;

app.get('/availability', function (req, res) {
  const startDate = DateTime.local().startOf('week').toUTC();
  const endDate = startDate.plus({ days: 6 }).toUTC();
  const data = generateOffice365Schedule(startDate, endDate).value[0];
  const scheduleItems = data.scheduleItems.filter((event) => event.status === 'Busy');
  const dates = scheduleItems.map((item) => DateTime.fromISO(item.start.dateTime).toFormat('dd/MM/yyyy'));
  const uniqueDates = [...new Set(dates)];
  const workingHours = data.workingHours;
  const dayStart = DateTime.fromISO(workingHours.startTime).toLocaleString(DateTime.TIME_24_SIMPLE);
  const dayEnd = DateTime.fromISO(workingHours.endTime).toLocaleString(DateTime.TIME_24_SIMPLE);

  let hours = [];

  for (
    let i = dayStart;
    i !== dayEnd;
    i = DateTime.fromISO(i).plus({ hours: 1 }).toLocaleString(DateTime.TIME_24_SIMPLE)
  ) {
    hours.push(i);
  }

  let availableSlots = hours.map((hour) => {
    return {
      startTime: hour,
      endTime: DateTime.fromISO(hour).plus({ hours: 1 }).toLocaleString(DateTime.TIME_24_SIMPLE),
    };
  });

  let resObj = uniqueDates.map((date) => {
    return {
      date,
      availableSlots,
    };
  });

  const scheduleItemsSorted = scheduleItems.map((item) => {
    const date = DateTime.fromISO(item.start.dateTime).toFormat('dd/MM/yyyy');

    const startTime = DateTime.fromISO(item.start.dateTime);
    const endTime = DateTime.fromISO(item.end.dateTime);

    return { date, startTime, endTime };
  });

  scheduleItemsSorted.forEach((event) => {
    const { date, startTime, endTime } = event;
    const eventStartTime = startTime.toLocaleString(DateTime.TIME_24_SIMPLE);
    const eventEndTime = endTime.toLocaleString(DateTime.TIME_24_SIMPLE);

    const day = resObj.filter((day) => day.date === date)[0];

    day.availableSlots.forEach((slot, index) => {
      if (eventStartTime >= slot.startTime && eventStartTime < slot.endTime) {
        const eventLength = endTime.diff(startTime, 'hours').hours;
        const splicedSlotsNumber = Math.ceil(eventLength);

        day.availableSlots.splice(index, splicedSlotsNumber);
      }
      if (eventEndTime > slot.startTime && eventEndTime <= slot.endTime) {
        day.availableSlots.splice(index, 1);
      }
    });
  });

  return res.send(resObj);
});

function generateMockUpResponse() {
  const d1 = now().set({ hour: 10 });
  const d2 = d1.plus({ hours: 1, days: 1 });

  return [
    {
      date: d1.toFormat('dd/MM/yyyy'),
      availableSlots: [
        { startTime: '9:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
      ],
    },
    {
      date: d2.toFormat('dd/MM/yyyy'),
      availableSlots: [
        { startTime: '15:00', endTime: '16:00' },
        { startTime: '16:00', endTime: '17:00' },
      ],
    },
  ];
}

app.listen(port, () => console.log(`App listening on port ${port}!`));

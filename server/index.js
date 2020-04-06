const { Settings, DateTime } = require('luxon');
const { generateOffice365Schedule } = require('./utils/schedule');
const { now } = require('./utils/dateHelper');

const express = require('express');
const app = express();
const port = 8080;

app.get('/availability', function (req, res) {
  const startDate = DateTime.local().startOf('week').toUTC();
  const endDate = startDate.plus({ days: 6 }).toUTC();

  const data = generateOffice365Schedule(startDate, endDate);

  return res.send(data.value);
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

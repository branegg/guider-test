const { DateTime } = require('luxon');

exports.office365ToAPIResponse = (dayStart, dayEnd, scheduleItems, uniqueDates) => {
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

    return resObj
  }
  
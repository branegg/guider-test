
const { office365ToAPIResponse } = require('../server/utils/office365parser');

var assert = require('assert');

describe('Office365', function() {
  describe('office365parser()', function() {
    it('should return valid response', function() {
        const expected = [
            {"date":"06/08/2018","availableSlots":[
                {"startTime": "08:00", "endTime":"09:00"},
                {"startTime": "11:00", "endTime":"12:00"},
                {"startTime": "14:00", "endTime":"15:00"},
                {"startTime": "15:00", "endTime": "16:00"},
                {"startTime": "16:00", "endTime": "17:00"}
            ]}
        ]
        const scheduleItems = [
            {
                "status":"Busy",
                "start":{
                    "dateTime":"2018-08-06T09:00:00.0000000",
                    "timeZone":"Pacific Standard Time"
                },
                "end":{
                    "dateTime":"2018-08-06T10:30:00.0000000",
                    "timeZone":"Pacific Standard Time"
                }
            },
            {
                "status":"Busy",
                "start":{
                    "dateTime":"2018-08-06T12:00:00.0000000",
                    "timeZone":"Pacific Standard Time"
                },
                "end":{
                    "dateTime":"2018-08-06T13:30:00.0000000",
                    "timeZone":"Pacific Standard Time"
                }
            }
        ]

        const response = office365ToAPIResponse("08:00", "17:00", scheduleItems, ['06/08/2018']);

        assert.deepEqual(response, expected);
    });
  });
});
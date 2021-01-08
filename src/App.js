import './App.css';
import axios from './helper/axios-helper';
import TimeSlotRow from './components/TimeSlotRow';
import { useEffect, useState } from 'react';
import SCHEDULAR_CONFIG from './helper/schedular-config';
import {
  getTimeStampInSecondFromDate,
  addDaysToDate,
  getToday,
  getDateFromTimeStampInSecond,
} from './helper/date-helper';

function isValidWorkHour(timeInHour) {
  return (
    timeInHour < SCHEDULAR_CONFIG.END_HOUR &&
    timeInHour >= SCHEDULAR_CONFIG.START_HOUR
  );
}

function isTimeStampValid(timeStampInSeconds) {
  let date = getDateFromTimeStampInSecond(timeStampInSeconds);
  return date >= new Date() && isValidWorkHour(date.getHours());
}

let getDateRangeTimeStamps = () => {
  let startDate = getToday();
  let endDate = addDaysToDate(startDate, SCHEDULAR_CONFIG.TOTAL_DAYS);
  let startTimeInSecond = getTimeStampInSecondFromDate(startDate);
  let endTimeInSecond = getTimeStampInSecondFromDate(endDate);
  return {
    startTime: startTimeInSecond,
    endTime: endTimeInSecond,
  };
};

let filterTimeSlots = (timeSlots) => {
  return timeSlots.filter((timeSlot) => isTimeStampValid(timeSlot.start));
};

let convertTimeSlotsToMap = (timeSlots) => {
  return timeSlots.reduce((map, timeSlot) => {
    let date = getDateFromTimeStampInSecond(timeSlot.start);
    let day = date.getDate();
    if (!map.has(day)) {
      map.set(day, []);
    }
    map.get(day).push(date.getTime());
    return map;
  }, new Map());
};

let getPayload = () => {
  let { startTime, endTime } = getDateRangeTimeStamps();
  let data = {
    duration_minutes: SCHEDULAR_CONFIG.TIME_DURATION_IN_MIN,
    start_time: startTime,
    end_time: endTime,
    interval_minutes: SCHEDULAR_CONFIG.TIME_DURATION_IN_MIN,
    emails: [SCHEDULAR_CONFIG.EMAIL],
    free_busy: [],
  };
  return data;
};

function App() {
  let [dayToTimeSlotsMap, setDayToTimeSlotsMap] = useState(new Map());
  useEffect(() => {
    async function fetchData() {
      let payLoad = getPayload();
      try {
        let response = await axios.post('/calendars/availability', payLoad);
        let allValidTimeSlots = filterTimeSlots(response.data.time_slots);
        setDayToTimeSlotsMap(convertTimeSlotsToMap(allValidTimeSlots));
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return dayToTimeSlotsMap.size > 0 ? (
    <div>
      {Array.from(dayToTimeSlotsMap).map(
        ([day, availableTimeSlotForTheDay]) => (
          <TimeSlotRow
            key={day}
            availableTimeSlots={availableTimeSlotForTheDay}
            bookInMin={SCHEDULAR_CONFIG.TIME_DURATION_IN_MIN}
            calendarID={SCHEDULAR_CONFIG.CALENDER_ID}
          />
        )
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default App;

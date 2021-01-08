import React from 'react';
import './TimeSlotRow.css';
import axios from '../helper/axios-helper';
import {
  getTimeStampInSecondFromDate,
  addMinToDate,
  formatAMPM,
  getMonthAndDay,
} from '../helper/date-helper';

let TimeSlotRow = ({ availableTimeSlots, bookInMin, calendarID }) => {
  let getEndTime = (startTimeInMilliSecond) => {
    let startDate = new Date(startTimeInMilliSecond);
    return getTimeStampInSecondFromDate(addMinToDate(startDate, bookInMin));
  };

  let getStartTime = (startTimeInMilliSecond) => {
    let startDate = new Date(startTimeInMilliSecond);
    return getTimeStampInSecondFromDate(startDate);
  };

  async function onClick(e, startTime) {
    e.preventDefault();
    let title = prompt('Please enter the appointment name');
    if (!title) {
      return;
    }
    let data = {
      title,
      when: {
        start_time: getStartTime(startTime).toString(),
        end_time: getEndTime(startTime).toString(),
      },
      calendar_id: calendarID,
      busy: true,
      notify_participants: true,
    };
    try {
      await axios.post('events', data);
      alert(`Appointment ${title} successfully booked`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  let isTimeslotsAvailable = () => {
    return availableTimeSlots && availableTimeSlots.length > 0;
  };

  let links = availableTimeSlots.map((timeSlot) => (
    <a key={timeSlot} href={''} onClick={(e) => onClick(e, timeSlot)}>
      <li className="item" key={timeSlot}>
        {formatAMPM(timeSlot)}
      </li>
    </a>
  ));

  return (
    isTimeslotsAvailable() && (
      <div>
        <div className="item">
          {getMonthAndDay(availableTimeSlots[0]) + ':'}
        </div>
        {links}
        <br />
      </div>
    )
  );
};

export default TimeSlotRow;

import React, { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';

const Calendar = ({ workcheckData }) => {
  const [events, setEvents] = useState([]);
  const newEvents = [];

  let date = new Date();
  let nowstartDate = new Date(date.getFullYear(), date.getMonth(), 2);

  useEffect(() => {
    if (workcheckData.length !== 0 && workcheckData == undefined && workcheckData == null && workcheckData.code !== 200) {
      // 현재 1일로 바꾸기
      const currentDate = new Date();
      for (let date = nowstartDate; date <= currentDate; date.setDate(date.getDate() + 1)) {
        // 날짜만 가져오기
        const dateString = date.toISOString().split('T')[0];
        // workcheckData에서 한 데이터 씩(data) 뽑아서 날짜(dateString)가 포함되어있는(includes) data 가져오기
        const someData = workcheckData.data.find(data => data.startDate.includes(dateString));

        if (someData === undefined) {
          const commuteEvent = { title: '출근 기록이 없습니다.', date: dateString };
          newEvents.push(commuteEvent);
        } else {
          if (someData.endDate == null) {
            const leaveEvent = { title: '퇴근 기록이 없습니다.', date: dateString };
            newEvents.push(leaveEvent);
          }
        }
      }
    }
    setEvents(newEvents);
  }, [workcheckData]);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: "2fr 1fr" }}>
        <FullCalendar
          key={events.length}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={'dayGridMonth'}
          headerToolbar={{
            start: 'today',
            center: 'title',
            end: 'prev,next',
          }}
          height={"85vh"}
          events={events}
        />
      </div>
    </>
  );
};

export default Calendar;
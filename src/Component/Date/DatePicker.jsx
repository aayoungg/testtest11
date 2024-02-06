import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Date/DatePicker.css";

const DatePickerComponent = ({ setStartDate, setEndDate }) => {
  const [checkStartDate, setCheckStartDate] = useState(new Date());
  const [checkEndDate, setCheckEndDate] = useState(new Date());

  useEffect(() => {
    // 컴포넌트가 마운트될 때 초기 날짜 설정
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    setCheckStartDate(startDate);
    setCheckEndDate(endDate);
    setStartDate(formatDateString(startDate));
    setEndDate(formatDateString(endDate));
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  const setChangeDate = (dates) => {
    const [start, end] = dates;
    setCheckStartDate(start);
    setCheckEndDate(end);
    setStartDate(formatDateString(start));
    setEndDate(formatDateString(end));
  };

  const formatDateString = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  return (
    <div>
      <DatePicker
        selectsRange={true}
        className="custom-datepicker"
        dateFormat="yyyy년 MM월 dd일"
        locale={ko}
        selected={checkStartDate}
        startDate={checkStartDate}
        endDate={checkEndDate}
        maxDate={new Date()}
        onChange={(dates) => setChangeDate(dates)}
      />
    </div>
  );
};

export default DatePickerComponent;

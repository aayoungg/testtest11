import React, { useEffect, useState } from "react";
import "../Modal/modal.css";
import Map from "../Map/Map.jsx";
import Button from "../Button/Button.jsx";
import { getCookie, setCookie } from "../../Cookie/cookie.js";
import { work } from "../../Api/api.js"


function getCookies(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

function Modal({ IsWorkData, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [attendanceText, setAttendanceText] = useState(true);

  const isInCircleState = useState(false);
  const [isInCircle, setIsInCircle] = isInCircleState
  const [typework, setTypework] = useState(0);
  const workdataCookie = getCookies('workdata');
  const TypeworkInitialValue = workdataCookie ? 1 : 0;

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const LoginDate = getCookie('logindata');
  const userIdx = LoginDate.data.idx;
  const workdata = getCookie("workdata");
  useEffect(() => {
    if (workdata == undefined || workdata.length === 0) {
      setTypework(1)
    } else if (workdata.startDate !== null && workdata.endDate === null) {
      setTypework(2)
    }
  })

  const idx = typework == 2 ? workdata.idx : null;
  const toggleText = async () => {
    if (!isInCircle) {
      alert("회사 범위 밖에 있습니다.")
      return;
    }
    try {
      const workdata = await new work().post(idx, userIdx, typework);

      if (workdata.code === 200) {
        setCookie('workdata', workdata.data, {
          path: '/',
          // secure: true,
        });
        IsWorkData(workdata.data)
      }
    } catch (error) {
      // 에러 처리 로직 추가 (예: console.error(error);)
    }


    closeModal();
    setAttendanceText(!attendanceText);
    onClose(); // 모달 닫기
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal">
          <div className="modal_background">
            <div className="modal_close" onClick={closeModal}>
              X
            </div>
            <Map isInCircleState={isInCircleState} />
            <Button onClick={toggleText} name="button" type="button">
              {/* 출근 안 찍음 0 출근 찍음 1 퇴근 찍음 2 */}
              {typework == 2 ? "퇴근하기" : "출근하기"}
            </Button>
          </div>
        </div>
      )}

    </>
  );
}

export default Modal;
import React, { useState, useEffect } from "react";
import VacationBtn from "../Component/Button/VacationBtn";
import styled from "styled-components";
import Modal from "react-modal";
import { vacationPro, vacationReq, vacationProNo } from "../Api/api";
import { getCookie, setCookie } from "../Cookie/cookie";
import axios from "axios";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  height: 500px;
  margin: auto;
  border-radius: 30px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
// const vacationRequest = {
//   idx: 34,
//   approveIdx: 1,
//   action: 'reject',
//   reason: 'ss'
// };
const InputGroup = styled.div`
  //파트 이름과 파트 메모 사이
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;
const TotalBtn = styled.div`
  width: 100%;
  display: flex;
  margin-top: 27px;
  justify-content: space-evenly;
`;
const Vacation = () => {
  const [userIdx, setUserIdx] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vacationType, setVacationType] = useState("1");
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [idx, setIdx] = useState("");
  const [approveIdx, setApproveIdx] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.2)",
      width: "100%",
      height: "100vh",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "360px",
      height: "400px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      backgroundColor: "white",
      justifyContent: "center",
    },
  };
  useEffect(() => {
    //logindata 쿠키 가져옴
    const loginData = getCookie("logindata");
    // console.log(loginData);
    if (loginData) {
      setUserIdx(loginData.data.idx);
      setIdx(loginData.data.idx);
      // console.log(userIdx);
    }
  }, []);

  const saveVacation = async () => {
    //휴가 요청
    new vacationReq()
      .post(userIdx, vacationType, startDate, endDate, reason)
      .then((vacationdata) => {
        console.log("test", vacationdata);
      });
    setVacationType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    // closeModal();
  };
  const request = () => {
    //휴가 요청 버튼 클릭 시 모달 open
    openModal();
  };

  const handleApprove = async () => {
    //휴가 수락
    new vacationPro().put(idx, approveIdx, action, reason).then(() => {});
    setIdx("");
    setApproveIdx("");
    setAction("");
    setReason("");
  };

  const handleReject = async () => {
    //휴가 거절
    new vacationProNo().put(idx, approveIdx, action, reason).then(() => {});
    setIdx("");
    setApproveIdx("");
    setAction("");
    setReason("");
  };

  return (
    <FormContainer>
      <VacationBtn onClick={request}>휴가 요청</VacationBtn>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        <InputGroup>
          <h1>휴가 요청</h1>
          <label>시작일:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <br />

          <label>종료일:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <br />

          <label>종류:</label>
          {/* <input
          type="text"
          value={vacationType}
          onChange={(e) => setVacationType(e.target.value)}
        /> */}
          {/* 휴가 신청 조회 목록 가져오면 map 써서 select box로 할 예정 */}
          {/* <select       
        onChange={(e) => setVacationType(e.target.value)}
        value={vacationType}
      >
      </select> */}
          <select
            value={vacationType ? vacationType : 1}
            onChange={(e) => setVacationType(e.target.value)}
          >
            <option value="1">연차</option>
            <option value="2">반차</option>
            <option value="3">반반차</option>
            <option value="4">예비군훈련</option>
            <option value="5">출산휴가</option>
            <option value="6">배우자출산휴가</option>
            <option value="7">생리휴가</option>
            <option value="8">가족돌봄휴가</option>
            <option value="9">그 외</option>
          </select>
          <br />

          <label>사유:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </InputGroup>
        <TotalBtn>
          <VacationBtn onClick={closeModal}>취소</VacationBtn>
          <VacationBtn onClick={saveVacation}>요청</VacationBtn>
        </TotalBtn>
      </Modal>

      <button onClick={handleApprove} disabled={loading}>
        {loading ? "처리 중..." : "수락"}
      </button>
      <button onClick={handleReject}>거절</button>
    </FormContainer>
  );
};

export default Vacation;

// const handleApprove = async () => {     //휴가 수락 및 거절
//   setLoading(true);
//   try {
//     const response = await axios.put('/api/v1/vacation-app/process', {
//       idx: 9,     //휴가 신청 인덱스 (휴가 신청자의 인덱스 아님)
//       approveIdx: 1,    //휴가 신청할 담당자(관리자는 1, 팀장은 2)
//       action: 'approve',   // 거절 : reject , 수락 : approve
//       reason: 'reason'
//     });

//     if (response.data.code === 200) {
//       alert('휴가가 수락되었습니다.');
//     } else {
//       alert('이미 처리한 휴가입니다.');
//     }
//   } catch (error) {
//     console.error('휴가 수락 중 오류가 발생했습니다:', error);
//     alert('휴가 수락 중 오류가 발생했습니다.');
//     setLoading(false);
//   }
// };

// const handleReject = async () => {    //휴가 거절
//   const reason = prompt("거절 사유를 입력해주세요.");
//   if ( reason === null ) {    //프롬포트 취소 클릭 시
//     return;
//   }
//   setLoading(true);
//   try {
//     const response = await axios.put('/api/v1/vacation-app/process', {
//       idx: 7,
//       approveIdx: 1,
//       action: 'reject',
//       reason: reason
//     });

//     if (response.data.code === 200) {
//       alert('휴가가 거절되었습니다.');

//     } else {
//       alert('휴가 거절 중 오류가 발생했습니다.');
//     }
//   } catch (error) {
//     console.error('휴가 거절 중 오류가 발생했습니다:', error);
//     alert('휴가 거절 중 오류가 발생했습니다.');
//     setLoading(false);
//   }
// };

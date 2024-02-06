import React, { useState, useEffect } from "react";
import { vacationPro, vacationProNo } from "../Api/vacationapi";
import { getCookie } from "../Cookie/cookie";
import styled from "styled-components";

const Process = styled.div`
  width: 80vw;
  position: absolute;
  left: 14%;
  top: 20%;
  overflow: hidden;
  overflow-y: auto;
  padding: 0px 50px;
`;
function VacationProcess() {
  const [reason, setReason] = useState("");
  const [userIdx, setUserIdx] = useState("");
  const [idx, setIdx] = useState("");
  const [approveIdx, setApproveIdx] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
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
  const handleApprove = async () => {
    //휴가 수락
    new vacationPro().put(idx, approveIdx, action, reason).then();
    setIdx("");
    setApproveIdx("");
    setAction("");
    setReason("");
  };

  const handleReject = async () => {
    //휴가 거절
    new vacationProNo().put(idx, approveIdx, action, reason).then();
    setIdx("");
    setApproveIdx("");
    setAction("");
    setReason("");
  };
  return (
    <Process>
      <button onClick={handleApprove} disabled={loading}>
        {loading ? "처리 중..." : "수락"}
      </button>
      <button onClick={handleReject}>거절</button>
    </Process>
  );
}

export default VacationProcess;

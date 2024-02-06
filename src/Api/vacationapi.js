import axios from "axios";

export class vacationReq {
  //직원이 휴가 요청
  async post(userIdx, vacationType, startDate, endDate, reason) {
    try {
      if (
        !vacationType.trim() ||
        !startDate.trim() ||
        !endDate.trim() ||
        !reason.trim()
      ) {
        alert("빈 내용이 있습니다.");
        console.log("vacationType:", vacationType);
        // console.log(vacationType);
        return;
      }

      const response = await axios.post("/api/v1/vacation-app", {
        userIdx: userIdx,
        vacationType: vacationType,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
      });

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("휴가 요청 완료");
        return response.data;
      }
    } catch (error) {
      console.log("vacationType:", vacationType);
      console.error("오류 발생:", error);
      alert("휴가 요청 중 오류가 발생했습니다.");
      return error;
    }
  }
}

export class vacationPro {
  //직원이 신청한 휴가를 수락
  async put(idx, approveIdx, action, reason) {
    try {
      const response = await axios.put("/api/v1/vacation-app/process", {
        idx: 18, //휴가 신청 인덱스 (휴가 신청자의 인덱스 아님)
        approveIdx: 1, //휴가 신청할 담당자(관리자는 1, 팀장은 2)
        action: "approve", // 거절 : reject , 수락 : approve
        reason: "reason",
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("휴가가 수락되었습니다.");
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("이미 처리된 휴가입니다.");
        alert("이미 처리된 휴가입니다.");
      } else {
        console.error("오류 발생:", error);
        alert("휴가 수락 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}
export class vacationProNo {
  //직원이 신청한 휴가를 거절
  async put(idx, approveIdx, action, reason) {
    try {
      const response = await axios.put("/api/v1/vacation-app/process", {
        idx: 31, //휴가 거절 인덱스 (휴가 신청자의 인덱스 아님)
        approveIdx: 1, //휴가 거절할 담당자(관리자는 1, 팀장은 2)
        action: "reject", // 거절 : reject , 수락 : approve
        reason: "reason",
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        const reason = prompt("거절 사유를 입력해주세요");
        if (reason === null) {
          return;
        }
        alert("휴가가 거절되었습니다.");
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("이미 처리된 휴가입니다.");
        console.error("이미 처리된 휴가입니다.");
      } else {
        console.error("오류 발생:", error);
        alert("휴가 거절 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}
export class vacationdelete {
  //요청한 휴가 취소
  async delete(idx) {
    try {
      const response = await axios.delete("api/v1/vacation-app/delete?idx=17", {
        idx: 17,
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("요청한 휴가를 취소하였습니다.");
        return response.data;
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("취소 중 오류가 발생했습니다.");
    }
  }
}

// export class vacationlist {
//   async get(useridx, startDate, endDate, type) {
//     try {
//       const response = await axios.delete("api/v1/vacation-app/list?userIdx=34&startDate=2024-02-21&endDate=2024-02-21&type=4", {
//         useridx: 34,
//         startDate : 20240221,
//         endDate : 20240221,
//         type : 4,
//       });
//       if (response.data === null) {
//         throw new Error("서버 응답이 올바르지 않습니다.");
//       } else {
//         alert("요청한 휴가를 취소하였습니다.");
//         return response.data;
//       }
//     } catch (error) {
//       console.error("오류 발생:", error);
//       alert("취소 중 오류가 발생했습니다.");
//     }
//   }
// }

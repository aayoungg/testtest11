import axios from "axios";

export class addPart {
  async post(name, memo) {
    try {
      if (!name.trim()) {
        // 파트 이름이 비어 있는지 확인
        alert("부서 이름 입력 필수");
        return;
      }

      const response = await axios.post("/api/v1/addPart", {
        name: name,
        memo: memo,
      });

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("부서 생성 완료");
        return response.data;
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("부서 생성 중 오류가 발생했습니다.");
      return error;
    }
  }
}

export class addRank {
  async post(name, memo) {
    try {
      if (!name.trim()) {
        // 파트 이름이 비어 있는지 확인
        alert("직급 이름 입력 필수");
        return;
      }

      const response = await axios.post("/api/v1/addRank", {
        name: name,
        memo: memo,
      });

      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("직급 생성 완료");
        return response.data;
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("직급 생성 중 오류가 발생했습니다.");
      return error;
    }
  }
}

export class addAccount {
  async post(id, password, name, phone, email, partidx, rankidx, memo) {
    try {
      if (!id.trim() || !password.trim()) {
        alert("계정 이름 입력 필수");
        return;
      }

      const response = await axios.post("/api/v1/addaccount", {
        id: id,
        password: password,
        name: name,
        phone: phone,
        email: email,
        partIdx: partidx,
        rankIdx: rankidx,
        memo: memo,
      });

      if (response.data.code === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("계정 생성 완료");
        return response.data;
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("계정 생성 중 오류가 발생했습니다.");
      return error;
    }
  }
}

export class updateAccount {
  async put(idx, name, phone, email) {
    try {
      const response = await axios.put("/api/v1/updateInfo", {
        idx: idx,
        name: name,
        phone: phone,
        email: email,
      });

      if (response.data.code === 200) {
        console.log(response);
        alert("정보가 변경 되었습니다.");
        return response;
      } else {
        alert("정보 변경 실패.");
      }
    } catch (error) {
      console.error("오류.", error);
      alert("오류");
    }
  }
}

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
  async put(idx, approveIdx, action, reason) {
    try {
      const response = await axios.put("/api/v1/vacation-app/process", {
        idx: 14, //휴가 신청 인덱스 (휴가 신청자의 인덱스 아님)
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
  async put(idx, approveIdx, action, reason) {
    try {
      const response = await axios.put("/api/v1/vacation-app/process", {
        idx: 3, //휴가 거절 인덱스 (휴가 신청자의 인덱스 아님)
        approveIdx: 1, //휴가 거절할 담당자(관리자는 1, 팀장은 2)
        action: "approve", // 거절 : reject , 수락 : approve
        reason: "reason",
      });
      if (response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        alert("휴가가 거절되었습니다.");
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("이미 처리된 휴가입니다.");
      } else {
        console.error("오류 발생:", error);
        alert("휴가 거절 중 오류가 발생했습니다.");
      }
      return error;
    }
  }
}

// 범진 코드
export class mainLogin {
  async post(id, password) {
    try {
      // Validate input values
      if (!id || !password) {
        throw new Error("아이디와 비밀번호를 입력하지 않으셨습니다.");
      }

      const response = await axios.post("/api/v1/userLogin", {
        id: id,
        pw: password,
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      return error;
    }
  }
}

export class work {
  async post(idx, userIdx, typework) {
    try {
      const response = await axios.post("/api/v1/work", {
        // 로그인할 떄 쿠키에 넣은 후 여기에 뿌려주기
        idx: idx,
        userIdx: userIdx,
        type: typework,
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("출퇴근 실패: " + error.message);
      return error;
    }
  }
}

export class workcheck {
  async get(userIdx, startDate, endDate, type) {
    try {
      const response = await axios.get("/api/v1/work", {
        params: {
          userIdx: userIdx,
          startDate: startDate,
          endDate: endDate,
          type: type,
        },
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("출퇴근 조회 실패: " + error.message);
      return error;
    }
  }
}

export class workRequest {
  async post(userIdx, startTime, endTime, type, workIdx) {
    try {
      const response = await axios.post("/api/v1/work-request", {
        userIdx: userIdx,
        startDate: startTime,
        endDate: endTime,
        type: type,
        workIdx: workIdx,
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("출퇴근 조회 실패: " + error.message);
      return error;
    }
  }
  async get(userIdx, startDate, endDate, type) {
    try {
      const response = await axios.get("/api/v1/work-request", {
        params: {
          userIdx: userIdx,
          startDate: startDate,
          endDate: endDate,
          type: type,
        },
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("출퇴근 조회 실패: " + error.message);
      return error;
    }
  }
  async put(idx, confirm) {
    try {
      const response = await axios.put("/api/v1/work-request", {
        idx: idx,
        confirm: confirm,
      });

      return response;
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("출퇴근 조회 실패: " + error.message);
      return error;
    }
  }
}

export class workTimeUnit {
  async post(timename, startTime, endTime, memo) {
    try {
      const response = await axios.post("/api/v1/addTimeUnit", {
        name: timename,
        startTime: startTime,
        endTime: endTime,
        memo: memo,
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      return error;
    }
  }
  async get() {
    try {
      const response = await axios.get("/api/v1/getTimeUnits");

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("근무시간 조회 실패: " + error.message);
      return error;
    }
  }
  async put(idx, changeName, startTimeChange, endTimeChange, changeMemo) {
    try {
      const response = await axios.put("/api/v1/updateTimeUnit", {
        idx: idx,
        name: changeName,
        startTime: startTimeChange,
        endTime: endTimeChange,
        memo: changeMemo,
      });

      // Validate response data
      if (response.data.code === 200) {
        // console.log()
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("근무시간 조회 실패: " + error.message);
      return error;
    }
  }
  async delete(idx) {
    try {
      const response = await axios.delete("/api/v1/deleteTimeUnit", {
        params: {
          idx: idx,
        },
      });

      // Validate response data
      if (response.data.code === 200) {
        // console.log()
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("근무시간 조회 실패: " + error.message);
      return error;
    }
  }
}

export class userUpdateTime {
  async put(userIdx, UpdateIdx, idx) {
    try {
      const response = await axios.put(
        `/api/v1/userUpdateTimeUnit?userIdx=${userIdx}`,
        {
          userIdx: UpdateIdx,
          idx: idx,
        },
      );

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      return error;
    }
  }
  async get(userIdx) {
    try {
      const response = await axios.get("/api/v1/userUpdateTimeUnit", {
        params: {
          userIdx: userIdx,
        },
      });

      // Validate response data
      if (!response.data === null) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      } else {
        return response.data;
      }
    } catch (error) {
      // 오류 발생 시 처리
      console.error("오류 발생:", error);
      // 로그인 실패 시 알림창 띄우기
      alert("근무시간 조회 실패: " + error.message);
      return error;
    }
  }
}

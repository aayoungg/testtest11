import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NewModal from "../../Component/Modal/NewModal";
import { workTimeUnit } from "../../Api/api";

const ListPosition = styled.div``;

const WorkBtn = styled.button`
  padding: 15px 35px;
  border: 1px solid black;
`;

const Input = styled.input`
  width: 200px;
  height: 26px;
  border-radius: 14px;
  margin-bottom: 24px;
  padding-right: 10px;
`;

const Button = styled.button``;

function AdminRequest() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("default");
  const [timeDataCopy, setTimeDataCopy] = useState();
  const [value, setValue] = useState();

  const [inputs, setInputs] = useState({
    startTime: "",
    endTime: "",
    timename: "",
    memo: "",
    startTimeChange: "",
    endTimeChange: "",
  });

  const {
    timename,
    startTime,
    endTime,
    memo,
    startTimeChange,
    endTimeChange,
    changeName,
    changeMemo,
  } = inputs;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const toggleModal = (content) => {
    setModalContent(content);
    setIsModalOpen(!isModalOpen);
  };

  function getWorkTimeUnit() {
    new workTimeUnit().get().then((TimeDataCheck) => {
      if (TimeDataCheck.code === 200) {
        setTimeDataCopy(TimeDataCheck.data);
      }
    });
  }

  const TimeDataAdd = async () => {
    new workTimeUnit()
      .post(timename, startTime, endTime, memo)
      .then((TimeDataAdd) => {
        if (TimeDataAdd.code === 200) {
          getWorkTimeUnit();
          alert("근무 시간이 추가 되었습니다.");
          setIsModalOpen(!isModalOpen);
        } else {
          alert("근무 시간 추가중에 문제가 발생했습니다.");
        }
      });
  };

  useEffect(() => {
    getWorkTimeUnit();
  }, []);

  function IdxCheck(e) {
    const selectedIdx = e.target.value;
    setValue(
      timeDataCopy.find(
        (TimeCheck) => selectedIdx === TimeCheck.idx.toString(),
      ),
    );
  }

  const TimeDateChange = async () => {
    const idx = value.idx;
    new workTimeUnit()
      .put(idx, changeName, startTimeChange, endTimeChange, changeMemo)
      .then((TimeChange) => {
        if (TimeChange.code === 200) {
          getWorkTimeUnit();
          alert("근무 시간이 수정 되었습니다!");
          setIsModalOpen(!isModalOpen);
        }
      });
  };

  function TimeDateDelete() {
    const idx = value.idx;
    new workTimeUnit().delete(idx).then((TimeDelete) => {
      if (TimeDelete.code === 200) {
        getWorkTimeUnit();
        alert("근무 시간이 삭제 되었습니다!");
        setIsModalOpen(!isModalOpen);
      }
    });
  }
  // 다른 모달 나오게 하는 코드
  const renderModalContent = () => {
    switch (modalContent) {
      case "default":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Input
              value={timename}
              name="timename"
              type="text"
              onChange={handleChange}
              placeholder={"근무 시간 이름"}
            />
            <Input
              value={startTime}
              name="startTime"
              onChange={handleChange}
              placeholder={"출근시간"}
            />
            <Input
              value={endTime}
              name="endTime"
              type="text"
              onChange={handleChange}
              placeholder={"퇴근시간"}
            />
            <Input
              value={memo}
              name="memo"
              type="text"
              onChange={handleChange}
              placeholder={"설명"}
            />
            <Button name="button" type="button" onClick={TimeDataAdd}>
              추가하기
            </Button>
          </div>
        );
      case "custom":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <select onChange={IdxCheck}>
              <option selected>시간을 선택해주세요</option>
              {timeDataCopy &&
                timeDataCopy.map((TimeCheck, index) => (
                  <option key={index} value={TimeCheck.idx}>
                    {TimeCheck.startTime + "~" + TimeCheck.endTime}
                  </option>
                ))}
            </select>
            <Input
              value={changeName}
              name="changeName"
              type="text"
              onChange={handleChange}
              placeholder={value === undefined ? "근무 시간 이름" : value.name}
            />
            <Input
              value={startTimeChange}
              name="startTimeChange"
              onChange={handleChange}
              placeholder={value === undefined ? "출근시간" : value.startTime}
            />
            <Input
              value={endTimeChange}
              name="endTimeChange"
              onChange={handleChange}
              placeholder={value === undefined ? "퇴근시간" : value.endTime}
            />
            <Input
              value={changeMemo}
              name="changeMemo"
              type="text"
              onChange={handleChange}
              placeholder={value === undefined ? "설명" : value.memo}
            />
            <Button onClick={TimeDateChange}>근무시간 변경 하기</Button>
          </div>
        );
      case "delete":
        console.log(value);
        return (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <select onChange={IdxCheck} style={{ width: "180px" }}>
              <option selected>시간을 선택해주세요</option>
              {timeDataCopy &&
                timeDataCopy.map((TimeCheck, index) => (
                  <option key={index} value={TimeCheck.idx}>
                    {TimeCheck.startTime + "~" + TimeCheck.endTime}
                  </option>
                ))}
            </select>
            <input
              type="text"
              defaultValue={
                value !== undefined
                  ? `${value.startTime} ~ ${value.endTime}`
                  : ""
              }
            />

            <button
              onClick={() => {
                TimeDateDelete();
              }}
            >
              근무시간 삭제
            </button>
          </div>
        );
      // {currentItems && currentItems.map((record, index, e) => (
      //     <div style={{ width: "80vw", display: "flex", justifyContent: "space-evenly", alignItems: "center", height: "50px", borderBottom: "1px solid " }} key={index} className="custom-list-item">
      //         <List>{record.name}</List>
      //         {/* 신청 날짜 들어오면 신청하기 */}
      //         <List>{record.memo}</List>
      //         <List>{`${record.startTime.split(":").slice(0, 2).join("시") + "분"} ~ ${record.endTime.split(":").slice(0, 2).join("시") + "분"}`}</List>
      //         <List onClick={e.target}>{"수정하기"}</List>
      //     </div>
      // ))
      // }
      // Add more cases as needed
      default:
        return null;
    }
  };

  return (
    <ListPosition>
      <div style={{ marginTop: "20px" }}>
        <WorkBtn onClick={() => toggleModal("default")}>근무 시간 추가</WorkBtn>
        <WorkBtn onClick={() => toggleModal("custom")}>근무 시간 수정</WorkBtn>
        <WorkBtn onClick={() => toggleModal("delete")}>근무 시간 삭제</WorkBtn>
        {isModalOpen && (
          <NewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {renderModalContent()}
          </NewModal>
        )}
      </div>
    </ListPosition>
  );
}

export default AdminRequest;

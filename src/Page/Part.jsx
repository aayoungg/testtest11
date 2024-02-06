import React, { useState, useEffect } from "react";
import Button from "../Component/Button/NewButton";
import styled from "styled-components";
import axios from "axios";
import Modal from "react-modal";
// import {getPart} from '../api/api.js';
// import Modal from '../modal/ClickModal';
import { addPart } from "../Api/api";
import Pagination from "../Component/Pagination/Pagination";

const PartContainer = styled.div``;

const Title = styled.h2`
  color: #333;
  padding-bottom: 10px;
`;
const SecTitle = styled.h2`
  display: flex;
  text-align: center;
  flex-direction: column;
`;

const Form = styled.form``;

const InputGroup = styled.div`
  //파트 이름과 파트 메모 사이
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const InputField = styled.input`
  //파트 이름 칸
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 3px;
`;

const TextAreaField = styled.textarea`
  //파트 메모 칸
  padding: 20px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`;

const Li = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  text-align: center;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #d9d9d9;
`;

const ButtonPosition = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
`;
const FlexStyle = styled.div`
  display: flex;
`;
export const Select = styled.select`
  //모달창-선택박스
  margin: 3px;
  display: block;
  width: 185px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const TotalBtn = styled.div`
  //모달창-취소,수정 버튼
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;
const Part = () => {
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [flag, setFlag] = useState("사용함");
  const [filterFlag, setFilterFlag] = useState(-1);
  const [parts, setParts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPartId, setEditingPartId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
      height: "250px",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      backgroundColor: "white",
      justifyContent: "center",
    },
  };

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 5; // 페이지당 표시되는
  const totalItems = parts.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = parts.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지

  const handleCreatePart = () => {
    //부서 생성
    openModal();
  };

  const handleSavePart = async () => {
    new addPart().post(name, memo).then((partdata) => {
      console.log(partdata);
    });
    setName("");
    setMemo("");
    closeModal();
  };

  useEffect(() => {
    //부서 목록 사용 여부 구분
    const fetchParts = async () => {
      try {
        const response = await axios.get("/api/v1/getParts");
        if (Array.isArray(response.data.data)) {
          const filteredParts =
            filterFlag === -1
              ? response.data.data
              : response.data.data.filter(
                  (part) => part.partFlag === filterFlag,
                );
          setParts(filteredParts);
        } else {
          console.log(response);
          console.error("부서 목록 데이터 형식이 잘못되었습니다.");
        }
      } catch (error) {
        console.error("부서 목록 가져오기 실패:", error);
      }
    };
    fetchParts();
  }, [filterFlag, currentPage]);

  const handleUpdatePart = async () => {
    //부서 수정
    try {
      const updatedPart = parts.find((part) => part.idx === editingPartId);
      if (!updatedPart) {
        alert("부서를 찾을 수 없습니다.");
        return;
      }

      const response = await axios.put(`/api/v1/updatePart`, {
        idx: updatedPart.idx,
        name: name,
        memo: memo,
        flag: flag,
      });

      if (response.data.code === 200) {
        alert("부서 수정 완료");
        closeModal();
      } else {
        alert("부서 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("부서 수정 중 오류가 발생했습니다:", error);
      alert("부서 수정 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (part) => {
    //부서 목록에 수정 버튼 클릭 시 해당 부서 정보 받아오기
    setName(part.partname);
    setMemo(part.partMemo);
    setFlag(part.partFlag);
    setEditingPartId(part.idx);
    setIsEditing(true);
    openModal();
  };

  const handleCancelEdit = () => {
    //수정 중 취소 기능
    setIsEditing(false);
    setEditingPartId(null);
    setName("");
    setMemo("");
  };

  return (
    <PartContainer>
      <Title>부서 목록</Title>

      <FlexStyle>
        <select
          value={filterFlag}
          onChange={(e) => setFilterFlag(Number(e.target.value))}
        >
          <option key={parts.partFlag} defaultValue={1}>
            사용함
          </option>
          <option key={parts.partFlag} defaultValue={0}>
            사용 안 함
          </option>
          <option key={parts.partFlag} defaultValue={-1}>
            전체
          </option>
        </select>
        <ButtonPosition>
          <Button onClick={handleCreatePart}>생성</Button>
        </ButtonPosition>
      </FlexStyle>
      <Ul>
        <Li>
          <span>부서</span>
          <span>메모</span>
          <span>사용여부</span>
          <span>수정</span>
        </Li>
        {currentItems?.map((part) => (
          <Li key={part.idx}>
            <span>{part.partname}</span>
            <span>{part.partMemo}</span>
            <span>{part.partFlag == 0 ? "사용안함" : "사용함"}</span>

            <div>
              <Button onClick={() => handleEditClick(part)}>수정</Button>
              <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                shouldCloseOnOverlayClick={false}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Form style={{ width: "130px" }}>
                    <SecTitle>{isEditing ? "부서 수정" : "부서 생성"}</SecTitle>
                    <InputGroup>
                      <InputField
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="부서 이름"
                      />
                      <InputField
                        type="text"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="부서 메모"
                      />
                      {isEditing && (
                        <Select
                          value={flag}
                          onChange={(e) => {
                            setFlag(e.target.value);
                          }}
                        >
                          <option key={part.partFlag} value={1}>
                            사용함
                          </option>
                          <option key={part.partFlag} value={0}>
                            사용 안 함
                          </option>
                        </Select>
                      )}
                    </InputGroup>
                    <TotalBtn>
                      <Button onClick={handleCancelEdit}>취소</Button>
                      <Button
                        onClick={isEditing ? handleUpdatePart : handleSavePart}
                      >
                        {isEditing ? "수정" : "저장"}
                      </Button>
                    </TotalBtn>
                  </Form>
                </div>
              </Modal>
            </div>
          </Li>
        ))}
      </Ul>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        paginate={paginate}
      />
    </PartContainer>
  );
};

export default Part;

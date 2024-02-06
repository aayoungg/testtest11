import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";
// import { Link } from 'react-router-dom';
import { addRank } from "../Api/api";
import Button from "../Component/Button/NewButton";
import Pagination from "../Component/Pagination/Pagination";

const RankContainer = styled.div``;

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

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  //파트 이름 칸
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 3px;
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
function Position() {
  const [name, setRankName] = useState("");
  const [memo, setRankMemo] = useState("");
  const [ranks, setRanks] = useState([]);
  const [flag, setRankFlag] = useState("사용함");
  const [isEditing, setIsEditing] = useState(false);
  const [editingRankId, setEditingRankId] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [filterFlag, setFilterFlag] = useState(-1);

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

  const handleSubmit = () => {
    //직급 생성
    openModal();
  };

  const handleSaveRank = async () => {
    new addRank().post(name, memo).then((rankdata) => {
      console.log(rankdata);
    });
    setRankName("");
    setRankMemo("");
    closeModal();
  };

  const handleUpdateRank = async (RankId) => {
    //직 수정
    try {
      const updatedRank = ranks.find((rank) => rank.idx === editingRankId);
      if (!updatedRank) {
        alert("직 찾을 수 없vvv습니다.");
        return;
      }

      const response = await axios.put(`/api/v1/updateRank`, {
        idx: updatedRank.idx,
        name: name,
        memo: memo,
        flag: flag,
      });

      if (response.data.code === 200) {
        alert("직 수정 완료");
        closeModal();
      } else {
        alert("직 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("직 수정 중 오류가 발생했습니다:", error);
      alert("직 수정 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (rank) => {
    //직 목록에 수정 버튼 클릭 시 해당 직 정보 받아오기
    setRankName(rank.rankname);
    setRankMemo(rank.rankMemo);
    setRankFlag(rank.rankFlag);
    setEditingRankId(rank.idx);
    setIsEditing(true);
    openModal();
  };
  const handleCancelEdit = () => {
    //수정 중 취소 기능
    setIsEditing(false);
    setEditingRankId(null);
    setRankName("");
    setRankMemo("");
  };

  useEffect(() => {
    //직급 목록 사용 여부 구분
    const fetchPositions = async () => {
      try {
        const response = await axios.get("/api/v1/getRanks");
        if (Array.isArray(response.data.data)) {
          const filteredRanks =
            filterFlag === -1
              ? response.data.data
              : response.data.data.filter(
                  (rank) => rank.rankFlag === filterFlag,
                );
          setRanks(filteredRanks);
        } else {
          console.log(response);
          console.error("직급 목록 데이터 형식이 잘못되었습니다.");
        }
      } catch (error) {
        console.error("직급 목록 가져오기 실패:", error);
      }
    };
    fetchPositions();
  }, [filterFlag]);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 5; // 페이지당 표시되는
  const totalItems = ranks.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = ranks.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지

  return (
    <RankContainer>
      <Title>직급 목록</Title>
      <FlexStyle>
        <select
          value={filterFlag}
          onChange={(e) => setFilterFlag(Number(e.target.value))}
        >
          <option key={ranks.rankFlag} value={1}>
            사용함
          </option>
          <option key={ranks.rankFlag} value={0}>
            사용 안 함
          </option>
          <option key={ranks.rankFlag} value={-1}>
            전체
          </option>
        </select>
        <ButtonPosition>
          <Button onClick={handleSubmit}>생성</Button>
        </ButtonPosition>
      </FlexStyle>

      <Ul>
        <Li>
          <span>직급</span>
          <span>메모</span>
          <span>사용여부</span>
          <span>수정</span>
        </Li>
        {/* {ranks?.map(rank => ( */}
        {currentItems?.map((rank) => (
          <Li key={rank.idx}>
            <span>{rank.rankname}</span>
            <span>{rank.rankMemo}</span>
            <span>{rank.rankFlag == 0 ? "사용안함" : "사용함"}</span>
            <div>
              <Button onClick={() => handleEditClick(rank)}>수정</Button>

              <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                shouldCloseOnOverlayClick={false}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Form style={{ width: "130px" }}>
                    <SecTitle>{isEditing ? "직급 수정" : "직급 생성"}</SecTitle>
                    <InputGroup>
                      <InputField
                        type="text"
                        value={name}
                        onChange={(e) => setRankName(e.target.value)}
                        placeholder="직급"
                      />
                      <InputField
                        type="text"
                        value={memo}
                        onChange={(e) => setRankMemo(e.target.value)}
                        placeholder="메모"
                      />
                      {isEditing && (
                        <Select
                          value={flag}
                          onChange={(e) => {
                            setRankFlag(e.target.value);
                          }}
                        >
                          <option key={rank.rankFlag} value={1}>
                            사용함
                          </option>
                          <option key={rank.rankFlag} value={0}>
                            사용 안 함
                          </option>
                        </Select>
                      )}
                    </InputGroup>
                    <TotalBtn>
                      <Button onClick={closeModal}>취소</Button>
                      <Button
                        onClick={isEditing ? handleUpdateRank : handleSaveRank}
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
    </RankContainer>
  );
}

export default Position;

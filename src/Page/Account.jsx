import React, { useState, useEffect } from "react";
import Button from "../Component/Button/NewButton";
import styled from "styled-components";
import axios from "axios";
import Modal from "react-modal";
import Pagination from "../Component/Pagination/Pagination";
import { addAccount } from "../Api/api";
const PartContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 23vw;
  top: 20vh;
  width: 70%;
`;

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

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`;

const Li = styled.li`
  display: grid;
  grid-template-columns: 0.1fr 1fr 1fr 1fr 1fr 1fr;
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

const Btn = styled.div`
  padding: 5px;
`;
const BBtn = styled.button`
  background-color: #ff4141;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 5px 15px;
`;
const Account = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [partidx, setPartIdx] = useState("");
  const [rankidx, setRankIdx] = useState("");
  const [flag, setFlag] = useState("사용함");
  const [filterFlag, setFilterFlag] = useState(-1);
  const [accounts, setAccounts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccountId, setEdigingAccountId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [checkedAccounts, setCheckedAccounts] = useState({});
  const [part, setPart] = useState();
  const [position, setPosition] = useState();

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
      height: "450px",
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
    //수정 시 부서 select Box
    const fetchParts = async () => {
      const response = await axios.get("/api/v1/getParts");
      setPart(response);
      setPartIdx(response.data.data[0].idx);
    };
    fetchParts();
  }, []);
  useEffect(() => {
    const fetchPositions = async () => {
      const response = await axios.get("/api/v1/getRanks");
      setPosition(response);
      setRankIdx(response.data.data[0].idx);
    };
    fetchPositions();
  }, []);
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 5; // 페이지당 표시되는
  const totalItems = accounts.length; // 전체
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째
  const currentItems = accounts.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지

  const handleCreateAccount = () => {
    //계정 생성
    openModal();
  };

  const handleSaveAccount = async () => {
    new addAccount()
      .post(id, password, name, phone, email, partidx, rankidx, flag, memo)
      .then((accountdata) => {});

    setId("");
    setPassword("");
    setName("");
    setPhone("");
    setEmail("");
    setPartIdx("");
    setRankIdx("");
    setMemo("");
    setFlag("사용함");
    closeModal();
    window.location.reload();
  };

  useEffect(() => {
    //계정 목록 사용 여부 구분
    const fetchAccount = async () => {
      try {
        const response = await axios.get("/api/v1/getUsers");
        if (Array.isArray(response.data.data)) {
          const filteredAccounts =
            filterFlag === -1
              ? response.data.data
              : response.data.data.filter(
                  (account) => account.AccountFlag === filterFlag
                );
          setAccounts(filteredAccounts);
        } else {
          console.log(response);
          console.error("계정 목록 데이터 형식이 잘못되었습니다.");
        }
      } catch (error) {
        console.error("계정 목록 가져오기 실패:", error);
      }
    };
    fetchAccount();
  }, [filterFlag, currentPage]);

  const handleUpdateAccount = async () => {
    try {
      const updatedAccount = accounts.find(
        (account) => account.idx === editingAccountId
      );
      if (!updatedAccount) {
        alert("부서를 찾을 수 없습니다.");
        return;
      }

      const response = await axios.put(`/api/v1/changeemployee`, {
        idx: updatedAccount.idx,
        id: id,
        name: name,
        phone: phone,
        email: email,
        partIdx:
          partidx === undefined || partidx === ""
            ? part.data.data[0].idx
            : partidx,
        rankIdx:
          rankidx === undefined || rankidx === ""
            ? position.data.data[0].idx
            : rankidx,
        memo: memo,
        flag: flag,
      });
      console.log("response ", response.partIdx);
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

  const handleEditClick = (account) => {
    //부서 목록에 수정 버튼 클릭 시 해당 부서 정보 받아오기
    setPartIdx(account.accountpartidx);
    setRankIdx(account.accountrankidx);
    // setFlag(account.accountFlag);
    setEdigingAccountId(account.idx);
    setIsEditing(true);
    openModal();
  };

  const handleCancelEdit = () => {
    //모달창 - 취소 기능
    setIsEditing(false);
    setEdigingAccountId(null);
    setPartIdx("");
    setRankIdx("");
    closeModal();
  };

  const handleCheck = (idx) => {
    //삭제
    setCheckedAccounts({ ...checkedAccounts, [idx]: !checkedAccounts[idx] });
  };

  const handleDeleteAccounts = async () => {
    //삭제
    const toDelete = Object.keys(checkedAccounts).filter(
      (idx) => checkedAccounts[idx]
    );
    console.log(toDelete);
    if (toDelete.length > 0) {
      try {
        let allRequestsSuccessful = true;

        for (let i = 0; i < toDelete.length; i++) {
          const response = await axios.delete("/api/v1/deleteUser", {
            params: {
              idx: toDelete[i],
            },
          });

          if (response.status !== 200) {
            allRequestsSuccessful = false;
            break;
          }
        }

        if (allRequestsSuccessful) {
          alert("성공적으로 삭제되었습니다.");
          window.location.reload();
        } else {
          alert("계정 삭제에 실패하였습니다.");
        }
      } catch (error) {
        console.error("계정 삭제 실패:", error);
      }
    }
  };

  // console.log("partidx",partidx);
  // console.log("rankidx",partidx);
  return (
    <PartContainer>
      <Title>계정 목록</Title>

      <FlexStyle>
        <ButtonPosition>
          <Btn>
            <Button onClick={handleCreateAccount}>생성</Button>
          </Btn>
          <Btn>
            <BBtn onClick={handleDeleteAccounts}>삭제</BBtn>
          </Btn>
        </ButtonPosition>
      </FlexStyle>

      <Ul>
        <Li>
          <span> </span>
          <span>이름</span>
          <span>부서</span>
          <span>직급</span>
          <span>사용여부</span>
          <span>수정</span>
        </Li>
        {currentItems?.map((accounts) => (
          <Li key={accounts.idx}>
            <input
              type="checkbox"
              onChange={() => handleCheck(accounts.idx)}
              checked={checkedAccounts[accounts.idx] || false}
              style={{ display: "inline-block", margin: "0 10px" }}
            />
            <span>{accounts.name}</span>
            <span>{accounts.partName}</span>
            <span>{accounts.rankName}</span>
            <span>{accounts.rank == 0 ? "사용안함" : "사용함"}</span>

            <div>
              <Button onClick={() => handleEditClick(accounts)} type="button">
                수정
              </Button>

              <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                shouldCloseOnOverlayClick={false}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Form style={{ width: "130px" }}>
                    <SecTitle>{isEditing ? "계정 수정" : "계정 생성"}</SecTitle>
                    <InputGroup>
                      {isEditing || (
                        <InputField
                          type="text"
                          defaultValue={id}
                          onChange={(e) => setId(e.target.value)}
                          placeholder="아이디"
                        />
                      )}
                      {isEditing || (
                        <InputField
                          type="password"
                          defaultValue={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="비밀번호"
                        />
                      )}
                      {isEditing || (
                        <InputField
                          type="name"
                          defaultValue={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="이름"
                        />
                      )}
                      {isEditing || (
                        <InputField
                          type="phone"
                          defaultValue={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="전화번호"
                        />
                      )}
                      {isEditing || (
                        <InputField
                          type="email"
                          defaultValue={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="이메일"
                        />
                      )}

                      <select
                        onChange={(e) => {
                          console.log(e.target.value);
                          setPartIdx(e.target.value);
                        }}
                        value={partidx}
                      >
                        {part.data.data.map((data) => (
                          <option key={`part${data.idx}`} value={data.idx}>
                            {data.partname}
                          </option>
                        ))}
                      </select>
                      <select
                        onChange={(e) => setRankIdx(e.target.value)}
                        value={rankidx}
                      >
                        {position.data.data.map((data) => (
                          <option key={`rank${data.idx}`} value={data.idx}>
                            {data.rankname}
                          </option>
                        ))}
                      </select>
                      {isEditing || (
                        <InputField
                          value={memo}
                          onChange={(e) => setMemo(e.target.value)}
                          placeholder="메모"
                        />
                      )}
                    </InputGroup>
                    <TotalBtn>
                      <BBtn type="button" onClick={handleCancelEdit}>
                        취소
                      </BBtn>
                      <Button
                        type="button"
                        onClick={
                          isEditing ? handleUpdateAccount : handleSaveAccount
                        }
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

export default Account;

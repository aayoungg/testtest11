import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "Component/Button/NewButton";
import Modal from "react-modal";
import { getCookie, setCookie } from "Cookie/cookie";
import { updateAccount } from "Api/api";
import { useNavigate } from "react-router-dom";
import MainTitle from "../../Component/Header/MainTitle";
import { toast } from "react-toastify";

const InfoContainer = styled.div``;

const Container = styled.div`
  background: #fff;
  padding: 28px;
  border-radius: 5px;
  max-width: 400px;
  margin-bottom: 20px;

  .sub-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: space-between;
    height: 32px;

    p {
      font-size: 16px;
      font-weight: bold;
    }
  }
`;

const SecTitle = styled.h2`
  display: flex;
  text-align: center;
  height: 60px;
  font-size: 20px;
`;

const Form = styled.form``;

const InputField = styled.input``;

const TotalBtn = styled.div`
  //모달창-취소,수정 버튼
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
`;

const MyInfo = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    height: 40px;
  }

  span {
    width: 100px;
    display: block;
    font-size: 14px;
    font-weight: 500;
    flex: 0 0 100px;
  }

  div {
    font-size: 14px;
    font-weight: 400;
  }

  &.password {
    margin-bottom: 40px;
  }
`;

const Info = () => {
  const user = getCookie("logindata");
  const movePage = useNavigate();
  const LoginDate = getCookie("logindata");
  const [updateAccountData, setUpdateAccountData] = useState();
  const [name, setName] = useState(LoginDate.data.name);
  const [phone, setPhone] = useState(LoginDate.data.phone);
  const [email, setEmail] = useState(LoginDate.data.email);
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const idx = user.data.idx;

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
      height: "fit-content",
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
    const logindata = getCookie("logindata");
    // console.log(logindata);
    if (logindata) {
      setName(logindata.name);
      setPhone(logindata.phone);
      setEmail(logindata.email);
    }
  }, []);
  // 계정 생성
  const handleUpdateAccount = async (event) => {
    event.preventDefault();

    const accountdata = await new updateAccount().put(idx, name, phone, email);
    if (accountdata.data.code === 200) {
      closeModal();
      setUpdateAccountData(accountdata);
      setCookie(
        "logindata",
        { ...user, data: { ...user.data, name, phone, email } },
        { path: "/" },
      );
    }
  };

  const EditClick = () => {
    openModal();
    setName(
      updateAccountData === undefined || updateAccountData === null
        ? user.data.name
        : updateAccountData.data.data.name,
    );
    setPhone(
      updateAccountData === undefined || updateAccountData === null
        ? user.data.phone
        : updateAccountData.data.data.phone,
    );
    setEmail(
      updateAccountData === undefined || updateAccountData === null
        ? user.data.email
        : updateAccountData.data.data.email,
    );
  };

  const handleChangePassword = async () => {
    if (!password.trim()) {
      toast("현재 비밀번호를 입력해주세요");
      return;
    }

    if (
      !newPassword ||
      !confirmNewPassword ||
      newPassword !== confirmNewPassword
    ) {
      toast("새로운 비밀번호와 재확인 비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      const idx = LoginDate.data.idx;
      const response = await axios.put(`/api/v1/info/changepw?idx=${idx}`, {
        password: password,
        newPassword: newPassword,
      });

      if (response.data.code === 200) {
        toast("비밀번호가 성공적으로 변경되었습니다.");
        movePage("/main");
      } else if (response.data.code === 401) {
        toast("현재 비밀번호가 일치하지 않습니다.");
      } else {
        toast("비밀번호 변경 중 오류가 발생했습니다.");
      }
    } catch (error) {
      toast("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <InfoContainer>
      <MainTitle title={"마이페이지"}></MainTitle>

      <Container>
        <div className={`sub-title`}>
          <p>내 정보</p>
          {LoginDate.data.rankName !== "관리자" && (
            <Button onClick={EditClick} size={"s"} width={80}>
              수정하기
            </Button>
          )}
        </div>
        <MyInfo>
          <li>
            <span>이름</span>
            <div>{LoginDate.data.name}</div>
          </li>
          {LoginDate.data.rankName !== "관리자" && (
            <>
              <li>
                <span>전화번호</span>
                <div>{LoginDate.data.phone}</div>
              </li>
              <li>
                <span>이메일</span>
                <div>{LoginDate.data.email}</div>
              </li>
              <li>
                <span>부서</span>
                <div>{LoginDate.data.partName}</div>
              </li>
              <li>
                <span>직급</span>
                <div>{LoginDate.data.rankName}</div>
              </li>
            </>
          )}
        </MyInfo>
      </Container>

      <Container>
        <div className={`sub-title`}>
          <p>비밀번호 변경</p>
        </div>
        <MyInfo className={"password"}>
          <li>
            <span>현재 비밀번호</span>
            <Input
              type="password"
              placeholder="현재 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>
          <li>
            <span>새 비밀번호</span>
            <Input
              type="password"
              placeholder="새로운 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </li>
          <li>
            <span>비밀번호 확인</span>
            <Input
              type="password"
              placeholder="새로운 비밀번호 확인"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </li>
        </MyInfo>
        <Button onClick={handleChangePassword} size={"m"} full>
          비밀번호 변경
        </Button>
      </Container>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
      >
        <Form>
          <SecTitle>계정 수정</SecTitle>
          <MyInfo>
            <li>
              <span>이름</span>
              <InputField
                type="text"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
              />
            </li>
            <li>
              <span>전화번호</span>
              <InputField
                type="text"
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호"
              />
            </li>
            <li>
              <span>이메일</span>
              <InputField
                type="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
              />
            </li>
          </MyInfo>
          <TotalBtn>
            <Button onClick={closeModal} full size={"m"} color={"white"}>
              취소
            </Button>
            <Button onClick={handleUpdateAccount} full size={"m"}>
              수정
            </Button>
          </TotalBtn>
        </Form>
      </Modal>
    </InfoContainer>
  );
};

export default Info;

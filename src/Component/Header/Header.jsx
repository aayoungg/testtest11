import NickName from "../NickName/Nickname.jsx";
import Logo from "../Image/Image.jsx";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import LogoImage from "../../Image/logo.png";
import { getCookie, deleteCookie } from "../../Cookie/cookie.js";
import { ensureCookie } from "../../Cookie/cookiecheck.js";
import { useEffect } from "react";

const Menu = styled.div`
  display: flex;
  height: 80px;
  width: 100vw;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
`;

const MenuLogout = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 18px;
`;

const Menuflex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const NavStyle = styled(NavLink)`
  width: 100px;
  color: black;
  font-size: 18px;
  text-decoration-line: none;
  padding: 28px;
  text-align: center;
`;

function HeaderMenu({ workdataState }) {
  const Cookiecheck = ensureCookie("logindata");
  let now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const [workdata, setWorkData] = workdataState;
  const user = getCookie("logindata");
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookiecheck == formattedDate) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Menu>
        <Menuflex>
          <Logo src={LogoImage} width="200px" marginright="35px" />
          <NavStyle to="/work/Home">출퇴근</NavStyle>
          <NavStyle to="./vacationreq">휴가</NavStyle>
          {/* <NavStyle to="./vacationDel">휴가</NavStyle> */}
          {user !== undefined && user.data.rankName === "관리자" && (
            <NavStyle to="./account">설정</NavStyle>
          )}
        </Menuflex>
        <MenuLogout>
          {workdata !== "undefined" &&
          workdata !== undefined &&
          workdata.startDate !== null &&
          workdata.endDate === null ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "black",
                  width: "8px",
                  height: "8px",
                  borderRadius: "100%",
                  marginRight: "10px",
                  background: "#0059FF",
                }}
              ></div>
              <div>출근 중</div>
            </div>
          ) : (
            ""
          )}
          <NickName />
          {user !== undefined && user.data.rankName === "관리자" && (
            <NavStyle to="./password">마이페이지</NavStyle>
          )}
          {user !== undefined && user.data.rankName === "매니저" && (
            <NavStyle to="./info">마이페이지</NavStyle>
          )}
          {user !== undefined && user.data.rankName === "선임매니저" && (
            <NavStyle to="./info">마이페이지</NavStyle>
          )}
          {user !== undefined && user.data.rankName === "팀장" && (
            <NavStyle to="./info">마이페이지</NavStyle>
          )}
          <NavStyle to="/">로그아웃</NavStyle>
        </MenuLogout>
      </Menu>
    </>
  );
}

export default HeaderMenu;

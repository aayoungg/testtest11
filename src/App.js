// App.js
import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./Page/Login/Login";
import Home from "./Page/Home/Home";
import CommuteHistory from "./Page/CommuteHistory/CommuteHistory.jsx";
import Header from "./Component/Header/Header.jsx";
import Leftmenu from "./Component/LeftMenu/Leftmenu.jsx";
import SendRequest from "./Page/RequestCheck/SendRequest.jsx";
import RequestCheck from "./Page/RequestCheck/RequstCheck.jsx";
import { getCookie } from "./Cookie/cookie.js";
import CreateWork from "./Page/CreateWork/CreateWork.jsx";
import AdminRequest from "./Page/CreateWork/AdminRequest.jsx";
// 아영님 코드
import Password from "./Page/Password.jsx";
import Part from "./Page/Part";
import Position from "./Page/Position";
import AdminLeft from "./Component/LeftMenu/AdminLeft.jsx";
import UserLeft from "./Component/LeftMenu/UserLeft.jsx";
import Info from "./Page/Info";
import Account from "./Page/Account";
import My from "./Component/My/My.jsx";
import VacationReq from "./Page/VacationReq";
import Modal from "react-modal";
import VacationDel from "./Page/VacationDel.jsx";
import VacationProcess from "./Page/VacationProcess.jsx";
// import Rank from "./Page/Rank.jsx";

function App() {
  Modal.setAppElement("#root");
  const workdataState = useState(getCookie("workdata"));
  const user = getCookie("logindata");
  const { pathname } = useLocation();

  return (
    <div className="App">
      {pathname !== "/" && <Header workdataState={workdataState} />}
      {pathname.split("/")[1] === "work" && (
        <Leftmenu workdataState={workdataState} />
      )}

      {pathname !== "/main" &&
        pathname !== "/" &&
        pathname !== "/Home" &&
        pathname !== "/vacation" &&
        pathname !== "/info" &&
        pathname !== "/password" &&
        user.data.rankName === "관리자" && <AdminLeft />}
      {pathname !== "/main" &&
        pathname !== "/" &&
        pathname !== "/Home" &&
        pathname !== "/vacation" &&
        user.data.rankName === "팀장" && <UserLeft />}
      {pathname !== "/main" &&
        pathname !== "/" &&
        pathname !== "/Home" &&
        pathname !== "/vacation" &&
        user.data.rankName === "매니저" && <UserLeft />}
      {pathname !== "/main" &&
        pathname !== "/" &&
        pathname !== "/Home" &&
        pathname !== "/vacation" &&
        user.data.rankName === "선임매니저" && <UserLeft />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/work/home" element={<Home />} />
        <Route path="/work/CommuteHistory" element={<CommuteHistory />} />
        <Route path="/work/SendRequest" element={<SendRequest />} />
        <Route path="/work/RequestCheck" element={<RequestCheck />} />
        <Route path="/work/CreateWork" element={<CreateWork />} />
        <Route path="/work/AdminRequest" element={<AdminRequest />} />
        {/* 아영님 Page*/}
        <Route path="/password" element={<Password />}></Route>
        <Route path="/account" element={<Account />}></Route>
        {/* <Route path='/main' element={<Main/>}></Route> */}
        <Route path="/part" element={<Part />}></Route>
        <Route path="/position" element={<Position />}></Route>
        <Route path="/info" element={<Info />}></Route>
        <Route path="/my" element={<My />}></Route>
        <Route path="/vacationreq" element={<VacationReq />}></Route>
        <Route path="/vacationprocess" element={<VacationProcess />}></Route>
        {/* <Route path="/rank" element={<Rank/>}></Route> */}
        <Route path="/vacationdel" element={<VacationDel />}></Route>
      </Routes>
    </div>
  );
}

export default App;

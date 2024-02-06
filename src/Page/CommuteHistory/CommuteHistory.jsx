import { useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker from "../../Component/Date/DatePicker.jsx";
import { workcheck } from "../../Api/api.js";
import { getCookie } from "../../Cookie/cookie.js";
import Pagination from "../../Component/Pagination/Pagination.jsx";

const ListPosition = styled.div``;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-evenly;
  border-bottom: 1px solid black;
`;

const ListBody = styled.div`
  display: flex;
  justify-content: space-evenly;
  height: 700px;
`;

const List = styled.div`
  width: 300px;
  display: flex;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

function CommuteHistory() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRecord, setDateRecord] = useState();
  const LoginData = getCookie("logindata");
  const [type, setType] = useState(2); // 1 팀원 기록 2 자신의 출퇴근 기록 조회
  const [click, setClick] = useState(0); // 0 클릭 안함 1 클릭함
  const [currentPage, setCurrentPage] = useState(1);

  let userIdx = LoginData.data.idx;
  let rankName = LoginData.data.rankName;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (rankName === "팀장" && click !== 1) {
      setType(1);
    }
    if (startDate !== null && endDate !== null) {
      console.log(startDate, endDate);
      new workcheck()
        .get(userIdx, startDate, endDate, type)
        .then((workdata) => {
          if (type === 1) {
            setDateRecord(
              workdata.data.filter((record) =>
                LoginData.data.name === record.name ? "" : record,
              ),
            );
          } else {
            setDateRecord(workdata.data);
          }
        });
    }
  }, [startDate, endDate, click]);

  const MyRecords = () => {
    setType(type === 2 ? 1 : 2);
    setClick(click === 0 ? 1 : 0);
  };

  const itemsPerPage = 5;
  const totalItems =
    dateRecord !== undefined
      ? dateRecord && dateRecord.length
      : dateRecord && dateRecord.data.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    dateRecord !== undefined
      ? dateRecord && dateRecord.slice(indexOfFirstItem, indexOfLastItem)
      : dateRecord && dateRecord.data.slice(indexOfFirstItem, indexOfLastItem);

  const DateList = () => {
    return (
      <div>
        {currentItems &&
          currentItems.map(
            (record, index) => (
              console.log(record.name),
              (
                <div
                  style={{
                    width: "80vw",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    height: "50px",
                    borderBottom: "1px solid ",
                  }}
                  key={index}
                  className="custom-list-item"
                >
                  {rankName === "팀장" && type === 1 ? (
                    <List>{record.name}</List>
                  ) : (
                    ""
                  )}
                  <List>{record.startDate.split("T")[0]}</List>
                  <List>
                    {record.startDate
                      .split("T")[1]
                      .split(":")
                      .slice(0, 2)
                      .join("시") + "분"}
                  </List>
                  <List>
                    {record.endDate === null
                      ? ""
                      : record.endDate
                          .split("T")[1]
                          .split(":")
                          .slice(0, 2)
                          .join("시") + "분"}
                  </List>
                  <List>
                    {record.endDate === null
                      ? ""
                      : record.endDate
                          .split("T")[1]
                          .split(":")
                          .slice(0, 2)
                          .join("") -
                        record.startDate
                          .split("T")[1]
                          .split(":")
                          .slice(0, 2)
                          .join("") +
                        "분"}
                  </List>
                </div>
              )
            ),
          )}
      </div>
    );
  };

  // <MyWorkContent>
  //   <div style={{ display: "flex" }}>
  //     <h2 style={{ marginLeft: "40px" }}>내 근로 통계</h2>
  //     {rankName === "팀장" && mywork === 0 && <div onClick={togglemywork} style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>내 기록 보기</div>}
  //     {rankName === "팀장" && mywork === 1 && <div onClick={togglemywork} style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>내 팀원 보기</div>}
  //   </div>
  //   <DatePosition>
  //     <DatePicker />
  //   </DatePosition>

  return (
    <>
      <ListPosition>
        <DatePicker setStartDate={setStartDate} setEndDate={setEndDate} />
        {/* <TodayDatePicker IstodayDate={[startDate, setStartDate]} /> */}
        {rankName === "팀장" && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
              marginRight: "20px",
            }}
          >
            <input type="checkbox" id="check_btn" />
            <label
              for="check_btn"
              style={{ cursor: "pointer" }}
              onClick={MyRecords}
            >
              내 기록 보기
            </label>
          </div>
        )}
        <ListHeader>
          {rankName === "팀장" && type === 1 && <List>이름</List>}
          <List>날짜</List>
          <List>출근시간</List>
          <List>퇴근시간</List>
          <List>근로시간</List>
        </ListHeader>

        <ListBody>
          <DateList dateRecord={dateRecord} />
        </ListBody>

        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          paginate={paginate}
        />
      </ListPosition>
    </>
  );
}

export default CommuteHistory;

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { workRequest } from '../../Api/api.js';
import { getCookie } from '../../Cookie/cookie.js';
import Pagination from '../../Component/Pagination/Pagination.jsx';
import DatePicker from "../../Component/Date/DatePicker.jsx"
import NewModal from '../../Component/Modal/NewModal.jsx';

const ListPosition = styled.div`
  width: 80vw;
  position: absolute;
  left: 14%;
  top: 20%;
  overflow: hidden;
  overflow-y: auto;
  padding: 0px 50px;
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-evenly;
  border-bottom: 1px solid black;
  `

const ListBody = styled.div`
  display: flex;
  justify-content: space-evenly;
  height: 700px;
`

const List = styled.div`
    width: 300px;
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
`

const ContentSorting = styled.div`
    display: flex; 
`

const TextStyle = styled.span`
    width: 100px;
`

function RequestCheck() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [value, setValue] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [idx, setIdx] = useState(null);

    const toggleModal = (record) => {
        setIsModalOpen(!isModalOpen);
        setModalData(record)
        setIdx(record.idx)
        console.log(record.idx)
    };
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const LoginData = getCookie("logindata");

    const [type, setType] = useState(2); // 1 팀원 기록 2 자신의 출퇴근 기록 조회
    const [click, setClick] = useState(0); // 0 클릭 안함 1 클릭함


    useEffect(() => {
        if (LoginData.data.rankName === "팀장" && click !== 1) {
            setType(1)
        }
    })
    const MyRecords = () => {
        setType(type === 2 ? 1 : 2)
        setClick(click === 0 ? 1 : 0)
    }


    function WorkRequest() {
        if (startDate !== null && endDate !== null) {
            new workRequest()
                .get(userIdx, startDate, endDate, type)
                .then((workRequest) => {
                    if (workRequest.code === 200) {
                        if (type === 1) {
                            setDateRecord(workRequest.data.filter(record => LoginData.data.name === record.name ? "" : record))
                        } else {
                            setDateRecord(workRequest.data)
                        }
                    } else {
                        setDateRecord(null)
                    }
                })
        }
    }
    let userIdx = LoginData.data.idx
    const [dateRecord, setDateRecord] = useState();
    useEffect(() => {
        WorkRequest();
    }, [startDate, endDate, click]);

    function filter(e) {
        if (dateRecord !== undefined) {
            setValue(dateRecord.filter(record => e.target.value === "All" ? record : e.target.value === "null" ? record.confirm === null : e.target.value === "1" ? record.confirm === 1 : record.confirm === 0));

        }
    }
    const itemsPerPage = 5;
    const totalItems = value === undefined ? dateRecord && dateRecord.length : value && value.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = value === undefined ? dateRecord && dateRecord.slice(indexOfFirstItem, indexOfLastItem) : value && value.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        if (modalData !== null) {
            new workRequest()
                .put(idx, confirm)
                .then((confirmdata) => {
                    if (confirmdata.data.code === 200) {
                        if (confirm !== null) {
                            WorkRequest()
                            alert("처리 되셨습니다.")
                            setIsModalOpen(!isModalOpen);
                        }
                    }
                })

        }
    }, [confirm])


    // let a = dateRecord[0].split("T")[1].split(":").slice(0, 2).join("시") + "분"
    // console.log(a);
    // console.log(dateRecord[0].startDate.split("T")[1].split(":").slice(0, 2).join("시")+"분");
    // 팀장일 때 내 기록 보기를 클릭한 지 안 한지
    // 0 안함 1 함
    // const [mywork, setMyWork] = useState(0);
    // const togglemywork = () => {
    //     setMyWork(mywork === 0 ? 1 : 0);
    // }
    // let a = dateRecord[0].startDate.split("T")[1].split(":").slice(0, 2).join("시") + "분"
    // let b = dateRecord[0].endDate.split("T")[1].split(":").slice(0, 2).join("시") + "분"
    // console.log(a)


    const DateList = () => {
        return (
            <div>
                {currentItems && currentItems.map((record, index) => (
                    <div style={{ width: "80vw", display: "flex", justifyContent: "space-evenly", alignItems: "center", height: "50px", borderBottom: "1px solid " }} key={index} className="custom-list-item">
                        {LoginData.data.rankName === "팀장" || LoginData.data.rankName === "관리자" && type == 1 ? <List>{record.name}</List> : ""}
                        {/* 신청 날짜 들어오면 신청하기 */}
                        <List>{record.requestDate !== null && record.requestDate}</List>
                        <List>{record.startDate !== null ? record.startDate.split(' ')[0] : record.endDate.split(' ')[0]}</List>
                        <List>{record.type === 1 ? `출근 ${record.startDate.split(' ')[1].slice(0, 5)} ~ 퇴근 ${record.endDate.split(' ')[1].slice(0, 5)}` : record.startDate !== null ? "출근 " + record.startDate.split(' ')[1].slice(0, 5) : "퇴근 " + record.endDate.split(' ')[1].slice(0, 5)}</List>
                        {type === 2 && <List>{record.confirm === null ? "요청 중" : record.confirm === 1 ? "수락" : "거절"}</List>}
                        {type === 1 && <List>{record.confirm === null ? <div style={{ cursor: "pointer" }} onClick={() => toggleModal(record)}>승인/거절</div> : record.confirm === 1 ? <div style={{ color: "#29C91C" }}>승인</div> : <div style={{ color: "#FF0000" }}>거절</div>}</List>}
                    </div>
                ))
                }
            </div>
        );
    };

    function closeModal() {
        modalData(null)
        setIsModalOpen(false)
    }


    // 로그인 API에서 데이터 가져오기
    return (
        // 일단 기본 시간은 일주일인데 데이터가 있는 일주일만 표시
        // 1년까지 볼 수 있게 수정 
        // for문 돌려서 나오게 하기
        <>
            <ListPosition>
                <div style={{ display: "flex" }}>
                    {isModalOpen && (
                        <NewModal isOpen={isModalOpen} onClose={() => (closeModal)} modalData={modalData}>
                            <div style={{ width: "100%", height: "80%", textAlign: "center", display: "flex", display: "flex", flexDirection: "column", alignItems: "center" }} >
                                <ContentSorting>
                                    <TextStyle>수정할 날짜</TextStyle>
                                    <input style={{ width: "150px", marginBottom: "20px" }} type="text" defaultValue={modalData.startDate !== null ? modalData.startDate.split(' ')[0] : modalData.endDate.split(' ')[0]} />
                                </ContentSorting>
                                <ContentSorting>
                                    <TextStyle>타입</TextStyle>
                                    <input style={{ width: "150px", marginBottom: "20px" }} type="text" defaultValue={modalData.startDate !== null && modalData.endDate ? "출퇴근" : modalData.startDate !== null ? "출근" : "퇴근"} />
                                </ContentSorting>
                                <ContentSorting>
                                    <TextStyle>출근 시간</TextStyle>
                                    <input style={{ width: "150px", marginBottom: "20px" }} type="text" defaultValue={modalData.startDate === null ? "출근시간" : (modalData.startDate.split(' ')[1] || "출근시간")} />
                                </ContentSorting>
                                <ContentSorting>
                                    <TextStyle>퇴근 시간</TextStyle>
                                    <input style={{ width: "150px", marginBottom: "20px" }} type="text" defaultValue={modalData.endDate === null ? "퇴근시간" : (modalData.endDate.split(' ')[1] || "퇴근시간")} />
                                </ContentSorting>
                                <div>
                                    <button onClick={() => { setConfirm(true) }}>수락</button>
                                    <button onClick={() => { setConfirm(false) }}>거절</button>
                                </div>
                            </div>
                        </NewModal>
                    )}
                    <DatePicker setStartDate={setStartDate} setEndDate={setEndDate} />
                    <div>
                        <select onChange={filter} style={{ width: "140px", height: "35px", textAlign: "center" }}>
                            <option value="All">전체</option>
                            <option value="null">{type === 1 ? "승인/거절" : "요청 중"}</option>
                            <option value="1">{type === 1 ? "승인" : "수락"}</option>
                            <option value="0">거절</option>
                        </select>
                    </div>
                    {LoginData.data.rankName === "팀장" && <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "right", marginRight: "20px" }}>
                        <input type="checkbox" id="check_btn" />
                        <label htmlFor="check_btn" style={{ cursor: "pointer" }} onClick={MyRecords}>내 기록 보기</label>
                    </div>}
                </div>
                <ListHeader>
                    {LoginData.data.rankName === "팀장" || LoginData.data.rankName === "관리자" ? type === 1 && <List>이름</List> : ""}
                    <List>신청 일자</List>
                    <List>수정할 날짜</List>
                    <List>요청한 출/퇴근 시간</List>
                    <List>타입</List>
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
            </ListPosition >

        </>
    );
}

export default RequestCheck;
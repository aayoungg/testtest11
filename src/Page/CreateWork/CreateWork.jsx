import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { userUpdateTime, workTimeUnit } from '../../Api/api.js';
import { getCookie } from '../../Cookie/cookie.js';
import Pagination from '../../Component/Pagination/Pagination.jsx';
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

function RequestCheck() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [timeDataCopy, setTimeDataCopy] = useState();
    const [value, setValue] = useState();

    const LoginData = getCookie("logindata");
    let userIdx = LoginData.data.idx

    const toggleModal = (record) => {
        setIsModalOpen(!isModalOpen);
        setModalData(record)
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [dateRecord, setDateRecord] = useState();

    function UserUpdateTime() {
        new userUpdateTime()
            .get(userIdx)
            .then((workTimeRequest) => {
                setDateRecord(workTimeRequest.data)
            })
    }

    useEffect(() => {
        // 팀원들의 근무시간 조회
        UserUpdateTime();
        // 수정 버튼 클릭 시 select Box 조회를 위한 API
        new workTimeUnit()
            .get()
            .then((TimeDataCheck) => {
                console.log(TimeDataCheck)
                if (TimeDataCheck.code === 200) {
                    setTimeDataCopy(TimeDataCheck.data)
                }
            })
    }, []);

    const itemsPerPage = 5; // 페이지당 표시되는 
    const totalItems = dateRecord && dateRecord.length; // 전체 
    const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막 
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫번째 
    const currentItems = dateRecord && dateRecord.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지


    function IdxCheck(e) {
        const selectedIdx = e.target.value;
        setValue(timeDataCopy.find(TimeCheck => selectedIdx === TimeCheck.idx.toString()));
    }

    function WorkChange() {
        const UpdateIdx = modalData.idx
        const idx = value.idx
        new userUpdateTime()
            .put(userIdx, UpdateIdx, idx)
            .then((userUpdateDate) => {
                if (userUpdateDate.code === 200) {
                    UserUpdateTime();
                    alert("근무 시간이 수정 됐습니다.")
                    setIsModalOpen(!isModalOpen);
                }
            })
    }
    console.log(currentItems)
    const DateList = () => {
        return (
            <div>
                {currentItems && currentItems.map((record, index) => (
                    <div style={{ width: "80vw", display: "flex", justifyContent: "space-evenly", alignItems: "center", height: "50px", borderBottom: "1px solid " }} key={index} className="custom-list-item">
                        <List>{record.name}</List>
                        {/* 신청 날짜 들어오면 신청하기 */}
                        <List>{record.rank === 1 ? "관리자" : record.rank === 2 ? "팀장" : record.rank === 3 ? "선임매니저" : "매니저"}</List>
                        <List>{`${record.startTime.split(":").slice(0, 2).join("시") + "분"} ~ ${record.endTime.split(":").slice(0, 2).join("시") + "분"}`}</List>
                        <List onClick={() => toggleModal(record)}>{"수정하기"}</List>
                    </div>
                ))
                }
            </div >
        );
    };

    function closeModal() {
        modalData(null)
        setIsModalOpen(false)
    }

    return (

        <>


            <ListPosition>
                {isModalOpen && (
                    <NewModal isOpen={isModalOpen} onClose={() => { closeModal() }} modalData={modalData}>
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <input type="text" defaultValue={modalData.name} />
                            <div>
                                <select onChange={IdxCheck}>
                                    {timeDataCopy.filter(TimeCheck => TimeCheck.startTime === modalData.startTime)
                                        .map((TimeCheck, index) => (
                                            <option key={index} value={TimeCheck.idx}>
                                                {TimeCheck.startTime + "~" + TimeCheck.endTime}
                                            </option>
                                        ))}
                                    {/* 시작 시간이 modalData.startTime과 일치하지 않는 옵션 */}
                                    {timeDataCopy.filter(TimeCheck => TimeCheck.startTime !== modalData.startTime)
                                        .map((TimeCheck, index) => (
                                            <option key={index} value={TimeCheck.idx}>
                                                {TimeCheck.startTime + "~" + TimeCheck.endTime}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <button onClick={() => { WorkChange() }}>수정</button>
                        </div>
                    </NewModal>

                )}

                <ListHeader>
                    <List>이름</List>
                    <List>직급</List>
                    <List>근무 시간대</List>
                    <List>근무 시간 수정</List>
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

export default RequestCheck;
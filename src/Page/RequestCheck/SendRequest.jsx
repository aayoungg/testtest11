import styled from 'styled-components';
import TodayDatePicker from '../../Component/Date/TodayDatePicker';
import { useState, useEffect } from 'react';
import { workcheck, workRequest } from '../../Api/api';
import { getCookie } from '../../Cookie/cookie';

const RequestPosition = styled.div`
    width: 80vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 20%;
    top: 0;
`;

const RequestContent = styled.div`
    width: 550px;
    height: 540px;
    border: 1px solid black; 
    display: flex;
    justify-content: center;
`;

function formatDate(date) {
    if (date !== null) {
        const formattedDate = date.split('T')[1].split(":").slice(0, 2).join("시") + "분";
        return formattedDate;
    }
}

function formatNumberDate(date) {
    const formatNumberDate = date.replace(/-/g, ''); // Remove hyphens
    return formatNumberDate;
}

function SendRequest() {
    const [startDate, setStartDate] = useState('');
    const [responseData, setResponseData] = useState();
    const LoginDate = getCookie('logindata');
    const userIdx = LoginDate.data.idx;
    const [workIdx, setWorkIdx] = useState(null);
    // console.log(responseData !== undefined || responseData && responseData.length !== 0 ? responseData[0].idx : null)
    // const workIdx = responseData !== undefined || responseData && responseData.length !== 0 ? responseData[0].idx : null;
    const [inputs, setInputs] = useState({
        start: "",
        end: "",
        type: "2", // Default value for type (you can change it based on your requirements)
    });

    const { start, end, type } = inputs;

    const handleChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    };
    const endDate = startDate;
    useEffect(() => {
        if (startDate) {
            const fetchData = async () => {
                try {
                    const response = await new workcheck().get(userIdx, startDate, endDate, type);
                    setResponseData(response);
                    // Update workIdx here using the latest startDate
                    if (response !== undefined && response.code === 200) {
                        setWorkIdx(response.data[0].idx);
                    } else {
                        setWorkIdx(null);
                    }
                } catch (error) {
                    console.error('Error during workcheck:', error);
                }
            };

            fetchData();
        }
    }, [startDate]);


    const startTime = start == "" ? null : formatNumberDate(startDate) + start
    const endTime = end == "" ? null : formatNumberDate(endDate) + end
    const workChange = async () => {
        if (type === "2" && start !== "" && end !== "") {
            alert("수정인데 출근과 퇴근이 적혀있습니다.")
            return
        } else if (type === "1") {
            if (start === "" && end !== "" || start !== "" && end === "") {

            } else {
                alert("출퇴근 기록 생성 입니다 수정으로 바꿔주세요")
                return
            }
        }
        new workRequest()
            .post(userIdx, startTime, endTime, type, workIdx)
            .then((workrequest) => {
                if (workrequest.code === 200) {
                    alert("요청 보냈습니다.")
                }
            })
            .catch((error) => {
                console.error('Error during workRequest:', error);
            });
    };


    return (
        <>
            <RequestPosition>
                <RequestContent>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <TodayDatePicker IstodayDate={[startDate, setStartDate]} />
                        <input
                            type="text"
                            name='start'
                            onChange={handleChange}
                            // 오류 왜 나는 지 확인
                            placeholder={
                                responseData === undefined || responseData.code === 404
                                    ? "출근시간"
                                    : responseData.data[0] !== null && formatDate(responseData.data[0].startDate)
                            }
                            value={start}
                        />
                        <input
                            type="text"
                            name='end'
                            onChange={handleChange}
                            placeholder={
                                responseData === undefined || responseData.code === 404
                                    ? "출근시간"
                                    : responseData.data[0] !== null && formatDate(responseData.data[0].endDate)
                            }
                            value={end}
                        />
                        <select name="type" onChange={handleChange} value={type}>
                            <option value="2">출퇴근 기록 수정</option>
                            <option value="1">출퇴근 기록 생성</option>
                        </select>
                        <div onClick={workChange}>요청 보내기</div>
                    </div>
                </RequestContent>
            </RequestPosition>
        </>
    );
}

export default SendRequest;
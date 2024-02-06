import '../Home/Home.css'
import Calender from '../../Component/Date/Calender/Calender';
import styled from 'styled-components';
import { getCookie } from '../../Cookie/cookie';
import { workcheck } from '../../Api/api';
import { useEffect, useState } from 'react';

const CalenderPosition = styled.div`
  width: 100vw;
  position: absolute;
  left: 20%;
  top: 10%;
`
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Home() {
  const [workcheckData, setWorkcheckData] = useState([]);


  const LoginDate = getCookie('logindata');
  let userIdx = LoginDate.data.idx;
  let date = new Date();
  let nowstartDate = new Date(date.getFullYear(), date.getMonth(), 1);
  let nowendDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startDate = formatDate(nowstartDate);
  const endDate = formatDate(nowendDate);

  const fetchWorkcheckData = async () => {
    try {
      const WorkDataChack = await new workcheck().get(userIdx, startDate, endDate);
      setWorkcheckData(WorkDataChack);
    } catch (error) {
      console.error('Error fetching workcheck data:', error);
    }
  };
  useEffect(() => {
    // 페이지 로드 시에 workcheck 데이터를 가져옴
    fetchWorkcheckData();
  }, []);  // 빈 배열은 한 번만 실행되도록 함
  return (
    <>

      <CalenderPosition>
        <Calender workcheckData={workcheckData} />
      </CalenderPosition>
    </>
  );
}

export default Home;

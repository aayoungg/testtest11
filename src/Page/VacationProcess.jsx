// import React, { useState, useEffect } from 'react'
// import { getCookie } from '../Cookie/cookie';

// function VacationProcess() {
//     const[idx, setIdx] = useState('');
//     const [approveIdx, setApproveIdx] = useState('');
//     const [action, setAction] = useState('');
//     const [reason, setReason] = useState('');

//   useEffect(() => {
//     const loginData = getCookie("logindata");
//     if (loginData) {
//         setIdx(loginData.data.idx)
//     }
//   }, []);

//   const saveVacation = async () => {
//     new vacationPro().put(idx, approveIdx, action, reason).then(() => {
//     //   console.log("test", vacationdata);
//     });
//     setIdx('');
//     setApproveIdx('');
//     setAction('');
//     setReason('');
//   };
//   return (
//     <div>

//     </div>
//   )
// }

// export default VacationProcess

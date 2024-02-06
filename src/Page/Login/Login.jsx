import Logo from "../../Component/Image/Image.jsx"
import Input from '../../Component/Input/Input.jsx'
import Button from '../../Component/Button/Button.jsx'
import { useState } from 'react';
import styled from 'styled-components';
import { mainLogin } from '../../Api/api.js';
import { setCookie } from '../../Cookie/cookie.js';
import { useNavigate } from "react-router-dom";
import LogoImage from "../../Image/logo.png"
const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  `;

const LoginSize = styled.div`
  width: 530px;
`

function Login() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    id: "",
    password: "",
  });


  const { id, password } = inputs;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const sendData = async () => {
    new mainLogin()
      .post(id, password)
      .then((logindata) => {
        if (logindata.code === 200 && logindata.data.id !== null) {
          setCookie('logindata', logindata, {
            //쿠키의 값을 저장하는 서버 경로, '/'일 경우 모든 페이지에서 쿠키에 접근할 수 있도록 설정
            path: '/',
            // true인 경우에는 https로 통신할때만 쿠키가 저장된다.
            // secure: true,
          })
          if (logindata.data.rankName === "관리자") {
            navigate("/CommuteHistory");
          } else {
            navigate("/Home")
          }
        }
      })

  }
  return (
    <LoginContainer>
      <LoginSize>
        <Logo src={LogoImage} width="100%" marginbottom="35px" />
        <Input value={id} name="id"
          onChange={handleChange} placeholder={"아이디"} />
        <Input value={password} name="password" type="password"
          onChange={handleChange} placeholder={"비밀번호"} />
        <Button name="button" type="button" onClick={sendData}>로그인</Button>
      </LoginSize>
    </LoginContainer>
  );
}

export default Login;

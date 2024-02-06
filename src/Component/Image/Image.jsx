import React from "react";
import Logo from "../../Image/logo.png";

const LoginLogoUrl = (props) => {
  return (
    <>
      <img src={props.src} alt="" style={props.style} />
    </>
  );
};

export default LoginLogoUrl;

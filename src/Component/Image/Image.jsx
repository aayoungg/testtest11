import React from "react";
import Logo from "../../Image/logo.png"


const LoginLogoUrl = (props) => {
    return (
        <>
            <img src={props.src} alt="" style={{ width: props.width, marginBottom: props.marginbottom, marginLeft: props.marginright, padding: props.Padding }} />
        </>
    )
}

export default LoginLogoUrl;

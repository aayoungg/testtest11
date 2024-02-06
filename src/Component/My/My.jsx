import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import user from "../../Image/user.png";
import phone from "../../Image/phone.png";
import mail from "../../Image/mail.png";
import part from "../../Image/part.png";
// import Image from '../Iamge/Image';
import { getCookie } from '../../Cookie/cookie';


const InfoPosition = styled.div`
    display: flex;
    align-Items: center;
    margin-bottom: 20px;
`
const Img = styled.img`
    width : 40px;
    Padding : 0px 16px 0px 0px;
`;

const My = ({ updateAccountData }) => {
    const LoginDate = getCookie('logindata');
    // console.log(LoginDate);
    const value = updateAccountData;
    return (
        <>
            <InfoPosition>
                <Img src={user} />
                <div>{value === undefined || value === null ? LoginDate.data.name : value.data.data.name}</div>
            </InfoPosition>
            <InfoPosition>
                <Img src={phone} />
                <div>{value === undefined || value === null ? LoginDate.data.phone : value.data.data.phone}</div>
            </InfoPosition>
            <InfoPosition>
                <Img src={mail} />
                <div>{value === undefined || value === null ? LoginDate.data.email : value.data.data.email}</div>
            </InfoPosition>
            <InfoPosition>
                <Img src={part} />
                <div>{LoginDate.data.partName}</div>
            </InfoPosition>
            <InfoPosition>
                <Img src={user} />
                <div>{LoginDate.data.rankName}</div>
            </InfoPosition>
        </>


    )
};

export default My;
// NewModal.jsx
import React, { useEffect, useState } from "react";
import "../Modal/modal.css";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: absolute;
//   top: -5vh;
  left: 25vw;
  z-index: 2;
  background-color: #ffffff;
  width: 30vw;
  height: 40vh;
  border: 1px solid black;
`;

function NewModal({ isOpen, onClose, children, modalData }) {

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <ModalBackground>
                        <div className="modal_close" onClick={onClose}>
                            X
                        </div>
                        {children}
                    </ModalBackground>
                </div>
            )}
        </>
    );
}

export default NewModal;
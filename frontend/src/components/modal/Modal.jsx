import React from "react";
import styles from "./styles.module.css";

function Modal({ datas, openModal, height, width, blur=false }) {
  
  return (
    <>
      {openModal && (
        <div className={styles.modalContainer} style={{height,width, backdropFilter: blur? "blur(2px)" : ""}}>
          <div className={styles.modalDatas}>{datas}</div>
        </div>
      )}
    </>
  );
}

export default Modal;

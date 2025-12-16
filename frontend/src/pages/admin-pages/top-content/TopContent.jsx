import React, { useState } from "react";
import styles from "./topcontent.module.css";
import { IoMdNotifications } from "react-icons/io";
import BtnTheme from "../../../components/BtnTheme";
// import Modal from "../../../components/modal/Modal";
// import Notification from "../notification/Notification";
// import ThemeToggle from "../../../components/theme/ThemeToggle";

function TopContent() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <div className={styles.topContentContainer}>
        <span style={{scale: .5}}><BtnTheme /></span>
        {/* <span onClick={() => setOpen(true)}>
          <IoMdNotifications />
          <p>Notification</p>
        </span> */}
      </div>
      {/* <Modal
        openModal={open}
        height={"100vh"}
        width={"100vw"}
        datas={<Notification setOpen={setOpen}/>}
      /> */}
    </>
  );
}

export default TopContent;

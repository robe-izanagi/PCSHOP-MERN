import React, { useState } from "react";
import styles from "./sidebar.module.css";
// import { logout } from "../../services/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
// import Settings from "../settings/Settings";
import Modal from '../../../components/modal/Modal'
import LogoutConfirmation from "../logout/LogoutConfirmation";

function SideBar({ navList }) {
  const navigation = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [openSettings, setOpenSettings] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  const gotoHomepage = () => {
    navigation("/");
    // logout();
  };

  return (
    <>
      <div className={styles.sidebarContainer}>
        <div className={styles.title}>
          <h2>ROG - Admin hub</h2>
        </div>
        <div className={styles.nav}>
          <ul className={styles.mainNav}>
            {navList.map((navi) => (
              <li
                key={navi.namePage}
                className={activePage === navi.namePage ? styles.active : ""}
              >
                <NavLink
                  className={styles.navLink}
                  to={navi.linkPage}
                  onClick={() => setActivePage(navi.namePage)}
                  title={navi.namePage}
                >
                  {navi.icon} <span>{navi.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={styles.subNav}>
            {/* <button type="button" onClick={() => setOpenSettings(true)}>
              <IoSettingsSharp /> <span>Settings</span>
            </button> */}
            <button type="button" onClick={() => setOpenLogout(true)}>
              <TbLogout2 /> <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================Render Modal======================================== */}

      {/* {openSettings && (
        <Modal
          datas={<Settings setOpenSettings={setOpenSettings} />}
          openModal={openSettings}
          height={"100vh"}
          width={"100vw"}
        />
      )} */}
      {openLogout && (
        <Modal
          datas={<LogoutConfirmation setOpenLogout={setOpenLogout} />}
          openModal={openLogout}
          height={"100vh"}
          width={"100vw"}
          blur={true}
        />
      )}
    </>
  );
}

export default SideBar;

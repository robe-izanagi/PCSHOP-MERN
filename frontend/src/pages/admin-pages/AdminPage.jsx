import React from 'react'
import styles from './admin.module.css'
import { Outlet } from 'react-router-dom';
import { MdDashboard, MdInventory } from "react-icons/md";
import { FaStore ,FaUserAlt ,FaChartBar } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import TopContent from './top-content/TopContent'
import SideBar from './sidebar/SideBar';

function AdminPage() {
  const navList = [
      {
        namePage: "dashboard",
        linkPage: "/adminpage/dashboard",
        title: <span>Dashboard</span>,
        icon: <MdDashboard />,
      },
      {
        namePage: "management",
        linkPage: "/adminpage/management",
        title: <span>Management</span>,
        icon: <MdInventory />,
      },
      {
        namePage: "analytics",
        linkPage: "/adminpage/analytics",
        title: <span>Analytics</span>,
        icon: <FaChartBar />,
      },
    ];


  return (
    <div className={styles.mainContainer}>
      <SideBar navList={navList}/>
      <div className={styles.mainContent}>
        <TopContent />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPage
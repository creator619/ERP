import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children, activeModule, setActiveModule, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getModuleLabel = (id) => {
    const labels = {
      dashboard: 'Műszerfal',
      projects: 'Projektmenedzsment és Dokumentáció',
      manufacturing: 'Gyártáskezelés',
      quality: 'Minőségellenőrzés és Tanúsítás',
      maintenance: 'Gép- és Eszközkarbantartás',
      purchase: 'Beszerzés és Ellátási lánc',
      crm: 'CRM - Ügyfélkapcsolatok',
      inventory: 'Készletkezelés',
      sales: 'Értékesítés',
      invoicing: 'Számlázás',
      hr: 'HR - Emberi Erőforrások',
      messenger: 'Belső Kommunikáció',
      settings: 'Beállítások'
    };
    return labels[id] || 'Antigravity ERP';
  };

  return (
    <div className="layout-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onLogout={onLogout}
      />
      <main className={`main-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar activeModuleLabel={getModuleLabel(activeModule)} />
        <div className="content-inner">
          {children}
        </div>
      </main>

      <style jsx global>{`
        .content-inner {
          padding: 30px;
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children, activeModule, setActiveModule, onLogout, currency, setCurrency, language, setLanguage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar on mobile when switching modules
  const handleModuleChange = (id) => {
    setActiveModule(id);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const getModuleLabel = (id) => {
    const labels = {
      dashboard: 'Műszerfal',
      bi: 'Executive Business Intelligence',
      compliance: 'Megfelelőség, Audit és Biztonság',
      intelligence: 'AI Vezérlőterem és Stratégiai Központ',
      documents: 'Riport- és Dokumentumközpont',
      projects: 'Projektmenedzsment és Dokumentáció',
      manufacturing: 'Gyártáskezelés',
      quality: 'Minőségellenőrzés és Tanúsítás',
      maintenance: 'Gép- és Eszközkarbantartás',
      purchase: 'Beszerzés és Ellátási lánc',
      crm: 'CRM - Ügyfélkapcsolatok',
      inventory: 'Készletkezelés',
      logistics: 'Globális Logisztika és SCM',
      sales: 'Értékesítés',
      invoicing: 'Számlázás',
      hr: 'HR - Emberi Erőforrások',
      dms: 'DMS - Dokumentumkezelés',
      messenger: 'Belső Kommunikáció',
      settings: 'Beállítások'
    };
    return labels[id] || 'Antigravity ERP';
  };

  return (
    <div className="layout-container">
      {/* Mobile Overlay */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeModule={activeModule}
        setActiveModule={handleModuleChange}
        onLogout={onLogout}
      />
      <main className={`main-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar 
          activeModuleLabel={getModuleLabel(activeModule)} 
          currency={currency}
          setCurrency={setCurrency}
          language={language}
          setLanguage={setLanguage}
          toggleSidebar={toggleSidebar}
        />
        <div className="content-inner">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

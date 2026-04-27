import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIAssistant from '../AI/AIAssistant';
import { useLanguage } from '../../contexts/LanguageContext';
import './Layout.css';

const Layout = ({ children, activeModule, setActiveModule, onLogout, currency, setCurrency }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const { t } = useLanguage();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar on mobile when switching modules
  const handleModuleChange = (id) => {
    setActiveModule(id);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const getModuleLabel = (id) => {
    const key = `menu.${id}`;
    const translated = t(key);
    return translated === key ? 'RailParts ERP' : translated;
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
          setActiveModule={setActiveModule}
          currency={currency}
          setCurrency={setCurrency}
          toggleSidebar={toggleSidebar}
        />
        <div className="content-inner">
          {children}
        </div>
      </main>
      
      {/* Global AI Assistant Bot */}
      <AIAssistant />
    </div>
  );
};

export default Layout;

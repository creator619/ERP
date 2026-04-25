import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText, 
  Settings,
  Menu,
  X,
  Folder,
  MessageSquare,
  Wrench,
  BarChart3,
  Truck,
  Brain,
  FileCheck,
  ShieldCheck,
  Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Layout.css';

const Sidebar = ({ isOpen, toggleSidebar, activeModule, setActiveModule, onLogout }) => {
  const { t } = useLanguage();
  const menuItems = [
    { id: 'dashboard', label: t('menu.dashboard'), icon: <LayoutDashboard size={20} /> },
    { id: 'bi', label: t('menu.bi'), icon: <BarChart3 size={20} /> },
    { id: 'compliance', label: t('menu.compliance'), icon: <ShieldCheck size={20} /> },
    { id: 'intelligence', label: t('menu.intelligence'), icon: <Brain size={20} /> },
    { id: 'documents', label: t('menu.documents'), icon: <FileCheck size={20} /> },
    { id: 'traceability', label: t('menu.traceability'), icon: <LinkIcon size={20} /> },
    { id: 'projects', label: t('menu.projects'), icon: <Folder size={20} /> },
    { id: 'manufacturing', label: t('menu.manufacturing'), icon: <Settings size={20} /> },
    { id: 'quality', label: t('menu.quality'), icon: <ShieldCheck size={20} /> },
    { id: 'maintenance', label: t('menu.maintenance'), icon: <Wrench size={20} /> },
    { id: 'purchase', label: t('menu.purchase'), icon: <ShoppingCart size={20} /> },
    { id: 'crm', label: t('menu.crm'), icon: <Users size={20} /> },
    { id: 'inventory', label: t('menu.inventory'), icon: <Package size={20} /> },
    { id: 'logistics', label: t('menu.logistics'), icon: <Truck size={20} /> },
    { id: 'sales', label: t('menu.sales'), icon: <ShoppingCart size={20} /> },
    { id: 'invoicing', label: t('menu.invoicing'), icon: <FileText size={20} /> },
    { id: 'hr', label: t('menu.hr'), icon: <Users size={20} /> },
    { id: 'dms', label: t('menu.dms'), icon: <Folder size={20} /> },
    { id: 'messenger', label: t('menu.messenger'), icon: <MessageSquare size={20} /> },
    { id: 'settings', label: t('menu.settings'), icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-box" style={{ background: '#2C3E50' }}>RP</div>
          <span className="logo-text">RailParts ERP</span>
        </div>
        <button className="mobile-toggle" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
            onClick={() => setActiveModule(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">SE</div>
          {isOpen && <div className="user-details">
            <p className="user-name">Simon Ernő</p>
            <p className="user-role">{t('nav.userRole')}</p>
          </div>}
        </div>
        <button 
          onClick={onLogout} 
          className="nav-item" 
          style={{ marginTop: '10px', padding: '8px 15px', background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }}
        >
          <span className="nav-icon"><X size={18} /></span>
          <span className="nav-label">{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

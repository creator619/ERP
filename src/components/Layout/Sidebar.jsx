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
  ShieldCheck,
  Wrench
} from 'lucide-react';
import './Layout.css';

const Sidebar = ({ isOpen, toggleSidebar, activeModule, setActiveModule, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Műszerfal', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: 'Projektek', icon: <Folder size={20} /> },
    { id: 'manufacturing', label: 'Gyártás', icon: <Settings size={20} /> },
    { id: 'quality', label: 'Minőségügy', icon: <ShieldCheck size={20} /> },
    { id: 'maintenance', label: 'Karbantartás', icon: <Wrench size={20} /> },
    { id: 'purchase', label: 'Beszerzés', icon: <ShoppingCart size={20} /> },
    { id: 'crm', label: 'CRM', icon: <Users size={20} /> },
    { id: 'inventory', label: 'Készlet', icon: <Package size={20} /> },
    { id: 'sales', label: 'Értékesítés', icon: <ShoppingCart size={20} /> },
    { id: 'invoicing', label: 'Számlázás', icon: <FileText size={20} /> },
    { id: 'hr', label: 'HR', icon: <Users size={20} /> },
    { id: 'messenger', label: 'Üzenetek', icon: <MessageSquare size={20} /> },
    { id: 'settings', label: 'Beállítások', icon: <Settings size={20} /> },
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
          <div className="avatar">JD</div>
          {isOpen && <div className="user-details">
            <p className="user-name">John Doe</p>
            <p className="user-role">Administrator</p>
          </div>}
        </div>
        <button 
          onClick={onLogout} 
          className="nav-item" 
          style={{ marginTop: '10px', padding: '8px 15px', background: 'rgba(220, 53, 69, 0.1)', color: '#ff6b6b' }}
        >
          <span className="nav-icon"><X size={18} /></span>
          <span className="nav-label">Kijelentkezés</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

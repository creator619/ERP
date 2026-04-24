import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Settings as SettingsIcon, 
  Globe, 
  ShieldCheck, 
  Save,
  Moon,
  Sun,
  Palette,
  Key,
  Database,
  Lock,
  Eye,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import auditLogService from '../../services/AuditLogService';
import './Settings.css';

const Settings = ({ addToast, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [logs, setLogs] = useState(auditLogService.getLogs());

  const [rbac, setRbac] = useState([
    { role: 'Üzemi Operátor', inventory: 'Read', manufacturing: 'Write', finance: 'None', admin: 'None' },
    { role: 'Pénzügyi Vezető', inventory: 'Read', manufacturing: 'None', finance: 'Write', admin: 'None' },
    { role: 'Rendszergazda', inventory: 'Write', manufacturing: 'Write', finance: 'Write', admin: 'Full' },
  ]);

  React.useEffect(() => {
    const unsubscribe = auditLogService.subscribe(newLogs => {
      setLogs([...newLogs]);
    });
    return unsubscribe;
  }, []);

  const toggleRbac = (roleIndex, field) => {
    const nextValue = { 'None': 'Read', 'Read': 'Write', 'Write': 'Full', 'Full': 'None' };
    setRbac(prev => prev.map((r, i) => i === roleIndex ? { ...r, [field]: nextValue[r[field]] || 'Read' } : r));
    addToast('Jogosultság módosítva', 'info');
  };

  const tabs = [
    { id: 'general', label: 'Rendszer', icon: <SettingsIcon size={18} /> },
    { id: 'rbac', label: 'Jogosultságok', icon: <Lock size={18} /> },
    { id: 'security', label: 'Audit Napló', icon: <Activity size={18} /> },
    { id: 'integration', label: 'Integrációk', icon: <Cpu size={18} /> },
  ];

  const handleSave = () => {
    addToast('Konfiguráció frissítve', 'success', 'A rendszerbeállítások életbe léptek.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Palette size={20} /> Megjelenés és Lokalizáció</h3>
            <div className="settings-toggle">
              <div>
                <h5>Sötét üzemmód (OLED-ready)</h5>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Csökkenti a szem fáradását és az energiafogyasztást.</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-row" style={{ marginTop: '20px' }}>
              <div className="settings-group">
                <label>Alapértelmezett Nyelv</label>
                <select className="glass-input">
                  <option>Magyar (HU)</option>
                  <option>English (EN-GB)</option>
                  <option>Deutsch (DE)</option>
                </select>
              </div>
              <div className="settings-group">
                <label>Pénznem</label>
                <select className="glass-input">
                  <option>HUF (Ft)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'rbac':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Lock size={20} /> Szerepkör Mátrix (RBAC)</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Szerepkör</th>
                  <th>Készlet</th>
                  <th>Gyártás</th>
                  <th>Pénzügy</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {rbac.map((role, idx) => (
                  <tr key={idx}>
                    <td><strong>{role.role}</strong></td>
                    {['inventory', 'manufacturing', 'finance', 'admin'].map(field => (
                      <td key={field}>
                        <button 
                          className={`status-badge ${role[field] === 'None' ? 'inactive' : role[field] === 'Read' ? 'info' : role[field] === 'Write' ? 'warning' : 'active'}`}
                          style={{ border: 'none', cursor: 'pointer', width: '80px', textAlign: 'center' }}
                          onClick={() => toggleRbac(idx, field)}
                        >
                          {role[field]}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'security':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Activity size={20} /> Biztonsági Eseménynapló</h3>
            <div className="audit-log-mini" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.8rem', maxHeight: '400px', overflowY: 'auto' }}>
              {logs.map(log => (
                <p key={log.id} style={{ color: log.severity === 'success' ? '#2ecc71' : log.severity === 'danger' ? '#e74c3c' : log.severity === 'warning' ? '#f1c40f' : 'inherit', marginBottom: '5px' }}>
                  [{new Date(log.timestamp).toLocaleTimeString()}] {log.module}: {log.action} - {log.details}
                </p>
              ))}
            </div>
          </div>
        );
      case 'integration':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Cpu size={20} /> Külső Rendszer Kapcsolatok</h3>
            <div className="integration-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="glass" style={{ padding: '20px', borderRadius: '15px', borderLeft: '4px solid #2ecc71' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                   <span style={{ fontWeight: 700 }}>SAP ERP Connector</span>
                   <span className="status-badge active">Online</span>
                 </div>
                 <p className="text-muted" style={{ fontSize: '0.75rem' }}>Master data szinkronizáció aktív.</p>
              </div>
              <div className="glass" style={{ padding: '20px', borderRadius: '15px', borderLeft: '4px solid #f1c40f' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                   <span style={{ fontWeight: 700 }}>MES Middleware</span>
                   <span className="status-badge warning">Syncing</span>
                 </div>
                 <p className="text-muted" style={{ fontSize: '0.75rem' }}>Gyártási adatok valós idejű átvétele.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Válassz egy menüpontot.</div>;
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '12px' }}>
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Rendszer Adminisztráció</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Globális konfiguráció és biztonsági házirend</p>
          </div>
        </div>
        <button className="create-btn" onClick={handleSave}>
          <Save size={20} /> Mentés
        </button>
      </div>

      <div className="settings-container">
        <div className="settings-nav glass">
          {tabs.map(tab => (
            <div 
              key={tab.id} 
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </div>
          ))}
        </div>

        <div className="settings-content glass">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

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
  Palette
} from 'lucide-react';
import './Settings.css';

const Settings = ({ addToast, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Általános', icon: <SettingsIcon size={18} /> },
    { id: 'company', label: 'Vállalati profil', icon: <Building size={18} /> },
    { id: 'users', label: 'Felhasználók', icon: <Users size={18} /> },
    { id: 'localization', label: 'Nyelv és Pénznem', icon: <Globe size={18} /> },
    { id: 'security', label: 'Biztonság', icon: <ShieldCheck size={18} /> },
  ];

  const handleSave = () => {
    addToast('Beállítások mentve', 'success', 'A módosítások sikeresen rögzítésre kerültek.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Palette size={20} /> Rendszer Megjelenés</h3>
            <div className="settings-toggle">
              <div>
                <h5 style={{ marginBottom: '4px' }}>Sötét üzemmód</h5>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Váltás világos és sötét téma között.</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-toggle">
              <div>
                <h5 style={{ marginBottom: '4px' }}>Kompakt nézet</h5>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Több adat megjelenítése kisebb helyen.</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="settings-toggle">
              <div>
                <h5 style={{ marginBottom: '4px' }}>Automatikus frissítés</h5>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Adatok valós idejű szinkronizálása.</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        );
      case 'company':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Building size={20} /> Vállalati Profil</h3>
            <div className="settings-row">
              <div className="settings-group">
                <label>Cégnév</label>
                <input type="text" defaultValue="RailParts Manufacturing Ltd." />
              </div>
              <div className="settings-group">
                <label>Adószám</label>
                <input type="text" defaultValue="12345678-2-42" />
              </div>
              <div className="settings-group">
                <label>Székhely</label>
                <input type="text" defaultValue="1117 Budapest, Vasút utca 12." />
              </div>
              <div className="settings-group">
                <label>Vállalati weboldal</label>
                <input type="url" defaultValue="https://railparts-manufacturing.hu" />
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Users size={20} /> Felhasználók és Jogosultságok</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Név</th>
                  <th>Szerepkör</th>
                  <th>Utolsó belépés</th>
                  <th>Állapot</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Kovács János (Admin)</strong></td>
                  <td>Rendszergazda</td>
                  <td>Ma, 10:24</td>
                  <td><span className="status-badge aktív">Aktív</span></td>
                </tr>
                <tr>
                  <td><strong>Szabó Anna</strong></td>
                  <td>Értékesítő</td>
                  <td>Tegnap, 16:45</td>
                  <td><span className="status-badge aktív">Aktív</span></td>
                </tr>
                <tr>
                  <td><strong>Nagy Péter</strong></td>
                  <td>Raktárvezető</td>
                  <td>2 napja</td>
                  <td><span className="status-badge aktív">Aktív</span></td>
                </tr>
              </tbody>
            </table>
            <button className="create-btn" style={{ marginTop: '20px' }}>
              <Plus size={18} inline /> Új felhasználó
            </button>
          </div>
        );
      case 'localization':
        return (
          <div className="settings-section">
            <h3 className="settings-section-title"><Globe size={20} /> Nyelv és Pénznem</h3>
            <div className="settings-row">
              <div className="settings-group">
                <label>Alapértelmezett nyelv</label>
                <select>
                  <option>Magyar</option>
                  <option>English</option>
                  <option>Deutsch</option>
                </select>
              </div>
              <div className="settings-group">
                <label>Pénznem</label>
                <select>
                  <option>HUF (Ft)</option>
                  <option>EUR (€)</option>
                  <option>USD ($)</option>
                </select>
              </div>
              <div className="settings-group">
                <label>Időzóna</label>
                <select>
                  <option>(GMT+01:00) Central European Time</option>
                  <option>(GMT+00:00) Western European Time</option>
                </select>
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Rendszerbeállítások</h2>
        <button className="create-btn" onClick={handleSave}>
          <Save size={20} />
          Változtatások mentése
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

const Plus = ({ size, inline }) => <span style={{ display: inline ? 'inline-flex' : 'block', verticalAlign: 'middle' }}><SettingsIcon size={size} /></span>;

export default Settings;

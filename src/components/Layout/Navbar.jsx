import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Grid, 
  User, 
  Settings, 
  LogOut, 
  Globe,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Menu
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Layout.css';

const Navbar = ({ activeModuleLabel, currency, setCurrency, toggleSidebar }) => {
  const { language, setLanguage, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Új megrendelés', desc: 'A MÁV-START 50db ablakot rendelt.', time: '5 perce', type: 'info', icon: <MessageSquare size={14} /> },
    { id: 2, title: 'Gyártás kész', desc: 'A PRJ-001 projekt dokumentációja hiányos.', time: '1 órája', type: 'warning', icon: <AlertCircle size={14} /> },
    { id: 3, title: 'Sikeres mentés', desc: 'A készletszintek frissültek.', time: '3 órája', type: 'success', icon: <CheckCircle2 size={14} /> },
  ];

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="page-title">{activeModuleLabel}</h1>
      </div>

      <div className="navbar-right">
        <div className="search-bar glass">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder={t('nav.search')} />
        </div>
        
        <div className="nav-action-wrapper">
          <button className="nav-action-btn" onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}>
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu glass notifications-dropdown">
              <div className="dropdown-header">
                <h4>{t('nav.notifications')}</h4>
                <span>{t('nav.markAllRead')}</span>
              </div>
              <div className="dropdown-body">
                {notifications.map(n => (
                  <div key={n.id} className="notification-item">
                    <div className={`notification-icon ${n.type}`}>{n.icon}</div>
                    <div className="notification-info">
                      <p><strong>{n.title}</strong></p>
                      <p className="text-muted">{n.desc}</p>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">{t('nav.viewAll')}</div>
            </div>
          )}
        </div>
        
        <div className="nav-action-wrapper">
          <button className="nav-action-btn" onClick={() => { setShowLangMenu(!showLangMenu); setShowCurrencyMenu(false); setShowNotifications(false); setShowUserMenu(false); }}>
            <Globe size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: '4px' }}>{language}</span>
          </button>
          
          {showLangMenu && (
            <div className="dropdown-menu glass mini-dropdown">
              <div className="dropdown-item" onClick={() => { setLanguage('HU'); setShowLangMenu(false); }}>🇭🇺 Magyar (HU)</div>
              <div className="dropdown-item" onClick={() => { setLanguage('EN'); setShowLangMenu(false); }}>🇬🇧 English (EN)</div>
              <div className="dropdown-item" onClick={() => { setLanguage('DE'); setShowLangMenu(false); }}>🇩🇪 Deutsch (DE)</div>
            </div>
          )}
        </div>

        <div className="nav-action-wrapper">
          <button className="nav-action-btn" onClick={() => { setShowCurrencyMenu(!showCurrencyMenu); setShowLangMenu(false); setShowNotifications(false); setShowUserMenu(false); }}>
             <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{currency}</span>
          </button>
          
          {showCurrencyMenu && (
            <div className="dropdown-menu glass mini-dropdown">
              <div className="dropdown-item" onClick={() => { setCurrency('HUF'); setShowCurrencyMenu(false); }}>Ft - HUF</div>
              <div className="dropdown-item" onClick={() => { setCurrency('EUR'); setShowCurrencyMenu(false); }}>€ - EUR</div>
              <div className="dropdown-item" onClick={() => { setCurrency('USD'); setShowCurrencyMenu(false); }}>$ - USD</div>
            </div>
          )}
        </div>
        
        <div className="nav-action-wrapper">
          <button className="nav-action-btn profile-trigger" onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}>
            <div className="nav-avatar">SE</div>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu glass user-dropdown">
              <div className="user-dropdown-header">
                <div className="nav-avatar large">SE</div>
                <div>
                  <p><strong>Simon Ernő</strong></p>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>simon.erno@railparts.hu</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item"><User size={16} /> {t('nav.profile')}</div>
              <div className="dropdown-item"><Settings size={16} /> {t('nav.settings')}</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-error"><LogOut size={16} /> {t('nav.logout')}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

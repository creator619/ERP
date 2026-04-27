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
import { useData } from '../../contexts/DataContext';
import './Layout.css';

const Navbar = ({ activeModuleLabel, setActiveModule, onLogout, currency, setCurrency, toggleSidebar }) => {
  const { language, setLanguage, t } = useLanguage();
  const { notifications, markNotificationAsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchableItems = [
    { id: 'dashboard', label: t('menu.dashboard'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'bi', label: t('menu.bi'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'compliance', label: t('menu.compliance'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'intelligence', label: t('menu.intelligence'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'documents', label: t('menu.documents'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'traceability', label: t('menu.traceability'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'projects', label: t('menu.projects'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'manufacturing', label: t('menu.manufacturing'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'quality', label: t('menu.quality'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'maintenance', label: t('menu.maintenance'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'purchase', label: t('menu.purchase'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'crm', label: t('menu.crm'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'inventory', label: t('menu.inventory'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'logistics', label: t('menu.logistics'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'sales', label: t('menu.sales'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'invoicing', label: t('menu.invoicing'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'hr', label: t('menu.hr'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'dms', label: t('menu.dms'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'messenger', label: t('menu.messenger'), category: 'Modul', icon: <Grid size={16} /> },
    { id: 'settings', label: t('menu.settings'), category: 'Modul', icon: <Grid size={16} /> },
  ];

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : searchableItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchSelect = (id) => {
    setActiveModule(id);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleNotificationClick = (n) => {
    markNotificationAsRead(n.id);
    
    // Simple routing logic based on entityId prefix
    if (n.entityId.startsWith('NCR-')) setActiveModule('compliance');
    else if (n.entityId.startsWith('PO/')) setActiveModule('purchase');
    else if (n.entityId.startsWith('MC-')) setActiveModule('maintenance');
    
    setShowNotifications(false);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'comment': return <MessageSquare size={14} />;
      case 'alert': return <AlertCircle size={14} />;
      case 'success': return <CheckCircle2 size={14} />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="page-title">{activeModuleLabel}</h1>
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <div className="search-bar glass">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder={t('nav.search')} 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
            />
          </div>

          {showSearchResults && searchQuery.trim() !== '' && (
            <div className="search-results glass">
              {filteredResults.length > 0 ? (
                filteredResults.map(result => (
                  <button 
                    key={result.id} 
                    className="search-result-item"
                    onClick={() => handleSearchSelect(result.id)}
                  >
                    <div className="search-result-icon">{result.icon}</div>
                    <div className="search-result-info">
                      <span className="search-result-title">{result.label}</span>
                      <span className="search-result-category">{result.category}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="no-results">{t('nav.noResults') || 'Nincs találat'}</div>
              )}
            </div>
          )}
        </div>
        
        <div className="nav-action-wrapper">
          <button className="nav-action-btn" onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu glass notifications-dropdown">
              <div className="dropdown-header">
                <h4>{t('nav.notifications')} ({unreadCount})</h4>
                <span onClick={() => notifications.forEach(n => markNotificationAsRead(n.id))} style={{ cursor: 'pointer' }}>{t('nav.markAllRead')}</span>
              </div>
              <div className="dropdown-body">
                {notifications.length > 0 ? notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`notification-item ${n.read ? 'read' : ''}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className={`notification-icon ${n.type}`}>{getNotificationIcon(n.type)}</div>
                    <div className="notification-info">
                      <p><strong>{n.text}</strong></p>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{n.time}</span>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                    <Bell size={32} style={{ marginBottom: '10px' }} />
                    <p>Nincsenek értesítések</p>
                  </div>
                )}
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
              <div className="dropdown-item" onClick={() => { setActiveModule('settings'); setShowUserMenu(false); }}><User size={16} /> {t('nav.profile')}</div>
              <div className="dropdown-item" onClick={() => { setActiveModule('settings'); setShowUserMenu(false); }}><Settings size={16} /> {t('nav.settings')}</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-error" onClick={() => { onLogout(); setShowUserMenu(false); }}><LogOut size={16} /> {t('nav.logout')}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

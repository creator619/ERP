import React, { useState, useCallback } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import CRM from './components/CRM/CRM';
import Inventory from './components/Inventory/Inventory';
import Sales from './components/Sales/Sales';
import Invoicing from './components/Invoicing/Invoicing';
import Manufacturing from './components/Manufacturing/Manufacturing';
import Login from './components/Auth/Login';
import Settings from './components/Settings/Settings';
import HR from './components/HR/HR';
import Purchase from './components/Purchase/Purchase';
import Projects from './components/Projects/Projects';
import Messenger from './components/Messenger/Messenger';
import Quality from './components/Quality/Quality';
import Maintenance from './components/Maintenance/Maintenance';
import { ToastContainer } from './components/UI/Toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const addToast = useCallback((message, type = 'success', description = '') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, description }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    addToast('Sikeres bejelentkezés', 'success', 'Üdvözöljük a RailParts ERP rendszerben!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    addToast('Kijelentkezve', 'info', 'Várjuk vissza hamarosan!');
  };

  const renderModule = () => {
    const props = { addToast };
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'projects':
        return <Projects {...props} />;
      case 'manufacturing':
        return <Manufacturing {...props} />;
      case 'quality':
        return <Quality {...props} />;
      case 'maintenance':
        return <Maintenance {...props} />;
      case 'crm':
        return <CRM {...props} />;
      case 'inventory':
        return <Inventory {...props} />;
      case 'sales':
        return <Sales {...props} />;
      case 'invoicing':
        return <Invoicing {...props} />;
      case 'hr':
        return <HR {...props} />;
      case 'purchase':
        return <Purchase {...props} />;
      case 'messenger':
        return <Messenger {...props} />;
      case 'settings':
        return <Settings {...props} theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <Dashboard {...props} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Layout 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        onLogout={handleLogout}
      >
        {renderModule()}
      </Layout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;

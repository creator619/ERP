import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldAlert,
  Wrench,
  Activity,
  Globe,
  Database,
  Target,
  ShieldCheck,
  Zap,
  Bell
} from 'lucide-react';
import './Dashboard.css';
import auditLogService from '../../services/AuditLogService';
import aiService from '../../services/AIService';
import { Brain, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Dashboard = ({ setActiveModule }) => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState(auditLogService.getLogs().slice(0, 10));
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'danger', msg: 'Lejárt hegesztő vizsgák (2 fő)', module: 'HR' },
    { id: 2, type: 'warning', msg: 'Késedelmes beszállítás (SteelWorks)', module: 'Purchase' },
    { id: 3, type: 'info', msg: 'Projekt mérföldkő esedékes: Stadler', module: 'Projects' }
  ]);

  useEffect(() => {
    const unsubscribe = auditLogService.subscribe((updatedLogs) => {
      setLogs(updatedLogs.slice(0, 10));
    });
    return unsubscribe;
  }, []);

  const stats = [
    { label: 'Pénzügyi Egészség', value: '94/100', icon: <CreditCard />, trend: '+2.5%', isUp: true, color: '#3498db' },
    { label: 'Gyártási Yield', value: '98.8%', icon: <Activity />, trend: '+0.4%', isUp: true, color: '#2ecc71' },
    { label: 'Beszállítói Minőség', value: 'A+', icon: <ShieldCheck />, trend: 'Stable', isUp: true, color: '#f1c40f' },
    { label: 'Dolgozói KPI Avg', value: '86.2%', icon: <Target />, trend: '-1.2%', isUp: false, color: '#9b59b6' },
  ];

  const getLogIcon = (module) => {
    switch (module) {
      case 'Maintenance': return <Wrench size={16} />;
      case 'Quality': return <ShieldAlert size={16} />;
      case 'Projects': return <Globe size={16} />;
      case 'Invoicing': return <CreditCard size={16} />;
      case 'HR': return <Users size={16} />;
      case 'Purchase': return <ShoppingCart size={16} />;
      default: return <Zap size={16} />;
    }
  };

  return (
    <div className="dashboard-enterprise">
      <div className="dashboard-welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 className="responsive-title" style={{ fontWeight: 800, marginBottom: '5px' }}>{t('dash.title')}</h1>
          <p className="text-muted">{t('dash.welcome')}</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
           <div className="glass" style={{ padding: '8px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="pulse-success"></div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>SYSTEM OPERATIONAL</span>
           </div>
        </div>
      </div>

      <div className="stats-grid responsive-grid" style={{ marginTop: '25px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-card-premium glass" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: stat.isUp ? '#2ecc71' : '#e74c3c' }}>{stat.trend}</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</h3>
            <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginTop: '25px' }}>
        <div className="analytics-pane">
           <div className="glass" style={{ padding: '25px', borderRadius: '20px', marginBottom: '25px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Bell size={20} color="#e74c3c" /> Kritikus Értesítések
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {activeAlerts.map(alert => (
                    <div key={alert.id} className={`alert-row ${alert.type}`} style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${alert.type === 'danger' ? '#e74c3c' : alert.type === 'warning' ? '#f1c40f' : '#3498db'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{alert.msg}</p>
                          <p className="text-muted" style={{ fontSize: '0.7rem' }}>Modul: {alert.module}</p>
                       </div>
                       <button 
                          className="view-btn-small"
                          onClick={() => setActiveModule(alert.module.toLowerCase())}
                       >
                          Intézkedés
                       </button>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '20px' }}>Vállalati Trendek</h3>
              <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                 {[40, 60, 45, 90, 65, 80, 85].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, var(--primary-color), rgba(52, 152, 219, 0.2))', borderRadius: '5px' }}></div>
                 ))}
              </div>
           </div>

            <div className="glass" style={{ padding: '25px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1))', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '25px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <Brain size={20} color="var(--primary-color)" /> AI Predikció
                  </h3>
                  <span className="status-badge active" style={{ fontSize: '0.6rem' }}>LIVE ANALYSIS</span>
               </div>
               <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px' }}>{aiService.getInsights()[0].title}</p>
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '10px' }}>{aiService.getInsights()[0].description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700 }}>
                        <Sparkles size={12} /> Confidence: 94%
                     </div>
                     <button 
                        className="view-btn-small" 
                        style={{ fontSize: '0.7rem' }}
                        onClick={() => setActiveModule('intelligence')}
                     >
                        Elemzés megnyitása
                     </button>
                  </div>
               </div>
            </div>
        </div>

        <div className="log-pane">
           <div className="glass" style={{ padding: '25px', borderRadius: '20px', height: '100%', maxHeight: '600px', overflowY: 'auto' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Activity size={20} color="var(--primary-color)" /> Valós idejű Audit Log
              </h3>
              <div className="activity-feed">
                 {logs.map(log => (
                    <div key={log.id} style={{ display: 'flex', gap: '15px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary-color)' }}>
                          {getLogIcon(log.module)}
                       </div>
                       <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.action}</p>
                          <p className="text-muted" style={{ fontSize: '0.75rem' }}>{log.details}</p>
                          <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '4px' }}>{new Date(log.timestamp).toLocaleTimeString()} • {log.user}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

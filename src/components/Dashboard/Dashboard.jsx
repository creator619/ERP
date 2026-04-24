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
  Database
} from 'lucide-react';
import './Dashboard.css';
import auditLogService from '../../services/AuditLogService';

const Dashboard = () => {
  const [logs, setLogs] = useState(auditLogService.getLogs().slice(0, 8));
  const [systemUptime, setSystemUptime] = useState('99.98%');

  useEffect(() => {
    const unsubscribe = auditLogService.subscribe((updatedLogs) => {
      setLogs(updatedLogs.slice(0, 8));
    });
    return unsubscribe;
  }, []);

  const stats = [
    { label: 'Havi árbevétel', value: '42.8M Ft', icon: <CreditCard />, trend: '+12.5%', isUp: true, color: '#3498db' },
    { label: 'OEE (Gépkihasználtság)', value: '88.2%', icon: <Activity />, trend: '+4.1%', isUp: true, color: '#2ecc71' },
    { label: 'Aktív Projektek', value: '14', icon: <Globe />, trend: '-2', isUp: false, color: '#9b59b6' },
    { label: 'Selejtarány', value: '1.4%', icon: <ShieldAlert />, trend: '-0.3%', isUp: true, color: '#e74c3c' },
  ];

  const chartData = [
    { day: 'H', rev: 45, cost: 30 },
    { day: 'K', rev: 52, cost: 35 },
    { day: 'Sze', rev: 48, cost: 32 },
    { day: 'Cs', rev: 70, cost: 40 },
    { day: 'P', rev: 65, cost: 38 },
    { day: 'Szo', rev: 30, cost: 20 },
    { day: 'V', rev: 20, cost: 15 },
  ];

  const getLogIcon = (module, severity) => {
    switch (module) {
      case 'Maintenance': return <Wrench size={16} />;
      case 'Quality': return <ShieldAlert size={16} />;
      case 'Projects': return <Globe size={16} />;
      case 'Invoicing': return <CreditCard size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getLogTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Most';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}ó`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="dashboard-enterprise">
      <div className="dashboard-welcome" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '5px' }}>RailParts Vezérlőpult</h1>
          <p className="text-muted">Vállalati erőforrások valós idejű monitorozása</p>
        </div>
        <div className="system-status glass" style={{ padding: '8px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
          <div className="pulse-success" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71' }}></div>
          <span>Rendszerüzemidő: <strong>{systemUptime}</strong></span>
        </div>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-card-premium glass" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <span className={`trend-pill ${stat.isUp ? 'up' : 'down'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '5px' }}>{stat.value}</h3>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{stat.label}</p>
            <div className="mini-sparkline" style={{ height: '30px', marginTop: '15px', opacity: 0.3 }}>
              {/* Sparkline simulation */}
              <svg width="100%" height="100%" viewBox="0 0 100 30">
                <path d="M0 25 L20 15 L40 20 L60 5 L80 18 L100 10" fill="none" stroke={stat.color} strokeWidth="2" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="main-analytics-row" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '25px', marginTop: '25px' }}>
        <div className="analytics-card glass" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <h3 style={{ fontWeight: 700 }}>Pénzügyi Teljesítmény (M Ft)</h3>
            <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%' }}></div> Bevétel
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', background: '#e74c3c', borderRadius: '50%' }}></div> Költség
              </span>
            </div>
          </div>
          <div className="chart-area" style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px' }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100%', position: 'relative' }}>
                <div className="bar rev" style={{ height: `${d.rev * 2.5}px`, background: 'var(--primary-color)', flex: 1, borderRadius: '3px 3px 0 0' }}></div>
                <div className="bar cost" style={{ height: `${d.cost * 2.5}px`, background: '#e74c3c', flex: 1, borderRadius: '3px 3px 0 0', opacity: 0.7 }}></div>
                <span style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="log-feed-card glass" style={{ padding: '25px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={18} color="var(--primary-color)" /> Rendszernapló
          </h3>
          <div className="activity-feed" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {logs.map(log => (
              <div key={log.id} className="feed-item" style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: log.severity === 'danger' ? '#e74c3c' : 'var(--primary-color)' }}>
                  {getLogIcon(log.module, log.severity)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{log.action}</p>
                  <p className="text-muted" style={{ fontSize: '0.75rem', margin: '2px 0' }}>{log.details}</p>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.65rem', opacity: 0.6 }}>
                    <span>{getLogTime(log.timestamp)}</span>
                    <span>•</span>
                    <span>{log.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

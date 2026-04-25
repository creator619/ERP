import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity, 
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Award,
  Zap,
  Filter
} from 'lucide-react';
import currencyService from '../../services/CurrencyService';
import './ExecutiveBI.css';

// Custom CountUp Component
const CountUp = ({ end, duration = 1.5, format = (val) => val, isCurrency = false }) => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(easeProgress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{isCurrency ? format(value) : (typeof end === 'number' && end % 1 !== 0 ? value.toFixed(1) : Math.floor(value))}</>;
};

// Mock data structures
const MOCK_DATA = {
  YTD: {
    kpis: [
      { label: 'Összes Árbevétel (YTD)', value: 1245000000, trend: '+12.4%', up: true, icon: <DollarSign size={20} /> },
      { label: 'EBITDA Margin', value: 24.2, suffix: '%', trend: '+2.1%', up: true, icon: <Activity size={20} /> },
      { label: 'Piaci Részesedés', value: 18.5, suffix: '%', trend: '-0.4%', up: false, icon: <PieChart size={20} /> },
      { label: 'Aktív Szerződések', value: 842, suffix: '', trend: '+45', up: true, icon: <Briefcase size={20} /> },
    ],
    chart: [
      { month: 'Okt', value: 180 }, { month: 'Nov', value: 240 }, { month: 'Dec', value: 210 },
      { month: 'Jan', value: 290 }, { month: 'Feb', value: 320 }, { month: 'Már', value: 380 }
    ],
    regions: [
      { name: 'DACH Régió', value: 45, color: '#3498db' },
      { name: 'Közép-Európa', value: 30, color: '#2ecc71' },
      { name: 'Észak-Amerika', value: 15, color: '#f1c40f' },
      { name: 'Ázsia', value: 10, color: '#e74c3c' },
    ]
  },
  Q1: {
    kpis: [
      { label: 'Q1 Árbevétel', value: 485000000, trend: '+8.2%', up: true, icon: <DollarSign size={20} /> },
      { label: 'EBITDA Margin', value: 22.1, suffix: '%', trend: '+0.5%', up: true, icon: <Activity size={20} /> },
      { label: 'Piaci Részesedés', value: 17.8, suffix: '%', trend: '+0.1%', up: true, icon: <PieChart size={20} /> },
      { label: 'Új Szerződések', value: 124, suffix: '', trend: '+12', up: true, icon: <Briefcase size={20} /> },
    ],
    chart: [
      { month: 'Jan 1.hét', value: 65 }, { month: 'Jan 2.hét', value: 72 }, { month: 'Jan 3.hét', value: 68 },
      { month: 'Feb 1.hét', value: 85 }, { month: 'Feb 2.hét', value: 92 }, { month: 'Már 1.hét', value: 105 }
    ],
    regions: [
      { name: 'DACH Régió', value: 48, color: '#3498db' },
      { name: 'Közép-Európa', value: 28, color: '#2ecc71' },
      { name: 'Észak-Amerika', value: 12, color: '#f1c40f' },
      { name: 'Ázsia', value: 12, color: '#e74c3c' },
    ]
  },
  Q4: {
    kpis: [
      { label: 'Q4 (Előző) Árbev.', value: 620000000, trend: '+15.4%', up: true, icon: <DollarSign size={20} /> },
      { label: 'EBITDA Margin', value: 26.5, suffix: '%', trend: '+3.2%', up: true, icon: <Activity size={20} /> },
      { label: 'Piaci Részesedés', value: 18.9, suffix: '%', trend: '-0.2%', up: false, icon: <PieChart size={20} /> },
      { label: 'Lezárt Szerződések', value: 315, suffix: '', trend: '+60', up: true, icon: <Briefcase size={20} /> },
    ],
    chart: [
      { month: 'Okt 15', value: 120 }, { month: 'Okt 31', value: 135 }, { month: 'Nov 15', value: 160 },
      { month: 'Nov 30', value: 145 }, { month: 'Dec 15', value: 190 }, { month: 'Dec 31', value: 210 }
    ],
    regions: [
      { name: 'DACH Régió', value: 42, color: '#3498db' },
      { name: 'Közép-Európa', value: 33, color: '#2ecc71' },
      { name: 'Észak-Amerika', value: 16, color: '#f1c40f' },
      { name: 'Ázsia', value: 9, color: '#e74c3c' },
    ]
  }
};

const ExecutiveBI = ({ currency }) => {
  const [period, setPeriod] = useState('YTD');
  const formatCurrency = (val) => currencyService.format(val, currency);
  
  const currentData = MOCK_DATA[period];

  const BarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.value)) * 1.1; // 10% headroom
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8%', height: '220px', marginTop: '30px', position: 'relative' }}>
        {/* Background Grid Lines */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, opacity: 0.1 }}>
            <div style={{ borderBottom: '1px dashed #fff', flex: 1 }}></div>
            <div style={{ borderBottom: '1px dashed #fff', flex: 1 }}></div>
            <div style={{ borderBottom: '1px dashed #fff', flex: 1 }}></div>
        </div>

        {data.map((d, i) => (
          <div key={i} className="bi-bar-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', zIndex: 1, height: '100%', justifyContent: 'flex-end' }}>
            <div className="bi-bar-fill" style={{ 
              width: '100%', 
              height: `${(d.value / max) * 100}%`, 
              background: 'linear-gradient(180deg, var(--primary-color) 0%, rgba(155, 89, 182, 0.4) 100%)', 
              borderRadius: '6px 6px 0 0',
              position: 'relative',
              transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
               <div className="bi-tooltip">
                  Mintázat: {d.value} Mrd<br/>
                  Időszak: {d.month}
               </div>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.month}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bi-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '14px', borderRadius: '16px', border: '1px solid rgba(155, 89, 182, 0.2)' }}>
            <Layers size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Executive BI Dashboard</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Globális menedzsment mutatók és előrejelzések</p>
          </div>
        </div>
        
        {/* Filters and Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
          <div className="bi-filters">
            {Object.keys(MOCK_DATA).map(p => (
              <button key={p} className={`bi-filter-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <button className="view-btn"><Filter size={16}/> Részletes Szűrő</button>
             <button className="create-btn" style={{ background: 'linear-gradient(45deg, #9b59b6, #8e44ad)', border: 'none', boxShadow: '0 5px 15px rgba(155,89,182,0.3)' }}><Zap size={18} /> Prezentációs Mód</button>
          </div>
        </div>
      </div>

      <div className="bi-stats-grid">
        {currentData.kpis.map((kpi, i) => (
          <div key={i} className="bi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ color: 'var(--primary-color)', background: 'rgba(155,89,182,0.1)', padding: '10px', borderRadius: '12px' }}>
                 {kpi.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', background: 'rgba(0,0,0,0.04)' }} className={kpi.up ? 'trend-up' : 'trend-down'}>
                {kpi.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>{kpi.label}</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: "'Inter', sans-serif", letterSpacing: '-1px' }}>
              <CountUp 
                 end={kpi.value} 
                 duration={1.2} 
                 isCurrency={kpi.label.includes('Árbevétel')} 
                 format={formatCurrency} 
              />
              {kpi.suffix}
            </h3>
          </div>
        ))}
      </div>

      <div className="bi-chart-container">
        <div className="bi-chart-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
             <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Bevétel vs. Előrejelzés</h4>
             <span className="text-muted" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px' }}>Szűrés: {period}</span>
          </div>
          <BarChart data={currentData.chart} />
        </div>

        <div className="bi-chart-box" style={{ display: 'flex', flexDirection: 'column' }}>
           <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '30px' }}>Regionális Megoszlás</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', flex: 1 }}>
              {currentData.regions.map(r => (
                <div key={r.name}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700 }}>{r.name}</span>
                      <span style={{ fontWeight: 800, color: r.color }}>{r.value}%</span>
                   </div>
                   <div className="region-bar-bg">
                      <div className="region-bar-fill" style={{ width: `${r.value}%`, background: r.color }}></div>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="award-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <div style={{ background: 'rgba(241, 196, 15, 0.2)', padding: '12px', borderRadius: '50%' }}>
                    <Award size={28} color="#f1c40f" />
                 </div>
                 <div>
                    <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f1c40f' }}>Piacvezető: {currentData.regions.reduce((max, r) => max.value > r.value ? max : r).name}</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>Az elemzett időszakban kimagasló teljesítmény.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bi-card" style={{ padding: '30px 40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
         <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} color="#2ecc71" /> Operatív Kiválóság (Global)
         </h4>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            <div className="performance-metric">
               <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Szállítási pontosság</span>
               <span style={{ fontWeight: 900, color: '#2ecc71', fontSize: '1.2rem' }}>98.4%</span>
            </div>
            <div className="performance-metric">
               <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Gyártási hatékonyság (OEE)</span>
               <span style={{ fontWeight: 900, color: '#3498db', fontSize: '1.2rem' }}>92.1%</span>
            </div>
            <div className="performance-metric">
               <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Vevői elégedettség (NPS)</span>
               <span style={{ fontWeight: 900, color: '#f1c40f', fontSize: '1.2rem' }}>+74</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ExecutiveBI;

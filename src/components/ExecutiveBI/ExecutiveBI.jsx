import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Activity, 
  Globe, 
  Target, 
  Zap, 
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Award
} from 'lucide-react';
import currencyService from '../../services/CurrencyService';
import './ExecutiveBI.css';

const ExecutiveBI = ({ currency }) => {
  const formatCurrency = (val) => currencyService.format(val, currency);

  const kpis = [
    { label: 'Összes Árbevétel (YTD)', value: 1245000000, trend: '+12.4%', up: true, icon: <DollarSign size={20} /> },
    { label: 'EBITDA Margin', value: '24.2%', trend: '+2.1%', up: true, icon: <Activity size={20} /> },
    { label: 'Piaci Részesedés', value: '18.5%', trend: '-0.4%', up: false, icon: <PieChart size={20} /> },
    { label: 'Aktív Szerződések', value: 842, trend: '+45', up: true, icon: <Briefcase size={20} /> },
  ];

  const regions = [
    { name: 'DACH Régió', value: 45, color: '#3498db' },
    { name: 'Közép-Európa', value: 30, color: '#2ecc71' },
    { name: 'Észak-Amerika', value: 15, color: '#f1c40f' },
    { name: 'Ázsia', value: 10, color: '#e74c3c' },
  ];

  const BarChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.value));
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '200px', marginTop: '30px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '100%', 
              height: `${(d.value / max) * 100}%`, 
              background: 'linear-gradient(to top, var(--primary-color), #2ecc71)', 
              borderRadius: '8px 8px 0 0',
              position: 'relative',
              transition: 'height 1s ease-out'
            }}>
              <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                {d.label}
              </div>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{d.month}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bi-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Layers size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Executive BI Dashboard</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Globális üzleti intelligencia és stratégiai mutatók</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
           <button className="view-btn">Jelentés Exportálása</button>
           <button className="create-btn"><Zap size={18} /> Élő Adatok</button>
        </div>
      </div>

      <div className="bi-stats-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="bi-card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ color: 'var(--primary-color)' }}>{kpi.icon}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }} className={kpi.up ? 'trend-up' : 'trend-down'}>
                {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>{kpi.label}</p>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>
              {typeof kpi.value === 'number' ? formatCurrency(kpi.value) : kpi.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="bi-chart-container">
        <div className="bi-chart-box glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Bevétel vs. Előrejelzés (Mrd HUF)</h4>
             <div className="text-muted" style={{ fontSize: '0.7rem' }}>Utolsó 6 hónap</div>
          </div>
          <BarChart data={[
            { month: 'Nov', value: 180, label: '180' },
            { month: 'Dec', value: 240, label: '240' },
            { month: 'Jan', value: 210, label: '210' },
            { month: 'Feb', value: 290, label: '290' },
            { month: 'Mar', value: 320, label: '320' },
            { month: 'Apr', value: 380, label: '380' },
          ]} />
        </div>

        <div className="bi-chart-box glass">
           <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '25px' }}>Regionális Teljesítmény</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {regions.map(r => (
                <div key={r.name}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 700 }}>{r.name}</span>
                      <span>{r.value}%</span>
                   </div>
                   <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${r.value}%`, height: '100%', background: r.color, borderRadius: '5px' }}></div>
                   </div>
                </div>
              ))}
           </div>
           <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <Award size={24} color="#f1c40f" />
                 <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Piacvezető státusz: DACH</p>
                    <p className="text-muted" style={{ fontSize: '0.7rem' }}>A vasúti belső terek 45%-át mi adjuk.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
         <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '20px' }}>Operatív Kiválóság (Global)</h4>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            <div className="performance-metric">
               <span className="text-muted">Szállítási pontosság</span>
               <span style={{ fontWeight: 800, color: '#2ecc71' }}>98.4%</span>
            </div>
            <div className="performance-metric">
               <span className="text-muted">Gyártási hatékonyság</span>
               <span style={{ fontWeight: 800, color: '#3498db' }}>92.1%</span>
            </div>
            <div className="performance-metric">
               <span className="text-muted">Vevői elégedettség (NPS)</span>
               <span style={{ fontWeight: 800, color: '#f1c40f' }}>74</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ExecutiveBI;

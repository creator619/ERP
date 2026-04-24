import React from 'react';
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
  PieChart as PieChartIcon
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { label: 'Havi bevétel', value: '18,450,000 Ft', icon: <CreditCard />, trend: '+8.2%', isUp: true },
    { label: 'Gyártási hatékonyság', value: '94.5%', icon: <TrendingUp />, trend: '+2.1%', isUp: true },
    { label: 'Aktív munkarendelések', value: '24', icon: <ShoppingCart />, trend: '+4', isUp: true },
    { label: 'Minőségi reklamáció', value: '0.2%', icon: <Users />, trend: '-0.1%', isUp: true },
  ];

  const chartData = [
    { day: 'Hét', value: 45 },
    { day: 'Ked', value: 52 },
    { day: 'Sze', value: 48 },
    { day: 'Csü', value: 70 },
    { day: 'Pén', value: 65 },
    { day: 'Szo', value: 30 },
    { day: 'Vas', value: 20 },
  ];

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card glass">
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <span className={`stat-trend ${stat.isUp ? 'up' : 'down'}`}>
                {stat.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.trend}
              </span>
            </div>
            <div className="stat-body">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginTop: '25px' }}>
        <div className="chart-card glass" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={20} color="var(--primary-color)" />
              Heti Gyártási Teljesítmény
            </h3>
            <select className="view-btn" style={{ fontSize: '0.8rem' }}>
              <option>Utolsó 7 nap</option>
              <option>Utolsó 30 nap</option>
            </select>
          </div>
          <div className="bar-chart-container" style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '15px' }}>
            {chartData.map((data, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div className="chart-bar" style={{ 
                  height: `${data.value * 2}px`, 
                  width: '100%', 
                  background: 'linear-gradient(to top, var(--primary-color), var(--secondary-color))',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative'
                }}>
                  <div className="bar-tooltip">{data.value} egység</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card glass" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <PieChartIcon size={20} color="var(--primary-color)" />
            Kategória Megoszlás
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="distribution-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                <span>Nyílászárók</span>
                <span>45%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px' }}>
                <div style={{ width: '45%', height: '100%', background: '#714B67', borderRadius: '3px' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                <span>Beltéri elemek</span>
                <span>35%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px' }}>
                <div style={{ width: '35%', height: '100%', background: '#00A896', borderRadius: '3px' }}></div>
              </div>
            </div>
            <div className="distribution-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                <span>Egyéb</span>
                <span>20%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px' }}>
                <div style={{ width: '20%', height: '100%', background: '#ffc107', borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity glass" style={{ marginTop: '25px', padding: '25px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Clock size={20} color="var(--primary-color)" />
          Legutóbbi események
        </h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success"><CheckCircle2 size={16} /></div>
            <div className="activity-content">
              <p><strong>Ablakgyártás befejezve</strong> - RW/MO/002 munkarendelés kész.</p>
              <span>15 perce</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info"><Clock size={16} /></div>
            <div className="activity-content">
              <p><strong>Új árajánlat</strong> küldve: MÁV-START Zrt. számára.</p>
              <span>1 órája</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon warning"><AlertCircle size={16} /></div>
            <div className="activity-content">
              <p><strong>Alacsony készlet:</strong> Poggyásztartó váz (5 db maradék).</p>
              <span>3 órája</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

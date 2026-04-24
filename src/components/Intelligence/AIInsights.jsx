import React, { useState } from 'react';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Cpu, 
  Activity,
  ShieldAlert,
  Lightbulb,
  Sparkles,
  BarChart3,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import aiService from '../../services/AIService';
import './AIInsights.css';

const AIInsights = ({ addToast }) => {
  const [activeView, setActiveView] = useState('ai'); // 'ai' or 'bi'
  const insights = aiService.getInsights();

  const kpis = [
    { label: 'EBITDA Margin', value: '24.2%', trend: '+2.1%', icon: <DollarSign size={18} />, color: '#2ecc71' },
    { label: 'Revenue Growth', value: '18.5%', trend: '+5.4%', icon: <TrendingUp size={18} />, color: '#3498db' },
    { label: 'Operational Efficiency', value: '92.1%', trend: '-0.5%', icon: <Activity size={18} />, color: '#f1c40f' },
    { label: 'Net Profit', value: '142M Ft', trend: '+12%', icon: <Zap size={18} />, color: '#9b59b6' },
  ];

  const financialData = [
    { month: 'Jan', revenue: 45, cost: 30 },
    { month: 'Feb', revenue: 52, cost: 32 },
    { month: 'Mar', revenue: 48, cost: 35 },
    { month: 'Apr', revenue: 61, cost: 38 },
    { month: 'May', revenue: 55, cost: 40 },
    { month: 'Jun', revenue: 68, cost: 42 },
  ];

  return (
    <div className="ai-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: 'var(--primary-color)', padding: '12px', borderRadius: '12px', position: 'relative' }}>
            <Brain size={24} />
            <div className="ai-status-dot" style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%', border: '2px solid var(--bg-card)' }}></div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>RailParts Intelligence & BI</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Prediktív analitika és vezetői döntéstámogatás</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="bi-tabs">
            <div className={`bi-tab ${activeView === 'ai' ? 'active' : ''}`} onClick={() => setActiveView('ai')}>
               <Cpu size={14} style={{ marginRight: '6px' }} /> AI Insights
            </div>
            <div className={`bi-tab ${activeView === 'bi' ? 'active' : ''}`} onClick={() => setActiveView('bi')}>
               <BarChart3 size={14} style={{ marginRight: '6px' }} /> Executive BI
            </div>
          </div>
          <button className="create-btn" onClick={() => addToast('Adatfrissítés folyamatban...', 'info')}>
            <Sparkles size={18} /> Adatfrissítés
          </button>
        </div>
      </div>

      {activeView === 'ai' ? (
        <div className="ai-grid-wrapper">
          <div className="ai-grid">
            {insights.map(insight => (
              <div key={insight.id} className={`ai-card glass ${insight.severity}`}>
                <div className="scan-line"></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                         {insight.type === 'inventory' ? <Zap size={20} color="#e74c3c" /> : 
                          insight.type === 'maintenance' ? <Activity size={20} color="#f1c40f" /> :
                          insight.type === 'logistics' ? <Cpu size={20} color="#3498db" /> :
                          <Target size={20} color="#9b59b6" />}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{insight.title}</h4>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>ID: {insight.id} • AI Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                      </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <span className={`status-badge ${insight.severity === 'high' ? 'danger' : insight.severity === 'warning' ? 'warning' : 'active'}`}>
                        {insight.severity.toUpperCase()}
                      </span>
                   </div>
                </div>

                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>{insight.description}</p>

                <div className="recommendation-box">
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <Lightbulb size={16} color="#f1c40f" />
                      <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>AI Javaslat:</span>
                   </div>
                   <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{insight.recommendation}</p>
                </div>

                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <div style={{ flex: 1 }}>
                      <p className="text-muted" style={{ fontSize: '0.7rem' }}>Kockázati Hatás</p>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{insight.impact}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <button className="view-btn-small" style={{ gap: '5px' }}>
                        Végrehajtás <ArrowRight size={14} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ marginTop: '30px', padding: '30px', borderRadius: '24px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
             <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Neurális Hálózat Állapota</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                   {[
                     { label: 'Adatfeldolgozás', val: 99 },
                     { label: 'Predikciós Pontosság', val: 94 },
                     { label: 'Tanulási Sebesség', val: 82 }
                   ].map(s => (
                     <div key={s.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                           <span>{s.label}</span>
                           <span>{s.val}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                           <div style={{ width: `${s.val}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingLeft: '40px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1 }}>
                   <h4 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '10px' }}>AI Master Insight</h4>
                   <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>"A globális adatok elemzése alapján az optimális készletszint 15%-kal csökkenthető anélkül, hogy a gyártási biztonság sérülne. Ez éves szinten kb. 45 Millió HUF megtakarítást eredményezhet."</p>
                </div>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(52, 152, 219, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Brain size={48} color="var(--primary-color)" />
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bi-view-wrapper">
          <div className="bi-kpi-grid">
            {kpis.map((kpi, i) => (
              <div key={i} className="bi-stat-card glass">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div style={{ padding: '10px', background: `${kpi.color}15`, color: kpi.color, borderRadius: '10px' }}>
                       {kpi.icon}
                    </div>
                    <span className={`bi-badge-trend ${kpi.trend.startsWith('+') ? 'up' : 'down'}`}>
                       {kpi.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {kpi.trend}
                    </span>
                 </div>
                 <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>{kpi.label}</p>
                 <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          <div className="bi-chart-container glass">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Bevétel vs Költség (Havi bontás)</h3>
                <div style={{ display: 'flex', gap: '20px' }}>
                   <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: 'var(--primary-color)' }}></div> Bevétel</div>
                   <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#e74c3c' }}></div> Költség</div>
                </div>
             </div>
             <div className="bi-bar-group">
                {financialData.map((d, i) => (
                  <div key={i} className="bi-bar-item" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                     <div style={{ display: 'flex', gap: '5px', height: '100%', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div className="bi-bar" style={{ height: `${d.revenue * 1.5}%`, background: 'var(--primary-color)', opacity: 0.8 }} title={`Revenue: ${d.revenue}M`}></div>
                        <div className="bi-bar" style={{ height: `${d.cost * 1.5}%`, background: '#e74c3c', opacity: 0.6 }} title={`Cost: ${d.cost}M`}></div>
                     </div>
                     <span className="bi-bar-label">{d.month}</span>
                  </div>
                ))}
             </div>
             <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                   <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '15px' }}>ROI Elemzés (Projektenként)</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {['Stadler', 'Siemens', 'ÖBB'].map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ fontSize: '0.8rem' }}>{p}</span>
                           <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', margin: '0 15px', borderRadius: '2px' }}>
                              <div style={{ width: `${80 - i * 15}%`, height: '100%', background: '#2ecc71' }}></div>
                           </div>
                           <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{8.2 - i*0.5}x</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                   <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '15px' }}>Piaci Benchmark</h4>
                   <p className="text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.6' }}>A RailParts jövedelmezősége jelenleg 12%-kal haladja meg az iparági átlagot (SME Gyártás, EU-V4).</p>
                   <div className="status-badge success" style={{ marginTop: '10px', width: 'fit-content' }}>TOP 5% IN SECTOR</div>
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                   <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '15px' }}>Kockázati Hőtérkép</h4>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} style={{ height: '25px', background: i === 2 ? '#e74c3c' : i === 5 ? '#f1c40f' : '#2ecc71', borderRadius: '4px', opacity: 0.6 }}></div>
                      ))}
                   </div>
                   <p className="text-muted" style={{ fontSize: '0.65rem', marginTop: '10px' }}>Kritikus pont: Beszállítói késedelem (Zóna B-4)</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

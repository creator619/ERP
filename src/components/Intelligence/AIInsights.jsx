import React from 'react';
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
  Sparkles
} from 'lucide-react';
import aiService from '../../services/AIService';
import './AIInsights.css';

const AIInsights = ({ addToast }) => {
  const insights = aiService.getInsights();

  return (
    <div className="ai-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: 'var(--primary-color)', padding: '12px', borderRadius: '12px', position: 'relative' }}>
            <Brain size={24} />
            <div className="ai-status-dot" style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%', border: '2px solid var(--bg-card)' }}></div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>RailParts AI Intelligence</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Prediktív analitika és neurális döntéstámogató rendszer</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Újraelemzés indítva...', 'info')}>Rendszer Újrahangolása</button>
          <button className="create-btn"><Sparkles size={18} /> Automatikus Optimalizálás</button>
        </div>
      </div>

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
  );
};

export default AIInsights;

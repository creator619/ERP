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
  ArrowDownRight,
  Globe,
  Navigation,
  ArrowRightCircle,
  MessageSquare,
  Send,
  Lock,
  Eye
} from 'lucide-react';
import aiService from '../../services/AIService';
import './AIInsights.css';

const AIInsights = ({ addToast }) => {
  const [activeView, setActiveView] = useState('ai'); // 'ai', 'bi', 'simulator', or 'strategy'
  const [simValues, setSimValues] = useState({
    salesVolume: 100,
    inflation: 0,
    supplyRisk: 0
  });
  
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Üdvözlöm Simon Ernő! Én vagyok a RailParts Oracle. Miben segíthetek ma?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const insights = aiService.getInsights();

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsThinking(true);

    // Simulated AI response
    setTimeout(() => {
      const responses = [
        "A készletszintek jelenleg stabilak, de a Stadler projekt miatt javaslom a kötőelemek korai utánrendelését.",
        "A múlt havi OEE csökkenés oka a 3-as számú présgép váratlan karbantartása volt. A prediktív modellem szerint a következő 30 napban nem várható hasonló leállás.",
        "A Simon Ernő által kért profit-szimuláció alapján 12%-os növekedés várható, ha az alapanyagárak nem emelkednek tovább.",
        "Igen, az audit naplóban látom a tegnapi biztonsági incidens kísérletet. Az IP-alapú korlátozás sikeresen blokkolta a hozzáférést."
      ];
      const aiMsg = { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] };
      setChatHistory(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1500);
  };

  // Logic for simulator
  const baseProfit = 142; // M Ft
  const profitImpact = 
    ((simValues.salesVolume - 100) * 2.5) - 
    (simValues.inflation * 1.5) - 
    (simValues.supplyRisk * 3.2);
  
  const estimatedProfit = baseProfit + profitImpact;

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
            <div className={`bi-tab ${activeView === 'ai' ? 'active' : ''}`} onClick={() => setActiveView('ai')}>AI Insights</div>
            <div className={`bi-tab ${activeView === 'oracle' ? 'active' : ''}`} onClick={() => setActiveView('oracle')}>Oracle Asszisztens</div>
            <div className={`bi-tab ${activeView === 'bi' ? 'active' : ''}`} onClick={() => setActiveView('bi')}>Executive BI</div>
            <div className={`bi-tab ${activeView === 'simulator' ? 'active' : ''}`} onClick={() => setActiveView('simulator')}>Simulator</div>
            <div className={`bi-tab ${activeView === 'strategy' ? 'active' : ''}`} onClick={() => setActiveView('strategy')}>Strategy Map</div>
          </div>
          <button className="create-btn" onClick={() => addToast('Globális adatok frissítése...', 'info')}>
            <Globe size={18} /> Globális Monitor
          </button>
        </div>
      </div>

      {activeView === 'ai' && (
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
      )}

      {activeView === 'bi' && (
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

      {activeView === 'simulator' && (
        <div className="bi-view-wrapper">
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="simulator-slider-container glass">
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '15px' }}>Üzleti Szimulátor</h3>
                 
                 <div className="sim-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ fontSize: '0.85rem' }}>Globális Infláció</span>
                       <span style={{ fontWeight: 700, color: '#e74c3c' }}>+{simValues.inflation}%</span>
                    </div>
                    <input type="range" className="sim-slider danger" min="0" max="30" value={simValues.inflation} onChange={(e) => setSimValues({...simValues, inflation: parseInt(e.target.value)})} />
                 </div>
 
                 <div className="sim-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ fontSize: '0.85rem' }}>Ellátási Lánc Kockázat</span>
                       <span style={{ fontWeight: 700, color: '#f1c40f' }}>{simValues.supplyRisk}%</span>
                    </div>
                    <input type="range" className="sim-slider warning" min="0" max="100" value={simValues.supplyRisk} onChange={(e) => setSimValues({...simValues, supplyRisk: parseInt(e.target.value)})} />
                 </div>
 
                 <div className="sim-group" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                       <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Várható Értékesítési Volumen</span>
                       <span style={{ fontWeight: 800, color: '#2ecc71' }}>{simValues.salesVolume}%</span>
                    </div>
                    <input type="range" className="sim-slider success" min="50" max="200" value={simValues.salesVolume} onChange={(e) => setSimValues({...simValues, salesVolume: parseInt(e.target.value)})} />
                 </div>
              </div>

              <div className="simulator-result-card glass">
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '30px' }}>Becsült Üzleti Hatás</h3>
                 <p className="text-muted" style={{ fontSize: '0.9rem' }}>Várható éves tiszta profit:</p>
                 <div style={{ fontSize: '4rem', fontWeight: 900, color: estimatedProfit > 0 ? '#2ecc71' : '#e74c3c', margin: '20px 0' }}>
                    {estimatedProfit.toFixed(1)}M <span style={{ fontSize: '1.5rem' }}>Ft</span>
                 </div>
                 
                 <div className={`impact-badge ${estimatedProfit > baseProfit ? 'positive' : 'negative'}`}>
                    {estimatedProfit > baseProfit ? '+' : ''}{(estimatedProfit - baseProfit).toFixed(1)}M Ft változás
                 </div>

                 <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <AlertTriangle size={16} color="#f1c40f" /> AI Kockázati Jelentés
                    </h4>
                    <p style={{ fontSize: '0.75rem', lineHeight: '1.5', opacity: 0.8 }}>
                       {estimatedProfit < 50 ? 
                        "FIGYELEM: A profitabilitás kritikus szintre csökkent. Javasolt a fix költségek azonnali optimalizálása." :
                        "A szimulált forgatókönyv fenntartható növekedést mutat. A likviditási tartalékok elegendőek a változások kezeléséhez."}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeView === 'oracle' && (
        <div className="oracle-view glass">
           <div className="neural-bg">
              <div className="neural-node" style={{ top: '20%', left: '10%' }}></div>
              <div className="neural-node" style={{ top: '60%', left: '30%' }}></div>
              <div className="neural-node" style={{ top: '40%', left: '70%' }}></div>
              <div className="neural-node" style={{ top: '80%', left: '90%' }}></div>
           </div>
           
           <div className="oracle-chat-container">
              <div className="oracle-messages">
                 {chatHistory.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role}`}>
                       <div className="bubble-content">
                          {msg.role === 'ai' && <div className="ai-avatar"><Brain size={16} /></div>}
                          <p>{msg.text}</p>
                       </div>
                    </div>
                 ))}
                 {isThinking && (
                    <div className="chat-bubble ai thinking">
                       <div className="bubble-content">
                          <div className="ai-avatar"><Brain size={16} className="pulse-ai" /></div>
                          <div className="typing-indicator"><span></span><span></span><span></span></div>
                       </div>
                    </div>
                 )}
              </div>
              
              <form className="oracle-input-area" onSubmit={handleSendMessage}>
                 <input 
                    type="text" 
                    placeholder="Kérdezzen Simon Ernő nevében..." 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                 />
                 <button type="submit" className="send-btn">
                    <Send size={20} />
                 </button>
              </form>
           </div>

           <div className="oracle-sidebar">
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <Cpu size={18} color="var(--primary-color)" /> Rendszer Kontextus
              </h3>
              <div className="context-card glass">
                 <p className="text-muted" style={{ fontSize: '0.7rem' }}>AKTÍV ELEMZÉS</p>
                 <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Globális ERP Adathalmaz v4.2</p>
              </div>
              <div className="context-card glass">
                 <p className="text-muted" style={{ fontSize: '0.7rem' }}>ADATFORRÁSOK</p>
                 <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    <div className="mini-tag">Inventory</div>
                    <div className="mini-tag">Finance</div>
                    <div className="mini-tag">MES</div>
                 </div>
              </div>
              <div className="oracle-hints">
                 <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px' }}>Próbálja ezeket:</p>
                 <button className="hint-btn" onClick={() => { setChatInput('Melyik projektünk áll a legrosszabbul?'); handleSendMessage(); }}>Veszélyben lévő projektek</button>
                 <button className="hint-btn" onClick={() => { setChatInput('Készlet-optimalizálási javaslatok?'); handleSendMessage(); }}>Készlet javaslatok</button>
              </div>
              <button className="create-btn" style={{ width: '100%', marginTop: 'auto', gap: '10px' }} onClick={() => addToast('AI Stratégiai Jelentés generálása...', 'info')}>
                 <Download size={18} /> Riport Exportálása
              </button>
           </div>
        </div>
      )}

      {activeView === 'strategy' && (
        <div className="bi-view-wrapper">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>Globális Stratégiai Térkép</h3>
              <p className="text-muted">Aktív ellátási lánc és nemzetközi logisztikai monitor</p>
              
              <div className="strategic-map-container">
                 <div className="map-ping" style={{ top: '45%', left: '48%' }} title="Budapest HQ"></div>
                 <div className="map-ping" style={{ top: '42%', left: '45%' }} title="Berlin Branch"></div>
                 <div className="map-ping" style={{ top: '40%', left: '55%' }} title="Supplier: Steel-Asia"></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginTop: '30px' }}>
                 <div className="security-badge">
                    <Navigation size={24} color="var(--primary-color)" />
                    <div>
                       <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>14 Kamion Úton</p>
                       <p className="text-muted" style={{ fontSize: '0.75rem' }}>Várható érkezés: 4-12 óra</p>
                    </div>
                 </div>
                 <div className="security-badge">
                    <ShieldAlert size={24} color="#f1c40f" />
                    <div>
                       <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>1 Logisztikai Késés</p>
                       <p className="text-muted" style={{ fontSize: '0.75rem' }}>Zóna: Közép-Európa</p>
                    </div>
                 </div>
                 <div className="security-badge">
                    <CheckCircle2 size={24} color="#2ecc71" />
                    <div>
                       <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Vámkezelés OK</p>
                       <p className="text-muted" style={{ fontSize: '0.75rem' }}>Export/Import folyamatok rendben</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass" style={{ marginTop: '30px', padding: '30px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '25px' }}>Cash-Flow Flow (Sankey-stílus)</h3>
              <div className="sankey-flow-container">
                 <div className="flow-node">
                    <p className="text-muted" style={{ fontSize: '0.6rem' }}>BEVÉTEL</p>
                    <p style={{ fontWeight: 800, color: '#2ecc71' }}>842M Ft</p>
                 </div>
                 <ArrowRightCircle size={32} color="var(--primary-color)" style={{ opacity: 0.5 }} />
                 <div className="flow-node" style={{ background: 'var(--primary-color)', color: 'white' }}>
                    <p style={{ fontSize: '0.6rem', opacity: 0.8 }}>KÖZPONTI KASSZA</p>
                    <p style={{ fontWeight: 900 }}>RP-TREASURY</p>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="flow-node">
                       <p className="text-muted" style={{ fontSize: '0.6rem' }}>BÉREK</p>
                       <p style={{ fontWeight: 800 }}>-420M Ft</p>
                    </div>
                    <div className="flow-node">
                       <p className="text-muted" style={{ fontSize: '0.6rem' }}>ANYAG</p>
                       <p style={{ fontWeight: 800 }}>-280M Ft</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Layers, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingCart,
  Clock,
  PieChart,
  BarChart3,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Activity
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import './Planning.css';

const Planning = ({ addToast }) => {
  const { mrpData, forecast, workOrders, resourceLoading, setProcurementRequests } = useData();
  const [activeTab, setActiveTab] = useState('mrp');

  const shortagesCount = mrpData.filter(m => m.shortage > 0).length;

  const handleGeneratePurchaseRequests = () => {
    const shortages = mrpData.filter(m => m.shortage > 0);
    if (shortages.length === 0) {
      addToast('Minden rendben', 'info', 'Nincs szükség új beszerzésre.');
      return;
    }

    shortages.forEach(item => {
      const newRequest = {
        id: `REQ-MRP-${Math.floor(Math.random() * 1000)}`,
        supplier: 'MRP Rendszer-generált',
        date: new Date().toISOString().split('T')[0],
        total: 0,
        status: 'Request',
        category: 'Alkatrész',
        approvalStep: 0,
        rating: 5.0,
        scores: { quality: 100, delivery: 100, price: 100, responsiveness: 100, innovation: 100 },
        items: [{ name: item.name, qty: item.shortage, price: 0 }]
      };
      setProcurementRequests(prev => [newRequest, ...prev]);
    });

    addToast('Beszerzési igények legenerálva', 'success', `${shortages.length} tétel továbbítva a Beszerzés modulba.`);
  };

  // --- GANTT Logic ---
  const ganttStartDate = useMemo(() => new Date('2024-04-01'), []);
  const daysToShow = 60;
  
  const generateGanttDays = () => {
    const days = [];
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(ganttStartDate);
      date.setDate(date.getDate() + i);
      days.push({
        date,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        dayNum: date.getDate(),
        month: date.toLocaleDateString('hu-HU', { month: 'short' })
      });
    }
    return days;
  };

  const ganttDays = useMemo(generateGanttDays, [ganttStartDate]);

  const calculatePosition = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffStart = Math.floor((startDate - ganttStartDate) / (1000 * 60 * 60 * 24));
    const duration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return {
      left: `${(diffStart / daysToShow) * 100}%`,
      width: `${(duration / daysToShow) * 100}%`
    };
  };

  return (
    <div className="planning-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Calendar size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Tervezés & Anyagszükséglet (MRP)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>I. FÁZIS: Erőforrás-allokáció és kapacitás-menedzsment</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn">
            <Download size={18} /> Riport
          </button>
          <button className="create-btn" onClick={handleGeneratePurchaseRequests} disabled={shortagesCount === 0}>
            <ShoppingCart size={20} /> Hiányzó tételek rendelése
          </button>
        </div>
      </div>

      <div className="planning-stats-grid">
         <div className="stat-card glass" style={{ borderLeft: '4px solid #9b59b6' }}>
            <p className="text-muted">Aktív Anyagigény</p>
            <div className="stat-value">{mrpData.length} tétel</div>
            <p className="stat-label">Gyártási munkalapokból</p>
         </div>
         <div className="stat-card glass" style={{ borderLeft: `4px solid ${shortagesCount > 0 ? '#e74c3c' : '#2ecc71'}` }}>
            <p className="text-muted">Készlethiány</p>
            <div className="stat-value" style={{ color: shortagesCount > 0 ? '#e74c3c' : '#2ecc71' }}>{shortagesCount} Kritikus</div>
            <p className="stat-label">Azonnali intézkedést igényel</p>
         </div>
         <div className="stat-card glass" style={{ borderLeft: '4px solid #3498db' }}>
            <p className="text-muted">Kereslet Pontosság</p>
            <div className="stat-value">92.4%</div>
            <p className="stat-label">AI modell megbízhatóság</p>
         </div>
      </div>

      <div className="compliance-tabs">
        <div className={`comp-tab ${activeTab === 'mrp' ? 'active' : ''}`} onClick={() => setActiveTab('mrp')}>
           <Layers size={16} /> Anyagszükséglet Lista (MRP)
        </div>
        <div className={`comp-tab ${activeTab === 'forecast' ? 'active' : ''}`} onClick={() => setActiveTab('forecast')}>
           <TrendingUp size={16} /> AI Kereslet-előrejelzés
        </div>
        <div className={`comp-tab ${activeTab === 'capacity' ? 'active' : ''}`} onClick={() => setActiveTab('capacity')}>
           <Clock size={16} /> Kapacitás & Leterheltség (GANTT)
        </div>
      </div>

      {activeTab === 'mrp' && (
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
           <table className="data-table">
              <thead>
                 <tr>
                    <th>Cikkszám (SKU)</th>
                    <th>Megnevezés</th>
                    <th>Érintett Rendelések</th>
                    <th style={{ textAlign: 'center' }}>Igényelt</th>
                    <th style={{ textAlign: 'center' }}>Raktáron</th>
                    <th style={{ textAlign: 'center' }}>Hiány</th>
                    <th>Státusz</th>
                 </tr>
              </thead>
              <tbody>
                 {mrpData.map((item, i) => (
                   <tr key={i}>
                      <td><span style={{ fontWeight: 800, color: 'var(--primary-color)' }}>{item.sku}</span></td>
                      <td style={{ fontWeight: 700 }}>{item.name}</td>
                      <td>
                         <div style={{ display: 'flex', gap: '5px' }}>
                            {item.orders.map(id => (
                              <span key={id} style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{id}</span>
                            ))}
                         </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.required}</td>
                      <td style={{ textAlign: 'center' }}>{item.stock}</td>
                      <td style={{ textAlign: 'center', fontWeight: 900, color: item.shortage > 0 ? '#e74c3c' : 'inherit' }}>
                         {item.shortage > 0 ? `-${item.shortage}` : '0'}
                      </td>
                      <td>
                         <span className={`status-badge ${item.status === 'Available' ? 'success' : 'danger'}`}>
                            {item.status === 'Available' ? 'FEDEZETT' : 'HIÁNY'}
                         </span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'forecast' && (
        <div className="planning-grid">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>AI Kereslet vs. Készlet Előrejelzés</h3>
                 <span className="status-badge info" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>AI MODELL: PRO-PLAN V2.4</span>
              </div>
              
              <div className="forecast-chart-container">
                 {forecast.map((f, i) => (
                   <div key={i} className="forecast-bar-group">
                      <div className="forecast-bars">
                         <div className="bar demand" style={{ height: `${f.demand / 6}px` }} title={`Kereslet: ${f.demand}`}></div>
                         <div className="bar stock" style={{ height: `${f.stock / 6}px` }} title={`Várható készlet: ${f.stock}`}></div>
                      </div>
                      <span className="forecast-month">{f.month}</span>
                      {f.alert && <div className="forecast-alert"><AlertTriangle size={12} /></div>}
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>AI Beszerzési Javaslatok</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 <div className="ncr-card" style={{ borderLeft: '4px solid #f1c40f' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>Május: Alumínium Profil készlethiány várható</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>Az AI 15%-os keresletnövekedést jelez a Stadler projekt miatt.</p>
                 </div>
                 <div className="ncr-card" style={{ borderLeft: '4px solid #2ecc71' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>Június: Készletoptimalizálás lehetséges</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>A PVC keretek készletszintje 20%-kal csökkenthető.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'capacity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Gantt Chart */}
          <div className="gantt-container glass">
             <div className="gantt-header">
                <div className="gantt-sidebar-header">FELADATOK / PROJEKTEK</div>
                <div className="gantt-timeline-header">
                   {ganttDays.map((day, i) => (
                     <div key={i} className={`gantt-day-header ${day.isWeekend ? 'weekend' : ''}`}>
                        <span className="day-month">{day.dayNum === 1 || i === 0 ? day.month : ''}</span>
                        <span className="day-num">{day.dayNum}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="gantt-body">
                {workOrders.map((wo, i) => {
                   const pos = calculatePosition(wo.startDate, wo.deadline);
                   return (
                     <div key={wo.id} className="gantt-row">
                        <div className="gantt-sidebar-cell">
                           <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{wo.id}</div>
                           <div className="text-muted" style={{ fontSize: '0.65rem' }}>{wo.product}</div>
                        </div>
                        <div className="gantt-timeline-cell">
                           {ganttDays.map((day, j) => (
                             <div key={j} className={`gantt-grid-line ${day.isWeekend ? 'weekend' : ''}`}></div>
                           ))}
                           <div className={`gantt-bar-wrapper ${wo.priority.toLowerCase()}`} style={{ left: pos.left, width: pos.width }}>
                              <div className="gantt-bar">
                                 <div className="gantt-bar-progress" style={{ width: `${wo.progress}%` }}></div>
                                 <span className="gantt-bar-label">{wo.progress}%</span>
                              </div>
                           </div>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>

          {/* Resource Loading Section */}
          <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Erőforrás Leterheltség (Machine Load)</h3>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem' }}>
                   <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#2ecc71' }}></div> Szabad</div>
                   <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#f1c40f' }}></div> Optimális</div>
                   <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#e74c3c' }}></div> Túlterhelt</div>
                </div>
             </div>

             <div className="resource-grid">
                {resourceLoading.map(resource => (
                  <div key={resource.id} className="resource-card glass">
                     <div className="resource-info">
                        <div className="resource-icon">
                           <Monitor size={18} />
                        </div>
                        <div>
                           <p className="resource-name">{resource.name}</p>
                           <p className="resource-meta">{resource.id} • {resource.orderCount} Aktív feladat</p>
                        </div>
                        <div className="resource-percentage" style={{ color: resource.percentage > 100 ? '#e74c3c' : resource.percentage > 80 ? '#f1c40f' : '#2ecc71' }}>
                           {resource.percentage}%
                        </div>
                     </div>
                     <div className="resource-load-bar">
                        <div 
                          className="load-progress" 
                          style={{ 
                            width: `${Math.min(100, resource.percentage)}%`,
                            background: resource.percentage > 100 ? '#e74c3c' : resource.percentage > 80 ? '#f1c40f' : '#2ecc71'
                          }}
                        ></div>
                     </div>
                     <div className="resource-footer">
                        <span>{resource.loadedHours} / {resource.capacity} Óra</span>
                        {resource.alert && <span className="resource-alert">SZŰK KERESZTMETSZET!</span>}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;

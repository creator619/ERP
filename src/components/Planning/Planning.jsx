import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import './Planning.css';

const Planning = ({ addToast }) => {
  const { mrpData, forecast, setProcurementRequests } = useData();
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

  return (
    <div className="planning-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Calendar size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Tervezés & Anyagszükséglet (MRP)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>I. FÁZIS: Intelligens erőforrás-allokáció és kereslet-előrejelzés</p>
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
           <Clock size={16} /> Kapacitás Tervező
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
              <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#9b59b6' }}></div> Tervezett Kereslet</div>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: 'rgba(255,255,255,0.1)' }}></div> Elérhető Készlet</div>
              </div>
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>AI Beszerzési Javaslatok</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 <div className="ncr-card" style={{ borderLeft: '4px solid #f1c40f' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>Május: Alumínium Profil készlethiány várható</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>Az AI 15%-os keresletnövekedést jelez a Stadler projekt miatt.</p>
                    <button className="view-btn-small" style={{ marginTop: '10px' }}>Ütemezés</button>
                 </div>
                 <div className="ncr-card" style={{ borderLeft: '4px solid #2ecc71' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>Június: Készletoptimalizálás lehetséges</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>A PVC keretek készletszintje 20%-kal csökkenthető a biztonság veszélyeztetése nélkül.</p>
                    <button className="view-btn-small" style={{ marginTop: '10px' }}>Alkalmaz</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'capacity' && (
        <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
           <Clock size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
           <h3 style={{ fontWeight: 800, marginBottom: '10px' }}>Kapacitás Tervező Modul</h3>
           <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
              A II. Fázis keretében itt fog megjelenni a GANTT-diagram és az erőforrás-allokációs felület. 
              Jelenleg az adatgyűjtés és a modellezés folyik.
           </p>
           <div className="pulse-info" style={{ margin: '20px auto' }}></div>
        </div>
      )}
    </div>
  );
};

export default Planning;

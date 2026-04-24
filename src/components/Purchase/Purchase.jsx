import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  MoreVertical,
  ArrowDownToLine,
  Building,
  Package,
  Calendar,
  CreditCard,
  History,
  FileText,
  Star,
  ShieldCheck,
  TrendingUp,
  Ban,
  PieChart,
  Target,
  Zap,
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import currencyService from '../../services/CurrencyService';
import './Purchase.css';

const Purchase = ({ addToast, currency }) => {
  const [selectedPO, setSelectedPO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  const [orders, setOrders] = useState([
    { 
      id: 'PO/2024/001', 
      supplier: 'Knorr-Bremse Vasúti Kft.', 
      date: '2024-04-10', 
      total: 4500000, 
      status: 'Delivered', 
      category: 'Alkatrész',
      approvalStep: 3, 
      rating: 4.8,
      scores: { quality: 98, delivery: 95, price: 90, responsiveness: 88, innovation: 85 },
      items: [
        { name: 'Féktárcsa szett (S-Line)', qty: 20, price: 150000 },
        { name: 'Szerelőkészlet', qty: 20, price: 75000 }
      ]
    },
    { 
      id: 'PO/2024/002', 
      supplier: 'Alu-Tech Hungary', 
      date: '2024-04-12', 
      total: 1200000, 
      status: 'Ordered', 
      category: 'Nyersanyag',
      approvalStep: 1, 
      rating: 4.2,
      scores: { quality: 92, delivery: 88, price: 95, responsiveness: 82, innovation: 75 },
      items: [{ name: 'Alu-profil 12m', qty: 50, price: 24000 }]
    },
    { 
      id: 'PO/2024/004', 
      supplier: 'SteelWorks Kft.', 
      date: '2024-03-20', 
      total: 12450000, 
      status: 'Late', 
      category: 'Nyersanyag',
      approvalStep: 0, 
      rating: 3.5,
      scores: { quality: 85, delivery: 65, price: 98, responsiveness: 70, innovation: 60 },
      items: [{ name: 'Vázszerkezet acél', qty: 5, price: 2490000 }]
    }
  ]);

  const spendCategories = [
    { name: 'Nyersanyag', value: 45, color: '#3498db' },
    { name: 'Alkatrész', value: 30, color: '#2ecc71' },
    { name: 'IT/Elektronika', value: 15, color: '#e67e22' },
    { name: 'Szolgáltatás', value: 10, color: '#9b59b6' }
  ];

  const SpendDonut = ({ data }) => {
    let totalValue = data.reduce((acc, curr) => acc + curr.value, 0);
    let cumulativeValue = 0;
    
    return (
      <div className="spend-donut-container">
        <svg width="120" height="120" viewBox="0 0 42 42" className="donut-svg">
          <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>
          <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3"></circle>
          
          {data.map((segment, i) => {
            const startOffset = 100 - cumulativeValue + 25;
            cumulativeValue += segment.value;
            return (
              <circle 
                key={i}
                className="donut-segment" 
                cx="21" cy="21" r="15.91549430918954" 
                fill="transparent" 
                stroke={segment.color} 
                strokeWidth="3" 
                strokeDasharray={`${segment.value} ${100 - segment.value}`} 
                strokeDashoffset={startOffset}
              ></circle>
            );
          })}
        </svg>
        <div className="donut-label">
          <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>ÖSSZES</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>100%</span>
        </div>
      </div>
    );
  };

  const ApprovalStepper = ({ currentStep }) => {
    const steps = ['Igény', 'Részleg', 'Pénzügy', 'Beszerzés'];
    return (
      <div className="approval-stepper">
        {steps.map((step, i) => (
          <div key={i} className={`step-node ${i <= currentStep ? 'active' : ''}`}>
             <div className="node-circle">
                {i < currentStep ? <CheckCircle2 size={12} /> : <span>{i + 1}</span>}
             </div>
             <span className="node-text">{step}</span>
             {i < steps.length - 1 && <div className="node-line"></div>}
          </div>
        ))}
      </div>
    );
  };

  const SupplierRadarMap = ({ scores }) => {
    const points = [
      { x: 50, y: 10 },  // Quality
      { x: 90, y: 35 },  // Delivery
      { x: 75, y: 80 },  // Price
      { x: 25, y: 80 },  // Response
      { x: 10, y: 35 }   // Innovation
    ];
    
    const getPoint = (p, score) => {
      const centerX = 50;
      const centerY = 50;
      const factor = score / 100;
      const x = centerX + (p.x - centerX) * factor;
      const y = centerY + (p.y - centerY) * factor;
      return `${x},${y}`;
    };

    const polygonPoints = [
      getPoint(points[0], scores.quality),
      getPoint(points[1], scores.delivery),
      getPoint(points[2], scores.price),
      getPoint(points[3], scores.responsiveness),
      getPoint(points[4], scores.innovation)
    ].join(' ');

    return (
      <div className="radar-container">
        <svg viewBox="0 0 100 100" width="200" height="200">
           {/* Grid */}
           <polygon points="50,10 90,35 75,80 25,80 10,35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
           <polygon points="50,20 80,41 69,73 31,73 20,41" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
           <polygon points="50,30 70,47 62,67 38,67 30,47" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
           
           {/* Data */}
           <polygon points={polygonPoints} fill="rgba(52, 152, 219, 0.3)" stroke="var(--primary-color)" strokeWidth="2" />
           
           {/* Labels */}
           <text x="50" y="5" fontSize="5" fill="white" textAnchor="middle">Minőség</text>
           <text x="95" y="35" fontSize="5" fill="white">Szállítás</text>
           <text x="80" y="85" fontSize="5" fill="white">Ár</text>
           <text x="5" y="85" fontSize="5" fill="white">Válaszidő</text>
           <text x="0" y="35" fontSize="5" fill="white">Innováció</text>
        </svg>
      </div>
    );
  };

  const openPODetails = (po) => {
    setSelectedPO(po);
    setIsModalOpen(true);
    setActiveTab('items');
  };

  const handleApprove = (id) => {
    setOrders(prev => prev.map(po => {
      if (po.id === id) {
        const nextStep = po.approvalStep + 1;
        const stepNames = ['Részlegvezető', 'Pénzügy', 'Beszerzés', 'Véglegesítve'];
        
        auditLogService.log({
          user: stepNames[po.approvalStep],
          action: 'Jóváhagyási lépés teljesítve',
          module: 'Purchase',
          details: `${po.id} -> Következő: ${stepNames[nextStep] || 'Nincs'}`,
          severity: 'info'
        });
        
        if (nextStep === 3) {
           addToast('Rendelés véglegesítve és kiküldve', 'success');
        } else {
           addToast(`${stepNames[nextStep]} jóváhagyására vár`, 'info');
        }

        return { ...po, approvalStep: nextStep };
      }
      return po;
    }));
  };

  const formatCurrency = (val) => currencyService.format(val, currency);

  return (
    <div className="purchase-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(230, 126, 34, 0.1)', color: '#e67e22', padding: '12px', borderRadius: '12px' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Stratégiai Beszerzés & AI Sourcing</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Globális ellátási lánc menedzsment és költéselemzés</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új igény rögzítése', 'info')}>
          <Plus size={20} /> Új Beszerzés
        </button>
      </div>

      <div className="purchase-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr', gap: '25px', marginBottom: '25px' }}>
         <div className="purchase-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="stat-card glass" style={{ borderLeft: '4px solid var(--primary-color)' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Függő igények</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{formatCurrency(18500000)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', color: '#2ecc71', fontSize: '0.7rem' }}>
                 <TrendingUp size={12} /> +12% vs előző hó
              </div>
            </div>
            <div className="stat-card glass" style={{ borderLeft: '4px solid #e74c3c' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Késési arány</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e74c3c' }}>12.4%</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', color: '#e74c3c', fontSize: '0.7rem' }}>
                 <AlertTriangle size={12} /> Szállítási lánc hiba észlelve
              </div>
            </div>
            <div className="stat-card glass" style={{ borderLeft: '4px solid #2ecc71' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Beszállítói minőség</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2ecc71' }}>98.2%</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', color: '#2ecc71', fontSize: '0.7rem' }}>
                 <CheckCircle2 size={12} /> IRIS szabványnak megfelelő
              </div>
            </div>
         </div>

         <div className="glass spend-analytics-card" style={{ padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <SpendDonut data={spendCategories} />
            <div style={{ flex: 1 }}>
               <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '10px' }}>KÖLTÉSELEMZÉS</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {spendCategories.slice(0, 3).map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c.color }}></div>
                          {c.name}
                       </span>
                       <span style={{ fontWeight: 800 }}>{c.value}%</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="list-view glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rendelés ID</th>
              <th>Beszállító</th>
              <th>Kategória</th>
              <th style={{ textAlign: 'right' }}>Végösszeg</th>
              <th>Jóváhagyási Folyamat</th>
              <th>Státusz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(po => (
              <tr key={po.id} onClick={() => openPODetails(po)} style={{ cursor: 'pointer' }}>
                <td><strong style={{ color: 'var(--primary-color)' }}>{po.id}</strong></td>
                <td>
                   <div style={{ fontWeight: 700 }}>{po.supplier}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f1c40f', fontSize: '0.7rem' }}>
                      <Star size={10} fill="#f1c40f" /> {po.rating}
                   </div>
                </td>
                <td><span className="category-tag">{po.category}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--text-main)' }}>{formatCurrency(po.total)}</td>
                <td>
                   <div style={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map(s => (
                        <div key={s} className={`step-bar ${po.approvalStep > s ? 'done' : po.approvalStep === s ? 'active' : ''}`}></div>
                      ))}
                   </div>
                </td>
                <td>
                  <span className={`status-badge ${po.status === 'Delivered' ? 'active' : po.status === 'Late' ? 'danger' : 'warning'}`}>
                    {po.status === 'Delivered' ? 'Beérkezett' : po.status === 'Ordered' ? 'Szállítás alatt' : 'Késik'}
                  </span>
                </td>
                <td><button className="view-btn-small"><MoreVertical size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Beszerzési Monitor: ${selectedPO?.id}`}
        width="950px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedPO?.approvalStep < 3 && (
              <button className="create-btn" onClick={() => {
                handleApprove(selectedPO.id);
                setSelectedPO(prev => ({ ...prev, approvalStep: prev.approvalStep + 1 }));
              }}>
                <ShieldCheck size={18} /> Jóváhagyás: {['Részleg', 'Pénzügy', 'Beszerzés'][selectedPO.approvalStep]}
              </button>
            )}
          </>
        }
      >
        {selectedPO && (
          <div className="po-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Rendelt Tételek</div>
              <div className={`settings-nav-item ${activeTab === 'sourcing' ? 'active' : ''}`} onClick={() => setActiveTab('sourcing')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>AI Sourcing</div>
              <div className={`settings-nav-item ${activeTab === 'scorecard' ? 'active' : ''}`} onClick={() => setActiveTab('scorecard')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Beszállító Profil</div>
            </div>

            {activeTab === 'items' && (
              <div className="items-tab">
                <div style={{ marginBottom: '25px' }}>
                   <ApprovalStepper currentStep={selectedPO.approvalStep} />
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '10px', fontSize: '0.75rem' }} className="text-muted">MEGNEVEZÉS</th>
                        <th style={{ padding: '10px', fontSize: '0.75rem', textAlign: 'right' }}>MENNYISÉG</th>
                        <th style={{ padding: '10px', fontSize: '0.75rem', textAlign: 'right' }}>EGYSÉGÁR</th>
                        <th style={{ padding: '10px', fontSize: '0.75rem', textAlign: 'right' }}>ÖSSZESEN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px 10px', fontWeight: 700 }}>{item.name}</td>
                          <td style={{ padding: '15px 10px', textAlign: 'right' }}>{item.qty} db</td>
                          <td style={{ padding: '15px 10px', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                          <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: 900 }}>{formatCurrency(item.qty * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'sourcing' && (
               <div className="sourcing-tab">
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' }}>
                     <div className="glass" style={{ padding: '25px', borderRadius: '20px', borderLeft: '4px solid #f1c40f' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                           <Zap size={24} color="#f1c40f" />
                           <h4 style={{ fontWeight: 800 }}>AI Beszerzési Javaslat</h4>
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                           "Az aktuális piaci trendek és a {selectedPO.supplier} korábbi teljesítménye alapján a rendelés volumene eléri a kiemelt kedvezmény kategóriát. 
                           <strong> Javaslat:</strong> Kérjen további 5% engedményt a szállítási határidő 3 napos kitolása fejében."
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                           <button className="view-btn-small">Piaci ár összehasonlítás</button>
                           <button className="view-btn-small">Alternatív beszállítók</button>
                        </div>
                     </div>
                     <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px' }}>MARKET TREND: {selectedPO.category}</h4>
                        <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '10px' }}>
                           {[40, 60, 45, 70, 85, 80].map((v, i) => (
                             <div key={i} style={{ flex: 1, height: `${v}%`, background: 'var(--primary-color)', opacity: 0.3 + (i * 0.1), borderRadius: '2px' }}></div>
                           ))}
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '10px' }}>Az alapanyag árak 8.2%-kal emelkedtek az elmúlt negyedévben.</p>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'scorecard' && (
              <div className="scorecard-tab">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                   <div>
                      <h4 style={{ fontWeight: 800, marginBottom: '20px' }}>Beszállító KPI Analitika</h4>
                      <SupplierRadarMap scores={selectedPO.scores} />
                   </div>
                   <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px' }}>MINŐSÍTÉSI ADATOK</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                         {Object.entries(selectedPO.scores).map(([key, val]) => (
                           <div key={key}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.75rem' }}>
                                 <span className="text-muted" style={{ textTransform: 'capitalize' }}>{key}</span>
                                 <span style={{ fontWeight: 800 }}>{val}%</span>
                              </div>
                              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                 <div style={{ width: `${val}%`, height: '100%', background: val > 90 ? '#2ecc71' : val > 80 ? '#f1c40f' : '#e74c3c' }}></div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Purchase;

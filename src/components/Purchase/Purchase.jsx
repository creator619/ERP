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
  Ban
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
      approvalStep: 3, // 3 = Finalized
      rating: 4.8,
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
      approvalStep: 1, // 1 = Waiting for Finance
      rating: 4.2,
      items: [{ name: 'Alu-profil 12m', qty: 50, price: 24000 }]
    },
    { 
      id: 'PO/2024/004', 
      supplier: 'SteelWorks Kft.', 
      date: '2024-03-20', 
      total: 12450000, 
      status: 'Late', 
      approvalStep: 0, // 0 = Waiting for Dept Head
      rating: 3.5,
      items: [{ name: 'Vázszerkezet acél', qty: 5, price: 2490000 }]
    }
  ]);

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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Stratégiai Beszerzés</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Beszállítói lánc és jóváhagyási munkafolyamatok</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új igény rögzítése', 'info')}>
          <Plus size={20} /> Új Rendelés
        </button>
      </div>

      <div className="purchase-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Függő igények</p>
          <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{formatCurrency(18500000)}</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Késési arány</p>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e74c3c' }}>12.4%</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Átlagos Lead-time</p>
          <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>8.2 nap</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Beszállítói minőség</p>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2ecc71' }}>98.2%</div>
        </div>
      </div>

      <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rendelés</th>
              <th>Beszállító</th>
              <th>Értékelés</th>
              <th style={{ textAlign: 'right' }}>Végösszeg</th>
              <th>Jóváhagyás</th>
              <th>Státusz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(po => (
              <tr key={po.id} onClick={() => openPODetails(po)} style={{ cursor: 'pointer' }}>
                <td><strong>{po.id}</strong></td>
                <td>{po.supplier}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f1c40f' }}>
                    <Star size={12} fill="#f1c40f" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{po.rating}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatCurrency(po.total)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[0, 1, 2].map(s => (
                        <div key={s} style={{ width: '12px', height: '4px', borderRadius: '2px', background: po.approvalStep > s ? '#2ecc71' : 'rgba(255,255,255,0.1)' }}></div>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }} className="text-muted">
                      {['Részleg', 'Pénzügy', 'Beszerzés', 'Kész'][po.approvalStep]}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${po.status === 'Delivered' ? 'active' : po.status === 'Late' ? 'danger' : 'warning'}`}>
                    {po.status === 'Delivered' ? 'Beérkezett' : po.status === 'Ordered' ? 'Úton' : 'Késik'}
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
        width="850px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedPO?.approvalStep < 3 && (
              <button className="create-btn" onClick={() => {
                handleApprove(selectedPO.id);
                setSelectedPO(prev => ({ ...prev, approvalStep: prev.approvalStep + 1 }));
              }}>
                <ShieldCheck size={18} /> {['Részleg', 'Pénzügy', 'Beszerzés'][selectedPO.approvalStep]} Jóváhagyás
              </button>
            )}
          </>
        }
      >
        {selectedPO && (
          <div className="po-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Rendelt Tételek</div>
              <div className={`settings-nav-item ${activeTab === 'scorecard' ? 'active' : ''}`} onClick={() => setActiveTab('scorecard')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Beszállító Scorecard</div>
            </div>

            {activeTab === 'items' && (
              <div className="items-tab">
                <div style={{ background: 'var(--bg-main)', borderRadius: '15px', padding: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '10px', fontSize: '0.8rem' }} className="text-muted">Megnevezés</th>
                        <th style={{ padding: '10px', fontSize: '0.8rem', textAlign: 'right' }}>Egységár</th>
                        <th style={{ padding: '10px', fontSize: '0.8rem', textAlign: 'right' }}>Összesen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px 10px' }}>
                             <div style={{ fontWeight: 700 }}>{item.name}</div>
                             <div className="text-muted" style={{ fontSize: '0.75rem' }}>Qty: {item.qty} db</div>
                          </td>
                          <td style={{ padding: '15px 10px', textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                          <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: 800 }}>{formatCurrency(item.qty * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'scorecard' && (
              <div className="scorecard-tab">
                <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h4 style={{ fontWeight: 800 }}>{selectedPO.supplier}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f1c40f' }}>
                         <Star size={20} fill="#f1c40f" />
                         <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{selectedPO.rating}</span>
                      </div>
                   </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                       {[
                         { label: 'Pontos szállítás', value: 94, color: '#2ecc71' },
                         { label: 'Minőségi megfelelés', value: 100, color: '#2ecc71' },
                         { label: 'Válaszidő', value: 85, color: '#f1c40f' },
                         { label: 'Ár-érték arány', value: 92, color: '#2ecc71' }
                       ].map((m, i) => (
                         <div key={i}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                             <span className="text-muted" style={{ fontSize: '0.75rem' }}>{m.label}</span>
                             <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{m.value}%</span>
                           </div>
                           <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                             <div style={{ width: `${m.value}%`, height: '100%', background: m.color, borderRadius: '4px' }}></div>
                           </div>
                         </div>
                       ))}
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

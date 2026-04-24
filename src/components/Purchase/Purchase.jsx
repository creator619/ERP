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
  FileText
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Purchase.css';

const Purchase = ({ addToast }) => {
  const [selectedPO, setSelectedPO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  const [orders, setOrders] = useState([
    { id: 'PO/2024/001', supplier: 'Knorr-Bremse Vasúti Kft.', date: '2024-04-10', total: 4500000, status: 'Delivered', items: [
      { name: 'Féktárcsa szett (S-Line)', qty: 20, price: 150000 },
      { name: 'Szerelőkészlet', qty: 20, price: 75000 }
    ]},
    { id: 'PO/2024/002', supplier: 'Alu-Tech Hungary', date: '2024-04-12', total: 1200000, status: 'Pending', items: [
      { name: 'Alu-profil 12m', qty: 50, price: 24000 }
    ]},
    { id: 'PO/2024/003', supplier: 'GlassPro Zrt.', date: '2024-04-15', total: 850000, status: 'Pending', items: [
      { name: 'Edzett üveg válaszfal', qty: 10, price: 85000 }
    ]},
    { id: 'PO/2024/004', supplier: 'SteelWorks Kft.', date: '2024-03-20', total: 12450000, status: 'Late', items: [
      { name: 'Vázszerkezet acél', qty: 5, price: 2490000 }
    ]},
    { id: 'PO/2024/005', supplier: 'Electro-Soft Zrt.', date: '2024-04-18', total: 320000, status: 'Draft', items: [
      { name: 'Vezérlő panel', qty: 2, price: 160000 }
    ]},
  ]);

  const openPODetails = (po) => {
    setSelectedPO(po);
    setIsModalOpen(true);
    setActiveTab('items');
  };

  const handleReceiveOrder = (id) => {
    setOrders(prev => prev.map(po => {
      if (po.id === id) {
        auditLogService.log({
          user: 'Beszerzési Vezető',
          action: 'Áru beérkeztetve',
          module: 'Purchase',
          details: `${po.id} - Beszállító: ${po.supplier}`,
          severity: 'success'
        });
        return { ...po, status: 'Delivered' };
      }
      return po;
    }));
    addToast('Áru beérkezése rögzítve', 'success');
    setIsModalOpen(false);
  };

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  const totalPending = orders.filter(o => o.status === 'Pending' || o.status === 'Late').reduce((sum, o) => sum + o.total, 0);
  const totalDelivered = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="purchase-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(230, 126, 34, 0.1)', color: '#e67e22', padding: '12px', borderRadius: '12px' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Beszerzés</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Alapanyag és szolgáltatás megrendelések</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új beszerzési igény', 'info')}>
          <Plus size={20} />
          Új Rendelés
        </button>
      </div>

      <div className="finance-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="finance-card glass" style={{ borderLeft: '4px solid #e67e22' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Függő rendelések</span>
            <Clock size={16} color="#e67e22" />
          </div>
          <div className="value" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>{formatHUF(totalPending)}</div>
        </div>
        <div className="finance-card glass" style={{ borderLeft: '4px solid #2ecc71' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Beérkezett (Havi)</span>
            <CheckCircle2 size={16} color="#2ecc71" />
          </div>
          <div className="value" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>{formatHUF(totalDelivered)}</div>
        </div>
        <div className="finance-card glass" style={{ borderLeft: '4px solid #e74c3c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Késedelmes szállítás</span>
            <AlertTriangle size={16} color="#e74c3c" />
          </div>
          <div className="value" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>{orders.filter(o => o.status === 'Late').length} db</div>
        </div>
      </div>

      <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rendelésszám</th>
              <th>Beszállító</th>
              <th>Dátum</th>
              <th style={{ textAlign: 'right' }}>Összeg</th>
              <th>Állapot</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(po => (
              <tr key={po.id} onClick={() => openPODetails(po)} style={{ cursor: 'pointer' }}>
                <td><strong style={{ color: 'var(--primary-color)' }}>{po.id}</strong></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={14} className="text-muted" />
                    {po.supplier}
                  </div>
                </td>
                <td>{po.date}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatHUF(po.total)}</td>
                <td>
                  <span className={`status-badge ${po.status === 'Delivered' ? 'active' : po.status === 'Late' ? 'danger' : 'warning'}`}>
                    {po.status === 'Delivered' ? 'Beérkezett' : po.status === 'Pending' ? 'Folyamatban' : po.status === 'Late' ? 'Késik' : 'Piszkozat'}
                  </span>
                </td>
                <td>
                  <button className="view-btn-small" onClick={(e) => { e.stopPropagation(); openPODetails(po); }}><FileText size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Beszerzési Adatlap: ${selectedPO?.id}`}
        width="800px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedPO?.status !== 'Delivered' && (
              <button className="create-btn" onClick={() => handleReceiveOrder(selectedPO.id)}>
                <Package size={18} /> Beérkezés rögzítése
              </button>
            )}
          </>
        }
      >
        {selectedPO && (
          <div className="po-details-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Rendelt Tételek</div>
              <div className={`settings-nav-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Beszállítói Adatok</div>
            </div>

            {activeTab === 'items' && (
              <div className="items-tab">
                <div style={{ background: 'var(--bg-main)', borderRadius: '15px', padding: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '10px', fontSize: '0.85rem' }} className="text-muted">Tétel</th>
                        <th style={{ padding: '10px', fontSize: '0.85rem' }} className="text-muted">Mennyiség</th>
                        <th style={{ padding: '10px', fontSize: '0.85rem', textAlign: 'right' }} className="text-muted">Egységár</th>
                        <th style={{ padding: '10px', fontSize: '0.85rem', textAlign: 'right' }} className="text-muted">Összesen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '15px 10px', fontWeight: 600 }}>{item.name}</td>
                          <td style={{ padding: '15px 10px' }}>{item.qty} db</td>
                          <td style={{ padding: '15px 10px', textAlign: 'right' }}>{formatHUF(item.price)}</td>
                          <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: 700 }}>{formatHUF(item.qty * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border-color)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p className="text-muted" style={{ fontSize: '0.85rem' }}>Mindösszesen (Bruttó):</p>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-color)' }}>{formatHUF(selectedPO.total)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="info-tab">
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ width: '50px', height: '50px', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedPO.supplier}</h3>
                      <p className="text-muted" style={{ fontSize: '0.85rem' }}>Minősített Beszállító (A+)</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>Fizetési feltétel</p>
                      <p style={{ fontWeight: 600 }}>Átutalás (30 nap)</p>
                    </div>
                    <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>Utolsó rendelés</p>
                      <p style={{ fontWeight: 600 }}>{selectedPO.date}</p>
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

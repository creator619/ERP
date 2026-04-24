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
  Building
} from 'lucide-react';
import Modal from '../UI/Modal';

const Purchase = ({ addToast }) => {
  const [selectedPO, setSelectedPO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orders = [
    { id: 'PO/2024/001', supplier: 'Knorr-Bremse Vasúti Kft.', date: '2024-04-10', total: '4,500,000 Ft', status: 'Delivered' },
    { id: 'PO/2024/002', supplier: 'Alu-Tech Hungary', date: '2024-04-12', total: '1,200,000 Ft', status: 'Pending' },
    { id: 'PO/2024/003', supplier: 'GlassPro Zrt.', date: '2024-04-15', total: '850,000 Ft', status: 'Pending' },
    { id: 'PO/2024/004', supplier: 'SteelWorks Kft.', date: '2024-03-20', total: '12,450,000 Ft', status: 'Late' },
    { id: 'PO/2024/005', supplier: 'Electro-Soft Zrt.', date: '2024-04-18', total: '320,000 Ft', status: 'Draft' },
  ];

  const openPODetails = (po) => {
    setSelectedPO(po);
    setIsModalOpen(true);
  };

  return (
    <div className="purchase-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Beszerzési Rendelések</h2>
        <button className="create-btn" onClick={() => addToast('Új beszerzés', 'info')}>
          <Plus size={20} />
          Új Megrendelés
        </button>
      </div>

      <div className="finance-summary" style={{ marginBottom: '30px' }}>
        <div className="finance-card glass" style={{ borderLeftColor: '#714B67' }}>
          <h5>Függőben lévő érték</h5>
          <div className="value">14,500,000 Ft</div>
        </div>
        <div className="finance-card glass" style={{ borderLeftColor: '#28a745' }}>
          <h5>Teljesített (Havi)</h5>
          <div className="value">28,200,000 Ft</div>
        </div>
        <div className="finance-card glass" style={{ borderLeftColor: '#dc3545' }}>
          <h5>Késedelmes szállítás</h5>
          <div className="value">1 db</div>
        </div>
      </div>

      <div className="list-view">
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
                <td><strong>{po.id}</strong></td>
                <td>{po.supplier}</td>
                <td>{po.date}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{po.total}</td>
                <td>
                  <span className={`status-badge ${po.status.toLowerCase()}`}>
                    {po.status === 'Delivered' ? 'Teljesítve' : po.status === 'Pending' ? 'Várakozás' : po.status === 'Late' ? 'Késésben' : 'Piszkozat'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="text-muted" onClick={(e) => e.stopPropagation()}><ArrowDownToLine size={16} /></button>
                    <button className="text-muted" onClick={(e) => e.stopPropagation()}><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Beszerzési rendelés részletei"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Sikeresen rögzítve', 'success')}>Beérkezés igazolása</button>
          </>
        }
      >
        {selectedPO && (
          <div className="po-details">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{selectedPO.supplier}</h2>
                <p className="text-muted">Rendelésszám: {selectedPO.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`status-badge ${selectedPO.status.toLowerCase()}`} style={{ marginBottom: '10px', display: 'inline-block' }}>
                  {selectedPO.status}
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedPO.total}</p>
              </div>
            </div>

            <div style={{ padding: '20px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>Rendelt tételek</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Alumínium profilok (12m)</span>
                <strong>50 db</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Rögzítő csavarok (M8)</span>
                <strong>1000 db</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                <strong>Összesen</strong>
                <strong>{selectedPO.total}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#ffc107' }}>
              <Truck size={16} />
              <span>Várható szállítás: 2 napon belül</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Purchase;

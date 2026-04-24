import React, { useState } from 'react';
import { 
  Settings, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Plus,
  Layers,
  Wrench,
  Activity,
  User,
  Calendar
} from 'lucide-react';
import Modal from '../UI/Modal';
import './Manufacturing.css';

const Manufacturing = ({ addToast }) => {
  const [selectedWO, setSelectedWO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openWODetails = (wo) => {
    setSelectedWO(wo);
    setIsModalOpen(true);
  };

  const workOrders = [
    { id: 'RW/MO/001', product: 'Automata tolóajtó', quantity: 5, progress: 40, status: 'In Progress', deadline: '2024-04-28', priority: 'High', technician: 'Nagy Péter' },
    { id: 'RW/MO/002', product: 'Hőszigetelt ablak', quantity: 24, progress: 100, status: 'Completed', deadline: '2024-04-22', priority: 'Medium', technician: 'Kovács János' },
    { id: 'RW/MO/003', product: 'Poggyásztartó modul', quantity: 12, progress: 75, status: 'In Progress', deadline: '2024-05-02', priority: 'Medium', technician: 'Szabó Anna' },
    { id: 'RW/MO/004', product: 'Tűzgátló válaszfal', quantity: 10, progress: 0, status: 'Draft', deadline: '2024-05-05', priority: 'Low', technician: 'Tóth Gábor' },
  ];

  return (
    <div className="manufacturing-module">
      <div className="sales-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Gyártási Munkarendelések</h2>
        <button className="create-btn">
          <Plus size={20} />
          Új Gyártás
        </button>
      </div>

      <div className="manufacturing-summary">
        <div className="stage-card glass">
          <h5>Aktív gyártás</h5>
          <div className="stage-value">12</div>
        </div>
        <div className="stage-card glass">
          <h5>Várakozó</h5>
          <div className="stage-value">5</div>
        </div>
        <div className="stage-card glass">
          <h5>Késésben</h5>
          <div className="stage-value" style={{ color: '#dc3545' }}>2</div>
        </div>
      </div>

      <div className="work-order-grid">
        {workOrders.map(wo => (
          <div key={wo.id} className="wo-card glass" onClick={() => openWODetails(wo)} style={{ cursor: 'pointer' }}>
            <div className="wo-header">
              <span className="wo-id">{wo.id}</span>
              <span className={`status-pill ${wo.status.toLowerCase().replace(' ', '-')}`}>
                {wo.status === 'In Progress' ? 'Folyamatban' : wo.status === 'Completed' ? 'Kész' : 'Tervezett'}
              </span>
            </div>
            <div className="wo-body">
              <h4 style={{ marginBottom: '4px' }}>{wo.product}</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Mennyiség: {wo.quantity} db</p>
            </div>
            <div className="wo-progress-wrapper">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Haladás</span>
                <span>{wo.progress}%</span>
              </div>
              <div className="wo-progress">
                <div className="progress-bar" style={{ width: `${wo.progress}%` }}></div>
              </div>
            </div>
            <div className="wo-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                Határidő: {wo.deadline}
              </div>
              <button className="view-btn" style={{ padding: '4px 8px' }} onClick={(e) => { e.stopPropagation(); openWODetails(wo); }}>
                <Wrench size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Work Order Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Munkarendelés részletei"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => { addToast('Munkarendelés indítva', 'success'); setIsModalOpen(false); }}>Munkavégzés indítása</button>
          </>
        }
      >
        {selectedWO && (
          <div className="wo-details">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{selectedWO.product}</h2>
                <p className="text-muted">Azonosító: {selectedWO.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`status-pill ${selectedWO.status.toLowerCase().replace(' ', '-')}`} style={{ marginBottom: '5px' }}>
                  {selectedWO.status}
                </div>
                <p style={{ fontSize: '0.85rem' }}>Prioritás: <strong style={{ color: selectedWO.priority === 'High' ? '#dc3545' : 'inherit' }}>{selectedWO.priority}</strong></p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <User size={16} /> Felelős technikus
                </label>
                <p style={{ fontWeight: 500 }}>{selectedWO.technician}</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Calendar size={16} /> Várható befejezés
                </label>
                <p style={{ fontWeight: 500 }}>{selectedWO.deadline}</p>
              </div>
            </div>

            <div className="production-stages" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '5px' }}>Gyártási fázisok</h4>
              <div className="stage-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <CheckCircle2 size={18} color="#28a745" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Alapanyag előkészítés</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Befejezve: 2024-04-21</p>
                </div>
              </div>
              <div className="stage-item" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Activity size={18} color="var(--primary-color)" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Összeszerelés (Phase 1)</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Folyamatban...</p>
                </div>
              </div>
              <div className="stage-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', opacity: 0.5 }}>
                <Clock size={18} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Minőségellenőrzés</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Várakozás...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Manufacturing;

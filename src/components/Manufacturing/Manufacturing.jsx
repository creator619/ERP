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
  Calendar,
  Package,
  ArrowRight
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Manufacturing.css';

const Manufacturing = ({ addToast }) => {
  const [workOrders, setWorkOrders] = useState([
    { 
      id: 'RW/MO/001', 
      product: 'Automata tolóajtó', 
      quantity: 5, 
      progress: 40, 
      status: 'In Progress', 
      deadline: '2024-04-28', 
      priority: 'High', 
      technician: 'Nagy Péter',
      workCenter: 'MC-101 (Profilvágó)',
      bom: [
        { item: 'Alumínium profil (2m)', required: 20, available: 150, status: 'ok' },
        { item: 'Ajtómotor (DC-42)', required: 5, available: 12, status: 'ok' },
        { item: 'Vezérlő panel', required: 5, available: 3, status: 'missing' }
      ]
    },
    { 
      id: 'RW/MO/002', 
      product: 'Hőszigetelt ablak', 
      quantity: 24, 
      progress: 100, 
      status: 'Completed', 
      deadline: '2024-04-22', 
      priority: 'Medium', 
      technician: 'Kovács János',
      workCenter: 'MC-103 (Festőkabin)',
      bom: [
        { item: 'Edzett üveg (4mm)', required: 48, available: 200, status: 'ok' },
        { item: 'PVC keret profil', required: 96, available: 500, status: 'ok' }
      ]
    },
    { 
      id: 'RW/MO/003', 
      product: 'Poggyásztartó modul', 
      quantity: 12, 
      progress: 75, 
      status: 'In Progress', 
      deadline: '2024-05-02', 
      priority: 'Medium', 
      technician: 'Szabó Anna',
      workCenter: 'MC-102 (Hidraulikus Prés)',
      bom: [
        { item: 'Acél lemez (1.5mm)', required: 12, available: 50, status: 'ok' },
        { item: 'Rögzítő csavar szett', required: 144, available: 1000, status: 'ok' }
      ]
    },
    { 
      id: 'RW/MO/004', 
      product: 'Tűzgátló válaszfal', 
      quantity: 10, 
      progress: 0, 
      status: 'Draft', 
      deadline: '2024-05-05', 
      priority: 'Low', 
      technician: 'Tóth Gábor',
      workCenter: 'Manuális Szerelősor',
      bom: [
        { item: 'Gipszkarton (Tűzgátló)', required: 20, available: 10, status: 'missing' }
      ]
    },
  ]);

  const [selectedWO, setSelectedWO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openWODetails = (wo) => {
    setSelectedWO(wo);
    setIsModalOpen(true);
  };

  const handleNextStage = (woId) => {
    const wo = workOrders.find(w => w.id === woId);
    let newProgress = Math.min(100, wo.progress + 25);
    let newStatus = newProgress === 100 ? 'Completed' : 'In Progress';
    
    setWorkOrders(prev => prev.map(w => 
      w.id === woId ? { ...w, progress: newProgress, status: newStatus } : w
    ));

    auditLogService.log({
      user: 'Gyártásvezető',
      action: 'Gyártási fázis kész',
      module: 'Manufacturing',
      details: `${wo.product} (${woId}) - Fázis kész, haladás: ${newProgress}%`,
      severity: newProgress === 100 ? 'success' : 'info'
    });

    addToast('Gyártási fázis kész', 'info', `Haladás: ${newProgress}%`);
    if (newProgress === 100) {
      addToast('Gyártás befejezve!', 'success');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="manufacturing-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '12px', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Gyártási Munkarendelések</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Munkalapok kezelése és gyártáskövetés</p>
          </div>
        </div>
        <button className="create-btn">
          <Plus size={20} />
          Új Gyártás
        </button>
      </div>

      <div className="manufacturing-summary">
        <div className="stage-card glass">
          <h5 className="text-muted">Aktív gyártás</h5>
          <div className="stage-value">12</div>
        </div>
        <div className="stage-card glass">
          <h5 className="text-muted">Várakozó</h5>
          <div className="stage-value">5</div>
        </div>
        <div className="stage-card glass">
          <h5 className="text-muted">Késésben</h5>
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
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Központ: {wo.workCenter}</p>
            </div>
            <div className="wo-progress-wrapper" style={{ margin: '15px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Haladás</span>
                <span>{wo.progress}%</span>
              </div>
              <div className="wo-progress">
                <div className="progress-bar" style={{ width: `${wo.progress}%` }}></div>
              </div>
            </div>
            <div className="wo-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <Clock size={14} />
                {wo.deadline}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: wo.priority === 'High' ? '#dc3545' : 'inherit' }}>
                {wo.priority}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Munkarendelés: ${selectedWO?.id}`}
        width="800px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedWO?.status !== 'Completed' && (
              <button className="create-btn" onClick={() => handleNextStage(selectedWO.id)}>
                Következő fázis <ArrowRight size={18} />
              </button>
            )}
          </>
        }
      >
        {selectedWO && (
          <div className="wo-details">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', padding: '15px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{selectedWO.product}</h3>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Felelős: {selectedWO.technician}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Munkaközpont</p>
                <div style={{ fontWeight: 600 }}>{selectedWO.workCenter}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
              <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} color="var(--primary-color)" /> BOM - Anyagjegyzék
                </h4>
                <div className="bom-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedWO.bom.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <span>{item.item}</span>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span className="text-muted">{item.required} db</span>
                        <span style={{ color: item.status === 'ok' ? '#28a745' : '#dc3545', fontWeight: 600 }}>
                          {item.status === 'ok' ? 'Készleten' : 'HIÁNY!'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="var(--primary-color)" /> Gyártási fázisok
                </h4>
                <div className="production-stages" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className={`stage-item-new ${selectedWO.progress >= 25 ? 'done' : 'active'}`}>
                    <div className="stage-dot"></div>
                    <span>Alapanyag előkészítés</span>
                  </div>
                  <div className={`stage-item-new ${selectedWO.progress >= 50 ? 'done' : selectedWO.progress >= 25 ? 'active' : ''}`}>
                    <div className="stage-dot"></div>
                    <span>Szerkezetépítés</span>
                  </div>
                  <div className={`stage-item-new ${selectedWO.progress >= 75 ? 'done' : selectedWO.progress >= 50 ? 'active' : ''}`}>
                    <div className="stage-dot"></div>
                    <span>Finishelés / Festés</span>
                  </div>
                  <div className={`stage-item-new ${selectedWO.progress >= 100 ? 'done' : selectedWO.progress >= 75 ? 'active' : ''}`}>
                    <div className="stage-dot"></div>
                    <span>Minőségellenőrzés</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '15px', background: 'rgba(52, 152, 219, 0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={20} color="var(--primary-color)" />
              <p style={{ fontSize: '0.85rem' }}>Jelenlegi fázis: <strong>{selectedWO.progress === 0 ? 'Indításra vár' : selectedWO.progress === 100 ? 'Befejezve' : 'Munka folyamatban'}</strong></p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Manufacturing;

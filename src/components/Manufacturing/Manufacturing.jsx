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
  ArrowRight,
  TrendingUp,
  BarChart2
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
      currentStage: 1,
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
      currentStage: 4,
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
      currentStage: 3,
      status: 'In Progress', 
      deadline: '2024-05-02', 
      priority: 'Medium', 
      technician: 'Szabó Anna',
      workCenter: 'MC-102 (Hidraulikus Prés)',
      bom: [
        { item: 'Acél lemez (1.5mm)', required: 12, available: 50, status: 'ok' },
        { item: 'Rögzítő csavar szett', required: 144, available: 1000, status: 'ok' }
      ]
    }
  ]);

  const [selectedWO, setSelectedWO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stages');

  const stages = [
    { name: 'Anyag előkészítés', icon: <Package size={16} /> },
    { name: 'Szerkezeti lakatosmunkák', icon: <Wrench size={16} /> },
    { name: 'Összeszerelés & Kábelezés', icon: <Layers size={16} /> },
    { name: 'Minőségellenőrzés (QA)', icon: <CheckCircle2 size={16} /> }
  ];

  const openWODetails = (wo) => {
    setSelectedWO(wo);
    setIsModalOpen(true);
    setActiveTab('stages');
  };

  const handleNextStage = (woId) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === woId) {
        const nextStage = Math.min(wo.currentStage + 1, stages.length);
        const nextProgress = (nextStage / stages.length) * 100;
        const nextStatus = nextProgress === 100 ? 'Completed' : 'In Progress';
        
        auditLogService.log({
          user: 'Gyártásvezető',
          action: 'Fázisváltás',
          module: 'Manufacturing',
          details: `${wo.product} (${woId}) -> ${stages[nextStage - 1].name} kész.`,
          severity: nextProgress === 100 ? 'success' : 'info'
        });

        return { ...wo, currentStage: nextStage, progress: nextProgress, status: nextStatus };
      }
      return wo;
    }));
    addToast('Gyártási fázis frissítve', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="manufacturing-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '12px', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Gyártási Folyamatok (MES)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Munkalapok és anyagszükséglet-tervezés</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új gyártási terv', 'info')}>
          <Plus size={20} /> Új Munkalap
        </button>
      </div>

      <div className="manufacturing-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Aktív Gyártás</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{workOrders.filter(w => w.status === 'In Progress').length} db</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Gépkihasználtság</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2ecc71' }}>92.4%</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Alapanyaghiány</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e74c3c' }}>1 tétel</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Heti Teljesítés</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>142 egység</div>
        </div>
      </div>

      <div className="work-order-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {workOrders.map(wo => (
          <div key={wo.id} className="wo-card glass" onClick={() => openWODetails(wo)} style={{ padding: '20px', borderRadius: '15px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)' }}>{wo.id}</span>
              <span className={`status-badge ${wo.status === 'Completed' ? 'active' : 'warning'}`}>
                {wo.status === 'Completed' ? 'Kész' : 'Gyártás alatt'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '5px' }}>{wo.product}</h4>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '15px' }}>{wo.workCenter}</p>
            
            <div className="progress-container" style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                <span>Haladás</span>
                <span>{wo.progress}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${wo.progress}%`, height: '100%', background: 'var(--primary-color)', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} className="text-muted" /> {wo.technician}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} className="text-muted" /> {wo.deadline}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Munkalap: ${selectedWO?.id}`}
        width="850px"
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
          <div className="manufacturing-details">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'stages' ? 'active' : ''}`} onClick={() => setActiveTab('stages')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Folyamat</div>
              <div className={`settings-nav-item ${activeTab === 'bom' ? 'active' : ''}`} onClick={() => setActiveTab('bom')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Anyagjegyzék (BOM)</div>
            </div>

            {activeTab === 'stages' && (
              <div className="stages-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {stages.map((stage, index) => (
                  <div key={index} className={`glass ${selectedWO.currentStage > index ? 'done-stage' : selectedWO.currentStage === index + 1 ? 'active-stage' : ''}`} style={{ 
                    padding: '15px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px',
                    opacity: selectedWO.currentStage > index + 1 ? 0.6 : 1,
                    borderLeft: selectedWO.currentStage === index + 1 ? '4px solid var(--primary-color)' : '1px solid var(--border-color)'
                  }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: selectedWO.currentStage > index ? '#2ecc71' : selectedWO.currentStage === index + 1 ? 'var(--primary-color)' : 'var(--bg-main)',
                      color: selectedWO.currentStage > index || selectedWO.currentStage === index + 1 ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selectedWO.currentStage > index ? <CheckCircle2 size={18} /> : stage.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{stage.name}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>{selectedWO.currentStage === index + 1 ? 'Munka folyamatban...' : selectedWO.currentStage > index ? 'Befejezve' : 'Várakozik'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bom' && (
              <div className="bom-view">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tétel</th>
                      <th>Szükséges</th>
                      <th>Raktáron</th>
                      <th>Státusz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWO.bom.map((item, i) => (
                      <tr key={i}>
                        <td>{item.item}</td>
                        <td style={{ fontWeight: 700 }}>{item.required} db</td>
                        <td className="text-muted">{item.available} db</td>
                        <td>
                          <span className={`status-badge ${item.status === 'ok' ? 'active' : 'danger'}`}>
                            {item.status === 'ok' ? 'Rendelkezésre áll' : 'Hiány!'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Manufacturing;

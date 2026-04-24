import React, { useState } from 'react';
import { 
  Wrench, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Calendar, 
  Activity,
  Zap,
  RotateCcw,
  History,
  FileText
} from 'lucide-react';
import Modal from '../UI/Modal';

const Maintenance = ({ addToast }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const machines = [
    { id: 'MC-101', name: 'Alumínium Profilvágó CNC', status: 'Healthy', health: 95, lastService: '2024-03-15', nextService: '2024-06-15', type: 'Gyártó gép' },
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, lastService: '2024-02-10', nextService: '2024-04-30', type: 'Présgép', issue: 'Olajszivárgás a főhengerben.' },
    { id: 'MC-103', name: 'Festőkabin Szellőztető', status: 'Healthy', health: 88, lastService: '2024-04-01', nextService: '2024-07-01', type: 'Kiszolgáló' },
    { id: 'MC-104', name: 'Hegesztő Robot (KUKA)', status: 'Maintenance', health: 10, lastService: '2024-01-20', nextService: '2024-04-23', type: 'Robot' },
  ];

  const openMachineDetails = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  const getStatusClass = (status) => status.toLowerCase();

  return (
    <div className="maintenance-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Karbantartás és Eszközök</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Műszaki napló letöltése', 'info')}>
            <FileText size={18} />
            Eszközlista
          </button>
          <button className="create-btn" onClick={() => addToast('Új munkalap', 'success')}>
            <Plus size={20} />
            Új Munkalap
          </button>
        </div>
      </div>

      <div className="kanban-grid">
        {machines.map(m => (
          <div key={m.id} className="kanban-card glass" onClick={() => openMachineDetails(m)}>
            <div className="wo-header">
              <span className="wo-id">{m.id}</span>
              <span className={`status-pill ${getStatusClass(m.status)}`}>
                {m.status === 'Healthy' ? 'Üzemkész' : m.status === 'Warning' ? 'Figyelem' : 'Szerviz alatt'}
              </span>
            </div>
            <div className="wo-body" style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{m.name}</h4>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: m.health > 80 ? '#28a745' : m.health > 50 ? '#ffc107' : '#dc3545' }}>{m.health}%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ÁLLAPOT</div>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Típus: {m.type}</p>
            </div>
            <div className="wo-footer" style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.8rem' }}>
                <Clock size={14} inline /> Köv. szerviz: {m.nextService}
              </div>
              <Activity size={16} className={m.status === 'Healthy' ? 'text-success' : 'text-warning'} />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Gép adatlap: ${selectedMachine?.name}`}
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Karbantartás ütemezve', 'success')}>Szerviz ütemezése</button>
          </>
        }
      >
        {selectedMachine && (
          <div className="machine-detail-view">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="stat-card glass" style={{ textAlign: 'center', padding: '15px' }}>
                <Zap size={24} color="#ffc107" style={{ marginBottom: '5px' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Üzemidő</div>
                <div style={{ fontWeight: 700 }}>4,250 óra</div>
              </div>
              <div className="stat-card glass" style={{ textAlign: 'center', padding: '15px' }}>
                <RotateCcw size={24} color="var(--primary-color)" style={{ marginBottom: '5px' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ciklusok</div>
                <div style={{ fontWeight: 700 }}>128,400</div>
              </div>
              <div className="stat-card glass" style={{ textAlign: 'center', padding: '15px' }}>
                <AlertTriangle size={24} color="#dc3545" style={{ marginBottom: '5px' }} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hibák (Havi)</div>
                <div style={{ fontWeight: 700 }}>2 db</div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Karbantartási előzmények</h4>
            <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '15px', padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(40, 167, 69, 0.1)', color: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Megelőző karbantartás (PM)</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Elvégezve: 2024. Március 15. • Technikus: Szabó Imre</p>
                </div>
                <button className="text-muted"><FileText size={18} /></button>
              </div>
              <div style={{ display: 'flex', gap: '15px', padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Eseti javítás - Főorsó csere</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Elvégezve: 2023. December 02. • Technikus: Kovács János</p>
                </div>
                <button className="text-muted"><FileText size={18} /></button>
              </div>
            </div>

            {selectedMachine.status === 'Warning' && (
              <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(255, 193, 7, 0.1)', borderLeft: '4px solid #ffc107', borderRadius: '4px' }}>
                <h4 style={{ color: '#856404', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} /> Aktív figyelmeztetés
                </h4>
                <p style={{ fontSize: '0.9rem' }}>{selectedMachine.issue}</p>
                <button className="create-btn" style={{ marginTop: '10px', fontSize: '0.8rem', background: '#ffc107', color: '#333' }}>Javítás azonnali ütemezése</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Maintenance;

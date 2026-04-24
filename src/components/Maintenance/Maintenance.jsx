import React, { useState, useEffect, useMemo } from 'react';
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
  FileText,
  Thermometer,
  Gauge,
  LifeBuoy
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Maintenance.css';

const Maintenance = ({ addToast }) => {
  const [machines, setMachines] = useState([
    { id: 'MC-101', name: 'Alumínium Profilvágó CNC', status: 'Healthy', health: 95, lastService: '2024-03-15', nextService: '2024-06-15', type: 'Gyártó gép', telemetry: [85, 87, 86, 90, 92, 88, 85, 84, 86] },
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, lastService: '2024-02-10', nextService: '2024-04-30', type: 'Présgép', issue: 'Olajszivárgás a főhengerben.', telemetry: [60, 65, 70, 75, 80, 85, 70, 65, 62] },
    { id: 'MC-103', name: 'Festőkabin Szellőztető', status: 'Healthy', health: 88, lastService: '2024-04-01', nextService: '2024-07-01', type: 'Kiszolgáló', telemetry: [80, 82, 81, 85, 88, 87, 85, 84, 88] },
    { id: 'MC-104', name: 'Hegesztő Robot (KUKA)', status: 'Maintenance', health: 10, lastService: '2024-01-20', nextService: '2024-04-23', type: 'Robot', telemetry: [10, 12, 11, 10, 15, 12, 10, 11, 10] },
  ]);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulatedTemp, setSimulatedTemp] = useState(42);
  const [activeTab, setActiveTab] = useState('telemetry');

  // Simulated live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedTemp(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(30, Math.min(85, prev + change));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const openMachineDetails = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
    setActiveTab('telemetry');
  };

  const handleStartMaintenance = (id) => {
    setMachines(prev => prev.map(m => {
      if (m.id === id) {
        auditLogService.log({
          user: 'Karbantartó Mérnök',
          action: 'Szerviz megkezdve',
          module: 'Maintenance',
          details: `${m.name} (${m.id}) - Tervezett karbantartás`,
          severity: 'info'
        });
        return { ...m, status: 'Maintenance', health: 10 };
      }
      return m;
    }));
    addToast('Karbantartás megkezdve', 'info');
    setIsModalOpen(false);
  };

  const getStatusClass = (status) => status.toLowerCase();

  const TelemetryChart = ({ data, color = 'var(--primary-color)' }) => {
    const width = 400;
    const height = 100;
    const padding = 10;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((d / 100) * (height - 2 * padding) + padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - ((d / 100) * (height - 2 * padding) + padding);
          return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="2" />;
        })}
      </svg>
    );
  };

  return (
    <div className="maintenance-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Wrench size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Karbantartás (EAM)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Eszközéletciklus és prediktív szerviz</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új szerviz jegyzőkönyv', 'success')}>
          <Plus size={20} /> Új Munkalap
        </button>
      </div>

      <div className="maintenance-overview glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '20px', borderRadius: '15px', marginBottom: '25px' }}>
        <div className="stat-item" style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>OEE (Átlag)</p>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2ecc71' }}>82.4%</h4>
        </div>
        <div className="stat-item" style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>MTTR (Óra)</p>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 800 }}>4.2</h4>
        </div>
        <div className="stat-item" style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Aktív hibák</p>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e74c3c' }}>{machines.filter(m => m.status !== 'Healthy').length} db</h4>
        </div>
        <div className="stat-item" style={{ textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Szerviz esedékes</p>
          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1c40f' }}>2 db</h4>
        </div>
      </div>

      <div className="kanban-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {machines.map(m => (
          <div key={m.id} className={`kanban-card glass ${m.status === 'Warning' ? 'warning-border' : ''}`} onClick={() => openMachineDetails(m)} style={{ padding: '20px', borderRadius: '15px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>{m.id}</span>
              <span className={`status-badge ${m.status === 'Healthy' ? 'active' : m.status === 'Warning' ? 'warning' : 'danger'}`}>
                {m.status === 'Healthy' ? 'Online' : m.status === 'Warning' ? 'Figyelem' : 'Leállt'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{m.name}</h4>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${m.health}%`, height: '100%', background: m.health > 80 ? '#2ecc71' : m.health > 50 ? '#f1c40f' : '#e74c3c' }}></div>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{m.health}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} /> Köv: {m.nextService}
              </div>
              <Activity size={16} className={m.status === 'Healthy' ? 'text-success' : 'text-danger'} />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Eszköz Monitor: ${selectedMachine?.name}`}
        width="850px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedMachine?.status !== 'Maintenance' && (
              <button className="create-btn" onClick={() => handleStartMaintenance(selectedMachine.id)}>
                <Zap size={18} /> Szerviz Megkezdése
              </button>
            )}
          </>
        }
      >
        {selectedMachine && (
          <div className="machine-details-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'telemetry' ? 'active' : ''}`} onClick={() => setActiveTab('telemetry')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Telemetria</div>
              <div className={`settings-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Szerviznapló</div>
            </div>

            {activeTab === 'telemetry' && (
              <div className="telemetry-tab">
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                  <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase' }}>Élő Teljesítmény (Vibráció / Hő)</h4>
                    <TelemetryChart data={selectedMachine.telemetry} color={selectedMachine.health > 50 ? '#3498db' : '#e74c3c'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="glass" style={{ padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <Thermometer size={24} color="#f1c40f" />
                      <div>
                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Hőmérséklet</p>
                        <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{simulatedTemp.toFixed(1)} °C</p>
                      </div>
                    </div>
                    <div className="glass" style={{ padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <Zap size={24} color="#2ecc71" />
                      <div>
                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Áramfelvétel</p>
                        <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>14.2 A</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="history-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid #2ecc71' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 700 }}>Megelőző Karbantartás (PM)</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{selectedMachine.lastService}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>Szűrők cseréje és általános kenés elvégezve.</p>
                  </div>
                  <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid #f1c40f' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 700 }}>Ad-hoc javítás</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>2024-01-10</span>
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>Szenzor kalibráció szoftveres frissítéssel.</p>
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

export default Maintenance;

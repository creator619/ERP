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
  Gauge
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';

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
  };

  const handleReportIssue = (machineId) => {
    const machine = machines.find(m => m.id === machineId);
    setMachines(prev => prev.map(m => 
      m.id === machineId ? { ...m, status: 'Warning', health: Math.max(10, m.health - 20), issue: 'Felhasználó által jelentett rendellenes működés.' } : m
    ));
    
    auditLogService.log({
      user: 'Aktuális Felhasználó',
      action: 'Hiba bejelentve',
      module: 'Maintenance',
      details: `${machine.name} (${machineId}) - Rendellenes működés észlelve.`,
      severity: 'warning'
    });

    addToast('Hiba bejelentve', 'warning', 'A karbantartó csapat értesítve lett.');
    setIsModalOpen(false);
  };

  const handleScheduleService = (machineId) => {
    addToast('Szerviz ütemezve', 'success', 'A munkalap elkészült.');
    setIsModalOpen(false);
  };

  const getStatusClass = (status) => status.toLowerCase();

  // Simple SVG Line Chart component
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
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - ((d / 100) * (height - 2 * padding) + padding);
          return (
            <circle key={i} cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="maintenance-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: 'var(--primary-color)', padding: '12px', borderRadius: '12px' }}>
            <Wrench size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Karbantartás és Eszközök</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Eszközök állapota és szerviz ütemezés</p>
          </div>
        </div>
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
          <div key={m.id} className={`kanban-card glass ${m.status === 'Warning' ? 'warning-border' : ''}`} onClick={() => openMachineDetails(m)}>
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
              
              <div className="mini-chart" style={{ marginTop: '15px', height: '40px', opacity: 0.6 }}>
                <TelemetryChart data={m.telemetry} color={m.health > 80 ? '#28a745' : m.health > 50 ? '#ffc107' : '#dc3545'} />
              </div>
            </div>
            <div className="wo-footer" style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.8rem' }}>
                <Clock size={14} inline /> Köv: {m.nextService}
              </div>
              <div className={m.status === 'Healthy' ? 'pulse-success' : m.status === 'Warning' ? 'pulse-warning' : 'pulse-danger'}>
                <Activity size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Eszköz Monitor: ${selectedMachine?.name}`}
        width="800px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="view-btn" style={{ color: '#dc3545', borderColor: '#dc3545' }} onClick={() => handleReportIssue(selectedMachine.id)}>
              <AlertTriangle size={18} />
              Hiba Bejelentése
            </button>
            <button className="create-btn" onClick={() => handleScheduleService(selectedMachine.id)}>Szerviz ütemezése</button>
          </>
        }
      >
        {selectedMachine && (
          <div className="machine-detail-view">
            <div className="telemetry-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px', marginBottom: '30px' }}>
              <div className="telemetry-main glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>Élő Teljesítmény Görbe</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#28a745' }}>
                    <div className="pulse-success" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28a745' }}></div>
                    Live Data
                  </div>
                </div>
                <TelemetryChart data={selectedMachine.telemetry} color={selectedMachine.health > 50 ? 'var(--primary-color)' : '#dc3545'} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>08:00</span>
                  <span>10:00</span>
                  <span>12:00</span>
                  <span>Most</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="stat-card glass" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '10px', background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', borderRadius: '10px' }}>
                    <Thermometer size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hőmérséklet</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{simulatedTemp.toFixed(1)} °C</div>
                  </div>
                </div>
                <div className="stat-card glass" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '10px', background: 'rgba(52, 152, 219, 0.1)', color: 'var(--primary-color)', borderRadius: '10px' }}>
                    <Gauge size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hatékonyság</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{(selectedMachine.health * 0.98).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Karbantartási előzmények</h4>
                <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="history-item-compact">
                    <div className="history-icon-small success"><CheckCircle2 size={16} /></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>PM Felülvizsgálat</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>2024.03.15 • Szabó I.</p>
                    </div>
                  </div>
                  <div className="history-item-compact">
                    <div className="history-icon-small warning"><Wrench size={16} /></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>Főorsó kenés</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>2023.12.02 • Kovács J.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>Kritikus Alkatrészek</h4>
                <div className="spare-parts-list glass" style={{ padding: '10px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <span>H-42 Szelep készlet</span>
                    <span className="badge-stock">12 db</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <span>Ipari kenőanyag (5L)</span>
                    <span className="badge-stock warning">2 db</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.85rem' }}>
                    <span>CNC vágófej (Standard)</span>
                    <span className="badge-stock">5 db</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedMachine.status === 'Warning' && (
              <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(255, 193, 7, 0.1)', borderLeft: '4px solid #ffc107', borderRadius: '4px' }}>
                <h4 style={{ color: '#856404', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} /> Aktív figyelmeztetés
                </h4>
                <p style={{ fontSize: '0.9rem' }}>{selectedMachine.issue}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Maintenance;

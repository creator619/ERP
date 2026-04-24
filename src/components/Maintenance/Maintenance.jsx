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
  LifeBuoy,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  Monitor
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Maintenance.css';

const Maintenance = ({ addToast }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'kanban'
  const [machines, setMachines] = useState([
    { 
      id: 'MC-101', 
      name: 'Alumínium Profilvágó CNC', 
      status: 'Healthy', 
      health: 95, 
      lastService: '2024-03-15', 
      nextService: '2024-06-15', 
      type: 'Gyártó gép', 
      pdm: 42, // Days to failure
      downtimeCost: 15000, // HUF / hour
      telemetry: [85, 87, 86, 90, 92, 88, 85, 84, 86],
      parts: [
        { name: 'Vágótárcsa (T-200)', stock: 5, required: 1, status: 'ok' },
        { name: 'Hidraulika olaj (L-4)', stock: 20, required: 5, status: 'ok' }
      ]
    },
    { 
      id: 'MC-102', 
      name: 'Hidraulikus Prés', 
      status: 'Warning', 
      health: 62, 
      lastService: '2024-02-10', 
      nextService: '2024-04-30', 
      type: 'Présgép', 
      pdm: 8,
      downtimeCost: 25000,
      telemetry: [60, 65, 70, 75, 80, 85, 70, 65, 62],
      parts: [
        { name: 'Tömítőgyűrű készlet', stock: 2, required: 1, status: 'ok' },
        { name: 'Főhenger szelep', stock: 0, required: 1, status: 'missing' }
      ]
    },
    { 
      id: 'MC-103', 
      name: 'Festőkabin Szellőztető', 
      status: 'Healthy', 
      health: 88, 
      lastService: '2024-04-01', 
      nextService: '2024-07-01', 
      type: 'Kiszolgáló', 
      pdm: 65,
      downtimeCost: 8000,
      telemetry: [80, 82, 81, 85, 88, 87, 85, 84, 88],
      parts: [
        { name: 'HEPA Szűrő', stock: 12, required: 2, status: 'ok' }
      ]
    },
    { 
      id: 'MC-104', 
      name: 'Hegesztő Robot (KUKA)', 
      status: 'Maintenance', 
      health: 10, 
      lastService: '2024-01-20', 
      nextService: '2024-04-23', 
      type: 'Robot', 
      pdm: 0,
      downtimeCost: 45000,
      telemetry: [10, 12, 11, 10, 15, 12, 10, 11, 10],
      parts: [
        { name: 'Vezérlőkábel szett', stock: 1, required: 1, status: 'ok' }
      ]
    },
  ]);

  const [workOrders, setWorkOrders] = useState([
    { id: 'WO-001', machine: 'MC-102', task: 'Henger tömítés csere', priority: 'High', status: 'Backlog' },
    { id: 'WO-002', machine: 'MC-104', task: 'Vezérlő panel diagnosztika', priority: 'Critical', status: 'In Progress' },
    { id: 'WO-003', machine: 'MC-101', task: 'Éves megelőző szerviz', priority: 'Medium', status: 'Backlog' }
  ]);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulatedTemp, setSimulatedTemp] = useState(42);
  const [activeTab, setActiveTab] = useState('telemetry');
  const [downtimeTicker, setDowntimeTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedTemp(prev => Math.max(30, Math.min(85, prev + (Math.random() - 0.5) * 2)));
      setDowntimeTicker(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const openMachineDetails = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
    setActiveTab('telemetry');
  };

  const handleStartMaintenance = (id) => {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, status: 'Maintenance', health: 10 } : m));
    addToast('Karbantartási folyamat elindítva', 'info');
    setIsModalOpen(false);
  };

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
        {data.map((d, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * (width - 2 * padding) + padding} cy={height - ((d / 100) * (height - 2 * padding) + padding)} r="3" fill="white" stroke={color} strokeWidth="2" />
        ))}
      </svg>
    );
  };

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="maintenance-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Wrench size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Karbantartás & Eszközéletciklus</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>AI Prediktív Karbantartás és Valós idejű Monitorozás</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="view-controls glass" style={{ padding: '4px', borderRadius: '10px' }}>
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>Dashboard</button>
            <button className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>Szerviz Tábla</button>
          </div>
          <button className="create-btn" onClick={() => addToast('Új szerviz feladat', 'success')}>
            <Plus size={20} /> Új Munkalap
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <>
          <div className="maintenance-overview glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '25px', borderRadius: '20px', marginBottom: '25px' }}>
            <div className="stat-item" style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Rendelkezésre állás</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2ecc71' }}>94.2%</h4>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Prediktív Riasztás</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1c40f' }}>1 Aktív</h4>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Leállási Veszteség</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e74c3c' }}>{formatHUF(450000)}</h4>
            </div>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>MTBF (Óra)</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800 }}>842</h4>
            </div>
          </div>

          <div className="kanban-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {machines.map(m => (
              <div key={m.id} className={`kanban-card glass ${m.status === 'Warning' ? 'warning-border' : m.status === 'Maintenance' ? 'danger-border' : ''}`} onClick={() => openMachineDetails(m)} style={{ padding: '25px', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)' }}>{m.id}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {m.pdm < 15 && m.pdm > 0 && (
                      <span className="status-badge warning pulse" style={{ fontSize: '0.6rem' }}>AI ALERT: {m.pdm} NAP</span>
                    )}
                    <span className={`status-badge ${m.status === 'Healthy' ? 'active' : m.status === 'Warning' ? 'warning' : 'danger'}`}>
                      {m.status === 'Healthy' ? 'Online' : m.status === 'Warning' ? 'Figyelem' : 'Leállt'}
                    </span>
                  </div>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '5px' }}>{m.name}</h4>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '15px' }}>{m.type}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${m.health}%`, height: '100%', background: m.health > 80 ? '#2ecc71' : m.health > 50 ? '#f1c40f' : '#e74c3c', transition: 'width 1s ease' }}></div>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>{m.health}%</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '15px', fontSize: '0.75rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <TrendingUp size={14} className="text-muted" />
                      <span className="text-muted">PdM:</span>
                      <span style={{ fontWeight: 700, color: m.pdm < 15 ? '#f1c40f' : 'inherit' }}>{m.pdm} nap</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} className="text-muted" />
                      <span className="text-muted">Köv:</span>
                      <span style={{ fontWeight: 700 }}>{m.nextService}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="maintenance-kanban-view" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
           {['Backlog', 'In Progress', 'Waiting for Parts', 'Done'].map(column => (
              <div key={column} className="kanban-column glass" style={{ minWidth: '320px', flex: 1, padding: '20px', borderRadius: '20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>{column}</h3>
                    <span className="count-badge">{workOrders.filter(wo => wo.status === column).length}</span>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {workOrders.filter(wo => wo.status === column).map(wo => (
                       <div key={wo.id} className="glass" style={{ padding: '15px', borderRadius: '12px', borderLeft: `4px solid ${wo.priority === 'Critical' ? '#e74c3c' : wo.priority === 'High' ? '#f1c40f' : '#3498db'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-color)' }}>{wo.id}</span>
                             <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{wo.machine}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>{wo.task}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span className="status-badge" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>{wo.priority}</span>
                             <button className="view-btn-small"><ArrowRight size={14} /></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Eszköz Monitor: ${selectedMachine?.name}`}
        width="950px"
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
          <div className="machine-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'telemetry' ? 'active' : ''}`} onClick={() => setActiveTab('telemetry')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Telemetria & AI</div>
              <div className={`settings-nav-item ${activeTab === 'parts' ? 'active' : ''}`} onClick={() => setActiveTab('parts')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Alkatrészek</div>
              <div className={`settings-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Szerviznapló</div>
            </div>

            {activeTab === 'telemetry' && (
              <div className="telemetry-tab">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                           <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Élő Vibrációs Adatok</h4>
                           <Activity size={20} color="var(--primary-color)" />
                        </div>
                        <TelemetryChart data={selectedMachine.telemetry} color={selectedMachine.health > 50 ? '#3498db' : '#e74c3c'} />
                     </div>
                     
                     <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '15px' }}>AI Prediktív Elemzés</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                           <div className="pdm-circle" style={{ borderColor: selectedMachine.pdm < 15 ? '#f1c40f' : '#2ecc71' }}>
                              <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{selectedMachine.pdm}</span>
                              <span style={{ fontSize: '0.6rem' }}>NAP</span>
                           </div>
                           <div>
                              <p style={{ fontWeight: 700 }}>Várható élettartam</p>
                              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Az AI modell szerint {selectedMachine.pdm} nap múlva javasolt a főcsapágy cseréje.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {selectedMachine.status === 'Maintenance' && (
                       <div className="glass downtime-ticker" style={{ padding: '25px', borderRadius: '20px', border: '1px solid #e74c3c' }}>
                          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e74c3c', marginBottom: '15px' }}>LEÁLLÁSI VESZTESÉG</h4>
                          <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '5px' }}>{formatHUF(selectedMachine.downtimeCost * (downtimeTicker / 3600))}</div>
                          <p className="text-muted" style={{ fontSize: '0.7rem' }}>Költség: {formatHUF(selectedMachine.downtimeCost)} / óra</p>
                       </div>
                    )}
                    <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                          <Thermometer size={24} color="#f1c40f" />
                          <div>
                             <p className="text-muted" style={{ fontSize: '0.75rem' }}>Hőmérséklet</p>
                             <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{simulatedTemp.toFixed(1)} °C</p>
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <Zap size={24} color="#2ecc71" />
                          <div>
                             <p className="text-muted" style={{ fontSize: '0.75rem' }}>Energiafelvétel</p>
                             <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>{(12 + Math.random()).toFixed(1)} kW</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parts' && (
              <div className="parts-tab">
                 <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px' }}>Szükséges Alkatrészek (Raktárkészlet)</h4>
                 <div className="parts-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedMachine.parts.map((p, i) => (
                       <div key={i} className="glass" style={{ padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                             <Package size={20} className="text-muted" />
                             <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</p>
                                <p className="text-muted" style={{ fontSize: '0.7rem' }}>Igény: {p.required} db</p>
                             </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                             <span className={`status-badge ${p.status === 'ok' ? 'active' : 'danger'}`}>
                                {p.status === 'ok' ? `${p.stock} db készleten` : 'HIÁNY!'}
                             </span>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button className="view-btn-small" style={{ marginTop: '20px' }}>Alkatrész rendelése</button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="history-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="glass" style={{ padding: '15px', borderRadius: '12px', borderLeft: '4px solid #2ecc71' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 700 }}>Megelőző Karbantartás (PM)</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{selectedMachine.lastService}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>Főcsapágy kenése, szűrők cseréje és kalibráció elvégezve.</p>
                  </div>
                  <div className="glass" style={{ padding: '15px', borderRadius: '12px', borderLeft: '4px solid #f1c40f' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 700 }}>Szenzor diagnosztika</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>2024-01-10</span>
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>Hőmérséklet jeladó tisztítása és szoftveres újraindítás.</p>
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

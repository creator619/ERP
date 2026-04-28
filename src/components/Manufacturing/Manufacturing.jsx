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
import { useData } from '../../contexts/DataContext';
import { 
  useData 
} from '../../contexts/DataContext';
import auditLogService from '../../services/AuditLogService';
import './Manufacturing.css';

const Manufacturing = ({ addToast }) => {
  const { workOrders, setWorkOrders, products, advanceWorkOrderStage, getBomStatus } = useData();
  
  const [selectedWO, setSelectedWO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stages');
  const [activeKpiModal, setActiveKpiModal] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [isNewWOModalOpen, setIsNewWOModalOpen] = useState(false);
  const [newWOData, setNewWOData] = useState({
    product: '',
    quantity: 1,
    deadline: '',
    priority: 'Medium',
    technician: 'Kovács János'
  });

  const { workOrders, setWorkOrders, advanceWorkOrderStage, getBomStatus, machines: machineData, setMachines: setMachineData } = useData();

  const getShortages = () => {
    let missingItems = [];
    workOrders.filter(w => w.status === 'In Progress').forEach(wo => {
      const bomStatus = getBomStatus(wo);
      bomStatus.forEach(b => {
        if (b.status === 'missing') {
          missingItems.push({ 
            woId: wo.id, 
            product: wo.product, 
            item: b.item, 
            required: b.required, 
            available: b.available, 
            missingAmount: b.required - b.available 
          });
        }
      });
    });
    return missingItems;
  };
  const missingItemsList = getShortages();

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
    const completed = advanceWorkOrderStage(woId, stages.length);
    if (completed) {
      addToast('Gyártás Befejezve! Készletbe bevételezve', 'success');
      setTimeout(() => setIsModalOpen(false), 800);
    } else {
      addToast('Gyártási fázis frissítve', 'success');
    }
    
    // Frissítjük a Modalban is a selectedWO state-t!
    setSelectedWO(prev => {
      if (!prev || prev.id !== woId) return prev;
      const nextStage = Math.min(prev.currentStage + 1, stages.length);
      const nextProgress = (nextStage / stages.length) * 100;
      const nextStatus = nextProgress === 100 ? 'Completed' : 'In Progress';
      return { ...prev, currentStage: nextStage, progress: nextProgress, status: nextStatus };
    });
  };

  const [viewMode, setViewMode] = useState('orders'); // 'orders' or 'monitor'


  const OEEGauge = ({ value, color }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="oee-gauge">
        <svg width="120" height="120">
          <circle className="oee-circle oee-bg" cx="60" cy="60" r={radius} />
          <circle 
            className="oee-circle oee-progress" 
            cx="60" cy="60" r={radius} 
            style={{ strokeDasharray: circumference, strokeDashoffset: offset, stroke: color }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{value}%</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>OEE</div>
        </div>
      </div>
    );
  };

  const handleEmergencyStop = (machineId) => {
    setMachineData(prev => prev.map(m => m.id === machineId ? { ...m, status: 'Maintenance', health: 0 } : m));
    addToast(`${machineId} vészleállítása sikeres!`, 'danger');
    
    auditLogService.log({
      user: 'Rendszerüzenet (Biztonsági)',
      action: 'VÉSZLEÁLLÍTÁS AKTIVÁLVA',
      module: 'Manufacturing',
      details: `Gép azonosító: ${machineId}`,
      severity: 'danger'
    });
  };

  const openMachineParams = (machine) => {
    setSelectedMachine(machine);
    setIsMachineModalOpen(true);
  };

  const handleSaveNewWO = (e) => {
    e.preventDefault();
    if (!newWOData.product || !newWOData.deadline) {
      addToast('Kérjük töltsön ki minden mezőt!', 'warning');
      return;
    }

    const lastIdNum = parseInt(workOrders[workOrders.length - 1]?.id.split('/').pop() || '0');
    const newId = `RW/MO/${String(lastIdNum + 1).padStart(3, '0')}`;
    
    const selectedProd = products.find(p => p.name === newWOData.product);

    const woToAdd = {
      ...newWOData,
      id: newId,
      progress: 0,
      currentStage: 1,
      status: 'In Progress',
      workCenter: 'MC-101 (Előkészítés)',
      bom: selectedProd ? [
        { item: 'Alapanyag Bejegyzés', sku: selectedProd.sku, required: newWOData.quantity }
      ] : []
    };

    setWorkOrders([...workOrders, woToAdd]);
    setIsNewWOModalOpen(false);
    setNewWOData({
      product: '',
      quantity: 1,
      deadline: '',
      priority: 'Medium',
      technician: 'Kovács János'
    });

    auditLogService.log({
      user: 'Gyártástervező',
      action: 'Új Munkalap Létrehozva',
      module: 'Manufacturing',
      details: `${newId} - ${woToAdd.product} (${woToAdd.quantity} db)`,
      severity: 'success'
    });

    addToast(`Munkalap (${newId}) sikeresen létrehozva`, 'success');
  };

  return (
    <div className="manufacturing-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '12px', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Gyártásirányítás (MES)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Industry 4.0 - Valós idejű gépmonitorozás és MES</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="view-mode-toggle glass" style={{ padding: '4px', borderRadius: '10px', display: 'flex' }}>
            <button 
              className={`view-btn-small ${viewMode === 'orders' ? 'active' : ''}`} 
              onClick={() => setViewMode('orders')}
              style={{ background: viewMode === 'orders' ? 'var(--primary-color)' : 'transparent', color: 'white' }}
            >
              Munkalapok
            </button>
            <button 
              className={`view-btn-small ${viewMode === 'monitor' ? 'active' : ''}`} 
              onClick={() => setViewMode('monitor')}
              style={{ background: viewMode === 'monitor' ? 'var(--primary-color)' : 'transparent', color: 'white' }}
            >
              Élő Monitor
            </button>
          </div>
          <button className="create-btn" onClick={() => setIsNewWOModalOpen(true)}>
            <Plus size={20} /> Új Munkalap
          </button>
        </div>
      </div>

      {viewMode === 'orders' ? (
        <>
          <div className="manufacturing-summary-grid responsive-grid" style={{ marginBottom: '25px' }}>
            <div className="stat-card glass hover-lift" onClick={() => setActiveKpiModal('active_orders')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Aktív Gyártás</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{workOrders.filter(w => w.status === 'In Progress').length} db</div>
            </div>
            <div className="stat-card glass hover-lift" onClick={() => setActiveKpiModal('oee')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Átlagos OEE</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2ecc71' }}>86.5%</div>
            </div>
            <div className="stat-card glass hover-lift" onClick={() => setActiveKpiModal('shortages')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Alapanyaghiány</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: missingItemsList.length > 0 ? '#e74c3c' : '#2ecc71' }}>
                {missingItemsList.length} tétel
              </div>
            </div>
            <div className="stat-card glass hover-lift" onClick={() => setActiveKpiModal('weekly')} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Heti Teljesítés</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{workOrders.filter(w => w.status === 'Completed').reduce((acc, curr) => acc + curr.quantity, 0)} egység</div>
            </div>
          </div>

          <div className="work-order-grid responsive-grid">
            {workOrders.map(wo => (
              <div key={wo.id} className="wo-card glass" onClick={() => openWODetails(wo)} style={{ padding: '20px', borderRadius: '15px', position: 'relative', cursor: 'pointer' }}>
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
        </>
      ) : (
        <div className="machine-monitor-view">
          <div className="machine-grid responsive-grid">
            {machineData.map(m => (
              <div key={m.id} className={`machine-card glass ${m.status}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{m.name}</h4>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>S/N: {m.id}</span>
                  </div>
                  <span className={`status-badge ${m.status === 'Healthy' ? 'active' : m.status === 'Maintenance' ? 'danger' : 'warning'}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    <span className="pulse-indicator"></span>
                    {m.status === 'Healthy' ? 'Üzemel' : m.status === 'Maintenance' ? 'Szerviz' : 'Készenlét'}
                  </span>
                </div>

                <OEEGauge value={m.oee} color={m.status === 'running' ? '#2ecc71' : m.status === 'down' ? '#e74c3c' : '#f1c40f'} />

                <div className="telemetry-grid" style={{ marginTop: '25px' }}>
                  <div className="telemetry-item">
                    <span className="text-muted">Rendelkezésre állás</span>
                    <span style={{ fontWeight: 700 }}>{m.availability}%</span>
                  </div>
                  <div className="telemetry-item">
                    <span className="text-muted">Teljesítmény</span>
                    <span style={{ fontWeight: 700 }}>{m.performance}%</span>
                  </div>
                  <div className="telemetry-item">
                    <span className="text-muted">Minőség</span>
                    <span style={{ fontWeight: 700 }}>{m.quality}%</span>
                  </div>
                  <div className="telemetry-item">
                    <span className="text-muted">Hőmérséklet / Terhelés</span>
                    <span style={{ fontWeight: 700, color: m.load > 80 ? '#e74c3c' : 'inherit' }}>{m.temp} / {m.load}%</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button className="view-btn-small" style={{ width: '100%' }} onClick={() => openMachineParams(m)}>Paraméterek</button>
                  <button 
                    className="view-btn-small" 
                    style={{ width: '100%', borderColor: '#e74c3c', color: '#e74c3c' }}
                    onClick={() => handleEmergencyStop(m.id)}
                    disabled={m.status === 'Maintenance'}
                  >
                    Vészleállás
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Aktuális Gyártási Sor</h3>
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
              {['Vágás', 'Hajlítás', 'Hegesztés', 'Festés', 'Összeszerelés', 'Ellenőrzés'].map((step, i) => (
                <div key={i} className="glass" style={{ padding: '15px 30px', borderRadius: '15px', flexShrink: 0, textAlign: 'center', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Step 0{i+1}</div>
                  <div style={{ fontWeight: 800 }}>{step}</div>
                  <div className="pulse-success" style={{ margin: '10px auto 0' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                    {getBomStatus(selectedWO).map((item, i) => (
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

      <Modal
        isOpen={!!activeKpiModal}
        onClose={() => setActiveKpiModal(null)}
        title={
          activeKpiModal === 'active_orders' ? 'Aktív Gyártási Listázás' :
          activeKpiModal === 'oee' ? 'Eszközhatékonyság (OEE) Részletező' :
          activeKpiModal === 'shortages' ? 'Kritikus Anyaghiányok' :
          'Heti Teljesítmény Riport'
        }
        width="800px"
        footer={<button className="view-btn" onClick={() => setActiveKpiModal(null)}>Bezárás</button>}
      >
        <div className="kpi-detail-view" style={{ padding: '10px 0' }}>
          {activeKpiModal === 'active_orders' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Munkalap</th>
                  <th>Termék</th>
                  <th>Fázis</th>
                  <th>Haladás</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.filter(w => w.status === 'In Progress').map(wo => (
                  <tr key={wo.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{wo.id}</td>
                    <td>{wo.product}</td>
                    <td>{stages[wo.currentStage - 1]?.name || 'Folyamatban'}</td>
                    <td>
                      <div className="progress-container" style={{ width: '100px' }}>
                        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${wo.progress}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeKpiModal === 'oee' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Gép</th>
                  <th>Státusz</th>
                  <th>OEE</th>
                  <th>Minőség</th>
                </tr>
              </thead>
              <tbody>
                {machineData.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 700 }}>{m.name}</td>
                    <td>
                      <span className={`status-badge ${m.status === 'running' ? 'active' : m.status === 'down' ? 'danger' : 'warning'}`}>
                        {m.status === 'running' ? 'Üzemel' : m.status === 'down' ? 'Leállás' : 'Készenlét'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: m.oee > 80 ? '#2ecc71' : '#e74c3c' }}>{m.oee}%</td>
                    <td>{m.quality}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeKpiModal === 'shortages' && (
            missingItemsList.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Érintett Gyártás</th>
                    <th>Részegység / Szükséglet</th>
                    <th>Hiány (Raktár)</th>
                  </tr>
                </thead>
                <tbody>
                  {missingItemsList.map((m, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{m.woId}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{m.product}</div>
                      </td>
                      <td>{m.item} ({m.required} db)</td>
                      <td style={{ color: '#e74c3c', fontWeight: 800 }}>- {m.missingAmount} db hiány</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <CheckCircle2 size={48} color="#2ecc71" style={{ marginBottom: '15px' }} />
                <h3 style={{ fontWeight: 700 }}>Minden anyag rendelkezésre áll!</h3>
                <p className="text-muted">A jelenlegi aktív gyártásokhoz szükséges összes alapanyag megtalálható a raktárban.</p>
              </div>
            )
          )}

          {activeKpiModal === 'weekly' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Munkalap</th>
                  <th>Termék</th>
                  <th>Mennyiség</th>
                  <th>Státusz</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.filter(w => w.status === 'Completed').map(wo => (
                  <tr key={wo.id}>
                    <td style={{ fontWeight: 700 }}>{wo.id}</td>
                    <td>{wo.product}</td>
                    <td style={{ fontWeight: 800, color: '#2ecc71' }}>+ {wo.quantity} db</td>
                    <td><span className="status-badge active">Készletre véve</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isMachineModalOpen}
        onClose={() => setIsMachineModalOpen(false)}
        title={`Gép Paraméterek: ${selectedMachine?.name}`}
        width="600px"
        footer={<button className="view-btn" onClick={() => setIsMachineModalOpen(false)}>Bezárás</button>}
      >
        {selectedMachine && (
          <div className="machine-params-view" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="stat-card glass">
                <p className="text-muted" style={{ fontSize: '0.7rem' }}>Aktuális Terhelés</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedMachine.load}%</p>
              </div>
              <div className="stat-card glass">
                <p className="text-muted" style={{ fontSize: '0.7rem' }}>Üzemi Hőmérséklet</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedMachine.temp}</p>
              </div>
            </div>
            
            <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '15px', fontWeight: 700 }}>Szenzor Adatok (Valós idejű)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="text-muted">Vibráció (RMS)</span>
                  <span style={{ fontWeight: 600 }}>0.42 mm/s</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="text-muted">Kenőanyag szint</span>
                  <span style={{ fontWeight: 600, color: '#2ecc71' }}>Megfelelő (88%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="text-muted">Energiafogyasztás</span>
                  <span style={{ fontWeight: 600 }}>4.2 kW/h</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isNewWOModalOpen}
        onClose={() => setIsNewWOModalOpen(false)}
        title="Új Gyártási Munkalap Létrehozása"
        width="650px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsNewWOModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleSaveNewWO}>Munkalap Mentése</button>
          </>
        }
      >
        <form onSubmit={handleSaveNewWO} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Gyártandó Termék</label>
            <select 
              className="form-input"
              value={newWOData.product}
              onChange={(e) => setNewWOData({...newWOData, product: e.target.value})}
              required
            >
              <option value="">Válasszon terméket...</option>
              {products.map(p => (
                <option key={p.id} value={p.name}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mennyiség</label>
            <input 
              type="number" 
              className="form-input"
              min="1"
              value={newWOData.quantity}
              onChange={(e) => setNewWOData({...newWOData, quantity: parseInt(e.target.value)})}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Határidő</label>
            <input 
              type="date" 
              className="form-input"
              value={newWOData.deadline}
              onChange={(e) => setNewWOData({...newWOData, deadline: e.target.value})}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Felelős Technikus</label>
            <select 
              className="form-input"
              value={newWOData.technician}
              onChange={(e) => setNewWOData({...newWOData, technician: e.target.value})}
            >
              <option value="Kovács János">Kovács János</option>
              <option value="Nagy Péter">Nagy Péter</option>
              <option value="Szabó Anna">Szabó Anna</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Prioritás</label>
            <select 
              className="form-input"
              value={newWOData.priority}
              onChange={(e) => setNewWOData({...newWOData, priority: e.target.value})}
            >
              <option value="Low">Alacsony</option>
              <option value="Medium">Közepes</option>
              <option value="High">Sürgős</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Manufacturing;

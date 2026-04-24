import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  FileText, 
  Plus, 
  ClipboardCheck,
  AlertTriangle,
  History,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Download,
  Target,
  Zap,
  Clock,
  ChevronRight,
  FileSearch,
  Wrench
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Quality.css';

const Quality = ({ addToast }) => {
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('checkpoints');

  const [inspections, setInspections] = useState([
    { id: 'QC-2024-001', item: 'Kocsiablak (RW-WIN-042)', batch: 'BCH-882', date: '2024-04-20', inspector: 'Kovács János', status: 'Passed', score: 100 },
    { id: 'QC-2024-002', item: 'Poggyásztartó váz', batch: 'BCH-883', date: '2024-04-21', inspector: 'Nagy Péter', status: 'Failed', score: 65, issue: 'Felületi karcolások az eloxált rétegen.', d_status: 'D3' },
    { id: 'QC-2024-003', item: 'Ajtó tömítés', batch: 'BCH-884', date: '2024-04-22', inspector: 'Szabó Anna', status: 'Pending', score: 0 },
    { id: 'QC-2024-004', item: 'Válaszfal rögzítő', batch: 'BCH-885', date: '2024-04-23', inspector: 'Kovács János', status: 'Passed', score: 98 },
  ]);

  const spcData = [95, 96, 94, 98, 92, 95, 97, 94, 95, 96, 93, 95];
  const ucl = 98;
  const lcl = 92;
  const mean = 95;

  const calibrations = [
    { tool: 'Digitális Tolómérő #QC-01', status: 'Valid', due: '2024-12-15' },
    { tool: 'Nyomatékkulcs #MT-08', status: 'Expiring', due: '2024-05-01' },
    { tool: 'Mikrométer #QC-05', status: 'Valid', due: '2024-10-20' }
  ];

  const SPCControlChart = ({ data }) => {
    const width = 400;
    const height = 150;
    const padding = 20;
    
    const getX = (i) => (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const getY = (val) => height - ((val - 90) / 10) * (height - 2 * padding) - padding;

    const points = data.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
    
    return (
      <div className="spc-chart-container">
        <svg width={width} height={height} className="spc-svg">
          <line x1={padding} y1={getY(ucl)} x2={width-padding} y2={getY(ucl)} stroke="#e74c3c" strokeDasharray="4" strokeWidth="1" />
          <line x1={padding} y1={getY(lcl)} x2={width-padding} y2={getY(lcl)} stroke="#e74c3c" strokeDasharray="4" strokeWidth="1" />
          <line x1={padding} y1={getY(mean)} x2={width-padding} y2={getY(mean)} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <polyline points={points} fill="none" stroke="var(--primary-color)" strokeWidth="2" />
          {data.map((v, i) => (
            <circle key={i} cx={getX(i)} cy={getY(v)} r="3" fill="var(--primary-color)" />
          ))}
          <text x={width - 5} y={getY(ucl)} fontSize="8" fill="#e74c3c" textAnchor="end">UCL</text>
          <text x={width - 5} y={getY(lcl)} fontSize="8" fill="#e74c3c" textAnchor="end">LCL</text>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginTop: '10px', opacity: 0.6 }}>
          <span>T-12h</span>
          <span>Aktuális folyamatstabilitás (X-Bar)</span>
          <span>Most</span>
        </div>
      </div>
    );
  };

  const EightDSteps = ({ currentStep }) => {
    const steps = [
      { id: 'D1', name: 'Csapat' }, { id: 'D2', name: 'Hiba leírás' }, { id: 'D3', name: 'Kárenyhítés' }, { id: 'D4', name: 'Gyökérok' },
      { id: 'D5', name: 'Megoldás' }, { id: 'D6', name: 'Validálás' }, { id: 'D7', name: 'Megelőzés' }, { id: 'D8', name: 'Zárás' }
    ];
    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
      <div className="eight-d-grid">
        {steps.map((step, i) => (
          <div key={step.id} className={`eight-d-step ${i <= currentIndex ? 'active' : ''} ${i === currentIndex ? 'current' : ''}`}>
             <div className="step-number">{step.id}</div>
             <div className="step-name">{step.name}</div>
          </div>
        ))}
      </div>
    );
  };

  const openInspection = (insp) => {
    setSelectedInspection(insp);
    setIsModalOpen(true);
    setActiveTab('checkpoints');
  };

  const handleCreateNCR = (insp) => {
    auditLogService.log({
      user: 'Minőségellenőr',
      action: 'NCR Létrehozva',
      module: 'Quality',
      details: `Hiba: ${insp.issue} (${insp.id})`,
      severity: 'danger'
    });
    addToast('NCR folyamat elindítva', 'warning');
    setIsModalOpen(false);
  };

  const yieldRate = 94.2;
  const dpmo = 1250;

  return (
    <div className="quality-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Minőségügyi Központ (QMS)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>SPC statisztikák, 8D riportok és mérőeszköz kalibrálás</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Havi minőségi riport generálása', 'info')}>
            <Download size={18} /> Letöltés
          </button>
          <button className="create-btn" onClick={() => addToast('Új ellenőrzési folyamat', 'success')}>
            <Plus size={20} /> Új Ellenőrzés
          </button>
        </div>
      </div>

      <div className="quality-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="stat-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Yield (Kihozatal)</span>
            <Activity size={16} color="#2ecc71" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2ecc71' }}>{yieldRate}%</div>
          <p style={{ fontSize: '0.7rem', color: '#2ecc71', marginTop: '5px' }}>+0.5% az előző héthez</p>
        </div>
        <div className="stat-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>DPMO (Hibaarány)</span>
            <BarChart3 size={16} color="#e74c3c" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{dpmo}</div>
          <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '5px' }}>Cél: &lt; 1000</p>
        </div>
        <div className="stat-card glass" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
             <span className="text-muted" style={{ fontSize: '0.8rem' }}>SPC Monitor</span>
             <Target size={16} color="var(--primary-color)" />
          </div>
          <SPCControlChart data={spcData} />
        </div>
        <div className="stat-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Audit & Compliance</span>
            <ShieldCheck size={16} color="var(--primary-color)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>ISO 9001</div>
          <p style={{ fontSize: '0.7rem', color: '#2ecc71', marginTop: '5px' }}>IRIS Cert: Érvényes</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '25px' }}>
        <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Vizsgálat ID</th>
                <th>Termék / Tétel</th>
                <th>Eredmény</th>
                <th>Minőség %</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inspections.map(insp => (
                <tr key={insp.id} onClick={() => openInspection(insp)} style={{ cursor: 'pointer' }}>
                  <td><strong style={{ color: 'var(--primary-color)' }}>{insp.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{insp.item}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Batch: {insp.batch}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${insp.status === 'Passed' ? 'active' : insp.status === 'Failed' ? 'danger' : 'warning'}`}>
                      {insp.status === 'Passed' ? 'Megfelelt' : insp.status === 'Failed' ? 'Elutasítva' : 'Várakozik'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--border-color)', borderRadius: '3px', width: '60px' }}>
                        <div style={{ width: `${insp.score}%`, height: '100%', background: insp.score > 90 ? '#2ecc71' : insp.score > 70 ? '#f1c40f' : '#e74c3c', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{insp.score}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="view-btn-small"><FileText size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--primary-color)" /> Kalibráció
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {calibrations.map((c, i) => (
                <div key={i} className="glass" style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.tool}</span>
                      <span className={`status-badge ${c.status === 'Valid' ? 'active' : 'warning'}`} style={{ fontSize: '0.6rem' }}>{c.status}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Lejárat:</span>
                      <span>{c.due}</span>
                   </div>
                </div>
              ))}
           </div>
           <button className="view-btn-small" style={{ width: '100%', marginTop: '20px' }}>Minden eszköz</button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Jegyzőkönyv: ${selectedInspection?.id}`}
        width="900px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedInspection?.status === 'Failed' && (
              <button className="create-btn" style={{ background: '#e74c3c' }} onClick={() => handleCreateNCR(selectedInspection)}>
                <ShieldAlert size={18} /> NCR Megnyitása
              </button>
            )}
            <button className="create-btn" onClick={() => addToast('Letöltve', 'success')}>PDF</button>
          </>
        }
      >
        {selectedInspection && (
          <div className="inspection-details-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'checkpoints' ? 'active' : ''}`} onClick={() => setActiveTab('checkpoints')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Ellenőrzés</div>
              <div className={`settings-nav-item ${activeTab === '8d' ? 'active' : ''}`} onClick={() => setActiveTab('8d')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>8D Elemzés</div>
              <div className={`settings-nav-item ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Műszaki Adatok</div>
            </div>

            {activeTab === 'checkpoints' && (
              <div className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="glass" style={{ padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <CheckCircle2 size={20} color="#2ecc71" />
                    <span>Méretpontosság (Tűrés: +/- 0.2mm)</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#2ecc71' }}>OK</span>
                </div>
                <div className="glass" style={{ padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {selectedInspection.status === 'Failed' ? <XCircle size={20} color="#e74c3c" /> : <CheckCircle2 size={20} color="#2ecc71" />}
                    <span>Felületi minőség (ISO 4287)</span>
                  </div>
                  <span style={{ fontWeight: 700, color: selectedInspection.status === 'Failed' ? '#e74c3c' : '#2ecc71' }}>
                    {selectedInspection.status === 'Failed' ? 'NOK' : 'OK'}
                  </span>
                </div>
              </div>
            )}
            
            {activeTab === '8d' && (
               <div className="eight-d-tab">
                  <EightDSteps currentStep={selectedInspection.d_status || 'D1'} />
                  {selectedInspection.status === 'Failed' && (
                     <div className="glass" style={{ marginTop: '30px', padding: '25px', borderRadius: '15px' }}>
                        <h5 style={{ fontWeight: 800, color: 'var(--primary-color)', marginBottom: '15px' }}>D3 - Kárenyhítés</h5>
                        <p style={{ fontSize: '0.85rem' }}>"Minden érintett tétel zárolva a raktárban. 100%-os válogatás folyamatban."</p>
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'specs' && (
              <div className="specs-view glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>Anyag</p>
                    <p style={{ fontWeight: 600 }}>AlMgSi0.5</p>
                  </div>
                  <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>Szabvány</p>
                    <p style={{ fontWeight: 600 }}>IRIS / EN 15085</p>
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

export default Quality;

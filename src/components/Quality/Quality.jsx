import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Plus, 
  Activity,
  BarChart3,
  Download,
  Target,
  Clock,
  Loader2
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Quality.css';

const Quality = ({ addToast }) => {
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('checkpoints');
  const [isCreatingNCR, setIsCreatingNCR] = useState(false);

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

  /* Interactive SVG Chart */
  const SPCControlChart = ({ data }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const width = 400;
    const height = 150;
    const padding = 20;
    
    const getX = (i) => (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const getY = (val) => height - ((val - 90) / 10) * (height - 2 * padding) - padding;

    const points = data.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
    
    return (
      <div className="spc-chart-container" onMouseLeave={() => setHoveredPoint(null)}>
        {hoveredPoint && (
           <div className="spc-tooltip" style={{ left: hoveredPoint.x, top: hoveredPoint.y - 10, opacity: 1 }}>
              Idő: T-{data.length - hoveredPoint.i}h<br/>
              Mérés: {hoveredPoint.v}
           </div>
        )}
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="spc-svg">
          {/* Upper Control Limit */}
          <line x1={padding} y1={getY(ucl)} x2={width-padding} y2={getY(ucl)} stroke="#e74c3c" strokeDasharray="4" strokeWidth="1" />
          {/* Lower Control Limit */}
          <line x1={padding} y1={getY(lcl)} x2={width-padding} y2={getY(lcl)} stroke="#e74c3c" strokeDasharray="4" strokeWidth="1" />
          {/* Mean */}
          <line x1={padding} y1={getY(mean)} x2={width-padding} y2={getY(mean)} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
          
          <polyline points={points} fill="none" stroke="var(--primary-color)" strokeWidth="2" className="spc-line-path" />
          
          {data.map((v, i) => (
            <circle 
              key={i} 
              cx={getX(i)} 
              cy={getY(v)} 
              r="3" 
              fill="var(--primary-color)" 
              className="spc-point"
              onMouseEnter={() => setHoveredPoint({ x: getX(i), y: getY(v), v, i })}
            />
          ))}
          <text x={width - 5} y={getY(ucl)} fontSize="8" fill="#e74c3c" textAnchor="end">UCL</text>
          <text x={width - 5} y={getY(lcl)} fontSize="8" fill="#e74c3c" textAnchor="end">LCL</text>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginTop: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
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
    
    // Calculate progress rail width (percentage)
    const progressPerc = Math.max(0, currentIndex) / (steps.length - 1) * 100;

    return (
      <div className="eight-d-grid">
        <div className="eight-d-progress-rail" style={{ width: `${progressPerc}%` }}></div>
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
    setIsCreatingNCR(true);
    
    setTimeout(() => {
      auditLogService.log({
        user: 'Minőségellenőr (Automatizált)',
        action: 'NCR Létrehozva',
        module: 'Quality',
        details: `Hiba: ${insp.issue} (${insp.id}). Folyamat átadva: 8D Group.`,
        severity: 'danger'
      });
      addToast(`NCR-${insp.id.slice(-3)} jegyzőkönyv elindítva`, 'success');
      setIsCreatingNCR(false);
      setIsModalOpen(false);
      
      // Update state locally to show progress
      setInspections(prev => prev.map(i => i.id === insp.id ? { ...i, d_status: 'D4' } : i));
    }, 1500);
  };

  return (
    <div className="quality-module">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Minőségügyi Központ (QMS)</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>SPC statisztikák, 8D riportok és műszer kalibráció</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Havi minőségi riport generálása...', 'info')}>
            <Download size={18} /> Export
          </button>
          <button className="create-btn" style={{ background: '#2ecc71', boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)' }} onClick={() => addToast('Új ellenőrzési folyamat indítva', 'success')}>
            <Plus size={18} /> Új Ellenőrzés
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '30px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Yield (Kihozatal)</span>
            <Activity size={18} color="#2ecc71" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2ecc71' }}>94.2%</div>
          <p style={{ fontSize: '0.75rem', color: '#2ecc71', marginTop: '5px', fontWeight: 700 }}>+0.5% az előző héthez</p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>DPMO (Hibaarány)</span>
            <BarChart3 size={18} color="#e74c3c" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>1250</div>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '5px', fontWeight: 600 }}>Cél: &lt; 1000</p>
        </div>
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
             <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>SPC Monitor</span>
             <Target size={18} color="var(--primary-color)" />
          </div>
          <SPCControlChart data={spcData} />
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Audit & Compliance</span>
            <ShieldCheck size={18} color="var(--primary-color)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>ISO 9001</div>
          <p style={{ fontSize: '0.75rem', color: '#2ecc71', marginTop: '5px', fontWeight: 700 }}>IRIS Cert: Érvényes</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '30px' }}>
        <div className="list-view" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Vizsgálat ID</th>
                <th>Alkatrész / Tétel</th>
                <th>Státusz</th>
                <th>Megfelelés %</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inspections.map(insp => (
                <tr key={insp.id} onClick={() => openInspection(insp)} style={{ cursor: 'pointer' }}>
                  <td><strong style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>{insp.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{insp.item}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px' }}>Loth: {insp.batch}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${insp.status === 'Passed' ? 'active' : insp.status === 'Failed' ? 'danger' : 'warning'}`}>
                      {insp.status === 'Passed' ? 'Megfelelt' : insp.status === 'Failed' ? 'Elutasítva' : 'Folyamatban'}
                    </span>
                  </td>
                  <td>
                    {insp.status === 'Pending' ? (
                       <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>N/A</span>
                    ) : (
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <div style={{ flex: 1, height: '8px', background: 'var(--bg-main)', borderRadius: '4px', width: '80px', overflow: 'hidden' }}>
                           <div style={{ 
                              width: `${insp.score}%`, 
                              height: '100%', 
                              background: insp.score > 90 ? '#2ecc71' : insp.score > 70 ? '#f39c12' : '#e74c3c', 
                              borderRadius: '4px',
                              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                           }}></div>
                         </div>
                         <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{insp.score}%</span>
                       </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="view-btn-small" style={{ borderRadius: '8px' }}><FileText size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="list-view" style={{ padding: '25px', borderRadius: '20px' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--primary-color)" /> Műszer Kalibráció
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {calibrations.map((c, i) => (
                <div key={i} className="stat-card" style={{ padding: '15px', borderRadius: '12px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.tool}</span>
                      <span className={`status-badge ${c.status === 'Valid' ? 'active' : 'warning'}`} style={{ fontSize: '0.65rem', padding: '4px 8px' }}>
                         {c.status === 'Valid' ? 'Hiteles' : 'Lejáróban'}
                      </span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <span>Lejárat:</span>
                      <span>{c.due}</span>
                   </div>
                </div>
              ))}
           </div>
           <button className="view-btn" style={{ width: '100%', marginTop: '25px', justifyContent: 'center' }}>Összes műszer</button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedInspection ? `Ellenőrzési Jegyzőkönyv: ${selectedInspection.id}` : ''}
        width="900px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedInspection?.status === 'Failed' && (
              <button 
                 className="create-btn" 
                 style={{ background: '#e74c3c', border: 'none', minWidth: '160px' }} 
                 onClick={() => handleCreateNCR(selectedInspection)}
                 disabled={isCreatingNCR}
              >
                {isCreatingNCR ? (
                   <><Loader2 size={18} className="spin-animation" /> Generálás...</>
                ) : (
                   <><ShieldAlert size={18} /> NCR Megnyitása</>
                )}
              </button>
            )}
            <button className="create-btn" onClick={() => addToast('Jegyzőkönyv letöltve', 'success')}>Aláírt PDF</button>
          </>
        }
      >
        {selectedInspection && (
          <div className="inspection-details-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', background: 'transparent', padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'checkpoints' ? 'active' : ''}`} onClick={() => setActiveTab('checkpoints')} style={{ flex: 1, textAlign: 'center' }}>Eredmények</div>
              <div className={`settings-nav-item ${activeTab === '8d' ? 'active' : ''}`} onClick={() => setActiveTab('8d')} style={{ flex: 1, textAlign: 'center' }}>8D Elemzés</div>
              <div className={`settings-nav-item ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')} style={{ flex: 1, textAlign: 'center' }}>Referencia Adatok</div>
            </div>

            {activeTab === 'checkpoints' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="check-list-item">
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <CheckCircle2 size={24} color="#2ecc71" />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Méretpontosság (Tűrés: +/- 0.2mm)</span>
                  </div>
                  <span className="status-badge active">OK (0.05mm)</span>
                </div>
                <div className={`check-list-item ${selectedInspection.status === 'Failed' ? 'nok' : ''}`}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {selectedInspection.status === 'Failed' ? <XCircle size={24} color="#e74c3c" /> : <CheckCircle2 size={24} color="#2ecc71" />}
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Felületi minőség (ISO 4287 / Ra)</span>
                  </div>
                  <span className={`status-badge ${selectedInspection.status === 'Failed' ? 'danger' : 'active'}`}>
                    {selectedInspection.status === 'Failed' ? 'NOK (Karcok)' : 'OK'}
                  </span>
                </div>
              </div>
            )}
            
            {activeTab === '8d' && (
               <div className="eight-d-tab">
                  <EightDSteps currentStep={selectedInspection.d_status || 'D1'} />
                  
                  {selectedInspection.status === 'Failed' && (
                     <div className="stat-card" style={{ marginTop: '40px', padding: '25px', borderColor: 'rgba(231, 76, 60, 0.3)', background: 'rgba(231, 76, 60, 0.02)' }}>
                        <h5 style={{ fontWeight: 800, color: '#e74c3c', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <ShieldAlert size={20} /> Akcióterv - D3 (Kárenyhítés)
                        </h5>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)', fontWeight: 500 }}>
                           Automatizált beavatkozás: "Minden érintett tétel (BCH-883) azonnal zárolva a raktárban. Értesítés küldve a minőségellenőröknek a 100%-os válogatás elkezdéséhez az XYZ területen."
                        </p>
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="specs-card">
                  <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Alapanyag</p>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>AlMgSi0.5</p>
                </div>
                <div className="specs-card">
                  <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Minőségi Szabvány</p>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>IRIS / EN 15085</p>
                </div>
                <div className="specs-card" style={{ gridColumn: 'span 2' }}>
                  <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Csatolt Műszaki Rajz</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                     <span style={{ fontWeight: 600 }}>DRW-882-V2.pdf</span>
                     <button className="view-btn-small">Megtekintés</button>
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

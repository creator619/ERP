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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPreviewDrawingOpen, setIsPreviewDrawingOpen] = useState(false);
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isNewInspectionModalOpen, setIsNewInspectionModalOpen] = useState(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [newTool, setNewTool] = useState({
    id: '',
    tool: '',
    due: ''
  });
  const [newInspection, setNewInspection] = useState({
    item: '',
    batch: '',
    inspector: 'Kovács János',
    status: 'Pending',
    score: 0
  });

  const handleMainExport = () => {
    setIsExporting(true);
    addToast('Havi minőségi riport generálása folyamatban...', 'info');
    
    setTimeout(() => {
      const reportId = `REP-QM-${Math.floor(Math.random() * 9000) + 1000}`;
      
      auditLogService.log({
        user: 'Minőségügyi Vezető',
        action: 'Havi Riport Generálva',
        module: 'Quality',
        details: `Azonosító: ${reportId}. Tartalom: Teljes SPC és NCR statisztika.`,
        severity: 'info'
      });

      // Add to central Document Engine
      const newDoc = {
        id: reportId,
        name: `Havi Minőségi Riport: 2024. Április`,
        date: new Date().toISOString().split('T')[0],
        status: 'Generated'
      };
      const existingDocs = JSON.parse(localStorage.getItem('generated_documents') || '[]');
      localStorage.setItem('generated_documents', JSON.stringify([newDoc, ...existingDocs]));

      addToast(`Riport (${reportId}) elkészült és archiválva`, 'success');
      setIsExporting(false);
    }, 2000);
  };

  const [calibrations, setCalibrations] = useState([
    { id: 'QC-01', tool: 'Digitális Tolómérő', status: 'Hiteles', due: '2024-12-15' },
    { id: 'MT-08', tool: 'Nyomatékkulcs', status: 'Lejáróban', due: '2024-05-01' },
    { id: 'QC-05', tool: 'Mikrométer', status: 'Hiteles', due: '2024-10-20' },
    { id: 'QC-12', tool: 'Rétegvastagság-mérő', id: 'QC-12', status: 'Hiteles', due: '2024-11-10' },
    { id: 'QC-22', tool: 'Digitális Szögmérő', id: 'QC-22', status: 'Érvénytelen', due: '2024-04-15' },
    { id: 'MT-02', tool: 'Hőmérséklet Kalibrátor', id: 'MT-02', status: 'Hiteles', due: '2025-01-20' },
    { id: 'QC-09', tool: 'Nyomásmérő Műszer', id: 'QC-09', status: 'Hiteles', due: '2024-09-05' }
  ]);

  const [selectedCalTool, setSelectedCalTool] = useState(null);

  const handleCertifyTool = (toolId) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const dateStr = nextYear.toISOString().split('T')[0];

    setCalibrations(prev => prev.map(t => t.id === toolId ? { ...t, status: 'Hiteles', due: dateStr } : t));
    
    auditLogService.log({
      user: 'Minőségügyi Technikus',
      action: 'Műszer Hitelesítve',
      module: 'Quality',
      details: `${toolId} - Következő felülvizsgálat: ${dateStr}`,
      severity: 'success'
    });
    
    addToast(`${toolId} sikeresen hitelesítve`, 'success');
    setSelectedCalTool(null);
  };

  const handleDecommissionTool = (toolId) => {
    setCalibrations(prev => prev.map(t => t.id === toolId ? { ...t, status: 'Érvénytelen' } : t));
    
    auditLogService.log({
      user: 'Minőségügyi Technikus',
      action: 'Műszer Kivonva a Forgalomból',
      module: 'Quality',
      details: `${toolId} - Használata tilos!`,
      severity: 'warning'
    });
    
    addToast(`${toolId} kivonva a forgalomból`, 'warning');
    setSelectedCalTool(null);
  };

  const handleViewDrawing = () => {
    setIsPreviewDrawingOpen(true);
    auditLogService.log({
      user: 'Minőségügyi Ellenőr',
      action: 'Műszak rajz megtekintve',
      module: 'Quality',
      details: 'DRW-882-V2.pdf (Blueprint #42)',
      severity: 'info'
    });
  };

  const handleExportPDF = (insp) => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      auditLogService.log({
        user: 'Minőségügyi Vezető',
        action: 'Digitális Jegyzőkönyv Exportálva',
        module: 'Quality',
        details: `Jegyzőkönyv: ${insp.id}. Formátum: Hitelesített PDF.`,
        severity: 'info'
      });
      addToast(`Jegyzőkönyv (${insp.id}) sikeresen generálva és letöltve`, 'success');
      
      const newDoc = {
        id: `DOC-${insp.id.split('-').pop()}-${Math.floor(Math.random() * 1000)}`,
        name: `Minőségügyi Jegyzőkönyv: ${insp.id}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Generated'
      };
      const existingDocs = JSON.parse(localStorage.getItem('generated_documents') || '[]');
      localStorage.setItem('generated_documents', JSON.stringify([newDoc, ...existingDocs]));
      
      setIsGeneratingPDF(false);
    }, 1800);
  };

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
          <line x1={padding} y1={getY(ucl)} x2={width-padding} y2={getY(ucl)} stroke="#e74c3c" strokeDasharray="4" strokeWidth="1" />
          <line x1={padding} y1={getY(lcl)} x2={width-padding} y2={getY(lcl)} stroke="#e74c3c" strokeDasharray="4" strokeWidth="1" />
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
      setInspections(prev => prev.map(i => i.id === insp.id ? { ...i, d_status: 'D4' } : i));
    }, 1500);
  };

  const handleSaveInspection = (e) => {
    e.preventDefault();
    if (!newInspection.item || !newInspection.batch) {
      addToast('Kérjük töltsön ki minden mezőt!', 'warning');
      return;
    }

    const id = `QC-2024-${String(inspections.length + 1).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    
    const inspectionToAdd = {
      ...newInspection,
      id,
      date
    };

    setInspections([inspectionToAdd, ...inspections]);
    setIsNewInspectionModalOpen(false);
    setNewInspection({
      item: '',
      batch: '',
      inspector: 'Kovács János',
      status: 'Pending',
      score: 0
    });

    auditLogService.log({
      user: inspectionToAdd.inspector,
      action: 'Új Ellenőrzés Létrehozva',
      module: 'Quality',
      details: `${id} - ${inspectionToAdd.item}`,
      severity: 'info'
    });

    addToast(`Új ellenőrzés (${id}) sikeresen létrehozva`, 'success');
  };

  const handleSaveNewTool = (e) => {
    e.preventDefault();
    if (!newTool.id || !newTool.tool || !newTool.due) {
      addToast('Minden mező kitöltése kötelező!', 'warning');
      return;
    }

    const toolToAdd = {
      ...newTool,
      status: 'Hiteles'
    };

    setCalibrations([toolToAdd, ...calibrations]);
    setIsAddToolModalOpen(false);
    setNewTool({ id: '', tool: '', due: '' });

    auditLogService.log({
      user: 'Minőségügyi Technikus',
      action: 'Új Műszer Regisztrálva',
      module: 'Quality',
      details: `${toolToAdd.tool} (${toolToAdd.id}) felvéve a rendszerbe.`,
      severity: 'success'
    });

    addToast(`${toolToAdd.tool} regisztrálva`, 'success');
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
          <button 
            className="view-btn" 
            onClick={handleMainExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <><Loader2 size={18} className="spin-animation" /> Generálás...</>
            ) : (
              <><Download size={18} /> Export</>
            )}
          </button>
          <button className="create-btn-premium" onClick={() => setIsNewInspectionModalOpen(true)}>
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
               {calibrations.slice(0, 3).map((c, i) => (
                 <div key={i} className="stat-card" style={{ padding: '15px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => setSelectedCalTool(c)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                       <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{c.tool} #{c.id}</span>
                       <span className={`status-badge ${c.status === 'Hiteles' ? 'active' : c.status === 'Lejáróban' ? 'warning' : 'danger'}`} style={{ fontSize: '0.65rem', padding: '4px 8px' }}>
                          {c.status}
                       </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                       <span>Lejárat:</span>
                       <span>{c.due}</span>
                    </div>
                 </div>
               ))}
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '25px' }}>
              <button className="view-btn" style={{ justifyContent: 'center' }} onClick={() => setIsCalibrationModalOpen(true)}>Összes</button>
              <button className="create-btn" style={{ justifyContent: 'center', padding: '8px' }} onClick={() => setIsAddToolModalOpen(true)}>
                <Plus size={16} /> Új műszer
              </button>
           </div>
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
            <button 
              className="create-btn" 
              onClick={() => handleExportPDF(selectedInspection)}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <><Loader2 size={18} className="spin-animation" /> Generálás...</>
              ) : (
                'Aláírt PDF'
              )}
            </button>
          </>
        }
      >
        {selectedInspection && (
          <div className="inspection-details-view">
            <div className="settings-nav">
              <div className={`settings-nav-item ${activeTab === 'checkpoints' ? 'active' : ''}`} onClick={() => setActiveTab('checkpoints')}>Eredmények</div>
              <div className={`settings-nav-item ${activeTab === '8d' ? 'active' : ''}`} onClick={() => setActiveTab('8d')}>8D Elemzés</div>
              <div className={`settings-nav-item ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Referencia Adatok</div>
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
                     <button className="view-btn-small" onClick={handleViewDrawing}>Megtekintés</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isPreviewDrawingOpen}
        onClose={() => setIsPreviewDrawingOpen(false)}
        title="Műszaki Rajz Előnézet: DRW-882-V2"
        width="850px"
        footer={
          <button className="view-btn" onClick={() => setIsPreviewDrawingOpen(false)}>Bezárás</button>
        }
      >
        <div style={{ background: '#001a33', padding: '20px', borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(52, 152, 219, 0.3)' }}>
           <div style={{ width: '100%', height: '400px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
              <FileText size={48} color="#3498db" />
              <p style={{ color: '#3498db', fontWeight: 600 }}>DRW-882-V2 Műszaki Rajz Betöltése...</p>
           </div>
           <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                 DOKUMENTUM AZONOSÍTÓ: 882-V2-2024-QC | UTOLSÓ MÓDOSÍTÁS: 2024-03-12
              </div>
              <div style={{ color: '#3498db', fontSize: '0.8rem', fontWeight: 800 }}>
                 HITELLESÍTETT BLUEPRINT
              </div>
           </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCalibrationModalOpen}
        onClose={() => setIsCalibrationModalOpen(false)}
        title="Műszerpark Kalibrációs Jegyzéke"
        width="800px"
        footer={
          <button className="view-btn" onClick={() => setIsCalibrationModalOpen(false)}>Bezárás</button>
        }
      >
        <div className="list-view" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Műszer Megnevezése</th>
                <th>Gyári Szám</th>
                <th>Állapot</th>
                <th>Következő Felülvizsgálat</th>
              </tr>
            </thead>
            <tbody>
              {calibrations.map((m, i) => (
                <tr key={i} onClick={() => { setSelectedCalTool(m); setIsCalibrationModalOpen(false); }} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 700 }}>{m.tool}</td>
                  <td className="text-muted" style={{ fontWeight: 600 }}>{m.id}</td>
                  <td>
                    <span className={`status-badge ${m.status === 'Hiteles' ? 'active' : m.status === 'Lejáróban' ? 'warning' : 'danger'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{m.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedCalTool}
        onClose={() => setSelectedCalTool(null)}
        title={`Műszer Kezelése: ${selectedCalTool?.tool}`}
        width="500px"
        footer={
          <button className="view-btn" onClick={() => setSelectedCalTool(null)}>Mégse</button>
        }
      >
        {selectedCalTool && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="stat-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Aktuális Állapot</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedCalTool.id}</span>
                <span className={`status-badge ${selectedCalTool.status === 'Hiteles' ? 'active' : selectedCalTool.status === 'Lejáróban' ? 'warning' : 'danger'}`}>
                  {selectedCalTool.status}
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '10px' }}>Lejárat: {selectedCalTool.due}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <button 
                className="create-btn" 
                style={{ background: '#2ecc71', width: '100%', justifyContent: 'center' }}
                onClick={() => handleCertifyTool(selectedCalTool.id)}
              >
                Hitelesítés (+1 év)
              </button>
              <button 
                className="view-btn" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => addToast('Műszer beállítása folyamatban...', 'info')}
              >
                Beállítás / Kalibrálás
              </button>
              <button 
                className="create-btn" 
                style={{ background: '#e74c3c', width: '100%', justifyContent: 'center' }}
                onClick={() => handleDecommissionTool(selectedCalTool.id)}
              >
                Kivonás a forgalomból
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isNewInspectionModalOpen}
        onClose={() => setIsNewInspectionModalOpen(false)}
        title="Új Ellenőrzési Folyamat Indítása"
        width="600px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsNewInspectionModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleSaveInspection}>Ellenőrzés Létrehozása</button>
          </>
        }
      >
        <form onSubmit={handleSaveInspection} className="new-inspection-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Alkatrész / Tétel Megnevezése</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Pl: Kocsiablak keret (RW-WIN-043)"
                value={newInspection.item}
                onChange={(e) => setNewInspection({...newInspection, item: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Batch / Loth Szám</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Pl: BCH-886"
                value={newInspection.batch}
                onChange={(e) => setNewInspection({...newInspection, batch: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Ellenőr</label>
              <select 
                className="form-input"
                value={newInspection.inspector}
                onChange={(e) => setNewInspection({...newInspection, inspector: e.target.value})}
              >
                <option value="Kovács János">Kovács János</option>
                <option value="Nagy Péter">Nagy Péter</option>
                <option value="Szabó Anna">Szabó Anna</option>
                <option value="Horváth Gábor">Horváth Gábor</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ padding: '15px', background: 'rgba(52, 152, 219, 0.05)', borderRadius: '10px', border: '1px dashed rgba(52, 152, 219, 0.3)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Az új ellenőrzés 'Folyamatban' státusszal jön létre. <br/>
                  A mérések felvitele a létrehozás után, a jegyzőkönyv megnyitásával lehetséges.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddToolModalOpen}
        onClose={() => setIsAddToolModalOpen(false)}
        title="Új Mérőműszer Regisztrálása"
        width="500px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsAddToolModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleSaveNewTool}>Műszer Mentése</button>
          </>
        }
      >
        <form onSubmit={handleSaveNewTool} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Műszer Megnevezése</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Pl: Digitális Mikrométer"
              value={newTool.tool}
              onChange={(e) => setNewTool({...newTool, tool: e.target.value})}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Leltári Szám / ID</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Pl: QC-45"
              value={newTool.id}
              onChange={(e) => setNewTool({...newTool, id: e.target.value})}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Következő Kalibráció Dátuma</label>
            <input 
              type="date" 
              className="form-input" 
              value={newTool.due}
              onChange={(e) => setNewTool({...newTool, due: e.target.value})}
              required
            />
          </div>
          <div style={{ padding: '15px', background: 'rgba(46, 204, 113, 0.05)', borderRadius: '10px', border: '1px dashed rgba(46, 204, 113, 0.3)' }}>
             <p style={{ fontSize: '0.8rem', color: '#2ecc71', textAlign: 'center', fontWeight: 600 }}>
                A műszer alapértelmezetten 'Hiteles' státusszal kerül a rendszerbe.
             </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Quality;

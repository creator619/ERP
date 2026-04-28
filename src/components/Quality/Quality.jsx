import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  ClipboardCheck, 
  BarChart, 
  Search, 
  Plus, 
  MoreVertical, 
  TrendingDown, 
  FileWarning, 
  Wrench,
  History,
  Info,
  ChevronRight,
  Target,
  Download,
  Calendar,
  Image as ImageIcon,
  Maximize2,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import Modal from '../UI/Modal';
import './Quality.css';

const Quality = ({ addToast, initialView = 'dashboard' }) => {
  const { inspections, setInspections, ncrs, setNcrs, workOrders, advanceWorkOrderStage } = useData();
  const [viewMode, setViewMode] = useState(initialView); 
  const [selectedNCR, setSelectedNCR] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [activeInspectionItem, setActiveInspectionItem] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAddNCRModalOpen, setIsAddNCRModalOpen] = useState(false);

  const [newNCR, setNewNCR] = useState({ title: '', source: 'Gyártás', severity: 'Medium', description: '' });

  const stats = [
    { label: 'Elsőre Jó (FTY)', value: '94.2%', trend: '+1.5%', color: '#2ecc71' },
    { label: 'Aktív NCR', value: ncrs.filter(n => n.status !== 'Closed').length.toString(), trend: '-2', color: '#e74c3c' },
    { label: 'Selejtarány', value: '1.8%', trend: '-0.4%', color: '#f1c40f' },
    { label: 'Lejárt Kalibrálás', value: '1', trend: 'Figyelem!', color: '#3498db' }
  ];

  const calibrations = [
    { id: 'CAL-001', name: 'Digitális Tolómérő (Mitutoyo)', lastDate: '2023-10-15', nextDate: '2024-10-15', status: 'Valid', serial: 'SN-44521' },
    { id: 'CAL-002', name: 'Nyomatékkulcs (Beta)', lastDate: '2024-01-20', nextDate: '2025-01-20', status: 'Valid', serial: 'SN-88210' },
    { id: 'CAL-003', name: 'Mikrométer 0-25mm', lastDate: '2023-04-10', nextDate: '2024-04-10', status: 'Expired', serial: 'SN-11200' },
    { id: 'CAL-004', name: 'Rétegvastagság mérő', lastDate: '2023-08-05', nextDate: '2024-06-05', status: 'Warning', serial: 'SN-99341' }
  ];

  const defectCategories = [
    { name: 'Mérethiba', count: 45, color: '#e74c3c' },
    { name: 'Esztétikai hiba', count: 32, color: '#f1c40f' },
    { name: 'Szerelési hiba', count: 18, color: '#3498db' },
    { name: 'Anyaghiba', count: 12, color: '#9b59b6' }
  ];

  const pendingInspections = workOrders.filter(w => w.status === 'In Progress' && w.currentStage === 4);

  const handleStartInspection = (item = null) => {
    setActiveInspectionItem(item);
    setIsChecklistModalOpen(true);
  };

  const handleCompleteChecklist = () => {
    const newInspection = {
      id: `INS-24-${100 + inspections.length + 1}`,
      product: activeInspectionItem?.product || 'Ismeretlen termék',
      type: activeInspectionItem?.id ? 'Gyártásközi (QA)' : 'Általános ellenőrzés',
      technician: activeInspectionItem?.technician || 'Admin',
      status: 'Passed',
      date: new Date().toISOString().split('T')[0]
    };

    setInspections(prev => [newInspection, ...prev]);
    
    // Ha gyártásból jött, léptetjük a munkalapot a befejezéshez
    if (activeInspectionItem?.id && activeInspectionItem.id.startsWith('RW/MO')) {
       advanceWorkOrderStage(activeInspectionItem.id, 4); 
    }

    addToast('Ellenőrzés sikeresen rögzítve a rendszerbe', 'success');
    setIsChecklistModalOpen(false);
    setActiveInspectionItem(null);
  };

  const handleCloseNCR = (id) => {
    setNcrs(prev => prev.map(n => n.id === id ? { ...n, status: 'Closed' } : n));
    addToast(`${id} jegyzőkönyv sikeresen lezárva`, 'success');
    setSelectedNCR(null);
  };

  const handleAddNCR = () => {
    if (!newNCR.title || !newNCR.description) {
      addToast('Kérem adjon meg egy címet és leírást!', 'warning');
      return;
    }
    const ncr = {
      id: `NCR-${Math.floor(Math.random() * 900) + 100}`,
      ...newNCR,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };
    setNcrs(prev => [ncr, ...prev]);
    addToast('Új nem-megfelelőségi jelentés rögzítve', 'success');
    setIsAddNCRModalOpen(false);
    setNewNCR({ title: '', source: 'Gyártás', severity: 'Medium', description: '' });
  };

  const handleDownloadCert = (id) => addToast(`${id} kalibrációs jegyzőkönyv letöltése elindult`, 'info');
  const handleScheduleCal = (id) => addToast(`Új kalibrálási időpont ütemezve a(z) ${id} eszközhöz`, 'success');

  return (
    <div className="quality-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Minőségirányítás & Megfelelőség</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>VI. FÁZIS: Digitális ellenőrzések és Kalibrálás</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="view-controls glass" style={{ padding: '4px', borderRadius: '10px' }}>
            <button className={`view-btn ${viewMode === 'dashboard' ? 'active' : ''}`} onClick={() => setViewMode('dashboard')}>Műszerfal</button>
            <button className={`view-btn ${viewMode === 'inspections' ? 'active' : ''}`} onClick={() => setViewMode('inspections')}>Ellenőrzések</button>
            <button className={`view-btn ${viewMode === 'ncr' ? 'active' : ''}`} onClick={() => setViewMode('ncr')}>NCR</button>
            <button className={`view-btn ${viewMode === 'calibration' ? 'active' : ''}`} onClick={() => setViewMode('calibration')}>Kalibrálás</button>
          </div>
          <button className="create-btn" onClick={handleStartInspection}>
            <ClipboardCheck size={20} /> Új Ellenőrzés
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' && (
        <div className="quality-dashboard">
          <div className="quality-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card glass" style={{ borderLeft: `4px solid ${s.color}` }}>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>{s.label}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{s.value}</span>
                  <span style={{ fontSize: '0.7rem', color: s.trend.includes('+') || s.trend === 'OK' ? '#2ecc71' : '#e74c3c' }}>{s.trend}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="quality-charts-layout">
            <div className="glass chart-card">
               <h3 className="chart-title"><Target size={18} /> Hiba Pareto Analízis</h3>
               <div className="pareto-chart">
                  {defectCategories.map((c, i) => (
                    <div key={i} className="pareto-row">
                       <span className="pareto-label">{c.name}</span>
                       <div className="pareto-bar-wrapper">
                          <div className="pareto-bar" style={{ width: `${(c.count / 45) * 100}%`, background: c.color }}></div>
                       </div>
                       <span className="pareto-value">{c.count} db</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="glass alert-list-card">
               <h3 className="chart-title"><AlertOctagon size={18} /> Legfrissebb Minőségi Riasztások</h3>
               <div className="quality-alerts">
                  <div className="q-alert warning">
                     <div className="q-icon"><Info size={16} /></div>
                     <div className="q-text">
                        <p><strong>RW-WIN-042</strong> - Megnövekedett mérethiba arány az 5-ös cellában</p>
                        <span className="text-muted">Ma, 14:20</span>
                     </div>
                  </div>
                  <div className="q-alert danger">
                     <div className="q-icon"><FileWarning size={16} /></div>
                     <div className="q-text">
                        <p><strong>NCR-441</strong> - Sürgős intézkedést igényel (Beszállítói hiba)</p>
                        <span className="text-muted">Tegnap, 09:15</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Pending Inspections from Manufacturing */}
          <div className="glass pending-inspections-card" style={{ border: pendingInspections.length > 0 ? '1px solid rgba(231, 76, 60, 0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
             <h3 className="chart-title">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <ClipboardCheck size={18} /> 
                 Gyártásból érkező ellenőrzendő tételek
                 {pendingInspections.length > 0 && <span className="pulse-indicator"></span>}
               </div>
             </h3>
             
             <div className="pending-list">
                {pendingInspections.length > 0 ? (
                  pendingInspections.map(wo => (
                    <div key={wo.id} className="pending-item">
                       <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ textAlign: 'center' }}>
                             <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary-color)' }}>ID</div>
                             <div style={{ fontWeight: 800 }}>{wo.id}</div>
                          </div>
                          <div>
                             <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{wo.product}</div>
                             <div className="text-muted" style={{ fontSize: '0.7rem' }}>Technikus: {wo.technician}</div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span className="status-badge warning" style={{ fontSize: '0.65rem' }}>QA FÁZISBAN</span>
                          <button className="create-btn" style={{ padding: '8px 15px', fontSize: '0.75rem' }} onClick={() => handleStartInspection(wo)}>
                             Ellenőrzés Indítása
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', opacity: 0.5 }}>
                     <CheckCircle2 size={32} style={{ marginBottom: '10px', color: '#2ecc71' }} />
                     <p style={{ fontSize: '0.85rem' }}>Nincs várakozó gyártási tétel.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {viewMode === 'inspections' && (
        <div className="glass quality-table-container">
           <table className="data-table">
              <thead>
                <tr>
                  <th>Azonosító</th>
                  <th>Termék</th>
                  <th>Típus</th>
                  <th>Ellenőr</th>
                  <th>Dátum</th>
                  <th>Státusz</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inspections.map(ins => (
                  <tr key={ins.id}>
                    <td><strong style={{ color: 'var(--primary-color)' }}>{ins.id}</strong></td>
                    <td>{ins.product}</td>
                    <td><span className="type-tag">{ins.type}</span></td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar-small">{ins.technician.charAt(0)}</div>
                          <span>{ins.technician}</span>
                       </div>
                    </td>
                    <td className="text-muted">{ins.date}</td>
                    <td>
                       <span className={`status-badge ${ins.status === 'Passed' ? 'active' : ins.status === 'Failed' ? 'danger' : 'warning'}`}>
                          {ins.status === 'Passed' ? 'Megfelelt' : ins.status === 'Failed' ? 'Elutasítva' : 'Folyamatban'}
                       </span>
                    </td>
                    <td>
                      <button 
                        className="icon-btn" 
                        onClick={() => setSelectedInspection(ins)}
                        title="Részletek megtekintése"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {viewMode === 'ncr' && (
        <div className="ncr-view">
           <div className="ncr-grid">
              {ncrs.map(ncr => (
                <div key={ncr.id} className={`ncr-card glass ${ncr.status === 'Closed' ? 'ncr-closed' : ''}`} onClick={() => setSelectedNCR(ncr)}>
                   <div className="ncr-header">
                      <span className="ncr-id">{ncr.id}</span>
                      <span className={`severity-tag ${ncr.severity.toLowerCase()}`}>{ncr.severity}</span>
                   </div>
                   <h4 className="ncr-title">{ncr.title}</h4>
                   <div className="ncr-meta">
                      <div className="meta-item"><History size={14} /> {ncr.date}</div>
                      <div className="meta-item"><BarChart size={14} /> {ncr.source}</div>
                   </div>
                   <div className="ncr-footer">
                      <span className={`status-badge ${ncr.status === 'Closed' ? 'success' : 'warning'}`}>{ncr.status.toUpperCase()}</span>
                      <ChevronRight size={18} />
                   </div>
                </div>
              ))}
              <div className="ncr-card glass add-new-card" onClick={() => setIsAddNCRModalOpen(true)}>
                 <Plus size={32} />
                 <p>Új NCR rögzítése</p>
              </div>
           </div>
        </div>
      )}

      {viewMode === 'calibration' && (
        <div className="glass quality-table-container">
           <table className="data-table">
              <thead>
                <tr>
                  <th>Eszköz ID</th>
                  <th>Megnevezés</th>
                  <th>Gyári szám</th>
                  <th>Utolsó mérés</th>
                  <th>Következő mérés</th>
                  <th>Státusz</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {calibrations.map(cal => (
                  <tr key={cal.id}>
                    <td><strong style={{ color: '#3498db' }}>{cal.id}</strong></td>
                    <td style={{ fontWeight: 700 }}>{cal.name}</td>
                    <td className="text-muted">{cal.serial}</td>
                    <td>{cal.lastDate}</td>
                    <td>{cal.nextDate}</td>
                    <td>
                       <span className={`status-badge ${cal.status === 'Valid' ? 'active' : cal.status === 'Expired' ? 'danger' : 'warning'}`}>
                          {cal.status === 'Valid' ? 'Érvényes' : cal.status === 'Expired' ? 'Lejárt!' : 'Hamarosan lejár'}
                       </span>
                    </td>
                    <td>
                       <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="icon-btn" title="Jegyzőkönyv letöltése" onClick={() => handleDownloadCert(cal.id)}><Download size={16} /></button>
                          <button className="icon-btn" title="Új kalibráció ütemezése" onClick={() => handleScheduleCal(cal.id)}><Calendar size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      <Modal isOpen={isChecklistModalOpen} onClose={() => setIsChecklistModalOpen(false)} title="Minőségügyi Ellenőrző Lista" width="650px" footer={<><button className="view-btn" onClick={() => setIsChecklistModalOpen(false)}>Mégse</button><button className="create-btn" onClick={handleCompleteChecklist}>Ellenőrzés Befejezése</button></>}>
        <div className="checklist-modal-content">
           <div className="checklist-info-bar">
              <div><p className="text-muted">Termék:</p><strong>{activeInspectionItem?.product || 'Hőszigetelt kocsiablak'}</strong></div>
              <div><p className="text-muted">Azonosító:</p><strong>{activeInspectionItem?.id || 'N/A'}</strong></div>
           </div>
           <div className="checklist-items">
              {['Specifikáció szerinti méretek', 'Felületi épség ellenőrzése', 'Anyagminőségi tanúsítvány megléte', 'Funkcionális teszt elvégezve'].map((item, i) => (
                <div key={i} className="checklist-row">
                   <input type="checkbox" id={`check-${i}`} defaultChecked={true} />
                   <label htmlFor={`check-${i}`}>{item}</label>
                </div>
              ))}
           </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedNCR} onClose={() => setSelectedNCR(null)} title={`NCR: ${selectedNCR?.id}`} width="750px">
        {selectedNCR && (
          <div className="ncr-details-layout">
             <div className="ncr-details-sidebar"><div className="ncr-status-box glass"><p className="text-muted">STÁTUSZ</p><h3 style={{ color: selectedNCR.status === 'Closed' ? '#2ecc71' : '#f1c40f' }}>{selectedNCR.status.toUpperCase()}</h3></div><div className="ncr-timeline"><div className="t-node active"><div className="t-dot"></div> Rögzítve ({selectedNCR.date})</div><div className={`t-node ${selectedNCR.status !== 'Open' ? 'active' : ''}`}><div className="t-dot"></div> Kivizsgálás</div><div className={`t-node ${selectedNCR.status === 'Closed' ? 'active' : ''}`}><div className="t-dot"></div> Lezárás</div></div></div>
             <div className="ncr-details-content"><h3 style={{ marginBottom: '15px', fontWeight: 800 }}>{selectedNCR.title}</h3><p className="text-muted" style={{ marginBottom: '25px', lineHeight: '1.6' }}>{selectedNCR.description}</p><div className="action-box glass"><h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '15px' }}>JAVÍTÓ INTÉZKEDÉS</h4><p style={{ fontSize: '0.85rem' }}>Beszállító értesítése, tételek zárolása.</p></div><div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}><button className="view-btn" onClick={() => setIsGalleryOpen(true)}>Fotók</button>{selectedNCR.status !== 'Closed' ? (<button className="view-btn" style={{ borderColor: '#2ecc71', color: '#2ecc71' }} onClick={() => handleCloseNCR(selectedNCR.id)}><Lock size={16} /> NCR Lezárása</button>) : (<span className="status-badge success" style={{ padding: '10px 20px', borderRadius: '10px' }}><CheckCircle2 size={16} /> JEGYZőKÖNYV LEZÁRVA</span>)}</div></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isAddNCRModalOpen} onClose={() => setIsAddNCRModalOpen(false)} title="Új NCR Rögzítése" width="600px" footer={<><button className="view-btn" onClick={() => setIsAddNCRModalOpen(false)}>Mégse</button><button className="create-btn" onClick={handleAddNCR}>Mentés</button></>}>
        <div className="add-ncr-form"><div className="settings-group"><label>Hiba Megnevezése</label><input type="text" className="glass-input" value={newNCR.title} onChange={e => setNewNCR({...newNCR, title: e.target.value})} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}><div className="settings-group"><label>Forrás</label><select className="glass-input" value={newNCR.source} onChange={e => setNewNCR({...newNCR, source: e.target.value})}><option value="Gyártás">Gyártás</option><option value="Beszállítói">Beszállítói</option></select></div><div className="settings-group"><label>Súlyosság</label><select className="glass-input" value={newNCR.severity} onChange={e => setNewNCR({...newNCR, severity: e.target.value})}><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div></div><div className="settings-group"><label>Leírás</label><textarea className="glass-input" rows="4" value={newNCR.description} onChange={e => setNewNCR({...newNCR, description: e.target.value})}></textarea></div></div>
      </Modal>

      <Modal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} title="NCR Fotók" width="800px"><div className="ncr-gallery"><div className="gallery-main"><img src="/faulty_aluminum_scratch_1777313090746.png" alt="Fault" style={{ width: '100%', borderRadius: '15px' }} /></div></div></Modal>

      <Modal 
        isOpen={!!selectedInspection} 
        onClose={() => setSelectedInspection(null)} 
        title={`Ellenőrzés Részletei: ${selectedInspection?.id}`}
        width="550px"
      >
        {selectedInspection && (
          <div className="inspection-details">
            <div className="glass" style={{ padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="text-muted">Azonosító:</span>
                <strong style={{ color: 'var(--primary-color)' }}>{selectedInspection.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="text-muted">Termék:</span>
                <strong>{selectedInspection.product}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="text-muted">Típus:</span>
                <span className="type-tag">{selectedInspection.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="text-muted">Ellenőr:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="avatar-small">{selectedInspection.technician.charAt(0)}</div>
                  <span>{selectedInspection.technician}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="text-muted">Dátum:</span>
                <span>{selectedInspection.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Eredmény:</span>
                <span className={`status-badge ${selectedInspection.status === 'Passed' ? 'active' : 'danger'}`}>
                  {selectedInspection.status === 'Passed' ? 'Megfelelt' : 'Elutasítva'}
                </span>
              </div>
            </div>
            
            <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '15px' }}>Ellenőrzési Megjegyzések</h4>
              <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                {selectedInspection.status === 'Passed' 
                  ? "Az ellenőrzés során minden paraméter a specifikáción belül volt. A termék továbbengedve a következő gyártási fázisba."
                  : "Kritikus eltérés észlelhető a felületi minőségben. NCR jegyzőkönyv felvétele szükséges."}
              </p>
            </div>
            
            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
              <button className="view-btn" style={{ flex: 1 }} onClick={() => setSelectedInspection(null)}>Bezárás</button>
              <button className="create-btn" style={{ flex: 1 }} onClick={() => {
                addToast('Jegyzőkönyv generálása...', 'info');
                setSelectedInspection(null);
              }}>PDF Export</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Quality;

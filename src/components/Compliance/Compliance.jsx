import React, { useState } from 'react';
import { 
  Shield, 
  History, 
  FileCheck, 
  AlertOctagon, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ShieldAlert, 
  Lock,
  ChevronRight,
  TrendingUp,
  Scale,
  CalendarDays
} from 'lucide-react';
import auditLogService from '../../services/AuditLogService';
import './Compliance.css';

const Compliance = ({ addToast }) => {
  const [activeTab, setActiveTab] = useState('audit');
  const [logs] = useState(auditLogService.getLogs());

  const ncrList = [
    { id: 'NCR-2024-042', project: 'Stadler EuroDual', issue: 'Anyaghiba: Alumínium profil vetemedés', status: 'In Review', severity: 'High', date: '2024-04-20' },
    { id: 'NCR-2024-039', project: 'Siemens Vectron', issue: 'Mérethiba: Hegesztési varrat (A-oldal)', status: 'Resolved', severity: 'Medium', date: '2024-04-15' },
    { id: 'NCR-2024-045', project: 'ÖBB Railjet', issue: 'Dokumentációs hiány: Certifikáció elmaradt', status: 'Draft', severity: 'Low', date: '2024-04-23' },
  ];

  const supplierScorecards = [
    { name: 'Steel-Direct Kft.', rating: 'A', quality: 99.2, delivery: 100, status: 'Premium' },
    { name: 'Alu-Global Inc.', rating: 'B', quality: 94.5, delivery: 92, status: 'Certified' },
    { name: 'Fastener Solutions', rating: 'A', quality: 100, delivery: 98.5, status: 'Premium' },
    { name: 'Electronics Pro', rating: 'C', quality: 82.1, delivery: 75, status: 'Under Review' },
  ];

  const steps8D = [
    { name: 'D1: Team Formation', status: 'done' },
    { name: 'D2: Problem Description', status: 'done' },
    { name: 'D3: Interim Containment', status: 'done' },
    { name: 'D4: Root Cause Analysis', status: 'active' },
    { name: 'D5: Corrective Actions', status: 'pending' },
    { name: 'D6: Verification', status: 'pending' },
    { name: 'D7: Prevention', status: 'pending' },
    { name: 'D8: Recognition', status: 'pending' },
  ];

  return (
    <div className="compliance-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Megfelelőség & Biztonság</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Audit naplók, minőségügyi NCR-ek és rendszerbiztonság</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Audit riport letöltése...', 'success')}>
            <Download size={18} /> Exportálás
          </button>
        </div>
      </div>

      <div className="compliance-tabs">
        <div className={`comp-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
           <History size={16} /> Audit Trail
        </div>
        <div className={`comp-tab ${activeTab === 'ncr' ? 'active' : ''}`} onClick={() => setActiveTab('ncr')}>
           <AlertOctagon size={16} /> NCR & 8D Riport
        </div>
        <div className={`comp-tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
           <FileText size={16} /> Dokumentum Tár
        </div>
        <div className={`comp-tab ${activeTab === 'risks' ? 'active' : ''}`} onClick={() => setActiveTab('risks')}>
           <ShieldAlert size={16} /> Kockázati Jegyzék
        </div>
        <div className={`comp-tab ${activeTab === 'calibration' ? 'active' : ''}`} onClick={() => setActiveTab('calibration')}>
           <Scale size={16} /> Kalibrálás
        </div>
        <div className={`comp-tab ${activeTab === 'auditPlan' ? 'active' : ''}`} onClick={() => setActiveTab('auditPlan')}>
           <CalendarDays size={16} /> Audit Terv
        </div>
        <div className={`comp-tab ${activeTab === 'gdpr' ? 'active' : ''}`} onClick={() => setActiveTab('gdpr')}>
           <Shield size={16} /> GDPR
        </div>
        <div className={`comp-tab ${activeTab === 'suppliers' ? 'active' : ''}`} onClick={() => setActiveTab('suppliers')}>
           <FileCheck size={16} /> Beszállítói Minősítés
        </div>
        <div className={`comp-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
           <Lock size={16} /> Biztonság
        </div>
      </div>

      {activeTab === 'audit' && (
        <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div className="search-bar" style={{ width: '400px' }}>
                 <Search size={18} />
                 <input type="text" placeholder="Keresés az események között..." />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                 <button className="view-btn-small"><Filter size={14} /> Szűrés</button>
              </div>
           </div>

           <div className="audit-table-container">
              <div className="audit-row" style={{ fontWeight: 800, background: 'rgba(255,255,255,0.02)', borderBottom: '2px solid var(--border-color)' }}>
                 <span>IDÓPONT</span>
                 <span>FELHASZNÁLÓ</span>
                 <span>MODUL</span>
                 <span>MŰVELET</span>
              </div>
              {logs.map(log => (
                <div key={log.id} className="audit-row">
                   <span className="text-muted">{new Date(log.timestamp).toLocaleTimeString()}</span>
                   <span style={{ fontWeight: 700 }}>{log.user}</span>
                   <span className="status-badge active" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)' }}>{log.module}</span>
                   <span>{log.action}: <span className="text-muted">{log.details}</span></span>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'ncr' && (
        <div className="compliance-grid">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Aktív Nem-megfelelőségek (NCR)</h3>
                 {ncrList.map(ncr => (
                   <div key={ncr.id} className="ncr-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                         <span style={{ fontWeight: 800, color: '#e74c3c' }}>{ncr.id}</span>
                         <span className={`status-badge ${ncr.status === 'Resolved' ? 'success' : 'warning'}`}>{ncr.status}</span>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px' }}>{ncr.issue}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '15px' }}>Projekt: {ncr.project}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '0.7rem' }}>Bejelentve: {ncr.date}</span>
                         <button className="view-btn-small">Részletek</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Élő 8D Folyamat Vizualizáció</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {steps8D.map((step, i) => (
                   <div key={i} className="glass" style={{ padding: '10px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', opacity: step.status === 'pending' ? 0.4 : 1, borderLeft: step.status === 'active' ? '4px solid var(--primary-color)' : 'none' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: step.status === 'done' ? '#2ecc71' : step.status === 'active' ? 'var(--primary-color)' : 'var(--bg-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                         {step.status === 'done' ? <CheckCircle2 size={14} /> : i+1}
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{step.name}</span>
                      {step.status === 'active' && <span className="pulse-success" style={{ marginLeft: 'auto' }}></span>}
                   </div>
                 ))}
                 <button className="create-btn" style={{ marginTop: '15px', width: '100%' }}>
                    <FileText size={18} /> PDF Riport Generálása
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="compliance-grid">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>ISO Dokumentum Tár</h3>
                 <button className="view-btn-small"><Plus size={14} /> Új Feltöltése</button>
              </div>
              {[
                { name: 'Hegesztési Szabályzat', ref: 'ISO-WLD-042', version: 'v3.2', status: 'Approved' },
                { name: 'Munkavédelmi Kézikönyv', ref: 'SAFE-HS-001', version: 'v1.1', status: 'Review' },
                { name: 'Minőségirányítási Kézikönyv', ref: 'QM-ISO-9001', version: 'v4.0', status: 'Approved' }
              ].map((doc, i) => (
                <div key={i} className="doc-list-item">
                   <div style={{ padding: '10px', background: 'rgba(52, 152, 219, 0.1)', color: 'var(--primary-color)', borderRadius: '10px' }}>
                      <FileText size={20} />
                   </div>
                   <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{doc.name}</p>
                      <p className="text-muted" style={{ fontSize: '0.65rem' }}>Ref: {doc.ref} • Verzió: {doc.version}</p>
                   </div>
                   <span className={`status-badge ${doc.status === 'Approved' ? 'success' : 'warning'}`}>{doc.status}</span>
                </div>
              ))}
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '25px' }}>Jóváhagyási Munkafolyamat</h3>
              <div className="approval-timeline">
                 {[
                   { user: 'Kovács J. (Mérnökség)', action: 'Létrehozva', date: '2024-04-22 10:30', status: 'done' },
                   { user: 'Nagy T. (Minőségügy)', action: 'Ellenőrzés alatt', date: '2024-04-23 09:15', status: 'active' },
                   { user: 'Szabó L. (Ügyvezetés)', action: 'Végső jóváhagyás', date: '-', status: 'pending' }
                 ].map((step, i) => (
                   <div key={i} className="timeline-step">
                      <div className={`step-dot ${step.status}`}></div>
                      <div style={{ opacity: step.status === 'pending' ? 0.4 : 1 }}>
                         <p style={{ fontWeight: 800, fontSize: '0.8rem' }}>{step.action}</p>
                         <p style={{ fontSize: '0.75rem' }}>{step.user}</p>
                         <p className="text-muted" style={{ fontSize: '0.6rem' }}>{step.date}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(52, 152, 219, 0.05)', borderRadius: '12px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                 <div className="pulse-info"></div>
                 <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>Várakozás a minőségügyi ellenőrzésre...</p>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="compliance-grid">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>Kockázati Hőtérkép (ISO 31000)</h3>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '20px' }}>Valószínűség vs. Hatás mátrix</p>
              
              <div className="risk-matrix">
                 {Array.from({ length: 25 }).map((_, i) => {
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    const level = row + col;
                    let cls = 'low';
                    if (level >= 6) cls = 'critical';
                    else if (level >= 4) cls = 'high';
                    else if (level >= 2) cls = 'medium';
                    
                    return (
                      <div key={i} className={`risk-cell ${cls}`}>
                         {i === 2 ? 'R1' : i === 7 ? 'R4' : i === 22 ? 'R8' : ''}
                      </div>
                    );
                 })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                 <span>ALACSONY HATÁS</span>
                 <span>KRITIKUS HATÁS</span>
              </div>
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Aktív Kockázatok és Enyhítés</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {[
                   { id: 'R1', title: 'Alapanyag áremelkedés', impact: 'High', mitigation: 'Hosszú távú fix áras szerződések' },
                   { id: 'R4', title: 'Szakember hiány', impact: 'Medium', mitigation: 'Belső képzési rendszer (Skill Matrix)' },
                   { id: 'R8', title: 'Szoftverleállás', impact: 'Critical', mitigation: 'Redundáns szerverek és napi mentés' }
                 ].map(risk => (
                   <div key={risk.id} className="ncr-card" style={{ borderLeft: `5px solid ${risk.impact === 'Critical' ? '#e74c3c' : risk.impact === 'High' ? '#e67e22' : '#f1c40f'}` }}>
                      <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>{risk.id}: {risk.title}</p>
                      <p style={{ fontSize: '0.75rem', margin: '5px 0' }}><span className="text-muted">Enyhítési terv:</span> {risk.mitigation}</p>
                      <span className="status-badge" style={{ fontSize: '0.6rem' }}>Besorolás: {risk.impact}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'calibration' && (
        <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Mérőeszköz Kalibrálás Kezelő</h3>
              <button className="view-btn-small"><Plus size={14} /> Eszköz Hozzáadása</button>
           </div>
           
           {[
             { id: 'TOL-001', name: 'Digitális Tolómérő (Mitutoyo)', lastDate: '2023-11-12', nextDate: '2024-05-12', status: 'valid' },
             { id: 'NYO-042', name: 'Nyomatékkulcs (Stahlwille)', lastDate: '2023-04-01', nextDate: '2024-04-01', status: 'expired' },
             { id: 'MIV-009', name: 'Mikrométer (Mahr)', lastDate: '2023-10-20', nextDate: '2024-04-20', status: 'warning' }
           ].map((tool, i) => (
             <div key={i} className={`calib-card ${tool.status === 'expired' ? 'pulse-expired' : ''}`}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                   <div className={`calib-status-icon ${tool.status}`}>
                      <Scale size={20} />
                   </div>
                   <div>
                      <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>{tool.name}</p>
                      <p className="text-muted" style={{ fontSize: '0.65rem' }}>Eszköz ID: {tool.id}</p>
                   </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                   <p className="text-muted" style={{ fontSize: '0.6rem' }}>Utolsó hitelesítés</p>
                   <p style={{ fontWeight: 700, fontSize: '0.75rem' }}>{tool.lastDate}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                   <p className="text-muted" style={{ fontSize: '0.6rem' }}>Következő hitelesítés</p>
                   <p style={{ fontWeight: 800, fontSize: '0.75rem', color: tool.status === 'expired' ? '#e74c3c' : 'inherit' }}>{tool.nextDate}</p>
                </div>
                <span className={`status-badge ${tool.status === 'valid' ? 'success' : tool.status === 'expired' ? 'danger' : 'warning'}`}>
                   {tool.status.toUpperCase()}
                </span>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'auditPlan' && (
        <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Vállalati Audit Tervező</h3>
              <button className="create-btn"><Plus size={18} /> Új Audit Ütemezése</button>
           </div>
           
           {[
             { day: '14', month: 'MÁJ', title: 'ISO 9001:2015 Belső Audit', area: 'Gyártás & Logisztika', auditor: 'Dr. Szabó Péter', status: 'Planned' },
             { day: '28', month: 'MÁJ', title: 'IRIS Vasúti Tanúsítás', area: 'Mérnökség & Design', auditor: 'TÜV Rheinland', status: 'External' },
             { day: '12', month: 'JÚN', title: 'Munkavédelmi Ellenőrzés', area: 'Üzemcsarnok B', auditor: 'Varga László', status: 'Planned' }
           ].map((audit, i) => (
             <div key={i} className="audit-plan-card">
                <div className="audit-date-box">
                   <span className="day">{audit.day}</span>
                   <span className="month">{audit.month}</span>
                </div>
                <div>
                   <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{audit.title}</p>
                   <p className="text-muted" style={{ fontSize: '0.75rem' }}>Terület: {audit.area}</p>
                </div>
                <div>
                   <p className="text-muted" style={{ fontSize: '0.65rem' }}>Auditor</p>
                   <p style={{ fontWeight: 700, fontSize: '0.8rem' }}>{audit.auditor}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <span className={`status-badge ${audit.status === 'External' ? 'warning' : 'active'}`}>{audit.status}</span>
                </div>
             </div>
           ))}
           
           <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(52, 152, 219, 0.05)', borderRadius: '15px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px' }}>Audit Eredményesség (YTD)</h4>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                 <div style={{ width: '85%', height: '100%', background: '#2ecc71' }} title="Lezárva"></div>
                 <div style={{ width: '10%', height: '100%', background: '#f1c40f' }} title="Folyamatban"></div>
                 <div style={{ width: '5%', height: '100%', background: '#e74c3c' }} title="Kritikus hiba"></div>
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.7rem' }}>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#2ecc71' }}></div> 85% Sikeres</div>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#f1c40f' }}></div> 10% Javító intézkedés</div>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#e74c3c' }}></div> 5% Eltérés</div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'gdpr' && (
        <div className="compliance-grid">
           <div className="gdpr-score-card glass">
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>Adatvédelmi Mutató</h3>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#2ecc71', margin: '20px 0' }}>98%</div>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>A vállalati adatkezelés megfelel a 2016/679 EU rendeletnek.</p>
              <div className="status-badge success" style={{ marginTop: '20px' }}>ALACSONY KOCKÁZAT</div>
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Adatkezelési Tevékenységek (ROPA)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {[
                   { name: 'Dolgozói bérszámfejtés', type: 'Személyes', legal: 'Szerződéses', period: '7 év' },
                   { name: 'Ügyfél kapcsolattartás', type: 'Business', legal: 'Jogos érdek', period: '5 év' },
                   { name: 'Beléptető rendszer (Kamera)', type: 'Biometrikus', legal: 'Biztonság', period: '3 nap' }
                 ].map((rec, i) => (
                   <div key={i} className="data-record-item">
                      <div>
                         <p style={{ fontWeight: 700, fontSize: '0.8rem' }}>{rec.name}</p>
                         <p className="text-muted" style={{ fontSize: '0.6rem' }}>Jogalap: {rec.legal}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <span className="status-badge" style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.05)' }}>{rec.period}</span>
                      </div>
                   </div>
                 ))}
                 <button className="view-btn-small" style={{ marginTop: '10px' }}>Teljes ROPA Jegyzék Letöltése</button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '25px' }}>Beszállítói Minősítési Rendszer (Scorecards)</h3>
           <table className="data-table">
              <thead>
                 <tr>
                    <th>Beszállító</th>
                    <th style={{ textAlign: 'center' }}>Rating</th>
                    <th>Minőség (PPM)</th>
                    <th>Szállítási Pontosság</th>
                    <th>Státusz</th>
                 </tr>
              </thead>
              <tbody>
                 {supplierScorecards.map((s, i) => (
                   <tr key={i}>
                      <td><span style={{ fontWeight: 800 }}>{s.name}</span></td>
                      <td style={{ textAlign: 'center' }}>
                         <span style={{ 
                           background: s.rating === 'A' ? '#2ecc71' : s.rating === 'B' ? '#3498db' : '#e74c3c',
                           color: 'white',
                           padding: '5px 12px',
                           borderRadius: '8px',
                           fontWeight: 900
                         }}>{s.rating}</span>
                      </td>
                      <td>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                               <div style={{ width: `${s.quality}%`, height: '100%', background: s.quality > 90 ? '#2ecc71' : '#f1c40f' }}></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{s.quality}%</span>
                         </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{s.delivery}%</td>
                      <td>
                         <span className={`status-badge ${s.status === 'Premium' ? 'active' : s.status === 'Certified' ? 'info' : 'danger'}`}>
                            {s.status}
                         </span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '25px' }}>Rendszerbiztonsági Monitor</h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
              <div className="security-badge">
                 <Server size={24} color="#2ecc71" />
                 <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Szerver Állapot</p>
                    <p style={{ color: '#2ecc71', fontSize: '0.75rem', fontWeight: 700 }}>Biztonságos</p>
                 </div>
              </div>
              <div className="security-badge">
                 <UserCheck size={24} color="#3498db" />
                 <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>RBAC Aktív</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>Role-Based Access</p>
                 </div>
              </div>
              <div className="security-badge">
                 <Eye size={24} color="#f1c40f" />
                 <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Élő Monitorozás</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>Anomália figyelés aktív</p>
                 </div>
              </div>
           </div>

           <div style={{ marginTop: '40px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '15px' }}>Hozzáférési Szintek</h4>
              <div className="audit-table-container">
                 {[
                   { role: 'Administrator', users: 2, access: 'Full System', status: 'Encrypted' },
                   { role: 'Engineer', users: 15, access: 'Projects, Manufacturing', status: 'Standard' },
                   { role: 'Accountant', users: 4, access: 'Invoicing, Purchase', status: 'Standard' }
                 ].map((r, i) => (
                   <div key={i} className="audit-row" style={{ gridTemplateColumns: '200px 100px 1fr 100px' }}>
                      <span style={{ fontWeight: 800 }}>{r.role}</span>
                      <span>{r.users} fő</span>
                      <span className="text-muted">{r.access}</span>
                      <span style={{ color: '#2ecc71', fontWeight: 700 }}>{r.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;

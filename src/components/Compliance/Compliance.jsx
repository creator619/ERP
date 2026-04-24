import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  History, 
  AlertOctagon, 
  FileCheck, 
  UserCheck, 
  Eye, 
  Download, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldAlert,
  Server
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

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
           <History size={16} /> Eseménynapló (Audit Trail)
        </div>
        <div className={`comp-tab ${activeTab === 'ncr' ? 'active' : ''}`} onClick={() => setActiveTab('ncr')}>
           <AlertOctagon size={16} /> NCR & Minőség (8D)
        </div>
        <div className={`comp-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
           <Lock size={16} /> Rendszerbiztonság
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
                      <button className="view-btn-small" onClick={() => addToast('8D jelentés generálása...', 'info')}>8D Letöltés</button>
                   </div>
                </div>
              ))}
           </div>

           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Minőségügyi Statisztikák</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div className="security-badge">
                    <CheckCircle2 color="#2ecc71" size={32} />
                    <div>
                       <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>98.2%</p>
                       <p className="text-muted" style={{ fontSize: '0.7rem' }}>Elsőre jó (FTY) arány</p>
                    </div>
                 </div>
                 <div className="security-badge" style={{ background: 'rgba(231, 76, 60, 0.05)', borderColor: 'rgba(231, 76, 60, 0.2)' }}>
                    <ShieldAlert color="#e74c3c" size={32} />
                    <div>
                       <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>1.8%</p>
                       <p className="text-muted" style={{ fontSize: '0.7rem' }}>NCR hibaarány (YTD)</p>
                    </div>
                 </div>
              </div>
              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(52, 152, 219, 0.05)', borderRadius: '15px' }}>
                 <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#3498db' }}>ISO 9001:2015 Compliance</p>
                 <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '5px' }}>A rendszer teljes mértékben megfelel a minőségirányítási előírásoknak.</p>
              </div>
           </div>
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

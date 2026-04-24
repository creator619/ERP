import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Search, 
  Mail, 
  Phone,
  CheckCircle2,
  Clock,
  MoreVertical,
  Award,
  TrendingUp,
  DollarSign,
  Heart,
  Umbrella,
  GraduationCap,
  Target,
  ShieldCheck,
  AlertTriangle,
  Ban
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './HR.css';

const HR = ({ addToast }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMainView, setActiveMainView] = useState('employees');

  const [employees, setEmployees] = useState([
    { 
      id: 1, 
      name: 'Kovács János', 
      role: 'Rendszergazda', 
      dept: 'IT', 
      status: 'Aktív', 
      kpi: 92,
      certifications: [
        { name: 'ISO 27001 Auditor', expiry: '2025-10-12', status: 'valid' },
        { name: 'CCNA Security', expiry: '2024-06-01', status: 'warning' }
      ]
    },
    { 
      id: 2, 
      name: 'Nagy Péter', 
      role: 'Minősített Hegesztő', 
      dept: 'Gyártás', 
      status: 'Aktív', 
      kpi: 88,
      certifications: [
        { name: 'EN ISO 9606-1', expiry: '2024-12-15', status: 'valid' },
        { name: 'Tűzvédelmi szakvizsga', expiry: '2024-04-20', status: 'expired' }
      ]
    },
    { 
      id: 3, 
      name: 'Szabó Anna', 
      role: 'Projektmenedzser', 
      dept: 'Management', 
      status: 'Aktív', 
      kpi: 95,
      certifications: [
        { name: 'PMP Certification', expiry: '2026-01-10', status: 'valid' }
      ]
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'Kovács János', type: 'Fizetett', start: '2024-05-01', end: '2024-05-05', status: 'Pending' },
    { id: 2, name: 'Szabó Anna', type: 'Betegszabadság', start: '2024-04-20', end: '2024-04-22', status: 'Approved' },
    { id: 3, name: 'Nagy Péter', type: 'Fizetett', start: '2024-06-10', end: '2024-06-20', status: 'Pending' }
  ]);

  const openEmployeeDetails = (emp) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
    setActiveTab('overview');
  };

  const getKPIColor = (val) => {
    if (val >= 90) return '#2ecc71';
    if (val >= 75) return '#f1c40f';
    return '#e74c3c';
  };

  return (
    <div className="hr-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Humánerőforrás & Képzés</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Kompetencia-mátrix és teljesítménymérés</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új munkatárs felvétele', 'info')}>
          <UserPlus size={20} /> Új Alkalmazott
        </button>
      </div>

      <div className="hr-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Létszám</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>124 fő</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Átlag KPI</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2ecc71' }}>86%</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Lejáró vizsgák</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e74c3c' }}>8 db</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Fluktuáció</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>2.4%</div>
        </div>
      </div>

      <div className="module-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={`tab-btn ${activeMainView === 'employees' ? 'active' : ''}`} onClick={() => setActiveMainView('employees')}>
          <Users size={16} /> Dolgozók
        </button>
        <button className={`tab-btn ${activeMainView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveMainView('matrix')}>
          <Target size={16} /> Kompetencia Mátrix
        </button>
        <button className={`tab-btn ${activeMainView === 'leaves' ? 'active' : ''}`} onClick={() => setActiveMainView('leaves')}>
          <Calendar size={16} /> Szabadságkezelés
        </button>
        <button className={`tab-btn ${activeMainView === 'recruitment' ? 'active' : ''}`} onClick={() => setActiveMainView('recruitment')}>
          <Briefcase size={16} /> Toborzás
        </button>
      </div>

      {activeMainView === 'employees' && (
        <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Alkalmazott</th>
                <th>Beosztás</th>
                <th>Osztály</th>
                <th>Teljesítmény</th>
                <th>Vizsgák</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} onClick={() => openEmployeeDetails(emp)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 600 }}>{emp.name}</span>
                    </div>
                  </td>
                  <td>{emp.role}</td>
                  <td><span className="text-muted">{emp.dept}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', width: '60px', background: 'var(--border-color)', borderRadius: '3px' }}>
                        <div style={{ width: `${emp.kpi}%`, height: '100%', background: getKPIColor(emp.kpi), borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{emp.kpi}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {emp.certifications.map((c, i) => (
                        <div key={i} title={c.name} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.status === 'valid' ? '#2ecc71' : c.status === 'warning' ? '#f1c40f' : '#e74c3c' }}></div>
                      ))}
                    </div>
                  </td>
                  <td><button className="view-btn-small"><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'matrix' && (
        <div className="matrix-view glass" style={{ padding: '20px', borderRadius: '15px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>Kompetencia és Vizsga Mátrix</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dolgozó</th>
                  <th>ISO 27001</th>
                  <th>CCNA Sec</th>
                  <th>ISO 9606-1</th>
                  <th>Tűzvédelem</th>
                  <th>PMP</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td><span style={{ fontWeight: 600 }}>{emp.name}</span></td>
                    {[
                      'ISO 27001 Auditor', 
                      'CCNA Security', 
                      'EN ISO 9606-1', 
                      'Tűzvédelmi szakvizsga', 
                      'PMP Certification'
                    ].map(cert => {
                      const hasCert = emp.certifications.find(c => c.name === cert);
                      return (
                        <td key={cert} style={{ textAlign: 'center' }}>
                          {hasCert ? (
                            <div style={{ 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '50%', 
                              margin: '0 auto',
                              background: hasCert.status === 'valid' ? '#2ecc71' : hasCert.status === 'warning' ? '#f1c40f' : '#e74c3c',
                              boxShadow: `0 0 10px ${hasCert.status === 'valid' ? 'rgba(46, 204, 113, 0.4)' : hasCert.status === 'warning' ? 'rgba(241, 196, 15, 0.4)' : 'rgba(231, 76, 60, 0.4)'}`
                            }}></div>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.1)' }}>-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeMainView === 'leaves' && (
        <div className="leaves-view glass" style={{ padding: '20px', borderRadius: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Függőben lévő kérések</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Dolgozó</th>
                <th>Típus</th>
                <th>Időszak</th>
                <th>Státusz</th>
                <th>Művelet</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map(req => (
                <tr key={req.id}>
                  <td><span style={{ fontWeight: 600 }}>{req.name}</span></td>
                  <td>{req.type}</td>
                  <td><span className="text-muted">{req.start} - {req.end}</span></td>
                  <td>
                    <span className={`status-badge ${req.status === 'Approved' ? 'active' : 'warning'}`}>
                      {req.status === 'Approved' ? 'Jóváhagyva' : 'Függőben'}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="view-btn-small" style={{ color: '#2ecc71' }} onClick={() => {
                          setLeaveRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
                          addToast('Szabadság jóváhagyva', 'success');
                          auditLogService.log({ user: 'HR Manager', action: 'Szabadság jóváhagyva', module: 'HR', details: req.name, severity: 'success' });
                        }}><CheckCircle2 size={16} /></button>
                        <button className="view-btn-small" style={{ color: '#e74c3c' }}><Ban size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'recruitment' && (
        <div className="recruitment-view glass" style={{ padding: '25px', borderRadius: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Aktív Toborzások</h3>
            <button className="view-btn-small">Összes állás megnyitása</button>
          </div>
          <div className="recruitment-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="glass" style={{ padding: '15px', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
              <div style={{ fontWeight: 700 }}>Senior Hegesztő Mérnök</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>Jelentkezők: 12 fő | Státusz: Interjúk folyamatban</div>
            </div>
            <div className="glass" style={{ padding: '15px', borderRadius: '12px', borderLeft: '4px solid #2ecc71' }}>
              <div style={{ fontWeight: 700 }}>Minőségügyi Ellenőr</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>Jelentkezők: 8 fő | Státusz: Kiválasztva</div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Dolgozói Profil: ${selectedEmployee?.name}`}
        width="850px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Profil frissítve', 'success')}>Adatok mentése</button>
          </>
        }
      >
        {selectedEmployee && (
          <div className="hr-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Áttekintés</div>
              <div className={`settings-nav-item ${activeTab === 'training' ? 'active' : ''}`} onClick={() => setActiveTab('training')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Képzési Mátrix</div>
            </div>

            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase' }}>Teljesítmény (KPI)</h4>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: getKPIColor(selectedEmployee.kpi) }}>{selectedEmployee.kpi}%</div>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>Havi hatékonysági index</p>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span className="text-muted">Minőség</span>
                        <span style={{ fontWeight: 700 }}>94%</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span className="text-muted">Határidő</span>
                        <span style={{ fontWeight: 700 }}>88%</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span className="text-muted">Fegyelem</span>
                        <span style={{ fontWeight: 700 }}>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase' }}>Személyes Adatok</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Munkaviszony kezdete:</span>
                      <span style={{ fontWeight: 600 }}>2020.05.12</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Munkabér:</span>
                      <span style={{ fontWeight: 600 }}>Bizalmas (HR+)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Szabadság (Nap):</span>
                      <span style={{ fontWeight: 600 }}>12 / 25</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="training-view">
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px' }}>Szakmai Tanúsítványok</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedEmployee.certifications.map((c, i) => (
                    <div key={i} className="glass" style={{ padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${c.status === 'valid' ? '#2ecc71' : c.status === 'warning' ? '#f1c40f' : '#e74c3c'}` }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {c.status === 'valid' ? <ShieldCheck size={20} color="#2ecc71" /> : <AlertTriangle size={20} color={c.status === 'warning' ? '#f1c40f' : '#e74c3c'} />}
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</p>
                          <p className="text-muted" style={{ fontSize: '0.75rem' }}>Lejárat: {c.expiry}</p>
                        </div>
                      </div>
                      <span className={`status-badge ${c.status === 'valid' ? 'active' : c.status === 'warning' ? 'warning' : 'danger'}`}>
                        {c.status === 'valid' ? 'Érvényes' : c.status === 'warning' ? 'Hamarosan lejár' : 'LEJÁRT'}
                      </span>
                    </div>
                  ))}
                  <button className="view-btn" style={{ width: '100%', marginTop: '10px' }}>
                    <GraduationCap size={16} /> Új képzés rögzítése
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HR;

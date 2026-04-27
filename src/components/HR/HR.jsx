import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone,
  CheckCircle2,
  Clock,
  MoreVertical,
  Award,
  TrendingUp,
  Target,
  ShieldCheck,
  AlertTriangle,
  Ban,
  GraduationCap
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './HR.css';

const HR = ({ addToast }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMainView, setActiveMainView] = useState('employees');
  
  // States for micro animations
  const [approvingLeaveId, setApprovingLeaveId] = useState(null);

  const [employees, setEmployees] = useState([
    { 
      id: 1, 
      name: 'Kovács János', 
      role: 'Rendszergazda', 
      dept: 'IT', 
      status: 'Aktív', 
      kpi: 92,
      shifts: ['DE', 'DE', 'DU', 'DU', 'ÉJS', 'PIH', 'PIH'],
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
      shifts: ['DU', 'DU', 'DE', 'DE', 'ÉJS', 'PIH', 'PIH'],
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
      kpi: 98,
      shifts: ['DE', 'DE', 'DE', 'DE', 'SZAB', 'PIH', 'PIH'],
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
    if (val >= 75) return '#f39c12';
    return '#e74c3c';
  };

  const STYLES_MAP = {
    'DE': 'morning',
    'DU': 'afternoon',
    'ÉJS': 'night',
    'SZAB': 'leave',
    'PIH': 'rest'
  };

  const SHIFT_CYCLE = ['DE', 'DU', 'ÉJS', 'SZAB', 'PIH'];

  const handleShiftChange = (empId, dayIdx) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        const newShifts = [...emp.shifts];
        const currentIndex = SHIFT_CYCLE.indexOf(newShifts[dayIdx]);
        newShifts[dayIdx] = SHIFT_CYCLE[(currentIndex + 1) % SHIFT_CYCLE.length];
        return { ...emp, shifts: newShifts };
      }
      return emp;
    }));
  };

  const dailyCheckIn = () => {
    auditLogService.log({
      user: 'Jelenlegi Felhasználó',
      action: 'Napi Blokkolás',
      module: 'HR',
      details: 'Sikeres érkeztetés rögzítve.',
      severity: 'success'
    });
    addToast('Sikeres napi érkeztetés (Blokkolás) rögzítve', 'success');
  };

  const handleApproveLeave = (reqId) => {
    setApprovingLeaveId(reqId);
    
    // Smooth micro-animation timeout
    setTimeout(() => {
       setLeaveRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
       setApprovingLeaveId(null);
       addToast('Szabadság jóváhagyva', 'success');
    }, 600);
  };

  const handleAddCertification = () => {
    if (!selectedEmployee) return;

    const newCert = {
      name: 'Munkavédelmi továbbképzés (2024)',
      expiry: '2025-04-27',
      status: 'valid'
    };

    setEmployees(prev => prev.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          certifications: [...emp.certifications, newCert]
        };
      }
      return emp;
    }));

    // Update the selected employee in local state too
    setSelectedEmployee(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));

    addToast(`Új vizsga rögzítve: ${selectedEmployee.name}`, 'success');
    
    auditLogService.log({
      user: 'Simon Ernő',
      action: 'Új képzés rögzítve',
      module: 'HR',
      details: `${selectedEmployee.name} - ${newCert.name}`,
      severity: 'info'
    });
  };

  // Modern SVG Gauge rendering
  const renderGauge = (val) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    // We only want a 270 degree arc (0.75 of circle)
    const arcLength = circumference * 0.75; 
    const dashoffset = circumference - ((val / 100) * arcLength);

    return (
      <div className="gauge-container">
        <svg fill="transparent" width="150" height="150" viewBox="0 0 100 100" className="gauge-svg">
          <circle className="gauge-bg" cx="50" cy="50" r={radius} strokeDasharray={`${arcLength} ${circumference}`} strokeDashoffset="0" />
          <circle 
            className="gauge-progress" cx="50" cy="50" r={radius} 
            stroke={getKPIColor(val)} 
            style={{ '--target-offset': dashoffset, strokeDasharray: circumference }} 
          />
        </svg>
        <div className="gauge-text">
           <span style={{ fontSize: '2rem', fontWeight: 900, color: getKPIColor(val) }}>{val}%</span>
           <span className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Hatékonyság</span>
        </div>
      </div>
    );
  };

  return (
    <div className="hr-module">
      <div className="invoicing-header" style={{ marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Humánerőforrás (HR)</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Átfogó alkalmazotti profilok és kompetenciamenedzsment</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={dailyCheckIn} style={{ borderColor: '#9b59b6', color: '#9b59b6' }}>
            <Clock size={16} /> Érkeztetés
          </button>
          <button className="create-btn" style={{ background: '#9b59b6', boxShadow: '0 4px 15px rgba(155, 89, 182, 0.3)' }} onClick={() => addToast('Új munkatárs felvétele felület', 'info')}>
            <UserPlus size={18} /> Alkalmazott Kódolása
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '35px' }}>
        <div className="stat-card">
          <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>Teljes Létszám</p>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>124 fő</div>
        </div>
        <div className="stat-card">
          <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>Átlagos KPI (Havi)</p>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
             86% <TrendingUp size={18} />
          </div>
        </div>
        <div className="stat-card">
          <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>Lejáratközeli Vizsgák</p>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e74c3c' }}>8 db</div>
        </div>
        <div className="stat-card">
          <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>Fluktuációs Ráta</p>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>2.4%</div>
        </div>
      </div>

      <div className="module-tabs" style={{ display: 'flex', gap: '5px', marginBottom: '25px', background: 'var(--bg-card)', padding: '5px', borderRadius: '15px', width: 'fit-content', border: '1px solid var(--border-color)' }}>
        <button className={`tab-btn ${activeMainView === 'employees' ? 'active' : ''}`} onClick={() => setActiveMainView('employees')}>
          <Users size={16} /> Dolgozói Adatbázis
        </button>
        <button className={`tab-btn ${activeMainView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveMainView('matrix')}>
          <Target size={16} /> Kompetencia Mátrix
        </button>
        <button className={`tab-btn ${activeMainView === 'shifts' ? 'active' : ''}`} onClick={() => setActiveMainView('shifts')}>
          <Clock size={16} /> Műszakbeosztás
        </button>
        <button className={`tab-btn ${activeMainView === 'leaves' ? 'active' : ''}`} onClick={() => setActiveMainView('leaves')}>
          <Calendar size={16} /> Szabadság
        </button>
      </div>

      {activeMainView === 'employees' && (
        <div className="list-view" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Név / Identitás</th>
                <th>Beosztás</th>
                <th>Osztály</th>
                <th>Hatékonyság (KPI)</th>
                <th>Jogosítványok</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} onClick={() => openEmployeeDetails(emp)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', border: '1px solid rgba(155, 89, 182, 0.3)' }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{emp.name}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{emp.role}</td>
                  <td><span className="text-muted" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{emp.dept}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, height: '8px', width: '80px', background: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${emp.kpi}%`, height: '100%', background: getKPIColor(emp.kpi), borderRadius: '4px', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{emp.kpi}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {emp.certifications.map((c, i) => (
                        <div key={i} title={c.name} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.status === 'valid' ? '#2ecc71' : c.status === 'warning' ? '#f39c12' : '#e74c3c', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}><button className="view-btn-small" style={{ borderRadius: '8px' }}><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'matrix' && (
        <div className="matrix-view" style={{ padding: '30px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}><Target color="#9b59b6" /> Szakmai Kompetencia Mátrix (Heatmap)</h3>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="matrix-cell" style={{ background: 'rgba(46, 204, 113, 0.8)', margin: 0 }}></div> Szakértő</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="matrix-cell" style={{ background: 'rgba(52, 152, 219, 0.8)', margin: 0 }}></div> Haladó</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div className="matrix-cell" style={{ background: 'rgba(241, 196, 15, 0.8)', margin: 0 }}></div> Kezdő</div>
            </div>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Név</th>
                  <th style={{ textAlign: 'center' }}>Hegesztés</th>
                  <th style={{ textAlign: 'center' }}>CNC Prog.</th>
                  <th style={{ textAlign: 'center' }}>Minőségell.</th>
                  <th style={{ textAlign: 'center' }}>Logisztika</th>
                  <th style={{ textAlign: 'center' }}>Villanyszer.</th>
                  <th style={{ textAlign: 'center' }}>CAD/CAM</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td><span style={{ fontWeight: 800 }}>{emp.name}</span></td>
                    <td style={{ textAlign: 'center' }}><div className="matrix-cell" style={{ background: emp.id === 2 ? 'rgba(46, 204, 113, 0.8)' : 'rgba(241, 196, 15, 0.8)' }} title={`${emp.name}: Hegesztés`}></div></td>
                    <td style={{ textAlign: 'center' }}><div className="matrix-cell" style={{ background: emp.id === 1 ? 'rgba(52, 152, 219, 0.8)' : 'var(--bg-main)' }} title={`${emp.name}: CNC`}></div></td>
                    <td style={{ textAlign: 'center' }}><div className="matrix-cell" style={{ background: emp.id === 2 ? 'rgba(52, 152, 219, 0.8)' : 'rgba(46, 204, 113, 0.8)' }} title={`${emp.name}: Minőség`}></div></td>
                    <td style={{ textAlign: 'center' }}><div className="matrix-cell" style={{ background: emp.id === 3 ? 'rgba(46, 204, 113, 0.8)' : 'var(--bg-main)' }} title={`${emp.name}: Logisztika`}></div></td>
                    <td style={{ textAlign: 'center' }}><div className="matrix-cell" style={{ background: 'rgba(241, 196, 15, 0.8)' }} title={`${emp.name}: Villanyszerelés`}></div></td>
                    <td style={{ textAlign: 'center' }}><div className="matrix-cell" style={{ background: emp.id === 1 ? 'rgba(46, 204, 113, 0.8)' : 'rgba(52, 152, 219, 0.8)' }} title={`${emp.name}: CAD/CAM`}></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeMainView === 'shifts' && (
        <div className="shifts-view" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock color="#9b59b6" /> Heti Műszak Kiosztás (Kapszulák)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="shift-grid" style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <div style={{ paddingLeft: '10px' }}>Alkalmazott Identitás</div>
              <div style={{ textAlign: 'center' }}>Hétfő</div><div style={{ textAlign: 'center' }}>Kedd</div><div style={{ textAlign: 'center' }}>Szerda</div><div style={{ textAlign: 'center' }}>Csütörtök</div><div style={{ textAlign: 'center' }}>Péntek</div><div style={{ color: '#e74c3c', textAlign: 'center' }}>Szombat</div><div style={{ color: '#e74c3c', textAlign: 'center' }}>Vasárnap</div>
            </div>
            {employees.map(emp => (
              <div key={emp.id} className="shift-grid" style={{ background: 'var(--bg-main)', borderRadius: '15px', border: '1px solid var(--border-color)', padding: '15px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{emp.name}</div>
                {emp.shifts.map((shift, idx) => (
                  <div 
                    key={idx} 
                    className={`shift-cell ${STYLES_MAP[shift]}`} 
                    onClick={() => handleShiftChange(emp.id, idx)}
                    title="Kattints a váltáshoz"
                  >
                    {shift}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMainView === 'leaves' && (
        <div className="leaves-view list-view" style={{ padding: '30px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar color="#9b59b6" /> Beérkező Szabadságigények</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Feladó</th>
                <th>Típus</th>
                <th>Időszak (Start - End)</th>
                <th>Engedély Státusz</th>
                <th>Akció</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map(req => (
                <tr key={req.id} className={`leave-row ${approvingLeaveId === req.id ? 'approving' : ''}`}>
                  <td><span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{req.name}</span></td>
                  <td style={{ fontWeight: 600 }}>{req.type}</td>
                  <td><span className="text-muted" style={{ fontWeight: 600 }}>{req.start} <span style={{ margin: '0 5px' }}>&rarr;</span> {req.end}</span></td>
                  <td>
                    <span className={`status-badge ${req.status === 'Approved' ? 'active' : 'warning'}`}>
                      {req.status === 'Approved' ? 'Jóváhagyva' : 'Függőben'}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="view-btn-small" style={{ color: '#2ecc71', borderColor: 'rgba(46, 204, 113, 0.3)' }} onClick={() => handleApproveLeave(req.id)} disabled={approvingLeaveId === req.id}>
                          <CheckCircle2 size={16} /> {approvingLeaveId === req.id ? '...' : ''}
                        </button>
                        <button className="view-btn-small" style={{ color: '#e74c3c', borderColor: 'rgba(231, 76, 60, 0.3)' }} disabled={approvingLeaveId === req.id}><Ban size={16} /></button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Lezárva</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEmployee ? `Employee Digital Twin: ${selectedEmployee.name}` : ''}
        width="800px"
        footer={
           <button className="view-btn" onClick={() => setIsModalOpen(false)}>Ablak Bezárása</button>
        }
      >
        {selectedEmployee && (
          <div className="hr-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '30px', background: 'transparent', padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, textAlign: 'center' }}>Áttekintés & Teljesítmény</div>
              <div className={`settings-nav-item ${activeTab === 'training' ? 'active' : ''}`} onClick={() => setActiveTab('training')} style={{ flex: 1, textAlign: 'center' }}>Végzettség & Engedélyek</div>
            </div>

            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div style={{ padding: '25px', borderRadius: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', alignSelf: 'flex-start' }}>KPI Monitor</h4>
                  
                  {renderGauge(selectedEmployee.kpi)}
                  
                  <div style={{ marginTop: '25px', width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span className="text-muted" style={{ fontWeight: 600 }}>Minőség</span>
                      <span style={{ fontWeight: 800 }}>94%</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'center' }}>
                      <span className="text-muted" style={{ fontWeight: 600 }}>Határidő</span>
                      <span style={{ fontWeight: 800 }}>88%</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'right' }}>
                      <span className="text-muted" style={{ fontWeight: 600 }}>Fegyelem</span>
                      <span style={{ fontWeight: 800, color: '#2ecc71' }}>100%</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ padding: '25px', borderRadius: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '15px' }}>Személyes Adatok</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-muted" style={{ fontWeight: 600 }}>Belépés Dátuma:</span>
                        <span style={{ fontWeight: 800 }}>2020.05.12</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-muted" style={{ fontWeight: 600 }}>Besorolás:</span>
                        <span style={{ fontWeight: 800, color: 'var(--primary-color)' }}>{selectedEmployee.role}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '25px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid rgba(241, 196, 15, 0.3)' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '15px' }}>Éves Szabadság (Nap)</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>12 <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>/ 25</span></span>
                       <div style={{ display: 'flex', gap: '5px' }}>
                         {Array.from({length: 10}).map((_, i) => (
                            <div key={i} style={{ width: '10px', height: '24px', borderRadius: '4px', background: i < 5 ? '#f39c12' : 'var(--bg-main)' }}></div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="training-view">
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Briefcase color="#9b59b6" /> Szakmai Tanúsítványok (Licenszek)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {selectedEmployee.certifications.map((c, i) => (
                    <div key={i} className={`training-card ${c.status === 'valid' ? 'valid' : c.status === 'warning' ? 'warning' : 'danger'}`}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ padding: '12px', borderRadius: '50%', background: 'var(--bg-card)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                           {c.status === 'valid' ? <ShieldCheck size={24} color="#2ecc71" /> : <AlertTriangle size={24} color={c.status === 'warning' ? '#f39c12' : '#e74c3c'} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>{c.name}</p>
                          <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Rendszer szerinti lejárat: {c.expiry}</p>
                        </div>
                      </div>
                      <span className={`status-badge ${c.status === 'valid' ? 'active' : c.status === 'warning' ? 'warning' : 'danger'}`} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        {c.status === 'valid' ? 'Érvényes' : c.status === 'warning' ? 'Hamarosan lejár' : 'LEJÁRT LICENSZ'}
                      </span>
                    </div>
                  ))}
                  <button 
                    className="create-btn" 
                    style={{ width: '100%', marginTop: '20px', gap: '10px', background: '#9b59b6', boxShadow: 'none' }}
                    onClick={handleAddCertification}
                  >
                    <GraduationCap size={18} /> Új Képzés / Vizsga Rögzítése
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

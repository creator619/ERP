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
  GraduationCap,
  ChevronRight,
  DollarSign,
  Heart
} from 'lucide-react';
import Modal from '../UI/Modal';
import { useData } from '../../contexts/DataContext';
import './HR.css';

const HR = ({ addToast }) => {
  const { employees, setEmployees, skillDefinitions } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMainView, setActiveMainView] = useState('employees');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [newEmployeeData, setNewEmployeeData] = useState({ name: '', role: '', dept: 'Gyártás', salary: 450000 });

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

  const handleAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.role) {
      addToast('Kérjük töltsön ki minden kötelező mezőt!', 'warning');
      return;
    }

    const newEmp = {
      id: `EMP-${Date.now()}`,
      name: newEmployeeData.name,
      role: newEmployeeData.role,
      department: newEmployeeData.dept,
      salary: parseInt(newEmployeeData.salary),
      performance: 85,
      avatar: newEmployeeData.name.split(' ').map(n => n[0]).join(''),
      skills: { welding: 1, cnc: 1, forklift: 1, assembly: 1 },
      certs: []
    };

    setEmployees([...employees, newEmp]);
    setIsAddingEmployee(false);
    addToast(`${newEmp.name} sikeresen felvéve`, 'success');
  };

  const handleMatrixChange = (empId, skillId) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        const currentLevel = emp.skills[skillId] || 0;
        const nextLevel = (currentLevel % 5) + 1; // 1 to 5
        return { ...emp, skills: { ...emp.skills, [skillId]: nextLevel } };
      }
      return emp;
    }));
  };

  const getMatrixColor = (level) => {
    if (level >= 5) return '#2ecc71'; // Expert
    if (level >= 3) return '#3498db'; // Advanced
    if (level >= 1) return '#f1c40f'; // Beginner
    return 'rgba(255,255,255,0.05)';
  };

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="hr-module">
      <div className="invoicing-header" style={{ marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Humánerőforrás (HR 2.0)</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>III. FÁZIS: Kompetencia Menedzsment és Bérszámfejtés</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => setIsAddingEmployee(true)}>
            <UserPlus size={18} /> Új alkalmazott
          </button>
        </div>
      </div>

      <div className="hr-stats-grid">
         <div className="stat-card glass">
            <p className="text-muted">Teljes Létszám</p>
            <div className="stat-value">{employees.length} fő</div>
            <p className="stat-label">Aktív állomány</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Havi Bérköltség</p>
            <div className="stat-value">{formatHUF(employees.reduce((acc, curr) => acc + curr.salary, 0))}</div>
            <p className="stat-label">Bruttó alapbér</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Átlagos Teljesítmény</p>
            <div className="stat-value" style={{ color: '#2ecc71' }}>91.2%</div>
            <p className="stat-label">KPI átlag</p>
         </div>
      </div>

      <div className="compliance-tabs">
        <div className={`comp-tab ${activeMainView === 'employees' ? 'active' : ''}`} onClick={() => setActiveMainView('employees')}>
           <Users size={16} /> Alkalmazottak
        </div>
        <div className={`comp-tab ${activeMainView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveMainView('matrix')}>
           <Target size={16} /> Kompetencia Mátrix
        </div>
        <div className={`comp-tab ${activeMainView === 'payroll' ? 'active' : ''}`} onClick={() => setActiveMainView('payroll')}>
           <DollarSign size={16} /> Bérszámfejtés
        </div>
        <div className={`comp-tab ${activeMainView === 'certs' ? 'active' : ''}`} onClick={() => setActiveMainView('certs')}>
           <GraduationCap size={16} /> Oktatás & Vizsgák
        </div>
      </div>

      {activeMainView === 'employees' && (
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>Beosztás</th>
                <th>Osztály</th>
                <th>Teljesítmény</th>
                <th style={{ textAlign: 'right' }}>Havi Bér</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} onClick={() => openEmployeeDetails(emp)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar-circle">{emp.avatar}</div>
                      <div style={{ fontWeight: 800 }}>{emp.name}</div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{emp.role}</td>
                  <td><span className="text-muted" style={{ fontSize: '0.8rem' }}>{emp.department}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div className="progress-mini" style={{ width: '60px' }}>
                          <div className="progress-fill" style={{ width: `${emp.performance}%`, background: getKPIColor(emp.performance) }}></div>
                       </div>
                       <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>{emp.performance}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatHUF(emp.salary)}</td>
                  <td style={{ textAlign: 'right' }}><ChevronRight size={18} className="text-muted" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'matrix' && (
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Szakmai Kompetencia Mátrix (Hőtérkép)</h3>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem' }}>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#2ecc71' }}></div> Szakértő (5)</div>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#3498db' }}></div> Haladó (3-4)</div>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#f1c40f' }}></div> Kezdő (1-2)</div>
              </div>
           </div>
           <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                 <thead>
                    <tr>
                       <th>Alkalmazott</th>
                       {skillDefinitions.map(s => <th key={s.id} style={{ textAlign: 'center' }}>{s.label}</th>)}
                    </tr>
                 </thead>
                 <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id}>
                         <td style={{ fontWeight: 700 }}>{emp.name}</td>
                         {skillDefinitions.map(s => (
                           <td key={s.id} style={{ textAlign: 'center' }}>
                              <div 
                                className="matrix-cell-bubble" 
                                style={{ background: getMatrixColor(emp.skills[s.id] || 0) }}
                                onClick={() => handleMatrixChange(emp.id, s.id)}
                              >
                                 {emp.skills[s.id] || 0}
                              </div>
                           </td>
                         ))}
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeMainView === 'payroll' && (
        <div className="payroll-grid">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Bérköltség Eloszlás</h3>
              <div className="payroll-chart-sim">
                 {employees.map((emp, i) => (
                   <div key={i} className="payroll-bar-row">
                      <span style={{ width: '100px', fontSize: '0.75rem', fontWeight: 700 }}>{emp.name}</span>
                      <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                         <div style={{ height: '100%', background: '#9b59b6', width: `${(emp.salary / 800000) * 100}%` }}></div>
                      </div>
                      <span style={{ width: '80px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 800 }}>{formatHUF(emp.salary)}</span>
                   </div>
                 ))}
              </div>
           </div>
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Kifizetési Ütemező</h3>
              <div className="ncr-card" style={{ borderLeft: '4px solid #2ecc71' }}>
                 <p style={{ fontWeight: 800, fontSize: '0.85rem' }}>Áprilisi bérek átutalása</p>
                 <p style={{ fontSize: '0.7rem', marginTop: '5px' }}>Határidő: 2024.05.05 • Összesen: 4.8M HUF</p>
                 <button className="view-btn-small" style={{ marginTop: '10px' }}>Fájl generálása</button>
              </div>
           </div>
        </div>
      )}

      {activeMainView === 'certs' && (
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Lejáró Tanúsítványok & Oktatások</h3>
           <div className="certs-grid">
              {employees.flatMap(emp => emp.certs.map(c => ({ ...c, empName: emp.name }))).map((cert, i) => (
                <div key={i} className={`cert-card-mini ${cert.status}`}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800 }}>{cert.name}</span>
                      {cert.status === 'warning' && <AlertTriangle size={16} color="#f39c12" />}
                   </div>
                   <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>Dolgozó: {cert.empName}</p>
                   <p style={{ fontSize: '0.75rem', color: cert.status === 'warning' ? '#f39c12' : 'inherit' }}>Lejár: {cert.expiry}</p>
                   <button className="view-btn-small" style={{ marginTop: '10px', width: '100%' }}>Oktatás Ütemezése</button>
                </div>
              ))}
           </div>
        </div>
      )}

      <Modal
        isOpen={isAddingEmployee}
        onClose={() => setIsAddingEmployee(false)}
        title="Új munkatárs felvétele"
        width="450px"
      >
        <div className="settings-row" style={{ maxWidth: '100%', gap: '15px' }}>
           <div className="settings-group">
              <label>Teljes Név</label>
              <input type="text" value={newEmployeeData.name} onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})} />
           </div>
           <div className="settings-group">
              <label>Beosztás</label>
              <input type="text" value={newEmployeeData.role} onChange={(e) => setNewEmployeeData({...newEmployeeData, role: e.target.value})} />
           </div>
           <div className="settings-group">
              <label>Havi Bruttó Bér (HUF)</label>
              <input type="number" value={newEmployeeData.salary} onChange={(e) => setNewEmployeeData({...newEmployeeData, salary: e.target.value})} />
           </div>
           <button className="create-btn" onClick={handleAddEmployee} style={{ width: '100%', marginTop: '10px' }}>Felvétel az állományba</button>
        </div>
      </Modal>
    </div>
  );
};

export default HR;

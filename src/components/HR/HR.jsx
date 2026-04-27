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
  Heart,
  CalendarCheck,
  Stethoscope
} from 'lucide-react';
import Modal from '../UI/Modal';
import { useData } from '../../contexts/DataContext';
import './HR.css';

const HR = ({ addToast }) => {
  const { employees, setEmployees, skillDefinitions, leaveRequests, approveLeave } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMainView, setActiveMainView] = useState('employees');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({ name: '', role: '', dept: 'Gyártás', salary: 450000 });

  const getKPIColor = (val) => {
    if (val >= 90) return '#2ecc71';
    if (val >= 75) return '#f39c12';
    return '#e74c3c';
  };

  const handleApprove = (id) => {
    approveLeave(id);
    addToast('Szabadság jóváhagyva', 'success', 'A dolgozó kerete frissült.');
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

  const handleAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.role) {
      addToast('Mezők kitöltése kötelező!', 'warning');
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
      leaveBalance: { total: 20, used: 0, sick: 0 },
      certs: []
    };
    setEmployees([...employees, newEmp]);
    setIsAddingEmployee(false);
    addToast(`${newEmp.name} rögzítve`, 'success');
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
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>III. FÁZIS: Kompetencia, Bér és Szabadságkezelés</p>
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
            <p className="text-muted">Szabadságon</p>
            <div className="stat-value">{leaveRequests.filter(r => r.status === 'Approved' && r.type === 'Fizetett').length} fő</div>
            <p className="stat-label">Jelenleg távol</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Betegállomány</p>
            <div className="stat-value" style={{ color: '#e74c3c' }}>{leaveRequests.filter(r => r.status === 'Approved' && r.type === 'Betegszabadság').length} fő</div>
            <p className="stat-label">Aktív igazolások</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Függő Igények</p>
            <div className="stat-value" style={{ color: '#f1c40f' }}>{leaveRequests.filter(r => r.status === 'Pending').length} db</div>
            <p className="stat-label">Jóváhagyásra vár</p>
         </div>
      </div>

      <div className="compliance-tabs">
        <div className={`comp-tab ${activeMainView === 'employees' ? 'active' : ''}`} onClick={() => setActiveMainView('employees')}>
           <Users size={16} /> Alkalmazottak
        </div>
        <div className={`comp-tab ${activeMainView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveMainView('matrix')}>
           <Target size={16} /> Kompetencia Mátrix
        </div>
        <div className={`comp-tab ${activeMainView === 'leaves' ? 'active' : ''}`} onClick={() => setActiveMainView('leaves')}>
           <CalendarCheck size={16} /> Szabadság & Betegség
        </div>
        <div className={`comp-tab ${activeMainView === 'payroll' ? 'active' : ''}`} onClick={() => setActiveMainView('payroll')}>
           <DollarSign size={16} /> Bérszámfejtés
        </div>
      </div>

      {activeMainView === 'employees' && (
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>Osztály</th>
                <th>Szabadság (Kivett/Összes)</th>
                <th>Betegszabadság</th>
                <th style={{ textAlign: 'right' }}>Havi Bruttó</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar-circle">{emp.avatar}</div>
                      <div style={{ fontWeight: 800 }}>{emp.name}</div>
                    </div>
                  </td>
                  <td><span className="text-muted" style={{ fontSize: '0.8rem' }}>{emp.department}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div className="progress-mini" style={{ width: '80px' }}>
                          <div className="progress-fill" style={{ width: `${(emp.leaveBalance.used / emp.leaveBalance.total) * 100}%`, background: '#9b59b6' }}></div>
                       </div>
                       <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>{emp.leaveBalance.used} / {emp.leaveBalance.total}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: emp.leaveBalance.sick > 0 ? '#e74c3c' : 'var(--text-muted)' }}>
                       <Stethoscope size={14} />
                       <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>{emp.leaveBalance.sick} nap</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatHUF(emp.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'matrix' && (
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Szakmai Kompetencia Mátrix</h3>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem' }}>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#2ecc71' }}></div> Szakértő</div>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#3498db' }}></div> Haladó</div>
                 <div className="bi-legend-item"><div className="bi-legend-dot" style={{ background: '#f1c40f' }}></div> Kezdő</div>
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

      {activeMainView === 'leaves' && (
        <div className="payroll-grid">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Beérkező Igények</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {leaveRequests.map(req => (
                   <div key={req.id} className="ncr-card" style={{ borderLeft: `4px solid ${req.status === 'Approved' ? '#2ecc71' : '#f1c40f'}`, padding: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                               <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{req.empName}</span>
                               <span className={`status-badge ${req.type === 'Fizetett' ? 'info' : 'danger'}`} style={{ fontSize: '0.6rem' }}>{req.type.toUpperCase()}</span>
                            </div>
                            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '5px' }}>{req.start} &rarr; {req.end} ({req.days} nap)</p>
                         </div>
                         {req.status === 'Pending' ? (
                           <button className="create-btn-small" onClick={() => handleApprove(req.id)} style={{ background: '#2ecc71' }}>Jóváhagyás</button>
                         ) : (
                           <div style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 800 }}>
                              <CheckCircle2 size={16} /> JÓVÁHAGYVA
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Kapacitás Elemzés</h3>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                 <AlertTriangle size={32} color="#f1c40f" style={{ marginBottom: '10px' }} />
                 <p style={{ fontSize: '0.85rem' }}>A májusi szabadságok miatt a <strong>Hegesztő részleg</strong> kapacitása 20%-kal csökken.</p>
              </div>
           </div>
        </div>
      )}

      {activeMainView === 'payroll' && (
        <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Bérköltség Analízis</h3>
           <div className="payroll-chart-sim">
              {employees.map((emp, i) => (
                <div key={i} className="payroll-bar-row">
                   <span style={{ width: '120px', fontSize: '0.75rem', fontWeight: 700 }}>{emp.name}</span>
                   <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#9b59b6', width: `${(emp.salary / 800000) * 100}%` }}></div>
                   </div>
                   <span style={{ width: '100px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 800 }}>{formatHUF(emp.salary)}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      <Modal isOpen={isAddingEmployee} onClose={() => setIsAddingEmployee(false)} title="Új munkatárs" width="400px">
        <div className="settings-row" style={{ maxWidth: '100%', gap: '15px' }}>
           <input type="text" placeholder="Név" value={newEmployeeData.name} onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})} />
           <input type="text" placeholder="Beosztás" value={newEmployeeData.role} onChange={(e) => setNewEmployeeData({...newEmployeeData, role: e.target.value})} />
           <input type="number" placeholder="Bruttó Bér" value={newEmployeeData.salary} onChange={(e) => setNewEmployeeData({...newEmployeeData, salary: e.target.value})} />
           <button className="create-btn" onClick={handleAddEmployee} style={{ width: '100%' }}>Rögzítés</button>
        </div>
      </Modal>
    </div>
  );
};

export default HR;

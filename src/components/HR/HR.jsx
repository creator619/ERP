import React, { useState } from 'react';
import { 
  Users, UserPlus, Briefcase, Calendar, Mail, Phone, CheckCircle2, Clock, 
  MoreVertical, Award, TrendingUp, Target, ShieldCheck, AlertTriangle, 
  Ban, GraduationCap, ChevronRight, DollarSign, Heart, CalendarCheck, 
  Stethoscope, FileText, Download, CreditCard, Plus
} from 'lucide-react';
import Modal from '../UI/Modal';
import { useData } from '../../contexts/DataContext';
import './HR.css';

const HR = ({ addToast }) => {
  const { employees, setEmployees, skillDefinitions, leaveRequests, setLeaveRequests, approveLeave } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeMainView, setActiveMainView] = useState('employees');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  
  const [newLeaveData, setNewLeaveData] = useState({ empId: '', type: 'Fizetett', start: '', end: '', days: 1 });
  const [newEmployeeData, setNewEmployeeData] = useState({ name: '', role: '', dept: 'Gyártás', salary: 450000 });

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  const calculateNet = (gross) => {
    const szja = gross * 0.15;
    const tb = gross * 0.185;
    return { gross, szja, tb, net: gross - szja - tb };
  };

  const getBonus = (emp) => {
    if (emp.performance >= 95) return emp.salary * 0.15;
    if (emp.performance >= 90) return emp.salary * 0.08;
    return 0;
  };

  const openPayslip = (emp) => {
    setSelectedEmployee(emp);
    setIsPayslipOpen(true);
  };

  const handleAddLeave = () => {
    if (!newLeaveData.empId || !newLeaveData.start || !newLeaveData.end) {
      addToast('Minden mezőt töltsön ki!', 'warning');
      return;
    }
    const emp = employees.find(e => e.id === newLeaveData.empId);
    const newReq = {
      id: `LR-${Date.now()}`,
      empId: newLeaveData.empId,
      empName: emp.name,
      type: newLeaveData.type,
      start: newLeaveData.start,
      end: newLeaveData.end,
      days: parseInt(newLeaveData.days),
      status: 'Pending'
    };
    setLeaveRequests([...leaveRequests, newReq]);
    setIsLeaveModalOpen(false);
    addToast('Igény rögzítve', 'success');
  };

  const handleMatrixChange = (empId, skillId) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        const currentLevel = emp.skills[skillId] || 0;
        const nextLevel = (currentLevel % 5) + 1;
        return { ...emp, skills: { ...emp.skills, [skillId]: nextLevel } };
      }
      return emp;
    }));
  };

  const handleAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.role) {
      addToast('Név és beosztás kötelező!', 'warning');
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
    addToast('Új munkatárs rögzítve', 'success');
  };

  return (
    <div className="hr-module">
      <div className="invoicing-header" style={{ marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Humánerőforrás</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Teljes körű humán és bérügyintézés</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => setIsLeaveModalOpen(true)} style={{ borderColor: '#9b59b6', color: '#9b59b6' }}>
            <Plus size={18} /> Új Szabadság
          </button>
          <button className="view-btn" onClick={() => setIsAddingEmployee(true)}>
            <UserPlus size={18} /> Új alkalmazott
          </button>
        </div>
      </div>

      <div className="hr-stats-grid">
         <div className="stat-card glass">
            <p className="text-muted">Összes Létszám</p>
            <div className="stat-value">{employees.length} fő</div>
            <p className="stat-label">Aktív állomány</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Szabadságon</p>
            <div className="stat-value" style={{ color: '#9b59b6' }}>{leaveRequests.filter(r => r.status === 'Approved' && r.type === 'Fizetett').length} fő</div>
            <p className="stat-label">Fizetett távollét</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Betegállomány</p>
            <div className="stat-value" style={{ color: '#e74c3c' }}>{leaveRequests.filter(r => r.status === 'Approved' && r.type === 'Betegszabadság').length} fő</div>
            <p className="stat-label">Orvosi igazolással</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Függő igények</p>
            <div className="stat-value" style={{ color: '#f1c40f' }}>{leaveRequests.filter(r => r.status === 'Pending').length} db</div>
            <p className="stat-label">Jóváhagyásra vár</p>
         </div>
      </div>

      <div className="compliance-tabs" style={{ marginBottom: '30px' }}>
        <div className={`comp-tab ${activeMainView === 'employees' ? 'active' : ''}`} onClick={() => setActiveMainView('employees')}>
           <Users size={16} /> Alkalmazottak
        </div>
        <div className={`comp-tab ${activeMainView === 'payroll' ? 'active' : ''}`} onClick={() => setActiveMainView('payroll')}>
           <DollarSign size={16} /> Bérszámfejtés
        </div>
        <div className={`comp-tab ${activeMainView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveMainView('matrix')}>
           <Target size={16} /> Kompetencia Mátrix
        </div>
        <div className={`comp-tab ${activeMainView === 'leaves' ? 'active' : ''}`} onClick={() => setActiveMainView('leaves')}>
           <CalendarCheck size={16} /> Szabadságkezelés
        </div>
      </div>

      {activeMainView === 'employees' && (
        <div className="hr-table-container glass">
          <table className="data-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>Beosztás</th>
                <th>Osztály</th>
                <th>Szabadság Egyenleg</th>
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
                  <td style={{ fontWeight: 600 }}>{emp.role}</td>
                  <td>{emp.department}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div className="progress-mini" style={{ width: '60px' }}>
                          <div className="progress-fill" style={{ width: `${(emp.leaveBalance.used / emp.leaveBalance.total) * 100}%`, background: '#9b59b6' }}></div>
                       </div>
                       <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>{emp.leaveBalance.used} / {emp.leaveBalance.total}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatHUF(emp.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'payroll' && (
        <div className="hr-table-container glass">
          <table className="data-table">
            <thead>
              <tr>
                <th>Név</th>
                <th style={{ textAlign: 'right' }}>Bruttó</th>
                <th style={{ textAlign: 'right' }}>Bónusz</th>
                <th style={{ textAlign: 'right' }}>Adók</th>
                <th style={{ textAlign: 'right' }}>Nettó</th>
                <th style={{ textAlign: 'center' }}>Akció</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const bonus = getBonus(emp);
                const calc = calculateNet(emp.salary + bonus);
                return (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 700 }}>{emp.name}</td>
                    <td style={{ textAlign: 'right' }}>{formatHUF(emp.salary)}</td>
                    <td style={{ textAlign: 'right', color: '#2ecc71' }}>+{formatHUF(bonus)}</td>
                    <td style={{ textAlign: 'right', color: '#e74c3c' }}>-{formatHUF(calc.szja + calc.tb)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: '#3498db' }}>{formatHUF(calc.net)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="view-btn-small" onClick={() => openPayslip(emp)}><FileText size={16} /> Bérjegyzék</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'matrix' && (
        <div className="hr-table-container glass">
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
                        style={{ background: emp.skills[s.id] >= 5 ? '#2ecc71' : emp.skills[s.id] >= 3 ? '#3498db' : '#f1c40f' }}
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
      )}

      {activeMainView === 'leaves' && (
        <div className="payroll-grid">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Aktív és függő igények</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {leaveRequests.map(req => (
                   <div key={req.id} className="ncr-card" style={{ borderLeft: `4px solid ${req.status === 'Approved' ? '#2ecc71' : '#f1c40f'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <span style={{ fontWeight: 800 }}>{req.empName}</span>
                            <span className="status-badge info" style={{ marginLeft: '10px' }}>{req.type}</span>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>{req.start} - {req.end} ({req.days} nap)</p>
                         </div>
                         {req.status === 'Pending' && (
                           <button className="create-btn-small" style={{ background: '#2ecc71' }} onClick={() => approveLeave(req.id)}>Jóváhagyás</button>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      <Modal isOpen={isPayslipOpen} onClose={() => setIsPayslipOpen(false)} title="Havi Bérjegyzék" width="450px">
        {selectedEmployee && (
          <div className="payslip-container" style={{ padding: '20px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-color)', paddingBottom: '15px' }}>
                <h3 style={{ fontWeight: 800 }}>{selectedEmployee.name}</h3>
                <p style={{ fontWeight: 800 }}>2024. Április</p>
             </div>
             <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bruttó Bér:</span><span style={{ fontWeight: 800 }}>{formatHUF(selectedEmployee.salary)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71' }}><span>Bónusz:</span><span style={{ fontWeight: 800 }}>+{formatHUF(getBonus(selectedEmployee))}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e74c3c' }}><span>Összes Levonás:</span><span>-{formatHUF((selectedEmployee.salary + getBonus(selectedEmployee)) * 0.335)}</span></div>
                <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '12px', border: '1px solid #3498db' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800 }}>NETTÓ KIFIZETÉS:</span>
                      <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#3498db' }}>{formatHUF(calculateNet(selectedEmployee.salary + getBonus(selectedEmployee)).net)}</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="Szabadság rögzítése" width="400px">
        <div className="settings-row" style={{ maxWidth: '100%', gap: '15px' }}>
           <select value={newLeaveData.empId} onChange={(e) => setNewLeaveData({...newLeaveData, empId: e.target.value})}>
              <option value="">Válasszon alkalmazottat...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
           </select>
           <input type="date" value={newLeaveData.start} onChange={(e) => setNewLeaveData({...newLeaveData, start: e.target.value})} />
           <input type="date" value={newLeaveData.end} onChange={(e) => setNewLeaveData({...newLeaveData, end: e.target.value})} />
           <input type="number" placeholder="Napok száma" value={newLeaveData.days} onChange={(e) => setNewLeaveData({...newLeaveData, days: e.target.value})} />
           <button className="create-btn" onClick={handleAddLeave} style={{ width: '100%' }}>Rögzítés</button>
        </div>
      </Modal>

      <Modal isOpen={isAddingEmployee} onClose={() => setIsAddingEmployee(false)} title="Új munkatárs" width="400px">
        <div className="settings-row" style={{ maxWidth: '100%', gap: '15px' }}>
           <input type="text" placeholder="Név" value={newEmployeeData.name} onChange={(e) => setNewEmployeeData({...newEmployeeData, name: e.target.value})} />
           <input type="text" placeholder="Beosztás" value={newEmployeeData.role} onChange={(e) => setNewEmployeeData({...newEmployeeData, role: e.target.value})} />
           <input type="number" placeholder="Bruttó Bér" value={newEmployeeData.salary} onChange={(e) => setNewEmployeeData({...newEmployeeData, salary: e.target.value})} />
           <button className="create-btn" onClick={handleAddEmployee} style={{ width: '100%' }}>Felvétel</button>
        </div>
      </Modal>
    </div>
  );
};

export default HR;

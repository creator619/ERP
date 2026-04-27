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
  Stethoscope,
  FileText,
  Download,
  CreditCard,
  Plus
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
    addToast('Szabadságigény rögzítve', 'success', 'Jóváhagyásra vár.');
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

  return (
    <div className="hr-module">
      <div className="invoicing-header" style={{ marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Humánerőforrás</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Vállalati létszám és bérügyintézés</p>
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
            <p className="text-muted">Teljes Létszám</p>
            <div className="stat-value">{employees.length} fő</div>
            <p className="stat-label">Aktív állomány</p>
         </div>
         <div className="stat-card glass">
            <p className="text-muted">Szabadságon</p>
            <div className="stat-value" style={{ color: '#9b59b6' }}>{leaveRequests.filter(r => r.status === 'Approved' && r.type === 'Fizetett').length} fő</div>
            <p className="stat-label">Jelenleg távol</p>
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
        <div className={`comp-tab ${activeMainView === 'leaves' ? 'active' : ''}`} onClick={() => setActiveMainView('leaves')}>
           <CalendarCheck size={16} /> Szabadságkezelés
        </div>
        <div className={`comp-tab ${activeMainView === 'payroll' ? 'active' : ''}`} onClick={() => setActiveMainView('payroll')}>
           <DollarSign size={16} /> Bérszámfejtés
        </div>
        <div className={`comp-tab ${activeMainView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveMainView('matrix')}>
           <Target size={16} /> Kompetencia Mátrix
        </div>
      </div>

      {activeMainView === 'employees' && (
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>Osztály</th>
                <th>Szabadság Egyenleg</th>
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
                  <td>{emp.department}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div className="progress-mini" style={{ width: '60px' }}>
                          <div className="progress-fill" style={{ width: `${(emp.leaveBalance.used / emp.leaveBalance.total) * 100}%`, background: '#9b59b6' }}></div>
                       </div>
                       <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>{emp.leaveBalance.used} / {emp.leaveBalance.total}</span>
                    </div>
                  </td>
                  <td style={{ color: emp.leaveBalance.sick > 0 ? '#e74c3c' : 'var(--text-muted)' }}>{emp.leaveBalance.sick} nap</td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatHUF(emp.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'leaves' && (
        <div className="payroll-grid">
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Jóváhagyásra váró igények</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {leaveRequests.filter(r => r.status === 'Pending').length === 0 && <p className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>Nincs függőben lévő igény.</p>}
                 {leaveRequests.filter(r => r.status === 'Pending').map(req => (
                   <div key={req.id} className="ncr-card" style={{ borderLeft: `4px solid ${req.type === 'Fizetett' ? '#3498db' : '#e74c3c'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <span style={{ fontWeight: 800 }}>{req.empName}</span>
                            <span className="status-badge info" style={{ marginLeft: '10px', fontSize: '0.6rem' }}>{req.type}</span>
                            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '5px' }}>{req.start} - {req.end} ({req.days} nap)</p>
                         </div>
                         <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="create-btn-small" style={{ background: '#2ecc71' }} onClick={() => approveLeave(req.id)}>Jóváhagyás</button>
                            <button className="view-btn-small" style={{ color: '#e74c3c', borderColor: 'rgba(231,76,60,0.3)' }}>Elutasítás</button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '30px 0 20px 0' }}>Lezárt folyamatok</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {leaveRequests.filter(r => r.status === 'Approved').map(req => (
                    <div key={req.id} className="glass" style={{ padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}>
                       <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{req.empName} - {req.type}</span>
                       <span style={{ fontSize: '0.75rem' }}>{req.start} ({req.days} nap)</span>
                       <span style={{ color: '#2ecc71', fontSize: '0.7rem', fontWeight: 800 }}>SIKERES</span>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Tervezett távollétek</h3>
              <div className="calendar-sim" style={{ padding: '20px', textAlign: 'center' }}>
                 <Calendar size={48} style={{ opacity: 0.1, marginBottom: '15px' }} />
                 <p className="text-muted" style={{ fontSize: '0.85rem' }}>Heti áttekintés</p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {employees.map(e => (
                       <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '80px', fontSize: '0.7rem', textAlign: 'left' }}>{e.name}</span>
                          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative' }}>
                             {leaveRequests.filter(r => r.empId === e.id && r.status === 'Approved').map((r, i) => (
                                <div key={i} style={{ position: 'absolute', left: '20%', width: '30%', height: '100%', background: r.type === 'Fizetett' ? '#3498db' : '#e74c3c', borderRadius: '4px' }}></div>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Új szabadság */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Új Szabadság / Távollét Rögzítése"
        width="450px"
      >
        <div className="settings-row" style={{ maxWidth: '100%', gap: '15px' }}>
           <div className="settings-group">
              <label>Alkalmazott</label>
              <select value={newLeaveData.empId} onChange={(e) => setNewLeaveData({...newLeaveData, empId: e.target.value})}>
                 <option value="">Válasszon...</option>
                 {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
           </div>
           <div className="settings-group">
              <label>Típus</label>
              <select value={newLeaveData.type} onChange={(e) => setNewLeaveData({...newLeaveData, type: e.target.value})}>
                 <option value="Fizetett">Fizetett Szabadság</option>
                 <option value="Betegszabadság">Betegszabadság (Orvosi)</option>
                 <option value="Fizetés nélküli">Fizetés nélküli</option>
              </select>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="settings-group">
                 <label>Kezdet</label>
                 <input type="date" value={newLeaveData.start} onChange={(e) => setNewLeaveData({...newLeaveData, start: e.target.value})} />
              </div>
              <div className="settings-group">
                 <label>Vége</label>
                 <input type="date" value={newLeaveData.end} onChange={(e) => setNewLeaveData({...newLeaveData, end: e.target.value})} />
              </div>
           </div>
           <div className="settings-group">
              <label>Munkanapok száma</label>
              <input type="number" value={newLeaveData.days} onChange={(e) => setNewLeaveData({...newLeaveData, days: e.target.value})} />
           </div>
           <button className="create-btn" onClick={handleAddLeave} style={{ width: '100%', marginTop: '10px' }}>Igény Rögzítése</button>
        </div>
      </Modal>

      {/* ... Rest of existing modals (Payslip, AddEmployee) ... */}
      <Modal isOpen={isPayslipOpen} onClose={() => setIsPayslipOpen(false)} title="Bérjegyzék" width="500px">
        {selectedEmployee && (
          <div className="payslip-container" style={{ padding: '20px' }}>
             <h3 style={{ fontWeight: 800 }}>{selectedEmployee.name}</h3>
             <p>Nettó kifizetés: {formatHUF(calculateNet(selectedEmployee.salary + getBonus(selectedEmployee)).net)}</p>
          </div>
        )}
      </Modal>

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

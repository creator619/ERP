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
  CreditCard
} from 'lucide-react';
import Modal from '../UI/Modal';
import { useData } from '../../contexts/DataContext';
import './HR.css';

const HR = ({ addToast }) => {
  const { employees, setEmployees, skillDefinitions, leaveRequests, approveLeave } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [activeMainView, setActiveMainView] = useState('employees');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({ name: '', role: '', dept: 'Gyártás', salary: 450000 });

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  // Payroll Calculation Logic
  const calculateNet = (gross) => {
    const szja = gross * 0.15;
    const tb = gross * 0.185;
    return {
      gross,
      szja,
      tb,
      net: gross - szja - tb,
      totalCost: gross * 1.13 // SZOCHO 13% placeholder
    };
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
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Alkalmazotti profilok és bérügyintézés</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => setIsAddingEmployee(true)}>
            <UserPlus size={18} /> Új alkalmazott
          </button>
        </div>
      </div>

      <div className="compliance-tabs" style={{ marginBottom: '30px' }}>
        <div className={`comp-tab ${activeMainView === 'employees' ? 'active' : ''}`} onClick={() => setActiveMainView('employees')}>
           <Users size={16} /> Alkalmazottak
        </div>
        <div className={`comp-tab ${activeMainView === 'payroll' ? 'active' : ''}`} onClick={() => setActiveMainView('payroll')}>
           <DollarSign size={16} /> Bérszámfejtés (Real-time)
        </div>
        <div className={`comp-tab ${activeMainView === 'matrix' ? 'active' : ''}`} onClick={() => setActiveMainView('matrix')}>
           <Target size={16} /> Kompetencia Mátrix
        </div>
        <div className={`comp-tab ${activeMainView === 'leaves' ? 'active' : ''}`} onClick={() => setActiveMainView('leaves')}>
           <CalendarCheck size={16} /> Szabadságkezelés
        </div>
      </div>

      {activeMainView === 'employees' && (
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Alkalmazott</th>
                <th>Beosztás</th>
                <th>Szabadság</th>
                <th>Teljesítmény</th>
                <th style={{ textAlign: 'right' }}>Bruttó Bér</th>
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
                  <td>{emp.leaveBalance.used} / {emp.leaveBalance.total} nap</td>
                  <td>
                    <span style={{ fontWeight: 800, color: emp.performance >= 90 ? '#2ecc71' : '#f1c40f' }}>{emp.performance}%</span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatHUF(emp.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeMainView === 'payroll' && (
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
           <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Április havi bérszámfejtés</h3>
              <button className="create-btn-small" style={{ background: '#2ecc71' }}><CreditCard size={16} /> Összes utalása (Telebank)</button>
           </div>
           <table className="data-table">
              <thead>
                 <tr>
                    <th>Név</th>
                    <th style={{ textAlign: 'right' }}>Bruttó</th>
                    <th style={{ textAlign: 'right' }}>Bónusz (KPI)</th>
                    <th style={{ textAlign: 'right' }}>Adók (SZJA+TB)</th>
                    <th style={{ textAlign: 'right' }}>Nettó Kifizetés</th>
                    <th style={{ textAlign: 'center' }}>Dokumentum</th>
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
                          <td style={{ textAlign: 'right', color: '#2ecc71', fontWeight: 700 }}>+{formatHUF(bonus)}</td>
                          <td style={{ textAlign: 'right', color: '#e74c3c' }}>-{formatHUF(calc.szja + calc.tb)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 900, color: '#3498db' }}>{formatHUF(calc.net)}</td>
                          <td style={{ textAlign: 'center' }}>
                             <button className="view-btn-small" onClick={() => openPayslip(emp)}>
                                <FileText size={16} /> Bérjegyzék
                             </button>
                          </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
      )}

      {activeMainView === 'matrix' && (
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
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

      {/* Payslip Modal */}
      <Modal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        title="Bérjegyzék / Payslip"
        width="500px"
      >
        {selectedEmployee && (
          <div className="payslip-container" style={{ padding: '20px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                <div>
                   <h3 style={{ fontWeight: 800 }}>{selectedEmployee.name}</h3>
                   <p className="text-muted" style={{ fontSize: '0.8rem' }}>ID: {selectedEmployee.id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontWeight: 800 }}>2024. Április</p>
                   <p style={{ fontSize: '0.7rem' }}>RailParts ERP Payroll System</p>
                </div>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span>Alapbér (Bruttó):</span>
                   <span style={{ fontWeight: 800 }}>{formatHUF(selectedEmployee.salary)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71' }}>
                   <span>Teljesítmény bónusz ({selectedEmployee.performance}%):</span>
                   <span style={{ fontWeight: 800 }}>+{formatHUF(getBonus(selectedEmployee))}</span>
                </div>
                <div style={{ margin: '10px 0', borderTop: '1px dashed var(--border-color)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e74c3c' }}>
                   <span>SZJA (15%):</span>
                   <span>-{formatHUF((selectedEmployee.salary + getBonus(selectedEmployee)) * 0.15)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e74c3c' }}>
                   <span>Társadalombiztosítás (18.5%):</span>
                   <span>-{formatHUF((selectedEmployee.salary + getBonus(selectedEmployee)) * 0.185)}</span>
                </div>
                <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '12px', border: '1px solid #3498db' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>NETTÓ KIFIZETÉS:</span>
                      <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#3498db' }}>
                         {formatHUF(calculateNet(selectedEmployee.salary + getBonus(selectedEmployee)).net)}
                      </span>
                   </div>
                </div>
             </div>
             
             <button className="view-btn" style={{ width: '100%', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Download size={18} /> Letöltés PDF-ként
             </button>
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

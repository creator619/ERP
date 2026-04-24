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
  Umbrella
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './HR.css';

const HR = ({ addToast }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Kovács János', role: 'Rendszergazda', dept: 'IT', email: 'j.kovacs@railparts.hu', status: 'Aktív', joinDate: '2020-05-12', salary: '850k', leave: 12 },
    { id: 2, name: 'Nagy Péter', role: 'Gyártásvezető', dept: 'Gyártás', email: 'p.nagy@railparts.hu', status: 'Szabadságon', joinDate: '2018-03-01', salary: '920k', leave: 5 },
    { id: 3, name: 'Szabó Anna', role: 'Értékesítési menedzser', dept: 'Értékesítés', email: 'a.szabo@railparts.hu', status: 'Aktív', joinDate: '2021-11-15', salary: '780k', leave: 18 },
    { id: 4, name: 'Tóth Gábor', role: 'Minőségellenőr', dept: 'Minőségbiztosítás', email: 'g.toth@railparts.hu', status: 'Aktív', joinDate: '2022-02-20', salary: '740k', leave: 22 },
    { id: 5, name: 'Molnár Emese', role: 'HR koordinátor', dept: 'HR', email: 'e.molnar@railparts.hu', status: 'Aktív', joinDate: '2019-09-05', salary: '680k', leave: 10 },
  ]);

  const openEmployeeDetails = (emp) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        auditLogService.log({
          user: 'HR Manager',
          action: 'Státusz módosítva',
          module: 'HR',
          details: `${emp.name} - Új állapot: ${newStatus}`,
          severity: 'info'
        });
        return { ...emp, status: newStatus };
      }
      return emp;
    }));
    addToast('Státusz frissítve', 'success');
  };

  return (
    <div className="hr-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6', padding: '12px', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Emberi Erőforrások</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Alkalmazottak és bérszámfejtés</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új alkalmazott felvétele', 'success')}>
          <UserPlus size={20} />
          Új Felvétel
        </button>
      </div>

      <div className="hr-stats glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '20px', borderRadius: '15px', marginBottom: '25px' }}>
        <div className="stat-item">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Összes létszám</p>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>42 fő</h4>
        </div>
        <div className="stat-item">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Aktív jelenlét</p>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2ecc71' }}>38 fő</h4>
        </div>
        <div className="stat-item">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Szabadságon</p>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1c40f' }}>3 fő</h4>
        </div>
        <div className="stat-item">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Nyitott pozíció</p>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>4 hely</h4>
        </div>
      </div>

      <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Név</th>
              <th>Szerepkör</th>
              <th>Osztály</th>
              <th>Státusz</th>
              <th>Készlet (Nap)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} onClick={() => openEmployeeDetails(emp)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="kanban-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{emp.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td>{emp.role}</td>
                <td>{emp.dept}</td>
                <td>
                  <span className={`status-badge ${emp.status === 'Aktív' ? 'active' : 'warning'}`}>
                    {emp.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Umbrella size={14} className="text-muted" />
                    <strong>{emp.leave}</strong>
                  </div>
                </td>
                <td>
                  <button className="view-btn-small"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Dolgozói Adatlap: ${selectedEmployee?.name}`}
        width="800px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Módosítások mentve', 'success')}>Mentés</button>
          </>
        }
      >
        {selectedEmployee && (
          <div className="employee-details-view">
            <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', padding: '20px', background: 'var(--bg-main)', borderRadius: '15px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
                {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '5px' }}>{selectedEmployee.name}</h2>
                <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '10px' }}>{selectedEmployee.role} • {selectedEmployee.dept}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="view-btn-small" onClick={() => handleStatusChange(selectedEmployee.id, 'Szabadságon')}>Szabadság rögzítése</button>
                  <button className="view-btn-small" onClick={() => handleStatusChange(selectedEmployee.id, 'Aktív')}>Aktiválás</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
              <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="var(--primary-color)" /> Pénzügyi Adatok
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    <span className="text-muted">Alapbér (Bruttó)</span>
                    <span style={{ fontWeight: 700 }}>{selectedEmployee.salary} Ft</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    <span className="text-muted">Cafeteria</span>
                    <span style={{ fontWeight: 700 }}>35.000 Ft</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                    <span className="text-muted">Éves bónusz keret</span>
                    <span style={{ fontWeight: 700, color: '#2ecc71' }}>15%</span>
                  </div>
                </div>
              </div>

              <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Umbrella size={18} color="var(--primary-color)" /> Szabadság Keret
                </h4>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-color)' }}>{selectedEmployee.leave}</div>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>Felhasználható napok</p>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', marginTop: '15px', overflow: 'hidden' }}>
                    <div style={{ width: `${(selectedEmployee.leave / 30) * 100}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HR;

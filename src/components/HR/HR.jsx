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
  MoreVertical
} from 'lucide-react';
import Modal from '../UI/Modal';

const HR = ({ addToast }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const employees = [
    { id: 1, name: 'Kovács János', role: 'Rendszergazda', dept: 'IT', email: 'j.kovacs@railparts.hu', status: 'Aktív', joinDate: '2020-05-12' },
    { id: 2, name: 'Nagy Péter', role: 'Gyártásvezető', dept: 'Gyártás', email: 'p.nagy@railparts.hu', status: 'Szabadságon', joinDate: '2018-03-01' },
    { id: 3, name: 'Szabó Anna', role: 'Értékesítési menedzser', dept: 'Értékesítés', email: 'a.szabo@railparts.hu', status: 'Aktív', joinDate: '2021-11-15' },
    { id: 4, name: 'Tóth Gábor', role: 'Minőségellenőr', dept: 'Minőségbiztosítás', email: 'g.toth@railparts.hu', status: 'Aktív', joinDate: '2022-02-20' },
    { id: 5, name: 'Molnár Emese', role: 'HR koordinátor', dept: 'HR', email: 'e.molnar@railparts.hu', status: 'Betegszabadság', joinDate: '2019-09-05' },
  ];

  const openEmployeeDetails = (emp) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  return (
    <div className="hr-module">
      <div className="crm-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Alkalmazottak</h2>
        <button className="create-btn" onClick={() => addToast('Új alkalmazott', 'info')}>
          <UserPlus size={20} />
          Új Felvétel
        </button>
      </div>

      <div className="list-view">
        <table className="data-table">
          <thead>
            <tr>
              <th>Név</th>
              <th>Szerepkör</th>
              <th>Osztály</th>
              <th>E-mail</th>
              <th>Státusz</th>
              <th>Belépés</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} onClick={() => openEmployeeDetails(emp)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="kanban-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <strong>{emp.name}</strong>
                  </div>
                </td>
                <td>{emp.role}</td>
                <td>{emp.dept}</td>
                <td>{emp.email}</td>
                <td>
                  <span className={`status-badge ${emp.status.toLowerCase().replace(' ', '-')}`}>
                    {emp.status}
                  </span>
                </td>
                <td>{emp.joinDate}</td>
                <td>
                  <button className="text-muted" onClick={(e) => e.stopPropagation()}><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Alkalmazott adatlapja"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Módosítások mentve', 'success')}>Szerkesztés</button>
          </>
        }
      >
        {selectedEmployee && (
          <div className="employee-details">
            <div style={{ display: 'flex', gap: '25px', marginBottom: '30px', alignItems: 'center' }}>
              <div className="kanban-avatar" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{selectedEmployee.name}</h2>
                <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{selectedEmployee.role}</p>
                <span className={`status-badge ${selectedEmployee.status.toLowerCase().replace(' ', '-')}`} style={{ marginTop: '10px', display: 'inline-block' }}>
                  {selectedEmployee.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Briefcase size={16} /> Osztály
                </label>
                <p style={{ fontWeight: 500 }}>{selectedEmployee.dept}</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Calendar size={16} /> Belépés dátuma
                </label>
                <p style={{ fontWeight: 500 }}>{selectedEmployee.joinDate}</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Mail size={16} /> Vállalati e-mail
                </label>
                <p style={{ fontWeight: 500 }}>{selectedEmployee.email}</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Clock size={16} /> Munkaidő keret
                </label>
                <p style={{ fontWeight: 500 }}>Heti 40 óra (Full-time)</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HR;

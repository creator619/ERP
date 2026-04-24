import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  FileText, 
  Plus, 
  ClipboardCheck,
  AlertTriangle,
  History,
  Settings
} from 'lucide-react';
import Modal from '../UI/Modal';

const Quality = ({ addToast }) => {
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inspections = [
    { id: 'QC-2024-001', item: 'Kocsiablak (RW-WIN-042)', batch: 'BCH-882', date: '2024-04-20', inspector: 'Kovács János', status: 'Passed', score: '100/100' },
    { id: 'QC-2024-002', item: 'Poggyásztartó váz', batch: 'BCH-883', date: '2024-04-21', inspector: 'Nagy Péter', status: 'Failed', score: '65/100', issue: 'Felületi karcolások az eloxált rétegen.' },
    { id: 'QC-2024-003', item: 'Ajtó tömítés', batch: 'BCH-884', date: '2024-04-22', inspector: 'Szabó Anna', status: 'Pending', score: '-' },
    { id: 'QC-2024-004', item: 'Válaszfal rögzítő', batch: 'BCH-885', date: '2024-04-23', inspector: 'Kovács János', status: 'Passed', score: '98/100' },
  ];

  const openInspection = (insp) => {
    setSelectedInspection(insp);
    setIsModalOpen(true);
  };

  return (
    <div className="quality-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Minőségellenőrzés</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('NCR jelentés készítése', 'info')}>
            <ShieldAlert size={18} />
            NCR Jegyzőkönyv
          </button>
          <button className="create-btn" onClick={() => addToast('Új ellenőrzés', 'success')}>
            <ClipboardCheck size={20} />
            Új Ellenőrzés
          </button>
        </div>
      </div>

      <div className="finance-summary">
        <div className="finance-card glass" style={{ borderBottom: '3px solid #28a745' }}>
          <h5 className="text-muted">Elfogadva (Havi)</h5>
          <div className="value" style={{ color: '#28a745' }}>94.2%</div>
        </div>
        <div className="finance-card glass" style={{ borderBottom: '3px solid #dc3545' }}>
          <h5 className="text-muted">Selejt / NCR</h5>
          <div className="value" style={{ color: '#dc3545' }}>5.8%</div>
        </div>
        <div className="finance-card glass" style={{ borderBottom: '3px solid var(--primary-color)' }}>
          <h5 className="text-muted">Aktív vizsgálatok</h5>
          <div className="value">12 db</div>
        </div>
      </div>

      <div className="list-view">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Termék / Batch</th>
              <th>Dátum</th>
              <th>Ellenőr</th>
              <th>Eredmény</th>
              <th>Pontszám</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inspections.map(insp => (
              <tr key={insp.id} onClick={() => openInspection(insp)} style={{ cursor: 'pointer' }}>
                <td><strong>{insp.id}</strong></td>
                <td>
                  <div>{insp.item}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Batch: {insp.batch}</div>
                </td>
                <td>{insp.date}</td>
                <td>{insp.inspector}</td>
                <td>
                  <span className={`status-pill ${insp.status.toLowerCase()}`}>
                    {insp.status === 'Passed' ? <CheckCircle2 size={14} inline /> : insp.status === 'Failed' ? <XCircle size={14} inline /> : <History size={14} inline />}
                    {insp.status === 'Passed' ? 'Megfelelt' : insp.status === 'Failed' ? 'Elutasítva' : 'Folyamatban'}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{insp.score}</td>
                <td>
                  <button className="text-muted" onClick={(e) => e.stopPropagation()}><FileText size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Ellenőrzési Jegyzőkönyv: ${selectedInspection?.id}`}
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Tanúsítvány generálva', 'success')}>Tanúsítvány Letöltése</button>
          </>
        }
      >
        {selectedInspection && (
          <div className="inspection-details">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', padding: '15px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Ellenőrzött tétel</p>
                <h3 style={{ fontSize: '1.2rem', margin: '5px 0' }}>{selectedInspection.item}</h3>
                <p style={{ fontSize: '0.9rem' }}>Gyártási szám: {selectedInspection.batch}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Státusz</p>
                <div className={`status-pill ${selectedInspection.status.toLowerCase()}`} style={{ fontSize: '1rem', padding: '8px 15px' }}>
                  {selectedInspection.status === 'Passed' ? 'MEGFELELT' : selectedInspection.status === 'Failed' ? 'ELUTASÍTVA' : 'FOLYAMATBAN'}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ellenőrzési pontok</h4>
            <div className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border-color)' }}>
                <span>Méretpontosság (Tolerancia: +/- 0.5mm)</span>
                <CheckCircle2 size={18} color="#28a745" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border-color)' }}>
                <span>Felületi minőség (Karcmentesség)</span>
                {selectedInspection.status === 'Failed' ? <XCircle size={18} color="#dc3545" /> : <CheckCircle2 size={18} color="#28a745" />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border-color)' }}>
                <span>Anyagminőség tanúsítvány megléte</span>
                <CheckCircle2 size={18} color="#28a745" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--border-color)' }}>
                <span>Tűzvédelmi besorolás ellenőrzése</span>
                <CheckCircle2 size={18} color="#28a745" />
              </div>
            </div>

            {selectedInspection.status === 'Failed' && (
              <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(220, 53, 69, 0.05)', borderLeft: '4px solid #dc3545', borderRadius: '4px' }}>
                <h4 style={{ color: '#dc3545', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} /> Hiba leírása (NCR)
                </h4>
                <p style={{ fontSize: '0.9rem' }}>{selectedInspection.issue}</p>
                <button className="view-btn" style={{ marginTop: '10px', fontSize: '0.8rem', color: '#dc3545', borderColor: '#dc3545' }}>Kijavítási utasítás kiadása</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Quality;

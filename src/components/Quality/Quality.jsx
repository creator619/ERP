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
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Download
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Quality.css';

const Quality = ({ addToast }) => {
  const [inspections, setInspections] = useState([
    { id: 'QC-2024-001', item: 'Kocsiablak (RW-WIN-042)', batch: 'BCH-882', date: '2024-04-20', inspector: 'Kovács János', status: 'Passed', score: 100 },
    { id: 'QC-2024-002', item: 'Poggyásztartó váz', batch: 'BCH-883', date: '2024-04-21', inspector: 'Nagy Péter', status: 'Failed', score: 65, issue: 'Felületi karcolások az eloxált rétegen.' },
    { id: 'QC-2024-003', item: 'Ajtó tömítés', batch: 'BCH-884', date: '2024-04-22', inspector: 'Szabó Anna', status: 'Pending', score: 0 },
    { id: 'QC-2024-004', item: 'Válaszfal rögzítő', batch: 'BCH-885', date: '2024-04-23', inspector: 'Kovács János', status: 'Passed', score: 98 },
  ]);

  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('checkpoints');

  const openInspection = (insp) => {
    setSelectedInspection(insp);
    setIsModalOpen(true);
    setActiveTab('checkpoints');
  };

  const handleCreateNCR = (insp) => {
    auditLogService.log({
      user: 'Minőségellenőr',
      action: 'NCR Létrehozva',
      module: 'Quality',
      details: `Hiba: ${insp.issue} (${insp.id})`,
      severity: 'danger'
    });
    addToast('NCR folyamat elindítva', 'warning');
    setIsModalOpen(false);
  };

  const yieldRate = 94.2;
  const dpmo = 1250;

  return (
    <div className="quality-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Minőségellenőrzés</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>SPC statisztikák és szabványügyi megfelelőség</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Havi minőségi riport generálása', 'info')}>
            <Download size={18} /> Letöltés
          </button>
          <button className="create-btn" onClick={() => addToast('Új ellenőrzési folyamat', 'success')}>
            <Plus size={20} /> Új Ellenőrzés
          </button>
        </div>
      </div>

      <div className="quality-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="stat-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Yield (Kihozatal)</span>
            <Activity size={16} color="#2ecc71" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2ecc71' }}>{yieldRate}%</div>
          <p style={{ fontSize: '0.7rem', color: '#2ecc71', marginTop: '5px' }}>+0.5% az előző héthez</p>
        </div>
        <div className="stat-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>DPMO</span>
            <BarChart3 size={16} color="#e74c3c" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{dpmo}</div>
          <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '5px' }}>Cél: &lt; 1000</p>
        </div>
        <div className="stat-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Selejt Érték</span>
            <AlertTriangle size={16} color="#f1c40f" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>840k Ft</div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(241, 196, 15, 0.2)', borderRadius: '2px', marginTop: '10px' }}>
            <div style={{ width: '45%', height: '100%', background: '#f1c40f', borderRadius: '2px' }}></div>
          </div>
        </div>
        <div className="stat-card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Audit Status</span>
            <ShieldCheck size={16} color="var(--primary-color)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>ISO 9001</div>
          <p style={{ fontSize: '0.7rem', color: '#2ecc71', marginTop: '5px' }}>Érvényes: 2025/12</p>
        </div>
      </div>

      <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Vizsgálat ID</th>
              <th>Termék / Tétel</th>
              <th>Ellenőr</th>
              <th>Eredmény</th>
              <th>Minőség %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inspections.map(insp => (
              <tr key={insp.id} onClick={() => openInspection(insp)} style={{ cursor: 'pointer' }}>
                <td><strong style={{ color: 'var(--primary-color)' }}>{insp.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{insp.item}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>Batch: {insp.batch}</div>
                </td>
                <td>{insp.inspector}</td>
                <td>
                  <span className={`status-badge ${insp.status === 'Passed' ? 'active' : insp.status === 'Failed' ? 'danger' : 'warning'}`}>
                    {insp.status === 'Passed' ? 'Megfelelt' : insp.status === 'Failed' ? 'Elutasítva' : 'Várakozik'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--border-color)', borderRadius: '3px', width: '60px' }}>
                      <div style={{ width: `${insp.score}%`, height: '100%', background: insp.score > 90 ? '#2ecc71' : insp.score > 70 ? '#f1c40f' : '#e74c3c', borderRadius: '3px' }}></div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{insp.score}%</span>
                  </div>
                </td>
                <td>
                  <button className="view-btn-small"><FileText size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Minőségi Jegyzőkönyv: ${selectedInspection?.id}`}
        width="800px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            {selectedInspection?.status === 'Failed' && (
              <button className="create-btn" style={{ background: '#e74c3c' }} onClick={() => handleCreateNCR(selectedInspection)}>
                <ShieldAlert size={18} /> NCR Jegyzőkönyv Megnyitása
              </button>
            )}
            <button className="create-btn" onClick={() => addToast('Tanúsítvány letöltve', 'success')}>Tanúsítvány (PDF)</button>
          </>
        }
      >
        {selectedInspection && (
          <div className="inspection-details-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'checkpoints' ? 'active' : ''}`} onClick={() => setActiveTab('checkpoints')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Ellenőrző Pontok</div>
              <div className={`settings-nav-item ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Műszaki Adatok</div>
            </div>

            {activeTab === 'checkpoints' && (
              <div className="check-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '15px', background: 'rgba(46, 204, 113, 0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(46, 204, 113, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <CheckCircle2 size={20} color="#2ecc71" />
                    <span>Méretpontosság (Tűrés: +/- 0.2mm)</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#2ecc71' }}>OK</span>
                </div>
                <div style={{ padding: '15px', background: selectedInspection.status === 'Failed' ? 'rgba(231, 76, 60, 0.05)' : 'rgba(46, 204, 113, 0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: selectedInspection.status === 'Failed' ? '1px solid rgba(231, 76, 60, 0.1)' : '1px solid rgba(46, 204, 113, 0.1)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {selectedInspection.status === 'Failed' ? <XCircle size={20} color="#e74c3c" /> : <CheckCircle2 size={20} color="#2ecc71" />}
                    <span>Felületi minőség (ISO 4287)</span>
                  </div>
                  <span style={{ fontWeight: 700, color: selectedInspection.status === 'Failed' ? '#e74c3c' : '#2ecc71' }}>
                    {selectedInspection.status === 'Failed' ? 'NOK' : 'OK'}
                  </span>
                </div>
                {selectedInspection.status === 'Failed' && (
                  <div style={{ padding: '20px', background: 'rgba(231, 76, 60, 0.05)', borderRadius: '15px', marginTop: '10px', borderLeft: '4px solid #e74c3c' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e74c3c', fontWeight: 700, marginBottom: '10px' }}>
                      <AlertTriangle size={20} /> Észlelt hiba (NCR)
                    </div>
                    <p style={{ fontSize: '0.9rem' }}>{selectedInspection.issue}</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="specs-view glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px' }}>Anyagminőségi Paraméterek</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>Ötvözet kód</p>
                    <p style={{ fontWeight: 600 }}>AlMgSi0.5 (6060)</p>
                  </div>
                  <div style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>Szakítószilárdság</p>
                    <p style={{ fontWeight: 600 }}>190 MPa</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Quality;

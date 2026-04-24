import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  ArrowDownToLine,
  Eye,
  Printer,
  Mail,
  Building
} from 'lucide-react';
import Modal from '../UI/Modal';
import './Invoicing.css';

const Invoicing = ({ addToast }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const openPreview = (inv) => {
    setSelectedInvoice(inv);
    setIsPreviewOpen(true);
  };

  const invoices = [
    { id: 'INV/2024/001', customer: 'Kovács és Társa Kft.', date: '2024-04-10', due: '2024-04-24', amount: '154,200 Ft', status: 'Paid' },
    { id: 'INV/2024/002', customer: 'MÁV-START Zrt.', date: '2024-04-12', due: '2024-04-26', amount: '1,245,000 Ft', status: 'Paid' },
    { id: 'INV/2024/003', customer: 'GYSEV Zrt.', date: '2024-04-15', due: '2024-04-29', amount: '450,000 Ft', status: 'Draft' },
    { id: 'INV/2024/004', customer: 'Stadler Trains', date: '2024-03-20', due: '2024-04-03', amount: '2,450,000 Ft', status: 'Overdue' },
    { id: 'INV/2024/005', customer: 'Rail-Cargo Hungaria', date: '2024-04-18', due: '2024-05-02', amount: '320,000 Ft', status: 'Partial' },
  ];

  const getStatusClass = (status) => status.toLowerCase();
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'Paid': return 'Fizetve';
      case 'Draft': return 'Piszkozat';
      case 'Overdue': return 'Késedelmes';
      case 'Partial': return 'Részben fizetve';
      default: return status;
    }
  };

  return (
    <div className="invoicing-module">
      <div className="invoicing-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Számlázás</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Exportálás indítva', 'info')}>
            <Download size={18} />
            Exportálás
          </button>
          <button className="create-btn" onClick={() => addToast('Új számla szerkesztő', 'success')}>
            <Plus size={20} />
            Új Számla
          </button>
        </div>
      </div>

      <div className="finance-summary">
        <div className="finance-card paid glass">
          <h5>Befolyt összeg</h5>
          <div className="value" style={{ color: '#28a745' }}>1,399,200 Ft</div>
        </div>
        <div className="finance-card pending glass">
          <h5>Várható bevétel</h5>
          <div className="value" style={{ color: '#ffc107' }}>770,000 Ft</div>
        </div>
        <div className="finance-card overdue glass">
          <h5>Késedelmes</h5>
          <div className="value" style={{ color: '#dc3545' }}>2,450,000 Ft</div>
        </div>
      </div>

      <div className="list-view">
        <table className="data-table">
          <thead>
            <tr>
              <th>Számlaszám</th>
              <th>Vevő</th>
              <th>Kelt</th>
              <th>Esedékesség</th>
              <th style={{ textAlign: 'right' }}>Összeg</th>
              <th>Állapot</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} onClick={() => openPreview(inv)} style={{ cursor: 'pointer' }}>
                <td><strong>{inv.id}</strong></td>
                <td>{inv.customer}</td>
                <td>{inv.date}</td>
                <td>
                  <span style={{ color: inv.status === 'Overdue' ? '#dc3545' : 'inherit' }}>
                    {inv.due}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{inv.amount}</td>
                <td>
                  <span className={`invoice-status ${getStatusClass(inv.status)}`}>
                    {getStatusLabel(inv.status)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="text-muted" onClick={(e) => { e.stopPropagation(); openPreview(inv); }}><Eye size={16} /></button>
                    <button className="text-muted" onClick={(e) => e.stopPropagation()}><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Preview Modal (Simulated PDF) */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Számlakép megtekintése"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsPreviewOpen(false)}>Bezárás</button>
            <button className="view-btn" onClick={() => addToast('E-mail elküldve a vevőnek', 'success')}>
              <Mail size={18} inline /> Küldés E-mailben
            </button>
            <button className="create-btn" onClick={() => window.print()}>
              <Printer size={18} inline /> Nyomtatás
            </button>
          </>
        }
      >
        {selectedInvoice && (
          <div className="invoice-preview-container" style={{ background: 'white', color: '#333', padding: '40px', borderRadius: '4px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)', minHeight: '600px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ background: '#714B67', color: 'white', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' }}>RP</div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#714B67' }}>RailParts Manufacturing Ltd.</h2>
                </div>
                <p style={{ fontSize: '0.8rem', margin: '2px 0' }}>1117 Budapest, Vasút utca 12.</p>
                <p style={{ fontSize: '0.8rem', margin: '2px 0' }}>Adószám: 12345678-2-42</p>
                <p style={{ fontSize: '0.8rem', margin: '2px 0' }}>Bankszámla: 11773000-12345678-00000000</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h1 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: '#714B67' }}>SZÁMLA</h1>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{selectedInvoice.id}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #eee' }}>Vevő adatai</h4>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{selectedInvoice.customer}</p>
                <p style={{ fontSize: '0.85rem', margin: '2px 0' }}>H-1054 Budapest, Szabadság tér 1.</p>
                <p style={{ fontSize: '0.85rem', margin: '2px 0' }}>Adószám: 98765432-1-11</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #eee' }}>Számla adatai</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                  <span>Kelt:</span> <strong>{selectedInvoice.date}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                  <span>Esedékesség:</span> <strong>{selectedInvoice.due}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                  <span>Teljesítés:</span> <strong>{selectedInvoice.date}</strong>
                </div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '10px', fontSize: '0.85rem' }}>Megnevezés</th>
                  <th style={{ textAlign: 'center', padding: '10px', fontSize: '0.85rem' }}>Mennyiség</th>
                  <th style={{ textAlign: 'right', padding: '10px', fontSize: '0.85rem' }}>Egységár</th>
                  <th style={{ textAlign: 'right', padding: '10px', fontSize: '0.85rem' }}>Nettó érték</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontSize: '0.85rem' }}>Vasúti kocsi ablak (Hőszigetelt, edzett üveg)</td>
                  <td style={{ textAlign: 'center', padding: '10px', fontSize: '0.85rem' }}>5 db</td>
                  <td style={{ textAlign: 'right', padding: '10px', fontSize: '0.85rem' }}>40,000 Ft</td>
                  <td style={{ textAlign: 'right', padding: '10px', fontSize: '0.85rem' }}>200,000 Ft</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontSize: '0.85rem' }}>Poggyásztartó rögzítő készlet (Alumínium)</td>
                  <td style={{ textAlign: 'center', padding: '10px', fontSize: '0.85rem' }}>10 db</td>
                  <td style={{ textAlign: 'right', padding: '10px', fontSize: '0.85rem' }}>5,200 Ft</td>
                  <td style={{ textAlign: 'right', padding: '10px', fontSize: '0.85rem' }}>52,000 Ft</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '250px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.9rem' }}>
                  <span>Összes nettó:</span> <span>252,000 Ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.9rem' }}>
                  <span>ÁFA (27%):</span> <span>68,040 Ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '1.1rem', fontWeight: 'bold', borderTop: '2px solid #333' }}>
                  <span>FIZETENDŐ:</span> <span>320,040 Ft</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '50px', borderTop: '1px dashed #ccc', paddingTop: '20px', fontSize: '0.75rem', color: '#888', textAlign: 'center' }}>
              Köszönjük a megrendelést! Ez a bizonylat elektronikusan készült és aláírás nélkül is hiteles.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Invoicing;

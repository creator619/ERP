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
  Building,
  CreditCard,
  TrendingUp,
  Receipt
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Invoicing.css';

const Invoicing = ({ addToast }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [invoices, setInvoices] = useState([
    { id: 'INV/2024/001', customer: 'Kovács és Társa Kft.', date: '2024-04-10', due: '2024-04-24', amount: 154200, status: 'Paid' },
    { id: 'INV/2024/002', customer: 'MÁV-START Zrt.', date: '2024-04-12', due: '2024-04-26', amount: 1245000, status: 'Paid' },
    { id: 'INV/2024/003', customer: 'GYSEV Zrt.', date: '2024-04-15', due: '2024-04-29', amount: 450000, status: 'Draft' },
    { id: 'INV/2024/004', customer: 'Stadler Trains', date: '2024-03-20', due: '2024-04-03', amount: 2450000, status: 'Overdue' },
    { id: 'INV/2024/005', customer: 'Rail-Cargo Hungaria', date: '2024-04-18', due: '2024-05-02', amount: 320000, status: 'Partial' },
  ]);

  const openPreview = (inv) => {
    setSelectedInvoice(inv);
    setIsPreviewOpen(true);
  };

  const handleMarkAsPaid = (id) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        auditLogService.log({
          user: 'Pénzügyi Vezető',
          action: 'Számla kiegyenlítve',
          module: 'Invoicing',
          details: `${inv.id} (${inv.customer}) - Összeg: ${formatHUF(inv.amount)}`,
          severity: 'success'
        });
        return { ...inv, status: 'Paid' };
      }
      return inv;
    }));
    addToast('Számla kifizetve!', 'success');
    setIsPreviewOpen(false);
  };

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  const getStatusLabel = (status) => {
    switch(status) {
      case 'Paid': return 'Fizetve';
      case 'Draft': return 'Piszkozat';
      case 'Overdue': return 'Késedelmes';
      case 'Partial': return 'Részben fizetve';
      default: return status;
    }
  };

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'Paid' && i.status !== 'Overdue').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="invoicing-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <Receipt size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Számlázás és Pénzügy</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Bizonylatok és kintlévőségek kezelése</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn" onClick={() => addToast('Exportálás indítva', 'info')}>
            <Download size={18} />
            Export
          </button>
          <button className="create-btn" onClick={() => addToast('Új számla', 'success')}>
            <Plus size={20} />
            Új Számla
          </button>
        </div>
      </div>

      <div className="finance-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="finance-card glass" style={{ borderLeft: '4px solid #2ecc71' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Befolyt összeg</span>
            <TrendingUp size={16} color="#2ecc71" />
          </div>
          <div className="value" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>{formatHUF(totalPaid)}</div>
        </div>
        <div className="finance-card glass" style={{ borderLeft: '4px solid #f1c40f' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Várható bevétel</span>
            <Clock size={16} color="#f1c40f" />
          </div>
          <div className="value" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>{formatHUF(totalPending)}</div>
        </div>
        <div className="finance-card glass" style={{ borderLeft: '4px solid #e74c3c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Késedelmes</span>
            <AlertCircle size={16} color="#e74c3c" />
          </div>
          <div className="value" style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>{formatHUF(totalOverdue)}</div>
        </div>
      </div>

      <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Számlaszám</th>
              <th>Vevő</th>
              <th>Dátum</th>
              <th style={{ textAlign: 'right' }}>Összeg</th>
              <th>Állapot</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} onClick={() => openPreview(inv)} style={{ cursor: 'pointer' }}>
                <td><strong style={{ color: 'var(--primary-color)' }}>{inv.id}</strong></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={14} className="text-muted" />
                    {inv.customer}
                  </div>
                </td>
                <td>{inv.date}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatHUF(inv.amount)}</td>
                <td>
                  <span className={`invoice-status ${inv.status.toLowerCase()}`}>
                    {getStatusLabel(inv.status)}
                  </span>
                </td>
                <td>
                  <button className="view-btn-small" onClick={(e) => { e.stopPropagation(); openPreview(inv); }}><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Számla megtekintése: ${selectedInvoice?.id}`}
        width="850px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsPreviewOpen(false)}>Bezárás</button>
            <button className="view-btn" onClick={() => addToast('E-mail elküldve', 'info')}>
              <Mail size={18} /> Küldés
            </button>
            {selectedInvoice?.status !== 'Paid' && (
              <button className="create-btn" onClick={() => handleMarkAsPaid(selectedInvoice.id)}>
                <CreditCard size={18} /> Fizetés rögzítése
              </button>
            )}
          </>
        }
      >
        {selectedInvoice && (
          <div className="invoice-preview-wrap" style={{ background: '#f8f9fa', padding: '30px', borderRadius: '12px' }}>
            <div className="invoice-paper glass" style={{ background: 'white', color: '#333', padding: '40px', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', minHeight: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ background: '#3498db', color: 'white', padding: '8px', borderRadius: '8px', fontWeight: 'bold' }}>RP</div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#2c3e50' }}>RailParts ERP System</h2>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>1117 Budapest, Vasút utca 12.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', color: '#3498db', fontWeight: 800 }}>SZÁMLA</h1>
                  <p style={{ fontWeight: 'bold' }}>{selectedInvoice.id}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                <div>
                  <h4 style={{ fontSize: '0.75rem', color: '#bdc3c7', textTransform: 'uppercase', marginBottom: '10px' }}>Vevő</h4>
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '5px' }}>{selectedInvoice.customer}</p>
                  <p style={{ fontSize: '0.85rem' }}>H-1054 Budapest, Szabadság tér 1.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ fontSize: '0.75rem', color: '#bdc3c7', textTransform: 'uppercase', marginBottom: '10px' }}>Dátumok</h4>
                  <p style={{ fontSize: '0.85rem' }}>Kelt: <strong>{selectedInvoice.date}</strong></p>
                  <p style={{ fontSize: '0.85rem' }}>Esedékesség: <strong style={{ color: selectedInvoice.status === 'Overdue' ? '#e74c3c' : 'inherit' }}>{selectedInvoice.due}</strong></p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '0.8rem', color: '#7f8c8d' }}>Megnevezés</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontSize: '0.8rem', color: '#7f8c8d' }}>Összeg</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '0.9rem' }}>Vasúti alkatrész szállítás és projektmenedzsment</td>
                    <td style={{ textAlign: 'right', padding: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{formatHUF(selectedInvoice.amount / 1.27)}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <span style={{ color: '#7f8c8d' }}>Nettó:</span>
                    <span>{formatHUF(selectedInvoice.amount / 1.27)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <span style={{ color: '#7f8c8d' }}>ÁFA (27%):</span>
                    <span>{formatHUF(selectedInvoice.amount - (selectedInvoice.amount / 1.27))}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '2px solid #333', marginTop: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
                    <span>ÖSSZESEN:</span>
                    <span style={{ color: '#3498db' }}>{formatHUF(selectedInvoice.amount)}</span>
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

export default Invoicing;

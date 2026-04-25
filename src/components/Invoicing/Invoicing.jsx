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
  Receipt,
  PieChart,
  BarChart,
  Calendar,
  Wallet
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import currencyService from '../../services/CurrencyService';
import './Invoicing.css';

const Invoicing = ({ addToast, currency }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [newInvoice, setNewInvoice] = useState({
    customer: '', due: '', amount: 0, status: 'Draft'
  });
  
  const [invoices, setInvoices] = useState([
    { id: 'INV/2024/001', customer: 'Kovács és Társa Kft.', date: '2024-04-10', due: '2024-04-24', amount: 154200, status: 'Paid', aging: 0 },
    { id: 'INV/2024/002', customer: 'MÁV-START Zrt.', date: '2024-04-12', due: '2024-04-26', amount: 1245000, status: 'Paid', aging: 0 },
    { id: 'INV/2024/003', customer: 'GYSEV Zrt.', date: '2024-04-15', due: '2024-04-29', amount: 450000, status: 'Draft', aging: 0 },
    { id: 'INV/2024/004', customer: 'Stadler Trains', date: '2024-03-20', due: '2024-04-03', amount: 2450000, status: 'Overdue', aging: 21 },
    { id: 'INV/2024/005', customer: 'Rail-Cargo Hungaria', date: '2024-04-18', due: '2024-05-02', amount: 320000, status: 'Partial', aging: 0 },
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
          action: 'Kifizetés rögzítve',
          module: 'Invoicing',
          details: `${inv.id} - Összeg: ${formatCurrency(inv.amount)}`,
          severity: 'success'
        });
        return { ...inv, status: 'Paid', aging: 0 };
      }
      return inv;
    }));
    addToast('Befizetés sikeresen rögzítve', 'success');
    addToast('Befizetés sikeresen rögzítve', 'success');
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.customer || !newInvoice.due || !newInvoice.amount) {
      addToast('Minden mező kitöltése kötelező!', 'warning');
      return;
    }
    const newId = `INV/2026/${String(invoices.length + 1).padStart(3, '0')}`;
    const amountNum = parseInt(newInvoice.amount) || 0;
    
    const invoiceToAdd = {
      id: newId,
      customer: newInvoice.customer,
      date: new Date().toISOString().split('T')[0],
      due: newInvoice.due,
      amount: amountNum,
      status: newInvoice.status,
      aging: 0
    };

    setInvoices([invoiceToAdd, ...invoices]);
    setIsCreateModalOpen(false);
    setNewInvoice({ customer: '', due: '', amount: 0, status: 'Draft' });
    
    auditLogService.log({
      user: 'Pénzügyi Vezető',
      action: 'Új Számla Létrehozva',
      module: 'Invoicing',
      details: `${newId} részére: ${invoiceToAdd.customer} (${formatCurrency(amountNum)})`,
      severity: 'info'
    });
    addToast('Számla sikeresen generálva', 'success');
  };

  const formatCurrency = (val) => currencyService.format(val, currency);

  const stats = {
    totalPaid: invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0),
    totalOverdue: invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0),
    avgAging: Math.round(invoices.reduce((sum, i) => sum + i.aging, 0) / (invoices.length || 1)),
    taxLiability: invoices.filter(i => i.status !== 'Draft').reduce((sum, i) => sum + i.amount, 0) * 0.27
  };

  const costCenters = [
    { name: 'Gyártósor-01', amount: 4520000, color: 'var(--primary-color)' },
    { name: 'Logisztika & Raktár', amount: 1240000, color: '#f1c40f' },
    { name: 'K+F / Mérnökség', amount: 2850000, color: '#9b59b6' },
    { name: 'Adminisztráció', amount: 850000, color: '#34495e' },
  ];

  return (
    <div className="invoicing-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <Receipt size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Pénzügy & Globális Kontrolling</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Multinacionális adókezelés és költséghely-elemzés</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="view-controls" style={{ background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button className={`view-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')} style={{ padding: '6px 12px', borderRadius: '8px' }}>
              <FileText size={16} />
            </button>
            <button className={`view-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')} style={{ padding: '6px 12px', borderRadius: '8px' }}>
              <TrendingUp size={16} />
            </button>
            <button className={`view-btn ${activeTab === 'costcenters' ? 'active' : ''}`} onClick={() => setActiveTab('costcenters')} style={{ padding: '6px 12px', borderRadius: '8px' }}>
              <PieChart size={16} />
            </button>
          </div>
          <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} /> Új Számla
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <>
          <div className="finance-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
            <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Fizetett (Havi)</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2ecc71' }}>{formatCurrency(stats.totalPaid)}</div>
            </div>
            <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Kintlévőség</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e74c3c' }}>{formatCurrency(stats.totalOverdue)}</div>
            </div>
            <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Átlagos fizetési nap</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{stats.avgAging} nap</div>
            </div>
            <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Adóegyenleg (ÁFA)</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{formatCurrency(stats.taxLiability)}</div>
            </div>
          </div>

          <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bizonylat</th>
                  <th>Partner</th>
                  <th>Esedékesség</th>
                  <th>Késés</th>
                  <th style={{ textAlign: 'right' }}>Bruttó</th>
                  <th>Státusz</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} onClick={() => openPreview(inv)} style={{ cursor: 'pointer' }}>
                    <td><strong>{inv.id}</strong></td>
                    <td>{inv.customer}</td>
                    <td>{inv.due}</td>
                    <td>
                      <span style={{ color: inv.aging > 0 ? '#e74c3c' : 'inherit', fontWeight: inv.aging > 0 ? 700 : 400 }}>
                        {inv.aging > 0 ? `+${inv.aging} nap` : '-'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatCurrency(inv.amount)}</td>
                    <td>
                      <span className={`status-badge ${inv.status === 'Paid' ? 'active' : inv.status === 'Overdue' ? 'danger' : 'warning'}`}>
                        {inv.status === 'Paid' ? 'Fizetve' : inv.status === 'Overdue' ? 'Késedelmes' : 'Várakozik'}
                      </span>
                    </td>
                    <td><button className="view-btn-small"><MoreVertical size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="finance-analytics">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' }}>
            <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase' }}>Követelések Korosítása (Aging)</h4>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '200px', paddingBottom: '20px' }}>
                <div style={{ flex: 1, background: '#2ecc71', height: '100%', borderRadius: '4px' }} title="0-30 nap"></div>
                <div style={{ flex: 1, background: '#f1c40f', height: '65%', borderRadius: '4px' }} title="31-60 nap"></div>
                <div style={{ flex: 1, background: '#e67e22', height: '35%', borderRadius: '4px' }} title="61-90 nap"></div>
                <div style={{ flex: 1, background: '#e74c3c', height: '20%', borderRadius: '4px' }} title="90+ nap"></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>0-30</span><span>31-60</span><span>61-90</span><span>90+ (nap)</span>
              </div>
            </div>
            <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase' }}>Tax & VAT Engine</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>EU-belüli mentes:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(12500000)}</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Belföldi 27% ÁFA alap:</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(stats.taxLiability / 0.27)}</span>
                </div>
                <div style={{ padding: '12px', background: 'rgba(231, 76, 60, 0.1)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e74c3c' }}>Fizetendő ÁFA:</span>
                  <span style={{ fontWeight: 800, color: '#e74c3c' }}>{formatCurrency(stats.taxLiability)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'costcenters' && (
        <div className="glass" style={{ padding: '25px', borderRadius: '24px' }}>
           <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '25px' }}>Költséghely Alapú Elemzés</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {costCenters.map((cc, i) => (
                   <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                         <span style={{ fontWeight: 700 }}>{cc.name}</span>
                         <span className="text-muted">{formatCurrency(cc.amount)}</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                         <div style={{ width: `${(cc.amount / 9460000) * 100}%`, height: '100%', background: cc.color }}></div>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="glass" style={{ padding: '20px', borderRadius: '20px', background: 'rgba(52, 152, 219, 0.05)', textAlign: 'center' }}>
                 <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>Összesített Működési Költség</p>
                 <div style={{ fontSize: '2rem', fontWeight: 900 }}>{formatCurrency(9460000)}</div>
                 <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <div style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
                       <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Munkabér</div>
                       <div style={{ fontWeight: 700 }}>45%</div>
                    </div>
                    <div style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
                       <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Anyag</div>
                       <div style={{ fontWeight: 700 }}>38%</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Számla Monitor: ${selectedInvoice?.id}`}
        width="850px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsPreviewOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => window.print()}>
              <Printer size={18} /> PDF Generálás
            </button>
            {selectedInvoice?.status !== 'Paid' && (
              <button className="create-btn" onClick={() => handleMarkAsPaid(selectedInvoice.id)}>
                <Wallet size={18} /> Befizetés rögzítése
              </button>
            )}
          </>
        }
      >
        {selectedInvoice && (
          <div className="invoice-detail-view printable-invoice">
             {/* ... Invoice Paper Layout ... */}
             <div style={{ background: 'white', color: '#333', padding: '40px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                   <h2 style={{ color: 'var(--primary-color)' }}>RP-INVOICE</h2>
                   <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800 }}>{selectedInvoice.id}</p>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>Dátum: {selectedInvoice.date}</p>
                   </div>
                </div>
                <div style={{ marginBottom: '30px' }}>
                   <p className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Vevő:</p>
                   <p style={{ fontWeight: 700 }}>{selectedInvoice.customer}</p>
                </div>
                <div style={{ borderTop: '2px solid #eee', paddingTop: '20px', textAlign: 'right' }}>
                   <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>Bruttó: {formatCurrency(selectedInvoice.amount)}</p>
                   <p className="text-muted" style={{ fontSize: '0.8rem' }}>Esedékesség: {selectedInvoice.due}</p>
                </div>
             </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Új Számla Kézi Rögzítése"
        width="600px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsCreateModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleCreateInvoice}>Számla Mentése</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="settings-group">
            <label>Vevő (Partner) Neve *</label>
            <input type="text" className="glass-input" value={newInvoice.customer} onChange={(e) => setNewInvoice({...newInvoice, customer: e.target.value})} placeholder="pl. MÁV Zrt." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="settings-group">
              <label>Fizetési Határidő *</label>
              <input type="date" className="glass-input" value={newInvoice.due} onChange={(e) => setNewInvoice({...newInvoice, due: e.target.value})} />
            </div>
            <div className="settings-group">
              <label>Bruttó Végösszeg *</label>
              <input type="number" className="glass-input" value={newInvoice.amount || ''} onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})} placeholder="Összeg Ft-ban" />
            </div>
          </div>
          <div className="settings-group">
            <label>Számla Státusza</label>
            <select className="glass-input" value={newInvoice.status} onChange={(e) => setNewInvoice({...newInvoice, status: e.target.value})}>
              <option value="Draft">Piszkozat (Draft)</option>
              <option value="Paid">Fizetve (Paid)</option>
              <option value="Overdue">Késedelmes (Overdue)</option>
              <option value="Partial">Részben fizetett (Partial)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Invoicing;

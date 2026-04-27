import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  History, 
  Layers, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Scale,
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  Calculator
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import Modal from '../UI/Modal';
import './Finance.css';

const Finance = ({ addToast }) => {
  const { transactions, balances, fixedAssets, setTransactions, setBalances } = useData();
  const [activeTab, setActiveTab] = useState('ledger');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    account: '',
    details: '',
    type: 'Debit',
    amount: ''
  });

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  const handleAddTransaction = () => {
    if (!newTx.account || !newTx.details || !newTx.amount) {
      addToast('Kérem töltsön ki minden mezőt!', 'warning');
      return;
    }

    const txAmount = parseFloat(newTx.amount);
    const tx = {
      id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
      ...newTx,
      amount: txAmount
    };

    setTransactions(prev => [tx, ...prev]);
    
    // Update balances (simplified)
    if (newTx.type === 'Debit') {
      setBalances(prev => ({ ...prev, cash: prev.cash + txAmount }));
    } else {
      setBalances(prev => ({ ...prev, cash: prev.cash - txAmount }));
    }

    addToast('Könyvelési tétel rögzítve', 'success');
    setIsAddModalOpen(false);
    setNewTx({
      date: new Date().toISOString().split('T')[0],
      account: '',
      details: '',
      type: 'Debit',
      amount: ''
    });
  };

  return (
    <div className="finance-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', padding: '12px', borderRadius: '12px' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Pénzügy & Kontrolling</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>II. FÁZIS: Mély pénzügyi integráció és eszközmenedzsment</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="view-btn">
            <Download size={18} /> Export (XLSX)
          </button>
          <button className="create-btn" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} /> Új Könyvelési Tétel
          </button>
        </div>
      </div>

      <div className="finance-stats-grid">
         <div className="stat-card glass" style={{ borderLeft: '4px solid #2ecc71' }}>
            <p className="text-muted">Készpénz / Bank</p>
            <div className="stat-value">{formatHUF(balances.cash)}</div>
            <div className="stat-change positive">
               <ArrowUpRight size={14} /> +4.2% vs múlt hó
            </div>
         </div>
         <div className="stat-card glass" style={{ borderLeft: '4px solid #3498db' }}>
            <p className="text-muted">Vevőkövetelés (AR)</p>
            <div className="stat-value">{formatHUF(balances.ar)}</div>
            <div className="stat-label">12 lejárt számla</div>
         </div>
         <div className="stat-card glass" style={{ borderLeft: '4px solid #e74c3c' }}>
            <p className="text-muted">Szállítói Tartozás (AP)</p>
            <div className="stat-value">{formatHUF(balances.ap)}</div>
            <div className="stat-label">Következő kifizetés: holnap</div>
         </div>
      </div>

      <div className="compliance-tabs">
        <div className={`comp-tab ${activeTab === 'ledger' ? 'active' : ''}`} onClick={() => setActiveTab('ledger')}>
           <History size={16} /> Főkönyvi Napló
        </div>
        <div className={`comp-tab ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>
           <Layers size={16} /> Tárgyi Eszközök (Amortizáció)
        </div>
        <div className={`comp-tab ${activeTab === 'tax' ? 'active' : ''}`} onClick={() => setActiveTab('tax')}>
           <Scale size={16} /> ÁFA & Adó Analízis
        </div>
      </div>

      {activeTab === 'ledger' && (
        <div className="glass ledger-container">
           <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
              <div className="search-bar" style={{ width: '350px' }}>
                 <Search size={18} />
                 <input type="text" placeholder="Keresés a tételek között..." style={{ color: 'var(--text-muted)' }} />
              </div>
              <button className="view-btn-small">Szűrés: Mind</button>
           </div>
           <table className="data-table">
              <thead>
                 <tr>
                    <th>Dátum</th>
                    <th>Tranzakció ID</th>
                    <th>Főkönyvi Számla</th>
                    <th>Leírás / Megjegyzés</th>
                    <th style={{ textAlign: 'right' }}>Típus</th>
                    <th style={{ textAlign: 'right' }}>Összeg</th>
                 </tr>
              </thead>
              <tbody>
                 {transactions.map((tx, i) => (
                   <tr key={i}>
                      <td>{tx.date}</td>
                      <td><span style={{ fontWeight: 800, color: 'var(--primary-color)' }}>{tx.id}</span></td>
                      <td style={{ fontWeight: 700 }}>{tx.account}</td>
                      <td className="text-muted" style={{ fontSize: '0.85rem' }}>{tx.details}</td>
                      <td style={{ textAlign: 'right' }}>
                         <span className={`status-badge ${tx.type === 'Debit' ? 'success' : 'warning'}`} style={{ fontSize: '0.65rem' }}>
                            {tx.type === 'Debit' ? 'TARTOZIK' : 'KÖVETEL'}
                         </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 900, color: tx.type === 'Credit' ? '#e74c3c' : '#2ecc71' }}>
                         {tx.type === 'Credit' ? '-' : '+'}{formatHUF(tx.amount)}
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="assets-view">
           <div className="glass ledger-container">
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Tárgyi Eszközök és Értékcsökkenés</h3>
              </div>
              <table className="data-table">
                 <thead>
                    <tr>
                       <th>Eszköz / Gép</th>
                       <th>Beszerzés</th>
                       <th style={{ textAlign: 'right' }}>Bruttó Érték</th>
                       <th style={{ textAlign: 'right' }}>Halmozott ÉCS</th>
                       <th style={{ textAlign: 'right' }}>Nettó Érték</th>
                       <th style={{ textAlign: 'center' }}>Kulcs (%)</th>
                       <th>Státusz</th>
                    </tr>
                 </thead>
                 <tbody>
                    {fixedAssets.map((asset, i) => (
                      <tr key={i}>
                         <td>
                            <div style={{ fontWeight: 800 }}>{asset.name}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>ID: {asset.id}</div>
                         </td>
                         <td>{asset.purchaseDate}</td>
                         <td style={{ textAlign: 'right' }}>{formatHUF(asset.purchaseValue)}</td>
                         <td style={{ textAlign: 'right', color: '#e74c3c' }}>-{formatHUF(asset.totalDepreciation)}</td>
                         <td style={{ textAlign: 'right', fontWeight: 900, color: '#2ecc71' }}>{formatHUF(asset.netValue)}</td>
                         <td style={{ textAlign: 'center', fontWeight: 700 }}>{asset.depYear}%</td>
                         <td>
                            <span className="status-badge active" style={{ fontSize: '0.65rem' }}>HASZNÁLATBAN</span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Új Könyvelési Tétel Rögzítése"
        width="500px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsAddModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleAddTransaction}>Tétel Mentése</button>
          </>
        }
      >
        <div className="add-tx-form">
           <div className="settings-group">
              <label>Dátum</label>
              <input type="date" className="glass-input" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
           </div>
           <div className="settings-group">
              <label>Főkönyvi Számla</label>
              <input type="text" className="glass-input" placeholder="pl. 381 (Pénztár)" value={newTx.account} onChange={e => setNewTx({...newTx, account: e.target.value})} />
           </div>
           <div className="settings-group">
              <label>Leírás / Megjegyzés</label>
              <input type="text" className="glass-input" placeholder="Tranzakció részletei..." value={newTx.details} onChange={e => setNewTx({...newTx, details: e.target.value})} />
           </div>
           <div className="settings-group">
              <label>Típus</label>
              <select className="glass-input" value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value})}>
                 <option value="Debit">TARTOZIK (Debit)</option>
                 <option value="Credit">KÖVETEL (Credit)</option>
              </select>
           </div>
           <div className="settings-group">
              <label>Összeg (HUF)</label>
              <input type="number" className="glass-input" placeholder="0" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default Finance;

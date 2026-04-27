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
import './Finance.css';

const Finance = ({ addToast }) => {
  const { transactions, balances, fixedAssets, addTransaction } = useData();
  const [activeTab, setActiveTab] = useState('ledger');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

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
          <button className="create-btn">
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
        <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
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
           <div className="glass" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden' }}>
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
           
           <div className="asset-summary-grid" style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div className="glass" style={{ padding: '25px', borderRadius: '20px', borderLeft: '4px solid #3498db' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <Calculator size={20} color="#3498db" />
                    <h4 style={{ fontWeight: 800 }}>Havi Amortizációs Költség</h4>
                 </div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                    {formatHUF(fixedAssets.reduce((acc, curr) => acc + curr.monthlyDepreciation, 0))}
                 </div>
                 <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '5px' }}>Ez az összeg automatikusan lekönyvelődik minden hónap végén.</p>
              </div>
              <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                 <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px' }}>ESZKÖZÖSSZETÉTEL</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {fixedAssets.map((a, i) => (
                       <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                             <span>{a.name}</span>
                             <span style={{ fontWeight: 800 }}>{Math.round((a.netValue / 65000000) * 100)}%</span>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                             <div style={{ height: '100%', background: 'var(--primary-color)', width: `${(a.netValue / 65000000) * 100}%` }}></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
           <Scale size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
           <h3 style={{ fontWeight: 800, marginBottom: '10px' }}>ÁFA & Adókezelő Modul</h3>
           <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
              Az automatikus ÁFA bevallás és NAV interfész modul fejlesztés alatt áll. 
              A rendszer jelenleg a háttérben gyűjti az adatokat a főkönyvből.
           </p>
           <div className="pulse-info" style={{ margin: '20px auto' }}></div>
        </div>
      )}
    </div>
  );
};

export default Finance;

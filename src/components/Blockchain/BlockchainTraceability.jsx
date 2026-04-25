import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  ShieldCheck, 
  Search, 
  Activity, 
  Database, 
  Clock, 
  Box, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Lock,
  Cpu,
  RefreshCw,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import './BlockchainTraceability.css';

const BlockchainTraceability = ({ addToast }) => {
  const { ledgers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeLedger, setActiveLedger] = useState(null);
  const [liveBlocks, setLiveBlocks] = useState([
    { id: 'BLK-9942', type: 'Manufacturing', time: 'Most', hash: '0000x8f2a...3d11', status: 'Confirmed' },
    { id: 'BLK-9941', type: 'Quality Check', time: '2 perce', hash: '0000x4c11...9a22', status: 'Confirmed' },
    { id: 'BLK-9940', type: 'Material Intake', time: '15 perce', hash: '0000x2e88...1f44', status: 'Confirmed' }
  ]);



  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsVerifying(true);
    setActiveLedger(null);

    setTimeout(() => {
      const result = ledgers[searchTerm.toUpperCase()];
      if (result) {
        setActiveLedger(result);
        addToast('Kriptográfiai eredet igazolva!', 'success');
      } else {
        addToast('A keresett azonosító nem található a láncban.', 'error');
      }
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="blockchain-module">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container blockchain-glow">
            <LinkIcon size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Blockchain Eredetigazolás</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Digitális Termék Útlevél és hamisíthatatlan gyártási napló</p>
          </div>
        </div>
        <div className="blockchain-status-badge">
          <div className="pulse-dot"></div>
          LEDGER ACTIVE (NETWORK: MAINNET-RP)
        </div>
      </div>

      <div className="blockchain-grid">
        <div className="search-ledger-section">
          <div className="glass search-card" style={{ padding: '30px', borderRadius: '24px' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={20} color="var(--primary-color)" /> Termék Útlevél Keresése
             </h3>
             <form onSubmit={handleSearch} className="blockchain-search-form">
                <input 
                  type="text" 
                  placeholder="Sorozatszám megadása (pl. AXLE-2024-001)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" disabled={isVerifying}>
                  {isVerifying ? <RefreshCw className="spin" size={18} /> : 'ELLENŐRZÉS'}
                </button>
             </form>
             <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '15px' }}>
                A keresés közvetlenül a decentralizált RailParts csomópontokon fut le.
             </p>
          </div>

          {activeLedger && (
            <div className="ledger-result-view animate-in">
               <div className="ledger-header glass">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <span className="verify-label"><ShieldCheck size={14} /> BLOCKCHAIN VERIFIED</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '10px' }}>{activeLedger.name}</h2>
                        <p className="hash-display">{activeLedger.finalHash}</p>
                     </div>
                     <div className="qr-box">
                        <QrCode size={60} />
                     </div>
                  </div>
               </div>

               <div className="timeline-ledger">
                  {activeLedger.steps.map((step, i) => (
                    <div key={i} className="timeline-block">
                       <div className="timeline-marker">
                          <div className="marker-dot"></div>
                          <div className="marker-line"></div>
                       </div>
                       <div className="timeline-content glass">
                          <div className="timeline-meta">
                             <span className="time-tag"><Clock size={12} /> {step.date}</span>
                             <span className="hash-tag">HASH: {step.hash}</span>
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '5px' }}>{step.title}</h4>
                          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{step.details}</p>
                          <div className="timeline-actor">
                             <CheckCircle2 size={14} color="#2ecc71" /> 
                             <span>Digitálisan aláírta: <strong>{step.actor}</strong></span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        <div className="blockchain-sidebar">
           <div className="glass network-card" style={{ padding: '20px', borderRadius: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Activity size={16} color="#2ecc71" /> Hálózat Állapota
              </h4>
              <div className="network-stat">
                 <span>Aktív Csomópontok</span>
                 <strong>12 db</strong>
              </div>
              <div className="network-stat">
                 <span>Átlagos Blokkidő</span>
                 <strong>1.2s</strong>
              </div>
              <div className="network-stat">
                 <span>Összes Tranzakció</span>
                 <strong>14,204</strong>
              </div>
           </div>

           <div className="live-ledger-feed glass" style={{ marginTop: '20px', padding: '20px', borderRadius: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Database size={16} color="var(--primary-color)" /> Élő Főkönyvi Feed
              </h4>
              <div className="block-feed">
                 {liveBlocks.map(block => (
                   <div key={block.id} className="feed-item">
                      <div className="feed-icon"><Box size={14} /></div>
                      <div className="feed-info">
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>{block.id}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{block.time}</span>
                         </div>
                         <p style={{ fontSize: '0.7rem' }}>{block.type}</p>
                         <p className="feed-hash">{block.hash}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass audit-help-card" style={{ marginTop: '20px', padding: '20px', borderRadius: '20px', background: 'rgba(52, 152, 219, 0.05)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px' }}>Mi az a Product Passport?</h4>
              <p style={{ fontSize: '0.75rem', lineHeight: '1.5', opacity: 0.8 }}>
                 A digitális termékútlevél garantálja az alkatrészek eredetét és biztonsági megfelelőségét, lehetetlenné téve a gyártási adatok utólagos módosítását.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainTraceability;

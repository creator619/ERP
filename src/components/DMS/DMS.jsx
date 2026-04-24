import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  Search, 
  Upload, 
  Download, 
  History, 
  MoreVertical, 
  FileImage, 
  FileCode, 
  ShieldCheck, 
  Clock,
  Filter,
  Eye,
  Trash2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './DMS.css';

const DMS = ({ addToast }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Összes Fájl', count: 124, icon: <Folder size={20} /> },
    { id: 'drawings', label: 'Műszaki Rajzok', count: 42, icon: <FileCode size={20} /> },
    { id: 'certs', label: 'Tanúsítványok', count: 18, icon: <ShieldCheck size={20} /> },
    { id: 'contracts', label: 'Szerződések', count: 64, icon: <FileText size={20} /> },
  ];

  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: 'Vázszerkezet_Összeállítás_A1.pdf', 
      category: 'drawings', 
      version: 'v2.4', 
      updated: '2024-04-20', 
      author: 'Nagy Péter',
      size: '4.2 MB',
      status: 'Érvényes',
      history: [
        { version: 'v2.4', date: '2024-04-20', user: 'Nagy Péter', comment: 'Hegesztési varratok pontosítása' },
        { version: 'v2.3', date: '2024-03-12', user: 'Szabó Anna', comment: 'Méretezési korrekció' }
      ]
    },
    { 
      id: 2, 
      name: 'ISO_9001_2024_Certification.pdf', 
      category: 'certs', 
      version: 'v1.0', 
      updated: '2024-01-15', 
      author: 'Kovács János',
      size: '1.8 MB',
      status: 'Érvényes',
      history: [
        { version: 'v1.0', date: '2024-01-15', user: 'Kovács János', comment: 'Eredeti tanúsítvány feltöltése' }
      ]
    },
    { 
      id: 3, 
      name: 'Knorr_Bremse_Keretszerződés_2024.docx', 
      category: 'contracts', 
      version: 'v3.1', 
      updated: '2024-04-22', 
      author: 'Dr. Kiss László',
      size: '850 KB',
      status: 'Felülvizsgálat alatt',
      history: [
        { version: 'v3.1', date: '2024-04-22', user: 'Dr. Kiss László', comment: 'Fizetési határidők módosítása' },
        { version: 'v3.0', date: '2024-04-10', user: 'Admin', comment: 'Éves megújítás' }
      ]
    },
    { 
      id: 4, 
      name: 'Szerelési_Útmutató_S-Line.pdf', 
      category: 'drawings', 
      version: 'v1.2', 
      updated: '2024-03-05', 
      author: 'Nagy Péter',
      size: '12.5 MB',
      status: 'Archivált',
      history: [
        { version: 'v1.2', date: '2024-03-05', user: 'Nagy Péter', comment: 'Képek frissítése' }
      ]
    }
  ]);

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc) => {
    addToast(`${doc.name} letöltése megkezdődött`, 'info');
    auditLogService.log({
      user: 'John Doe',
      action: 'Dokumentum letöltve',
      module: 'DMS',
      details: `${doc.name} (Verzió: ${doc.version})`,
      severity: 'info'
    });
  };

  const openHistory = (doc) => {
    setSelectedDoc(doc);
    setIsHistoryOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Érvényes': return '#2ecc71';
      case 'Felülvizsgálat alatt': return '#f1c40f';
      case 'Archivált': return '#95a5a6';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="dms-wrapper">
      <div className="dms-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dokumentumkezelő (DMS)</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Műszaki rajzok és tanúsítványok központi tára</p>
        </div>
        <button className="create-btn" onClick={() => addToast('Új dokumentum feltöltése', 'info')}>
          <Upload size={20} /> Fájl Feltöltése
        </button>
      </div>

      <div className="category-grid">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className={`category-card glass ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div style={{ padding: '10px', background: activeCategory === cat.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  {cat.icon}
               </div>
               <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{cat.count}</span>
            </div>
            <div>
              <h4 style={{ fontWeight: 700 }}>{cat.label}</h4>
              <p className="text-muted" style={{ fontSize: '0.7rem' }}>Kategória kezelése</p>
            </div>
          </div>
        ))}
      </div>

      <div className="file-list-container glass">
        <div className="dms-search-bar">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Keresés a dokumentumok között..." 
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="view-btn"><Filter size={18} /> Szűrők</button>
        </div>

        <div className="file-list">
          <div className="file-row" style={{ fontWeight: 700, fontSize: '0.75rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
            <div></div>
            <div>Fájlnév</div>
            <div>Frissítve</div>
            <div>Szerző</div>
            <div>Státusz</div>
            <div></div>
          </div>
          {filteredDocs.map(doc => (
            <div key={doc.id} className="file-row">
              <div className="file-icon">
                {doc.category === 'drawings' ? <FileCode size={18} color="#3498db" /> : <FileText size={18} color="#e67e22" />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{doc.name}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span className="version-badge">{doc.version}</span>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>{doc.size}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem' }}>{doc.updated}</div>
              <div style={{ fontSize: '0.85rem' }}>{doc.author}</div>
              <div>
                <span className="status-badge" style={{ background: 'transparent', border: `1px solid ${getStatusColor(doc.status)}`, color: getStatusColor(doc.status) }}>
                  {doc.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button className="view-btn-small" onClick={() => handleDownload(doc)} title="Letöltés"><Download size={16} /></button>
                <button className="view-btn-small" onClick={() => openHistory(doc)} title="Előzmények"><History size={16} /></button>
                <button className="view-btn-small"><MoreVertical size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title={`Verzióelőzmények: ${selectedDoc?.name}`}
        width="600px"
      >
        {selectedDoc && (
          <div className="history-list">
            {selectedDoc.history.map((h, i) => (
              <div key={i} className="history-item">
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={20} />
                    </div>
                    {i < selectedDoc.history.length - 1 && <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.05)', margin: '5px 0' }}></div>}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 800 }}>{h.version}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{h.date}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>{h.comment}</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '5px' }}>Szerkesztette: {h.user}</p>
                  </div>
                </div>
                <button className="view-btn-small" title="Visszaállítás"><RotateCcw size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

// Simple RotateCcw icon replacement if not imported
const RotateCcw = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

export default DMS;

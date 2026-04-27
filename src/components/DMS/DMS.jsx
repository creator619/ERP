import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  MoreVertical, 
  Filter, 
  Clock, 
  User, 
  Tag, 
  FileCode, 
  FileImage, 
  FileUp,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import Modal from '../UI/Modal';
import './DMS.css';

const DMS = ({ addToast }) => {
  const [activeFolder, setActiveFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const folders = [
    { id: 'finance', name: 'Pénzügyi bizonylatok', count: 12, icon: <Folder size={20} color="#f1c40f" /> },
    { id: 'hr', name: 'Személyügyi akták', count: 45, icon: <Folder size={20} color="#e74c3c" /> },
    { id: 'engineering', name: 'Műszaki rajzok (CAD)', count: 128, icon: <Folder size={20} color="#3498db" /> },
    { id: 'legal', name: 'Szerződések & Jog', count: 24, icon: <Folder size={20} color="#9b59b6" /> },
    { id: 'quality', name: 'Minőségi tanúsítványok', count: 86, icon: <Folder size={20} color="#2ecc71" /> }
  ];

  const initialDocuments = [
    { id: 1, name: 'RW-WIN-042_Technical_Spec.pdf', type: 'PDF', size: '2.4 MB', author: 'Kovács János', date: '2024-04-12', folder: 'engineering', version: 'v2.1' },
    { id: 2, name: 'Májusi_Bérjegyzékek_Összesített.xlsx', type: 'EXCEL', size: '1.1 MB', author: 'Szabó Anna', date: '2024-04-25', folder: 'hr', version: 'v1.0' },
    { id: 3, name: 'Szállítói_Szerződés_Knorr.pdf', type: 'PDF', size: '4.8 MB', author: 'Nagy Péter', date: '2024-03-28', folder: 'legal', version: 'v3.0' },
    { id: 4, name: 'Üzemcsarnok_Alaprajz_V3.dwg', type: 'CAD', size: '15.2 MB', author: 'Kovács János', date: '2024-04-05', folder: 'engineering', version: 'v3.2' },
    { id: 5, name: 'ISO_9001_Audit_Report.pdf', type: 'PDF', size: '1.2 MB', author: 'Tóth Béla', date: '2024-04-18', folder: 'quality', version: 'v1.0' }
  ];

  const [documents, setDocuments] = useState(initialDocuments);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolder === 'all' || doc.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText size={24} color="#e74c3c" />;
      case 'EXCEL': return <FileText size={24} color="#2ecc71" />;
      case 'CAD': return <FileCode size={24} color="#3498db" />;
      case 'IMAGE': return <FileImage size={24} color="#9b59b6" />;
      default: return <FileText size={24} />;
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    addToast('Fájl feltöltése folyamatban...', 'info');
    setTimeout(() => {
      addToast('Dokumentum sikeresen archiválva', 'success');
      setIsUploadModalOpen(false);
    }, 1500);
  };

  return (
    <div className="dms-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <HardDrive size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dokumentumtár & DMS</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>V. FÁZIS: Központi fájlkezelő és digitális archívum</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="search-wrapper glass">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Fájl keresése..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="create-btn" onClick={() => setIsUploadModalOpen(true)}>
            <FileUp size={20} /> Feltöltés
          </button>
        </div>
      </div>

      <div className="dms-layout">
        {/* Sidebar / Folders */}
        <div className="dms-sidebar glass">
          <h3 className="sidebar-title">KATEGÓRIÁK</h3>
          <div className="folder-list">
            <div 
              className={`folder-item ${activeFolder === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFolder('all')}
            >
              <Folder size={20} />
              <span>Minden dokumentum</span>
              <span className="doc-count">{documents.length}</span>
            </div>
            <div className="sidebar-divider"></div>
            {folders.map(folder => (
              <div 
                key={folder.id}
                className={`folder-item ${activeFolder === folder.id ? 'active' : ''}`}
                onClick={() => setActiveFolder(folder.id)}
              >
                {folder.icon}
                <span>{folder.name}</span>
                <span className="doc-count">{folder.count}</span>
              </div>
            ))}
          </div>

          <div className="storage-info glass">
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
                <span className="text-muted">Tárhely használat</span>
                <span style={{ fontWeight: 800 }}>72%</span>
             </div>
             <div className="progress-bar-small">
                <div className="progress-fill" style={{ width: '72%', background: 'var(--primary-color)' }}></div>
             </div>
             <p className="text-muted" style={{ fontSize: '0.65rem', marginTop: '10px' }}>
                4.2 GB szabad az 5 GB-ból
             </p>
          </div>
        </div>

        {/* File List */}
        <div className="dms-content glass">
          <div className="content-header">
             <div className="breadcrumb">
                <Folder size={16} /> 
                <ChevronRight size={14} /> 
                <span>{activeFolder === 'all' ? 'Minden fájl' : folders.find(f => f.id === activeFolder)?.name}</span>
             </div>
             <div className="view-mode-btns">
                <button className="view-btn-small active"><FileText size={16} /></button>
                <button className="view-btn-small"><Plus size={16} /></button>
             </div>
          </div>

          <div className="dms-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Név</th>
                  <th>Verzió</th>
                  <th>Méret</th>
                  <th>Szerző</th>
                  <th>Dátum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id} onClick={() => setSelectedDoc(doc)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {getFileIcon(doc.type)}
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{doc.name}</p>
                          <p className="text-muted" style={{ fontSize: '0.7rem' }}>{doc.type} fájl</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="version-badge">{doc.version}</span></td>
                    <td className="text-muted">{doc.size}</td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="avatar-small">{doc.author.charAt(0)}</div>
                          <span style={{ fontSize: '0.85rem' }}>{doc.author}</span>
                       </div>
                    </td>
                    <td className="text-muted">{doc.date}</td>
                    <td>
                      <div className="file-actions">
                        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); addToast('Letöltés indítása...', 'info'); }}><Download size={18} /></button>
                        <button className="icon-btn"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '100px', opacity: 0.3 }}>
                       <Search size={48} style={{ margin: '0 auto 15px' }} />
                       <p>Nem található a keresésnek megfelelő dokumentum.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Dokumentum Feltöltése"
        width="500px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsUploadModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleUpload}>Feltöltés indítása</button>
          </>
        }
      >
        <div className="upload-dropzone">
           <FileUp size={48} color="var(--primary-color)" />
           <h4>Kattintson vagy húzza ide a fájlt</h4>
           <p className="text-muted">PDF, EXCEL, PNG vagy CAD fájlok (Max 50MB)</p>
           <div className="settings-group" style={{ marginTop: '20px', textAlign: 'left', width: '100%' }}>
              <label>Célmappa</label>
              <select className="glass-input">
                 {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
           </div>
        </div>
      </Modal>

      {/* Detail View Modal */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.name}
        width="600px"
      >
        {selectedDoc && (
          <div className="doc-details-view">
             <div className="preview-placeholder glass">
                {getFileIcon(selectedDoc.type)}
                <p style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: 600 }}>Előnézet nem elérhető</p>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>Töltse le a fájlt a megtekintéshez</p>
             </div>
             <div className="doc-info-grid">
                <div className="info-item">
                   <span className="text-muted">Létrehozva:</span>
                   <span>{selectedDoc.date}</span>
                </div>
                <div className="info-item">
                   <span className="text-muted">Tulajdonos:</span>
                   <span>{selectedDoc.author}</span>
                </div>
                <div className="info-item">
                   <span className="text-muted">Mappája:</span>
                   <span style={{ textTransform: 'capitalize' }}>{selectedDoc.folder}</span>
                </div>
                <div className="info-item">
                   <span className="text-muted">Fájlméret:</span>
                   <span>{selectedDoc.size}</span>
                </div>
             </div>
             <div className="doc-history-mini">
                <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '15px' }}>VERZIÓTÖRTÉNET</h4>
                <div className="history-line">
                   <div className="line-node active">
                      <div className="dot"></div>
                      <div className="info">
                         <p><strong>{selectedDoc.version}</strong> - Aktuális</p>
                         <p className="text-muted">{selectedDoc.date} | {selectedDoc.author}</p>
                      </div>
                   </div>
                   <div className="line-node">
                      <div className="dot"></div>
                      <div className="info">
                         <p><strong>v1.0</strong> - Archivált</p>
                         <p className="text-muted">2024.01.12 | Rendszer</p>
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

export default DMS;

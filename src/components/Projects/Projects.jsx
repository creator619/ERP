import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Plus, 
  Search, 
  File, 
  Download, 
  Upload, 
  MoreVertical, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Paperclip
} from 'lucide-react';
import Modal from '../UI/Modal';

const Projects = ({ addToast }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const projects = [
    { 
      id: 'PRJ-001', 
      name: 'Poggyásztartó Fejlesztés (Sliver-Line)', 
      customer: 'Stadler Trains', 
      status: 'In Progress', 
      progress: 65,
      docs: [
        { name: 'Technikai rajz_V1.pdf', size: '2.4 MB', type: 'PDF', date: '2024-04-10' },
        { name: 'Anyagspecifikáció.xlsx', size: '1.1 MB', type: 'Excel', date: '2024-04-12' },
        { name: 'Tűzvédelmi tanúsítvány.pdf', size: '3.8 MB', type: 'PDF', date: '2024-04-15' }
      ]
    },
    { 
      id: 'PRJ-002', 
      name: 'Ajtórendszer Modernizáció', 
      customer: 'MÁV-START', 
      status: 'Draft', 
      progress: 15,
      docs: []
    },
    { 
      id: 'PRJ-003', 
      name: 'Válaszfal sorozatgyártás', 
      customer: 'GYSEV', 
      status: 'Completed', 
      progress: 100,
      docs: [
        { name: 'Végátvételi jegyzőkönyv.pdf', size: '1.5 MB', type: 'PDF', date: '2024-03-20' }
      ]
    }
  ];

  const openProjectDetails = (prj) => {
    setSelectedProject(prj);
    setIsModalOpen(true);
    setActiveTab('overview');
  };

  return (
    <div className="projects-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Projekt Menedzsment</h2>
        <button className="create-btn" onClick={() => addToast('Új projekt', 'info')}>
          <Plus size={20} />
          Új Projekt
        </button>
      </div>

      <div className="kanban-grid">
        {projects.map(prj => (
          <div key={prj.id} className="kanban-card glass" onClick={() => openProjectDetails(prj)}>
            <div className="wo-header">
              <span className="wo-id">{prj.id}</span>
              <span className={`status-pill ${prj.status.toLowerCase().replace(' ', '-')}`}>
                {prj.status === 'In Progress' ? 'Folyamatban' : prj.status === 'Completed' ? 'Kész' : 'Tervezés'}
              </span>
            </div>
            <div className="wo-body" style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{prj.name}</h4>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Vevő: {prj.customer}</p>
            </div>
            <div className="wo-progress-wrapper" style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                <span>Teljesítettség</span>
                <span>{prj.progress}%</span>
              </div>
              <div className="wo-progress">
                <div className="progress-bar" style={{ width: `${prj.progress}%` }}></div>
              </div>
            </div>
            <div className="wo-footer" style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                <Paperclip size={14} />
                {prj.docs.length} dokumentum
              </div>
              <ExternalLink size={16} className="text-muted" />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject?.name || 'Projekt részletei'}
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Dokumentáció frissítve', 'success')}>Mentés</button>
          </>
        }
      >
        {selectedProject && (
          <div className="project-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', borderRadius: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, justifyContent: 'center' }}>Áttekintés</div>
              <div className={`settings-nav-item ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')} style={{ flex: 1, justifyContent: 'center' }}>Dokumentáció ({selectedProject.docs.length})</div>
            </div>

            {activeTab === 'overview' ? (
              <div className="overview-tab">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="info-group">
                    <label className="text-muted" style={{ fontSize: '0.8rem' }}>Ügyfél</label>
                    <p style={{ fontWeight: 600 }}>{selectedProject.customer}</p>
                  </div>
                  <div className="info-group">
                    <label className="text-muted" style={{ fontSize: '0.8rem' }}>Határidő</label>
                    <p style={{ fontWeight: 600 }}>2024. December 15.</p>
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <label className="text-muted" style={{ fontSize: '0.8rem' }}>Projekt leírása</label>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginTop: '5px' }}>
                    A Silver-Line típusú vasúti kocsik új generációs alumínium poggyásztartóinak fejlesztése és prototípus gyártása, beleértve a tűzvédelmi teszteket és a statikai számításokat.
                  </p>
                </div>
              </div>
            ) : (
              <div className="docs-tab">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Csatolt fájlok</h4>
                  <button className="view-btn" style={{ fontSize: '0.8rem', padding: '5px 10px' }} onClick={() => addToast('Fájlválasztó megnyitása', 'info')}>
                    <Upload size={14} inline /> Feltöltés
                  </button>
                </div>
                <div className="doc-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedProject.docs.length > 0 ? selectedProject.docs.map((doc, i) => (
                    <div key={i} className="doc-item" style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div className="doc-icon" style={{ width: '32px', height: '32px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <FileText size={18} color="var(--primary-color)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{doc.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size} • {doc.date}</p>
                      </div>
                      <button className="text-muted" style={{ padding: '5px' }} onClick={() => addToast('Fájl letöltése indítva', 'success')}>
                        <Download size={18} />
                      </button>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      <File size={40} strokeWidth={1} style={{ marginBottom: '10px', opacity: 0.5 }} />
                      <p>Még nincsenek feltöltött dokumentumok.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects;

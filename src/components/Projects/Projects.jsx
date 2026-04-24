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
  Paperclip,
  Users,
  DollarSign,
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Projects.css';

const Projects = ({ addToast }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [projects, setProjects] = useState([
    { 
      id: 'PRJ-001', 
      name: 'Poggyásztartó Fejlesztés (Sliver-Line)', 
      customer: 'Stadler Trains', 
      status: 'In Progress', 
      progress: 65,
      budget: 15000000,
      actual: 9800000,
      team: [
        { name: 'Kovács J.', role: 'Lead Engineer', avatar: 'KJ' },
        { name: 'Nagy P.', role: 'Production', avatar: 'NP' },
        { name: 'Szabó A.', role: 'Sales', avatar: 'SZA' }
      ],
      milestones: [
        { id: 1, name: 'Specifikáció', status: 'done', date: '2024-03-01' },
        { id: 2, name: 'Prototípus', status: 'done', date: '2024-04-10' },
        { id: 3, name: 'Tűzvédelmi teszt', status: 'active', date: '2024-05-15' },
        { id: 4, name: 'Sorozatgyártás', status: 'pending', date: '2024-06-01' }
      ],
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
      budget: 8500000,
      actual: 1200000,
      team: [
        { name: 'Tóth G.', role: 'Mechanic', avatar: 'TG' }
      ],
      milestones: [
        { id: 1, name: 'Helyszíni felmérés', status: 'done', date: '2024-04-01' },
        { id: 2, name: 'Tervezés', status: 'active', date: '2024-05-10' }
      ],
      docs: []
    },
    { 
      id: 'PRJ-003', 
      name: 'Válaszfal sorozatgyártás', 
      customer: 'GYSEV', 
      status: 'Completed', 
      progress: 100,
      budget: 24000000,
      actual: 22500000,
      team: [
        { name: 'Szabó A.', role: 'Sales', avatar: 'SZA' },
        { name: 'Horváth L.', role: 'QC', avatar: 'HL' }
      ],
      milestones: [
        { id: 1, name: 'Gyártás indítása', status: 'done', date: '2024-01-10' },
        { id: 2, name: 'Átadás-átvétel', status: 'done', date: '2024-03-20' }
      ],
      docs: [
        { name: 'Végátvételi jegyzőkönyv.pdf', size: '1.5 MB', type: 'PDF', date: '2024-03-20' }
      ]
    }
  ]);

  const openProjectDetails = (prj) => {
    setSelectedProject(prj);
    setIsModalOpen(true);
    setActiveTab('overview');
  };

  const handleCompleteMilestone = (prjId, mId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === prjId) {
        const updatedMilestones = p.milestones.map(m => 
          m.id === mId ? { ...m, status: 'done' } : m
        );
        
        auditLogService.log({
          user: 'Project Manager',
          action: 'Mérföldkő teljesítve',
          module: 'Projects',
          details: `${p.name} - Mérföldkő kész: ${p.milestones.find(m => m.id === mId).name}`,
          severity: 'success'
        });

        return { ...p, milestones: updatedMilestones };
      }
      return p;
    }));
    addToast('Mérföldkő teljesítve!', 'success');
  };

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="projects-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Projekt Menedzsment</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Fejlesztések és mérnöki projektek követése</p>
          </div>
        </div>
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
            <div className="wo-body" style={{ marginTop: '12px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{prj.name}</h4>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>{prj.customer}</p>
            </div>
            
            <div className="wo-progress-wrapper" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                <span className="text-muted">Teljesítés</span>
                <span style={{ fontWeight: 600 }}>{prj.progress}%</span>
              </div>
              <div className="wo-progress" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${prj.progress}%` }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div className="team-avatars" style={{ display: 'flex' }}>
                {prj.team.map((m, i) => (
                  <div key={i} className="mini-avatar" title={`${m.name} (${m.role})`} style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-color)', 
                    color: 'white', fontSize: '0.6rem', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', border: '2px solid var(--bg-main)', marginLeft: i > 0 ? '-8px' : 0
                  }}>
                    {m.avatar}
                  </div>
                ))}
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Paperclip size={12} /> {prj.docs.length}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Projekt Adatlap: ${selectedProject?.id}`}
        width="900px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Projekt adatok mentve', 'success')}>Mentés</button>
          </>
        }
      >
        {selectedProject && (
          <div className="project-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Áttekintés</div>
              <div className={`settings-nav-item ${activeTab === 'milestones' ? 'active' : ''}`} onClick={() => setActiveTab('milestones')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Mérföldkövek</div>
              <div className={`settings-nav-item ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Dokumentumok</div>
            </div>

            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{selectedProject.name}</h2>
                    <p className="text-muted">{selectedProject.customer}</p>
                  </div>
                  <div className={`status-pill ${selectedProject.status.toLowerCase().replace(' ', '-')}`} style={{ height: 'fit-content' }}>
                    {selectedProject.status}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '30px' }}>
                  <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Tervezett Büdzsé</p>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatHUF(selectedProject.budget)}</h4>
                  </div>
                  <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Eddigi Költség</p>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedProject.actual > selectedProject.budget ? '#dc3545' : 'inherit' }}>{formatHUF(selectedProject.actual)}</h4>
                  </div>
                  <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Maradvány</p>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#28a745' }}>{formatHUF(selectedProject.budget - selectedProject.actual)}</h4>
                  </div>
                </div>

                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--primary-color)" /> Projekt Csapat
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    {selectedProject.team.map((member, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {member.avatar}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{member.name}</p>
                          <p className="text-muted" style={{ fontSize: '0.75rem' }}>{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="milestones-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {selectedProject.milestones.map((m) => (
                    <div key={m.id} className={`milestone-row glass ${m.status}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', borderRadius: '12px', borderLeft: `4px solid ${m.status === 'done' ? '#28a745' : m.status === 'active' ? 'var(--primary-color)' : 'var(--border-color)'}` }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {m.id}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{m.name}</h4>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Határidő: {m.date}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {m.status === 'done' ? (
                          <span style={{ color: '#28a745', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <CheckCircle2 size={16} /> Teljesítve
                          </span>
                        ) : (
                          <button 
                            className={m.status === 'active' ? 'create-btn' : 'view-btn'} 
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                            onClick={() => handleCompleteMilestone(selectedProject.id, m.id)}
                          >
                            Készre jelentés
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="docs-tab">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h4 className="text-muted" style={{ fontSize: '0.9rem' }}>{selectedProject.docs.length} csatolt dokumentum</h4>
                  <button className="view-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <Upload size={14} /> Feltöltés
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {selectedProject.docs.map((doc, i) => (
                    <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={20} color="var(--primary-color)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doc.name}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{doc.size} | {doc.date}</p>
                      </div>
                      <button className="view-btn-small"><Download size={14} /></button>
                    </div>
                  ))}
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

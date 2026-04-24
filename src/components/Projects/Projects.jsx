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
  AlertTriangle,
  BarChart3,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Projects.css';

const Projects = ({ addToast }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'portfolio'

  const [projects, setProjects] = useState([
    { 
      id: 'PRJ-001', 
      name: 'Poggyásztartó Fejlesztés (Sliver-Line)', 
      customer: 'Stadler Trains', 
      status: 'In Progress', 
      progress: 65,
      risk: 'Low',
      budget: 15000000,
      actual: 9800000,
      cpi: 1.05, // Cost Performance Index
      spi: 0.92, // Schedule Performance Index
      riskMatrix: { impact: 2, probability: 3 }, // 1-5
      team: [
        { name: 'Kovács J.', role: 'Lead Engineer', avatar: 'KJ' },
        { name: 'Nagy P.', role: 'Production', avatar: 'NP' }
      ],
      tasks: [
        { id: 'T1', name: 'Alumínium váz hegesztés', assignee: 'Nagy P.', status: 'done', priority: 'high' },
        { id: 'T2', name: 'Tűzvédelmi minősítés beszerzése', assignee: 'Kovács J.', status: 'active', priority: 'critical' },
        { id: 'T3', name: 'Színminta jóváhagyás', assignee: 'Kovács J.', status: 'pending', priority: 'medium' }
      ],
      milestones: [
        { id: 1, name: 'Specifikáció', status: 'done', start: 0, duration: 20 },
        { id: 2, name: 'Prototípus', status: 'done', start: 20, duration: 30 },
        { id: 3, name: 'Tűzvédelmi teszt', status: 'active', start: 50, duration: 25 },
        { id: 4, name: 'Sorozatgyártás', status: 'pending', start: 75, duration: 25 }
      ],
      docs: [
        { name: 'Technikai rajz_V1.pdf', size: '2.4 MB', date: '2024-04-10' }
      ]
    },
    { 
      id: 'PRJ-002', 
      name: 'Ajtórendszer Modernizáció', 
      customer: 'MÁV-START', 
      status: 'Warning', 
      progress: 15,
      risk: 'High',
      budget: 8500000,
      actual: 1200000,
      cpi: 0.85,
      spi: 0.65,
      riskMatrix: { impact: 4, probability: 5 },
      team: [{ name: 'Tóth G.', role: 'Mechanic', avatar: 'TG' }],
      tasks: [
        { id: 'T1', name: 'Helyszíni felmérés', assignee: 'Tóth G.', status: 'done', priority: 'high' },
        { id: 'T2', name: 'CAD terv átdolgozása', assignee: 'Mérnökség', status: 'active', priority: 'high' }
      ],
      milestones: [
        { id: 1, name: 'Felmérés', status: 'done', start: 0, duration: 40 },
        { id: 2, name: 'Tervezés', status: 'active', start: 40, duration: 60 }
      ],
      docs: []
    }
  ]);

  const openProjectDetails = (prj) => {
    setSelectedProject(prj);
    setIsModalOpen(true);
    setActiveTab('overview');
  };

  const RiskHeatmap = ({ matrix }) => {
    const grid = [];
    for (let i = 5; i >= 1; i--) {
      for (let j = 1; j <= 5; j++) {
        const isActive = matrix.impact === j && matrix.probability === i;
        const severity = i * j;
        let bgColor = 'rgba(255,255,255,0.02)';
        if (severity > 15) bgColor = 'rgba(231, 76, 60, 0.2)';
        else if (severity > 8) bgColor = 'rgba(241, 196, 15, 0.2)';
        else if (severity > 4) bgColor = 'rgba(46, 204, 113, 0.2)';

        grid.push(
          <div 
            key={`${i}-${j}`} 
            className={`risk-cell ${isActive ? 'active-risk' : ''}`}
            style={{ 
              background: isActive ? (severity > 15 ? '#e74c3c' : severity > 8 ? '#f1c40f' : '#2ecc71') : bgColor,
              border: isActive ? '2px solid white' : '1px solid rgba(255,255,255,0.05)',
              height: '40px',
              borderRadius: '4px',
              position: 'relative'
            }}
          >
            {isActive && <div className="risk-ping"></div>}
          </div>
        );
      }
    }
    return (
      <div className="risk-heatmap-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', width: '220px' }}>
          {grid}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', fontSize: '0.6rem', marginTop: '5px', color: 'var(--text-muted)' }}>
          <span>Low Impact</span>
          <span>High Impact</span>
        </div>
      </div>
    );
  };

  const ResourceHistogram = () => (
    <div className="resource-histogram">
       {[
         { dept: 'Eng', load: 85, color: '#3498db' },
         { dept: 'Prod', load: 92, color: '#e74c3c' },
         { dept: 'QA', load: 40, color: '#2ecc71' },
         { dept: 'Log', load: 55, color: '#f1c40f' }
       ].map(r => (
         <div key={r.dept} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
               <div style={{ width: '100%', height: `${r.load}%`, background: r.color, borderRadius: '4px', transition: 'height 1s ease-out' }}></div>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{r.dept}</span>
         </div>
       ))}
    </div>
  );

  const GanttChart = ({ milestones }) => (
    <div className="gantt-container" style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <div style={{ flex: 1 }}>Mérföldkő</div>
        <div style={{ flex: 2, display: 'flex', justifyContent: 'space-between' }}>
          <span>Március</span><span>Április</span><span>Május</span><span>Június</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {milestones.map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600 }}>{m.name}</div>
            <div style={{ flex: 2, height: '12px', background: 'var(--border-color)', borderRadius: '6px', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                left: `${m.start}%`, 
                width: `${m.duration}%`, 
                height: '100%', 
                background: m.status === 'done' ? '#2ecc71' : m.status === 'active' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                boxShadow: m.status === 'active' ? '0 0 10px var(--primary-color)' : 'none'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="projects-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Projekt Portfólió</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Globális erőforrás-tervezés és ütemezés</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="view-controls glass" style={{ padding: '4px', borderRadius: '10px' }}>
            <button className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>Kártyák</button>
            <button className={`view-btn ${viewMode === 'portfolio' ? 'active' : ''}`} onClick={() => setViewMode('portfolio')}>Portfólió (Gantt)</button>
          </div>
          <button className="create-btn" onClick={() => addToast('Új projekt indítása', 'info')}>
            <Plus size={20} /> Új Projekt
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="kanban-grid">
          {projects.map(prj => (
            <div key={prj.id} className={`kanban-card glass ${prj.risk === 'High' ? 'danger-border' : ''}`} onClick={() => openProjectDetails(prj)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)' }}>{prj.id}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`status-badge ${prj.risk === 'Low' ? 'active' : 'danger'}`} style={{ fontSize: '0.6rem' }}>
                    RISK: {prj.risk}
                  </span>
                  <span className={`status-badge ${prj.status === 'In Progress' ? 'warning' : 'active'}`} style={{ fontSize: '0.6rem' }}>
                    {prj.status}
                  </span>
                </div>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '5px' }}>{prj.name}</h4>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '15px' }}>{prj.customer}</p>
              
              <div className="progress-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                  <span>Teljesítés</span>
                  <span>{prj.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${prj.progress}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Activity size={14} className="text-muted" />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: prj.cpi < 1 ? '#e74c3c' : '#2ecc71' }}>CPI: {prj.cpi}</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} className="text-muted" />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: prj.spi < 1 ? '#e74c3c' : '#2ecc71' }}>SPI: {prj.spi}</span>
                   </div>
                </div>
                <div className="team-mini" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Users size={14} className="text-muted" />
                  <span style={{ fontSize: '0.75rem' }}>{prj.team.length} fő</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="portfolio-gantt glass" style={{ padding: '30px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Globális Idővonal & Erőforrások</h3>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2ecc71' }}></div> Tervezés</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary-color)' }}></div> Kivitelezés</div>
            </div>
          </div>
          
          <div className="gantt-grid">
            <div className="gantt-header-row" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>PROJEKT</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
              </div>
            </div>
            
            {projects.map(prj => (
              <div key={prj.id} className="gantt-prj-row" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ paddingRight: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{prj.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{prj.customer}</div>
                </div>
                <div style={{ height: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: `${prj.id === 'PRJ-001' ? '10%' : '30%'}`, 
                    width: `${prj.progress + 10}%`, 
                    height: '100%', 
                    background: `linear-gradient(90deg, #3498db, #2ecc71)`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 15px',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {prj.progress}% COMPLETE
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="resource-allocation" style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border-color)' }}>
             <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '20px' }}>Részlegszintű Erőforrás-kihasználtság</h4>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {[
                  { dept: 'Mérnökség', load: 88, color: '#3498db' },
                  { dept: 'Gyártás', load: 95, color: '#e74c3c' },
                  { dept: 'Minőségügy', load: 45, color: '#2ecc71' },
                  { dept: 'Logisztika', load: 62, color: '#f1c40f' }
                ].map(r => (
                  <div key={r.dept} className="glass" style={{ padding: '15px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 700 }}>{r.dept}</span>
                      <span>{r.load}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                      <div style={{ width: `${r.load}%`, height: '100%', background: r.color, borderRadius: '3px' }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Projekt Monitor: ${selectedProject?.name}`}
        width="950px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={() => addToast('Változtatások mentve', 'success')}>Mentés</button>
          </>
        }
      >
        {selectedProject && (
          <div className="project-detail-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Dashboard</div>
              <div className={`settings-nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Feladatok (WBS)</div>
              <div className={`settings-nav-item ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Kockázat & Erőforrás</div>
              <div className={`settings-nav-item ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Dokumentumok</div>
            </div>

            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px', marginBottom: '30px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase' }}>Pénzügyi Egészség (EVM)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                           <div className="evm-card">
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CPI (Cost Index)</div>
                              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: selectedProject.cpi < 1 ? '#e74c3c' : '#2ecc71' }}>{selectedProject.cpi}</div>
                           </div>
                           <div className="evm-card">
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SPI (Schedule Index)</div>
                              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: selectedProject.spi < 1 ? '#e74c3c' : '#2ecc71' }}>{selectedProject.spi}</div>
                           </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Büdzsé:</span>
                            <span style={{ fontWeight: 700 }}>{formatHUF(selectedProject.budget)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Aktuális költés:</span>
                            <span style={{ fontWeight: 700, color: selectedProject.actual > selectedProject.budget ? '#e74c3c' : 'inherit' }}>{formatHUF(selectedProject.actual)}</span>
                          </div>
                          <div style={{ height: '10px', background: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden', marginTop: '10px' }}>
                            <div style={{ width: `${Math.min(100, (selectedProject.actual / selectedProject.budget) * 100)}%`, height: '100%', background: selectedProject.actual > selectedProject.budget ? '#e74c3c' : '#2ecc71' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                         <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '15px' }}>Mérföldkő Ütemezés</h4>
                         <GanttChart milestones={selectedProject.milestones} />
                      </div>
                   </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div className="glass" style={{ padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase' }}>Kockázat</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                           <RiskHeatmap matrix={selectedProject.riskMatrix} />
                        </div>
                        <p style={{ fontWeight: 800, color: selectedProject.risk === 'High' ? '#e74c3c' : '#2ecc71' }}>
                           {selectedProject.risk === 'High' ? 'KRITIKUS KOCKÁZAT' : 'STABIL FOLYAMAT'}
                        </p>
                     </div>

                     <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '15px' }}>Projekt Csapat</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           {selectedProject.team.map((m, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                 <div className="mini-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', fontSize: '0.7rem' }}>{m.avatar}</div>
                                 <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{m.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.role}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tasks-tab">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                   <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Work Breakdown Structure (WBS)</h4>
                   <button className="view-btn-small"><Plus size={14} /> Feladat hozzáadása</button>
                </div>
                <div className="wbs-list">
                   {selectedProject.tasks.map(task => (
                      <div key={task.id} className="glass wbs-item" style={{ padding: '15px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                               {task.status === 'done' ? <CheckCircle2 size={18} color="#2ecc71" /> : <Clock size={18} color="var(--primary-color)" />}
                            </div>
                            <div>
                               <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{task.name}</div>
                               <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Felelős: {task.assignee}</div>
                            </div>
                         </div>
                         <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span className={`status-badge ${task.priority === 'critical' ? 'danger' : 'active'}`} style={{ fontSize: '0.6rem' }}>{task.priority.toUpperCase()}</span>
                            <button className="view-btn-small"><ArrowRight size={14} /></button>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="risk-tab">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                   <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px' }}>Részletes Kockázati Mátrix</h4>
                      <RiskHeatmap matrix={selectedProject.riskMatrix} />
                      <div style={{ marginTop: '30px' }}>
                         <h5 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '10px' }}>Aktív Mitigációs Terv</h5>
                         <div className="glass" style={{ padding: '15px', borderRadius: '10px', borderLeft: '4px solid #f1c40f' }}>
                            <p style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>"A beszállítói késedelem ellensúlyozására alternatív forrásokat vontunk be. A logisztikai költség 5%-kal nőhet, de az SPI tartható."</p>
                         </div>
                      </div>
                   </div>
                   <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px' }}>Erőforrás Histogram</h4>
                      <ResourceHistogram />
                      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(231, 76, 60, 0.05)', borderRadius: '10px' }}>
                         <p style={{ fontSize: '0.75rem', color: '#e74c3c', fontWeight: 700 }}>FIGYELEM: Gyártókapacitás túlterhelve (92%)!</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="docs-tab">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                  {selectedProject.docs.map((doc, i) => (
                    <div key={i} className="glass doc-card" style={{ padding: '20px', borderRadius: '15px', textAlign: 'center', transition: 'all 0.3s' }}>
                      <FileText size={32} color="var(--primary-color)" style={{ marginBottom: '10px' }} />
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '5px' }}>{doc.size} • {doc.date}</p>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                        <button className="view-btn-small"><Eye size={14} /></button>
                        <button className="view-btn-small"><Download size={14} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="glass" style={{ padding: '20px', borderRadius: '15px', border: '2px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '140px' }}>
                    <Upload size={24} className="text-muted" />
                    <span style={{ fontSize: '0.7rem', marginTop: '8px' }}>Dokumentum feltöltése</span>
                  </div>
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

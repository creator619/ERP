import React, { useState } from 'react';
import { 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  MoreVertical,
  Building,
  Calendar,
  Globe,
  MessageSquare,
  History,
  TrendingUp,
  User,
  Star,
  ExternalLink,
  Users,
  FileSearch,
  Clock,
  AlertCircle,
  FileCheck,
  Briefcase
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './CRM.css';

const CRM = ({ addToast }) => {
  const [viewType, setViewType] = useState('kanban'); // 'kanban', 'list', or 'tenders'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isCreatePartnerModalOpen, setIsCreatePartnerModalOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState({ type: 'Call', desc: '' });
  const [newOpportunity, setNewOpportunity] = useState({ name: '', value: '', stage: 'Prospecting' });
  const [newPartnerData, setNewPartnerData] = useState({ 
    name: '', email: '', phone: '', city: '', manager: 'Szabó Anna', tags: ['Vevő'] 
  });

  const [partners, setPartners] = useState([
    { id: 1, name: 'MÁV-START Zrt.', email: 'beszerzes@mav-start.hu', phone: '+36 1 511 1111', city: 'Budapest', tags: ['Vevő', 'Kiemelt'], status: 'Aktív', manager: 'Szabó Anna',
      interactions: [
        { date: '2024-04-18', type: 'Call', desc: 'Szerződéskötés előkészítése' },
        { date: '2024-04-15', type: 'Meeting', desc: 'Technikai specifikáció egyeztetés' }
      ],
      opportunities: [
        { name: 'Kocsi felújítás', value: 15000000, stage: 'Negotiation' }
      ]
    },
    { id: 2, name: 'GYSEV Zrt.', email: 'info@gysev.hu', phone: '+36 99 517 111', city: 'Sopron', tags: ['Vevő'], status: 'Aktív', manager: 'Szabó Anna', interactions: [], opportunities: [] },
    { id: 3, name: 'Rail Cargo Hungaria Zrt.', email: 'office@railcargo.hu', phone: '+36 1 512 7000', city: 'Budapest', tags: ['Vevő', 'Logisztika'], status: 'Aktív', manager: 'Kovács János', interactions: [], opportunities: [] },
    { id: 4, name: 'Stadler Trains Kft.', email: 'hungary@stadlerrail.com', phone: '+36 1 327 4060', city: 'Dunakeszi', tags: ['Partner', 'Gyártó'], status: 'Aktív', manager: 'Szabó Anna', interactions: [], opportunities: [] },
  ]);

  const [tenders, setTenders] = useState([
    { 
      id: 'TEN-2024-042', 
      title: 'Vagon alváz hegesztési tender', 
      issuer: 'MÁV-START Zrt.', 
      deadline: '2024-05-15', 
      value: 125000000, 
      status: 'In Progress',
      compliance: 85,
      tasks: ['Műszaki rajz', 'Költségbecslés', 'Referenciák']
    },
    { 
      id: 'TEN-2024-045', 
      title: 'Személykocsi belső világítás', 
      issuer: 'GYSEV Zrt.', 
      deadline: '2024-05-01', 
      value: 42000000, 
      status: 'Review',
      compliance: 100,
      tasks: ['Árajánlat kész', 'Mintadarab leadva']
    },
    { 
      id: 'TEN-2024-048', 
      title: 'Hajtóműalkatrész beszállítás', 
      issuer: 'Stadler Rail', 
      deadline: '2024-04-30', 
      value: 85000000, 
      status: 'Draft',
      compliance: 40,
      tasks: ['Specifikáció elemzés']
    }
  ]);

  const openPartnerDetails = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
    setActiveTab('overview');
  };

  const handleUpdatePartner = () => {
    auditLogService.log({
      user: 'Sales Manager',
      action: 'Partner adat módosítás',
      module: 'CRM',
      details: `${selectedPartner.name} adatai frissítve`,
      severity: 'info'
    });
    addToast('Partner adatok mentve', 'success');
  };

  const handleAddInteraction = () => {
    if (!newInteraction.desc) return;
    
    const interaction = {
      ...newInteraction,
      date: new Date().toISOString().split('T')[0]
    };

    setPartners(prev => prev.map(p => {
      if (p.id === selectedPartner.id) {
        const updatedPartner = {
          ...p,
          interactions: [interaction, ...p.interactions]
        };
        setSelectedPartner(updatedPartner);
        return updatedPartner;
      }
      return p;
    }));

    auditLogService.log({
      user: 'Sales Manager',
      action: 'Új interakció',
      module: 'CRM',
      details: `${selectedPartner.name}: ${interaction.type} rögzítve`,
      severity: 'info'
    });

    setIsInteractionModalOpen(false);
    setNewInteraction({ type: 'Call', desc: '' });
    addToast('Interakció rögzítve', 'success');
  };

  const handleAddOpportunity = () => {
    if (!newOpportunity.name || !newOpportunity.value) return;

    const opp = {
      ...newOpportunity,
      value: parseInt(newOpportunity.value)
    };

    setPartners(prev => prev.map(p => {
      if (p.id === selectedPartner.id) {
        const updatedPartner = {
          ...p,
          opportunities: [...p.opportunities, opp]
        };
        setSelectedPartner(updatedPartner);
        return updatedPartner;
      }
      return p;
    }));

    auditLogService.log({
      user: 'Sales Manager',
      action: 'Új lehetőség',
      module: 'CRM',
      details: `${selectedPartner.name}: ${opp.name} (${opp.value} HUF) rögzítve`,
      severity: 'success'
    });

    setIsOpportunityModalOpen(false);
    setNewOpportunity({ name: '', value: '', stage: 'Prospecting' });
    addToast('Értékesítési lehetőség rögzítve', 'success');
  };

  const handleAddPartner = () => {
    if (!newPartnerData.name) return;

    const partner = {
      ...newPartnerData,
      id: partners.length + 1,
      status: 'Aktív',
      interactions: [],
      opportunities: []
    };

    setPartners(prev => [partner, ...prev]);

    auditLogService.log({
      user: 'Sales Manager',
      action: 'Új partner felvétele',
      module: 'CRM',
      details: `${partner.name} hozzáadva a rendszerhez`,
      severity: 'success'
    });

    setIsCreatePartnerModalOpen(false);
    setNewPartnerData({ name: '', email: '', phone: '', city: '', manager: 'Szabó Anna', tags: ['Vevő'] });
    addToast('Új partner sikeresen létrehozva', 'success');
  };

  const openTenderDetails = (tender) => {
    setSelectedTender(tender);
    setIsTenderModalOpen(true);
  };

  const handleUpdateTenderStatus = (newStatus) => {
    setTenders(prev => prev.map(t => {
      if (t.id === selectedTender.id) {
        const updated = { ...t, status: newStatus };
        setSelectedTender(updated);
        return updated;
      }
      return t;
    }));

    auditLogService.log({
      user: 'Sales Manager',
      action: 'Tender státusz módosítás',
      module: 'CRM',
      details: `${selectedTender.id}: Új státusz: ${newStatus}`,
      severity: 'info'
    });

    addToast('Tender státusz frissítve', 'success');
  };

  const formatHUF = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="crm-module">
      <div className="crm-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Partnerkapcsolatok (CRM)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Ügyfelek és Pályázatok (Tender Monitor) kezelése</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="view-controls glass" style={{ padding: '4px', borderRadius: '10px' }}>
            <button className={`view-btn ${viewType === 'kanban' ? 'active' : ''}`} onClick={() => setViewType('kanban')}>
              Dashboard
            </button>
            <button className={`view-btn ${viewType === 'tenders' ? 'active' : ''}`} onClick={() => setViewType('tenders')}>
              Tender Monitor
            </button>
          </div>
          <button className="create-btn" onClick={() => setIsCreatePartnerModalOpen(true)}>
            <Plus size={20} /> Új Partner
          </button>
        </div>
      </div>

      {viewType === 'kanban' ? (
        <div className="partner-grid responsive-grid">
          {partners.map(partner => (
            <div key={partner.id} className="kanban-card glass" onClick={() => openPartnerDetails(partner)} style={{ padding: '25px', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div className="kanban-avatar" style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                  {partner.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{partner.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>{partner.city}</p>
                </div>
              </div>
              
              <div className="tag-list" style={{ marginBottom: '20px' }}>
                {partner.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <div className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} /> {partner.manager}
                </div>
                <span className="status-badge active" style={{ fontSize: '0.65rem' }}>AKTÍV</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tender-monitor-view">
           <div className="tender-stats-grid responsive-grid" style={{ marginBottom: '25px' }}>
              <div className="stat-card glass">
                 <p className="text-muted" style={{ fontSize: '0.75rem' }}>Összes Tender</p>
                 <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{tenders.length} db</div>
              </div>
              <div className="stat-card glass">
                 <p className="text-muted" style={{ fontSize: '0.75rem' }}>Várható Bevétel</p>
                 <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-color)' }}>{formatHUF(252000000)}</div>
              </div>
              <div className="stat-card glass">
                 <p className="text-muted" style={{ fontSize: '0.75rem' }}>Kritikus Határidő</p>
                 <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e74c3c' }}>4 nap</div>
              </div>
              <div className="stat-card glass">
                 <p className="text-muted" style={{ fontSize: '0.75rem' }}>Sikerarány</p>
                 <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2ecc71' }}>64%</div>
              </div>
           </div>

           <div className="tender-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
              {tenders.map(tender => (
                <div key={tender.id} className="tender-card glass" onClick={() => openTenderDetails(tender)} style={{ padding: '25px', borderRadius: '20px', cursor: 'pointer' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)' }}>{tender.id}</span>
                      <span className={`status-badge ${tender.status === 'Review' ? 'active' : tender.status === 'In Progress' ? 'warning' : 'info'}`}>
                         {tender.status === 'Review' ? 'Leadva' : tender.status === 'In Progress' ? 'Folyamatban' : 'Piszkozat'}
                      </span>
                   </div>
                   <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>{tender.title}</h4>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <Building size={14} className="text-muted" />
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>{tender.issuer}</span>
                   </div>

                   <div className="tender-compliance" style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                         <span>Megfelelőség</span>
                         <span style={{ fontWeight: 800 }}>{tender.compliance}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                         <div style={{ width: `${tender.compliance}%`, height: '100%', background: tender.compliance > 80 ? '#2ecc71' : tender.compliance > 50 ? '#f1c40f' : '#3498db' }}></div>
                      </div>
                   </div>

                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e74c3c' }}>
                         <Clock size={16} />
                         <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{tender.deadline}</span>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>{formatHUF(tender.value)}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Partner Adatlap: ${selectedPartner?.name}`}
        width="850px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={handleUpdatePartner}>Adatok Mentése</button>
          </>
        }
      >
        {selectedPartner && (
          <div className="partner-details-view">
            <div className="settings-nav">
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Áttekintés</div>
              <div className={`settings-nav-item ${activeTab === 'interactions' ? 'active' : ''}`} onClick={() => setActiveTab('interactions')}>Interakciók</div>
              <div className={`settings-nav-item ${activeTab === 'deals' ? 'active' : ''}`} onClick={() => setActiveTab('deals')}>Lehetőségek</div>
            </div>

            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                  <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>Elérhetőségek</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Mail size={16} color="var(--primary-color)" />
                        <span style={{ fontSize: '0.9rem' }}>{selectedPartner.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Phone size={16} color="var(--primary-color)" />
                        <span style={{ fontSize: '0.9rem' }}>{selectedPartner.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={16} color="var(--primary-color)" />
                        <span style={{ fontSize: '0.9rem' }}>{selectedPartner.city}, Magyarország</span>
                      </div>
                    </div>
                  </div>
                  <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>Account Manager</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {selectedPartner.manager.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600 }}>{selectedPartner.manager}</p>
                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Senior Sales Representative</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'interactions' && (
              <div className="interactions-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {selectedPartner.interactions.length > 0 ? selectedPartner.interactions.map((int, i) => (
                    <div key={i} className="glass" style={{ padding: '15px', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{int.type}</span>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{int.date}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem' }}>{int.desc}</p>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '40px' }} className="text-muted">Nincs rögzített interakció.</div>
                  )}
                  <button className="view-btn" style={{ width: '100%' }} onClick={() => setIsInteractionModalOpen(true)}>
                    <MessageSquare size={16} /> Új Interakció Rögzítése
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="deals-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {selectedPartner.opportunities.map((opp, i) => (
                    <div key={i} className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h4 style={{ fontWeight: 700 }}>{opp.name}</h4>
                        <div className="status-pill warning" style={{ fontSize: '0.7rem' }}>{opp.stage}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                           {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(opp.value)}
                        </div>
                        <button className="view-btn-small">Folyamat Megnyitása <ExternalLink size={14} /></button>
                      </div>
                    </div>
                  ))}
                  <button className="create-btn" style={{ width: '100%' }} onClick={() => setIsOpportunityModalOpen(true)}>
                    <Plus size={16} /> Új Értékesítési Lehetőség
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isInteractionModalOpen}
        onClose={() => setIsInteractionModalOpen(false)}
        title="Új Interakció Rögzítése"
        width="500px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsInteractionModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleAddInteraction}>Rögzítés</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div className="settings-group">
              <label>Interakció Típusa</label>
              <select 
                value={newInteraction.type} 
                onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
              >
                 <option value="Call" style={{ background: '#1a1a1a' }}>Telefonhívás</option>
                 <option value="Meeting" style={{ background: '#1a1a1a' }}>Személyes Megbeszélés</option>
                 <option value="Email" style={{ background: '#1a1a1a' }}>Email váltás</option>
                 <option value="Note" style={{ background: '#1a1a1a' }}>Belső Megjegyzés</option>
              </select>
           </div>
           <div className="settings-group">
              <label>Leírás / Összefoglaló</label>
              <textarea 
                value={newInteraction.desc} 
                onChange={(e) => setNewInteraction({...newInteraction, desc: e.target.value})}
                placeholder="Miről volt szó? Mik a következő lépések?"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', minHeight: '120px', outline: 'none' }}
              />
           </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOpportunityModalOpen}
        onClose={() => setIsOpportunityModalOpen(false)}
        title="Új Értékesítési Lehetőség"
        width="500px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsOpportunityModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleAddOpportunity}>Mentés</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div className="settings-group">
              <label>Projekt / Lehetőség Neve</label>
              <input 
                type="text"
                value={newOpportunity.name}
                onChange={(e) => setNewOpportunity({...newOpportunity, name: e.target.value})}
                placeholder="pl. 12db Vagon felújítása"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
              />
           </div>
           <div className="settings-group">
              <label>Becsült Érték (HUF)</label>
              <input 
                type="number"
                value={newOpportunity.value}
                onChange={(e) => setNewOpportunity({...newOpportunity, value: e.target.value})}
                placeholder="Érték forintban"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
              />
           </div>
           <div className="settings-group">
              <label>Értékesítési Fázis</label>
              <select 
                value={newOpportunity.stage} 
                onChange={(e) => setNewOpportunity({...newOpportunity, stage: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
              >
                 <option value="Prospecting" style={{ background: '#1a1a1a' }}>Felkutatás</option>
                 <option value="Qualification" style={{ background: '#1a1a1a' }}>Minősítés</option>
                 <option value="Proposal" style={{ background: '#1a1a1a' }}>Ajánlatadás</option>
                 <option value="Negotiation" style={{ background: '#1a1a1a' }}>Tárgyalás</option>
                 <option value="Closed Won" style={{ background: '#1a1a1a' }}>Lezárt - Megnyert</option>
              </select>
           </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCreatePartnerModalOpen}
        onClose={() => setIsCreatePartnerModalOpen(false)}
        title="Új Partner Felvétele"
        width="600px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsCreatePartnerModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleAddPartner}>Partner Létrehozása</button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
           <div className="settings-group" style={{ gridColumn: 'span 2' }}>
              <label>Cégnév / Partner Neve</label>
              <input 
                type="text"
                value={newPartnerData.name}
                onChange={(e) => setNewPartnerData({...newPartnerData, name: e.target.value})}
                placeholder="pl. Magyar Államvasutak"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
              />
           </div>
           <div className="settings-group">
              <label>Email Cím</label>
              <input 
                type="email"
                value={newPartnerData.email}
                onChange={(e) => setNewPartnerData({...newPartnerData, email: e.target.value})}
                placeholder="info@partner.hu"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
              />
           </div>
           <div className="settings-group">
              <label>Telefonszám</label>
              <input 
                type="text"
                value={newPartnerData.phone}
                onChange={(e) => setNewPartnerData({...newPartnerData, phone: e.target.value})}
                placeholder="+36 30 123 4567"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
              />
           </div>
           <div className="settings-group">
              <label>Város</label>
              <input 
                type="text"
                value={newPartnerData.city}
                onChange={(e) => setNewPartnerData({...newPartnerData, city: e.target.value})}
                placeholder="pl. Budapest"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
              />
           </div>
           <div className="settings-group">
              <label>Account Manager</label>
              <select 
                value={newPartnerData.manager} 
                onChange={(e) => setNewPartnerData({...newPartnerData, manager: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
              >
                 <option value="Szabó Anna" style={{ background: '#1a1a1a' }}>Szabó Anna</option>
                 <option value="Kovács János" style={{ background: '#1a1a1a' }}>Kovács János</option>
                 <option value="Nagy Péter" style={{ background: '#1a1a1a' }}>Nagy Péter</option>
              </select>
           </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTenderModalOpen}
        onClose={() => setIsTenderModalOpen(false)}
        title={`Tender Részletek: ${selectedTender?.title}`}
        width="600px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsTenderModalOpen(false)}>Bezárás</button>
          </>
        }
      >
        {selectedTender && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(52, 152, 219, 0.1)', padding: '15px', borderRadius: '12px' }}>
               <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>Kiíró Intézmény</p>
                  <p style={{ fontWeight: 700 }}>{selectedTender.issuer}</p>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>Várható Érték</p>
                  <p style={{ fontWeight: 900, color: 'var(--primary-color)' }}>{formatHUF(selectedTender.value)}</p>
               </div>
            </div>

            <div className="settings-group">
               <label>Státusz Módosítása</label>
               <select 
                 value={selectedTender.status} 
                 onChange={(e) => handleUpdateTenderStatus(e.target.value)}
                 style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid var(--border-color)', color: 'white', marginTop: '8px', outline: 'none' }}
               >
                  <option value="Draft" style={{ background: '#1a1a1a' }}>Piszkozat</option>
                  <option value="In Progress" style={{ background: '#1a1a1a' }}>Folyamatban</option>
                  <option value="Review" style={{ background: '#1a1a1a' }}>Leadva / Ellenőrzés alatt</option>
               </select>
            </div>

            <div className="settings-group">
               <label>Megfelelőségi Ellenőrzőlista</label>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  {selectedTender.tasks.map((task, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                       <FileCheck size={16} color="#2ecc71" />
                       <span style={{ fontSize: '0.9rem' }}>{task}</span>
                       <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#2ecc71', fontWeight: 800 }}>KÉSZ</span>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
               <div className="glass" style={{ padding: '15px', borderRadius: '12px' }}>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>Beadási Határidő</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e74c3c', marginTop: '5px' }}>
                     <Clock size={16} />
                     <span style={{ fontWeight: 700 }}>{selectedTender.deadline}</span>
                  </div>
               </div>
               <div className="glass" style={{ padding: '15px', borderRadius: '12px' }}>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>Aktuális Státusz</p>
                  <div style={{ fontWeight: 700, color: 'var(--primary-color)', marginTop: '5px' }}>
                     {selectedTender.status === 'Review' ? 'Leadva / Ellenőrzés alatt' : 'Kidolgozás folyamatban'}
                  </div>
               </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CRM;

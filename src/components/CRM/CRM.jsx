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
  Users
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './CRM.css';

const CRM = ({ addToast }) => {
  const [viewType, setViewType] = useState('kanban'); // 'kanban' or 'list'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  const partners = [
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
    { id: 5, name: 'Knorr-Bremse Vasúti Kft.', email: 'info.budapest@knorr-bremse.com', phone: '+36 1 289 4000', city: 'Budapest', tags: ['Beszállító'], status: 'Aktív', manager: 'Kovács János', interactions: [], opportunities: [] },
    { id: 6, name: 'Dunakeszi Járműjavító Kft.', email: 'iroda@djj.hu', phone: '+36 27 542 100', city: 'Dunakeszi', tags: ['Partner'], status: 'Aktív', manager: 'Szabó Anna', interactions: [], opportunities: [] },
  ];

  return (
    <div className="crm-module">
      <div className="crm-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Partnerkapcsolatok (CRM)</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Ügyfelek, beszállítók és lehetőségek kezelése</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="view-controls" style={{ background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button className={`view-btn ${viewType === 'kanban' ? 'active' : ''}`} onClick={() => setViewType('kanban')} style={{ padding: '6px 12px', borderRadius: '8px' }}>
              <LayoutGrid size={16} />
            </button>
            <button className={`view-btn ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')} style={{ padding: '6px 12px', borderRadius: '8px' }}>
              <List size={16} />
            </button>
          </div>
          <button className="create-btn" onClick={() => addToast('Új partner felvétele', 'info')}>
            <Plus size={20} /> Új Partner
          </button>
        </div>
      </div>

      {viewType === 'kanban' ? (
        <div className="kanban-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {partners.map(partner => (
            <div key={partner.id} className="kanban-card glass" onClick={() => openPartnerDetails(partner)} style={{ padding: '20px', borderRadius: '15px', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="kanban-avatar" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {partner.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{partner.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>{partner.city}</p>
                </div>
                <Star size={16} color="#f1c40f" style={{ cursor: 'pointer' }} />
              </div>
              
              <div className="tag-list" style={{ marginBottom: '15px' }}>
                {partner.tags.map(tag => (
                  <span key={tag} className="tag" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginRight: '5px' }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <div className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={12} /> {partner.manager}
                </div>
                <div className="status-pill active" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Aktív</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Partner Neve</th>
                <th>E-mail</th>
                <th>Város</th>
                <th>Manager</th>
                <th>Státusz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {partners.map(partner => (
                <tr key={partner.id} onClick={() => openPartnerDetails(partner)} style={{ cursor: 'pointer' }}>
                  <td><strong style={{ color: 'var(--primary-color)' }}>{partner.name}</strong></td>
                  <td>{partner.email}</td>
                  <td>{partner.city}</td>
                  <td>{partner.manager}</td>
                  <td><span className="status-badge active">{partner.status}</span></td>
                  <td><button className="view-btn-small"><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Áttekintés</div>
              <div className={`settings-nav-item ${activeTab === 'interactions' ? 'active' : ''}`} onClick={() => setActiveTab('interactions')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Interakciók</div>
              <div className={`settings-nav-item ${activeTab === 'deals' ? 'active' : ''}`} onClick={() => setActiveTab('deals')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Lehetőségek</div>
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
                  <button className="view-btn" style={{ width: '100%' }} onClick={() => addToast('Új bejegyzés rögzítése', 'info')}>
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
                        <button className="view-btn-small">Pipeline Megnyitása <ExternalLink size={14} /></button>
                      </div>
                    </div>
                  ))}
                  <button className="create-btn" style={{ width: '100%' }}>
                    <Plus size={16} /> Új Értékesítési Lehetőség
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CRM;

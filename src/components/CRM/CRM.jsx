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
  Globe
} from 'lucide-react';
import Modal from '../UI/Modal';
import './CRM.css';

const CRM = ({ addToast }) => {
  const [viewType, setViewType] = useState('kanban'); // 'kanban' or 'list'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPartnerDetails = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    addToast('Szerkesztés mód', 'info', 'A partner adatai szerkeszthetővé váltak.');
  };

  const handleCreate = () => {
    addToast('Új partner', 'success', 'Partner létrehozása folyamatban...');
  };

  const partners = [
    { id: 1, name: 'MÁV-START Zrt.', email: 'beszerzes@mav-start.hu', phone: '+36 1 511 1111', city: 'Budapest', tags: ['Vevő', 'Kiemelt'], status: 'Aktív' },
    { id: 2, name: 'GYSEV Zrt.', email: 'info@gysev.hu', phone: '+36 99 517 111', city: 'Sopron', tags: ['Vevő'], status: 'Aktív' },
    { id: 3, name: 'Rail Cargo Hungaria Zrt.', email: 'office@railcargo.hu', phone: '+36 1 512 7000', city: 'Budapest', tags: ['Vevő', 'Logisztika'], status: 'Aktív' },
    { id: 4, name: 'Stadler Trains Kft.', email: 'hungary@stadlerrail.com', phone: '+36 1 327 4060', city: 'Dunakeszi', tags: ['Partner', 'Gyártó'], status: 'Aktív' },
    { id: 5, name: 'Knorr-Bremse Vasúti Kft.', email: 'info.budapest@knorr-bremse.com', phone: '+36 1 289 4000', city: 'Budapest', tags: ['Beszállító'], status: 'Aktív' },
    { id: 6, name: 'Dunakeszi Járműjavító Kft.', email: 'iroda@djj.hu', phone: '+36 27 542 100', city: 'Dunakeszi', tags: ['Partner'], status: 'Aktív' },
  ];

  return (
    <div className="crm-module">
      <div className="crm-header">
        <div className="view-controls">
          <button 
            className={`view-btn ${viewType === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewType('kanban')}
          >
            <LayoutGrid size={18} />
            Kanban
          </button>
          <button 
            className={`view-btn ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => setViewType('list')}
          >
            <List size={18} />
            Lista
          </button>
        </div>

        <button className="create-btn" onClick={handleCreate}>
          <Plus size={20} />
          Új Partner
        </button>
      </div>

      {viewType === 'kanban' ? (
        <div className="kanban-grid">
          {partners.map(partner => (
            <div key={partner.id} className="kanban-card glass" onClick={() => openPartnerDetails(partner)}>
              <div className="kanban-avatar">
                {partner.name.charAt(0)}
              </div>
              <div className="kanban-info">
                <h4>{partner.name}</h4>
                <p><Mail size={14} inline /> {partner.email}</p>
                <p><MapPin size={14} inline /> {partner.city}</p>
                <div className="tag-list">
                  {partner.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <button className="more-btn" style={{ marginLeft: 'auto', alignSelf: 'flex-start' }} onClick={(e) => e.stopPropagation()}>
                <MoreVertical size={18} className="text-muted" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          <table className="data-table">
            <thead>
              <tr>
                <th>Név</th>
                <th>E-mail</th>
                <th>Telefon</th>
                <th>Város</th>
                <th>Státusz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {partners.map(partner => (
                <tr key={partner.id} onClick={() => openPartnerDetails(partner)} style={{ cursor: 'pointer' }}>
                  <td><strong>{partner.name}</strong></td>
                  <td>{partner.email}</td>
                  <td>{partner.phone}</td>
                  <td>{partner.city}</td>
                  <td>
                    <span className={`status-badge ${partner.status.toLowerCase()}`}>
                      {partner.status}
                    </span>
                  </td>
                  <td>
                    <button className="text-muted" onClick={(e) => e.stopPropagation()}><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Partner Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Partner részletes adatai"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn" onClick={handleEdit}>Szerkesztés</button>
          </>
        }
      >
        {selectedPartner && (
          <div className="partner-details">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', borderRadius: 0 }}>
              <div className="settings-nav-item active" style={{ flex: 1, justifyContent: 'center' }}>Áttekintés</div>
              <div className="settings-nav-item" style={{ flex: 1, justifyContent: 'center' }}>Napló (Audit)</div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
              <div className="kanban-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                {selectedPartner.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{selectedPartner.name}</h2>
                <div className="tag-list">
                  {selectedPartner.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Mail size={16} /> E-mail cím
                </label>
                <p style={{ fontWeight: 500 }}>{selectedPartner.email}</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Phone size={16} /> Telefonszám
                </label>
                <p style={{ fontWeight: 500 }}>{selectedPartner.phone}</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <MapPin size={16} /> Székhely
                </label>
                <p style={{ fontWeight: 500 }}>{selectedPartner.city}, Magyarország</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Building size={16} /> Cégtípus
                </label>
                <p style={{ fontWeight: 500 }}>Zártkörűen Működő Részvénytársaság</p>
              </div>
            </div>

            {/* Audit Log (SAP-style) */}
            <div style={{ marginTop: '25px', padding: '15px', borderTop: '1px dashed var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> Rendszeresemények (Audit Log)
              </h4>
              <div className="activity-list" style={{ fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span className="text-muted">2024-04-18 14:22</span>
                  <span><strong>Kovács János</strong> módosította az e-mail címet.</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span className="text-muted">2024-04-15 09:10</span>
                  <span><strong>Szabó Anna</strong> státuszt váltott: <span className="status-badge aktív">Aktív</span></span>
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

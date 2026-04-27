import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  MoreVertical,
  CheckCircle,
  Clock,
  Send,
  LayoutGrid,
  List,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';
import auditLogService from '../../services/AuditLogService';
import Modal from '../UI/Modal';
import './Sales.css';

const Sales = ({ addToast }) => {
  const [viewType, setViewType] = useState('pipeline');
  const [isAddingOpp, setIsAddingOpp] = useState(false);
  const [newOppData, setNewOppData] = useState({
    title: '',
    customer: '',
    value: '',
    stage: 'Felkutatás',
    priority: 'Medium'
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [opportunities, setOpportunities] = useState([
    { id: 'OPP-101', title: 'MÁV Ablak Csere', customer: 'MÁV-START', value: 12500000, probability: 70, stage: 'Minősítés', priority: 'High' },
    { id: 'OPP-102', title: 'GYSEV Ajtó modernizáció', customer: 'GYSEV', value: 8400000, probability: 40, stage: 'Tárgyalás', priority: 'Medium' },
    { id: 'OPP-103', title: 'Stadler Poggyásztartók', customer: 'Stadler Rail', value: 24500000, probability: 90, stage: 'Lezárás', priority: 'High' },
    { id: 'OPP-104', title: 'ÖBB Belső válaszfalak', customer: 'ÖBB', value: 15600000, probability: 20, stage: 'Felkutatás', priority: 'Low' },
  ]);

  const stages = ['Felkutatás', 'Minősítés', 'Tárgyalás', 'Lezárás'];

  const handleDeleteOpportunity = (id) => {
    const opp = opportunities.find(o => o.id === id);
    setOpportunities(prev => prev.filter(o => o.id !== id));
    setActiveDropdown(null);
    addToast('Lehetőség törölve', 'info');

    auditLogService.log({
      user: 'Sales Manager',
      action: 'Lehetőség törölve',
      module: 'Sales',
      details: `${id} - ${opp?.title}`,
      severity: 'warning'
    });
  };

  const handleUpdateOpportunity = (updatedOpp) => {
    setOpportunities(prev => prev.map(o => o.id === updatedOpp.id ? updatedOpp : o));
    setSelectedOpp(null);
    setIsEditing(false);
    addToast('Lehetőség sikeresen frissítve', 'success');

    auditLogService.log({
      user: 'Sales Manager',
      action: 'Lehetőség módosítva',
      module: 'Sales',
      details: `${updatedOpp.id} - ${updatedOpp.title}`,
      severity: 'info'
    });
  };

  const handleAddOpportunity = () => {
    if (!newOppData.title || !newOppData.customer || !newOppData.value) {
      addToast('Kérjük töltsön ki minden mezőt!', 'warning');
      return;
    }

    const nextIdNum = opportunities.length > 0 
      ? Math.max(...opportunities.map(o => parseInt(o.id.split('-')[1]))) + 1 
      : 101;
    
    const newOpp = {
      id: `OPP-${nextIdNum}`,
      title: newOppData.title,
      customer: newOppData.customer,
      value: parseInt(newOppData.value),
      stage: newOppData.stage,
      probability: (stages.indexOf(newOppData.stage) + 1) * 25,
      priority: newOppData.priority
    };

    setOpportunities([...opportunities, newOpp]);
    setIsAddingOpp(false);
    setNewOppData({ title: '', customer: '', value: '', stage: 'Felkutatás', priority: 'Medium' });
    addToast('Új értékesítési lehetőség rögzítve', 'success');

    auditLogService.log({
      user: 'Sales Manager',
      action: 'Új lehetőség rögzítve',
      module: 'Sales',
      details: `${newOpp.id} - ${newOpp.title}`,
      severity: 'success'
    });
  };

  const handleNextStage = (id) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === id) {
        const currentIndex = stages.indexOf(opp.stage);
        if (currentIndex < stages.length - 1) {
          const nextStage = stages[currentIndex + 1];
          const nextProb = (currentIndex + 2) * 25; // 25, 50, 75, 100
          
          auditLogService.log({
            user: 'Sales Manager',
            action: 'Lehetőség fázis váltás',
            module: 'Sales',
            details: `${opp.title} -> ${nextStage}`,
            severity: 'info'
          });
          
          addToast('Státusz frissítve', 'success', nextStage);
          return { ...opp, stage: nextStage, probability: nextProb };
        }
      }
      return opp;
    }));
  };

  const formatCurrency = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="sales-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Értékesítés és Pipeline</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Lehetőségek és árajánlatok kezelése</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="view-controls">
            <button className={`view-btn ${viewType === 'pipeline' ? 'active' : ''}`} onClick={() => setViewType('pipeline')}>
              <LayoutGrid size={18} />
            </button>
            <button className={`view-btn ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>
              <List size={18} />
            </button>
          </div>
          <button className="create-btn" onClick={() => setIsAddingOpp(true)}>
            <Plus size={20} />
            Új Lehetőség
          </button>
        </div>
      </div>

      <Modal
        isOpen={isAddingOpp}
        onClose={() => setIsAddingOpp(false)}
        title="Új Értékesítési Lehetőség"
        width="500px"
      >
        <div className="settings-row" style={{ maxWidth: '100%' }}>
          <div className="settings-group">
            <label>Projekt Megnevezése *</label>
            <input 
              type="text" 
              placeholder="pl. GYSEV Kocsifelújítás" 
              value={newOppData.title}
              onChange={(e) => setNewOppData({...newOppData, title: e.target.value})}
            />
          </div>
          <div className="settings-group">
            <label>Ügyfél *</label>
            <input 
              type="text" 
              placeholder="pl. GYSEV Zrt." 
              value={newOppData.customer}
              onChange={(e) => setNewOppData({...newOppData, customer: e.target.value})}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="settings-group">
              <label>Becsült Érték (HUF) *</label>
              <input 
                type="number" 
                placeholder="pl. 5000000" 
                value={newOppData.value}
                onChange={(e) => setNewOppData({...newOppData, value: e.target.value})}
              />
            </div>
            <div className="settings-group">
              <label>Prioritás</label>
              <select 
                value={newOppData.priority}
                onChange={(e) => setNewOppData({...newOppData, priority: e.target.value})}
              >
                <option value="Low">Alacsony</option>
                <option value="Medium">Közepes</option>
                <option value="High">Magas</option>
              </select>
            </div>
          </div>
          <div className="settings-group">
            <label>Értékesítési Fázis</label>
            <select 
              value={newOppData.stage}
              onChange={(e) => setNewOppData({...newOppData, stage: e.target.value})}
            >
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button className="view-btn" style={{ flex: 1 }} onClick={() => setIsAddingOpp(false)}>Mégse</button>
            <button className="create-btn" style={{ flex: 1, background: '#3498db' }} onClick={handleAddOpportunity}>Létrehozás</button>
          </div>
        </div>
      </Modal>

      <div className="pipeline-stats glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px', marginBottom: '25px', borderRadius: '15px' }}>
        <div className="stat-item">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Összesített Érték</p>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{formatCurrency(61000000)}</h4>
        </div>
        <div className="stat-item">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Súlyozott Várható Bevétel</p>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{formatCurrency(36500000)}</h4>
        </div>
        <div className="stat-item">
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>Aktív Lehetőségek</p>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{opportunities.length} db</h4>
        </div>
      </div>

      {viewType === 'pipeline' ? (
        <div className="pipeline-kanban" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', alignItems: 'flex-start' }}>
          {stages.map(stage => (
            <div key={stage} className="pipeline-column">
              <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '2px solid var(--border-color)', marginBottom: '15px' }}>
                <h5 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stage}</h5>
                <span className="count" style={{ background: 'var(--border-color)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                  {opportunities.filter(o => o.stage === stage).length}
                </span>
              </div>
              <div className="column-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {opportunities.filter(o => o.stage === stage).map(opp => (
                  <div key={opp.id} className="opportunity-card glass" style={{ padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 600 }}>{opp.id}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{opp.probability}% esély</span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '5px' }}>{opp.title}</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '12px' }}>{opp.customer}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatCurrency(opp.value)}</span>
                      <button 
                        className="view-btn-small" 
                        onClick={() => handleNextStage(opp.id)}
                        disabled={opp.stage === 'Lezárás'}
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  className="add-btn-dash" 
                  style={{ border: '1px dashed var(--border-color)', background: 'transparent', padding: '10px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', width: '100%' }}
                  onClick={() => {
                    setNewOppData({...newOppData, stage: stage});
                    setIsAddingOpp(true);
                  }}
                >
                  + Új elem
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Megnevezés</th>
                <th>Ügyfél</th>
                <th>Érték</th>
                <th>Fázis</th>
                <th>Esély</th>
                <th>Prioritás</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map(opp => (
                <tr key={opp.id}>
                  <td style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>{opp.id}</td>
                  <td style={{ fontWeight: 600 }}>{opp.title}</td>
                  <td className="text-muted">{opp.customer}</td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(opp.value)}</td>
                  <td>
                    <span className="status-badge active" style={{ fontSize: '0.7rem' }}>{opp.stage}</span>
                  </td>
                  <td>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '4px', width: '60px', background: 'var(--bg-main)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${opp.probability}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{opp.probability}%</span>
                     </div>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      padding: '4px 8px', 
                      borderRadius: '6px',
                      background: opp.priority === 'High' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)',
                      color: opp.priority === 'High' ? '#e74c3c' : '#3498db'
                    }}>
                      {opp.priority === 'High' ? 'Magas' : opp.priority === 'Medium' ? 'Közepes' : 'Alacsony'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button 
                      className="view-btn-small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === opp.id ? null : opp.id);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeDropdown === opp.id && (
                      <div className="dropdown-menu glass show" style={{ right: 0, top: '40px', minWidth: '150px' }}>
                         <button className="dropdown-item" onClick={() => { setSelectedOpp(opp); setIsEditing(false); setActiveDropdown(null); }}>
                           <Search size={14} /> Megtekintés
                         </button>
                         <button className="dropdown-item" onClick={() => { setSelectedOpp(opp); setIsEditing(true); setActiveDropdown(null); }}>
                           <Plus size={14} style={{ transform: 'rotate(45deg)' }} /> Szerkesztés
                         </button>
                         <div style={{ height: '1px', background: 'var(--border-color)', margin: '5px 0' }}></div>
                         <button className="dropdown-item" style={{ color: '#e74c3c' }} onClick={() => handleDeleteOpportunity(opp.id)}>
                           <AlertCircle size={14} /> Törlés
                         </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!selectedOpp}
        onClose={() => { setSelectedOpp(null); setIsEditing(false); }}
        title={isEditing ? `Szerkesztés: ${selectedOpp?.id}` : `Részletek: ${selectedOpp?.id}`}
        width="500px"
      >
        {selectedOpp && (
          <div className="settings-row" style={{ maxWidth: '100%' }}>
            <div className="settings-group">
              <label>Projekt Megnevezése</label>
              <input 
                type="text" 
                value={selectedOpp.title}
                readOnly={!isEditing}
                onChange={(e) => setSelectedOpp({...selectedOpp, title: e.target.value})}
              />
            </div>
            <div className="settings-group">
              <label>Ügyfél</label>
              <input 
                type="text" 
                value={selectedOpp.customer}
                readOnly={!isEditing}
                onChange={(e) => setSelectedOpp({...selectedOpp, customer: e.target.value})}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="settings-group">
                <label>Becsült Érték (HUF)</label>
                <input 
                  type="number" 
                  value={selectedOpp.value}
                  readOnly={!isEditing}
                  onChange={(e) => setSelectedOpp({...selectedOpp, value: parseInt(e.target.value)})}
                />
              </div>
              <div className="settings-group">
                <label>Prioritás</label>
                {isEditing ? (
                  <select 
                    value={selectedOpp.priority}
                    onChange={(e) => setSelectedOpp({...selectedOpp, priority: e.target.value})}
                  >
                    <option value="Low">Alacsony</option>
                    <option value="Medium">Közepes</option>
                    <option value="High">Magas</option>
                  </select>
                ) : (
                  <input type="text" value={selectedOpp.priority === 'High' ? 'Magas' : selectedOpp.priority === 'Medium' ? 'Közepes' : 'Alacsony'} readOnly />
                )}
              </div>
            </div>
            <div className="settings-group">
              <label>Értékesítési Fázis</label>
              {isEditing ? (
                <select 
                  value={selectedOpp.stage}
                  onChange={(e) => {
                    const newStage = e.target.value;
                    const newProb = (stages.indexOf(newStage) + 1) * 25;
                    setSelectedOpp({...selectedOpp, stage: newStage, probability: newProb});
                  }}
                >
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <input type="text" value={selectedOpp.stage} readOnly />
              )}
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button className="view-btn" style={{ flex: 1 }} onClick={() => { setSelectedOpp(null); setIsEditing(false); }}>Bezárás</button>
              {isEditing && (
                <button className="create-btn" style={{ flex: 1, background: '#3498db' }} onClick={() => handleUpdateOpportunity(selectedOpp)}>Mentés</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Sales;

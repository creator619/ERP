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
    stage: 'Prospecting',
    priority: 'Medium'
  });
  const [opportunities, setOpportunities] = useState([
    { id: 'OPP-101', title: 'MÁV Ablak Csere', customer: 'MÁV-START', value: 12500000, probability: 70, stage: 'Qualified', priority: 'High' },
    { id: 'OPP-102', title: 'GYSEV Ajtó modernizáció', customer: 'GYSEV', value: 8400000, probability: 40, stage: 'Negotiation', priority: 'Medium' },
    { id: 'OPP-103', title: 'Stadler Poggyásztartók', customer: 'Stadler Rail', value: 24500000, probability: 90, stage: 'Closing', priority: 'High' },
    { id: 'OPP-104', title: 'ÖBB Belső válaszfalak', customer: 'ÖBB', value: 15600000, probability: 20, stage: 'Prospecting', priority: 'Low' },
  ]);

  const stages = ['Prospecting', 'Qualified', 'Negotiation', 'Closing'];

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
    setNewOppData({ title: '', customer: '', value: '', stage: 'Prospecting', priority: 'Medium' });
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
                      disabled={opp.stage === 'Closing'}
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
    </div>
  );
};

export default Sales;

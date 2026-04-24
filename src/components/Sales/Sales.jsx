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
  AlertCircle
} from 'lucide-react';
import './Sales.css';

const Sales = ({ addToast }) => {
  const [viewType, setViewType] = useState('pipeline'); // 'list' or 'pipeline'

  const opportunities = [
    { id: 'OPP-101', title: 'MÁV Ablak Csere', customer: 'MÁV-START', value: 12500000, probability: 70, stage: 'Qualified' },
    { id: 'OPP-102', title: 'GYSEV Ajtó modernizáció', customer: 'GYSEV', value: 8400000, probability: 40, stage: 'Negotiation' },
    { id: 'OPP-103', title: 'Stadler Poggyásztartók', customer: 'Stadler Rail', value: 24500000, probability: 90, stage: 'Closing' },
    { id: 'OPP-104', title: 'ÖBB Belső válaszfalak', customer: 'ÖBB', value: 15600000, probability: 20, stage: 'Prospecting' },
  ];

  const quotations = [
    { id: 'S0001', customer: 'Kovács és Társa Kft.', date: '2024-04-20', total: '154,200 Ft', status: 'Draft' },
    { id: 'S0002', customer: 'Global Logistics Zrt.', date: '2024-04-21', total: '2,450,000 Ft', status: 'Sent' },
    { id: 'S0003', customer: 'Németh Virág', date: '2024-04-22', total: '18,900 Ft', status: 'Sale Order' },
    { id: 'S0004', customer: 'TechSolutions Kft.', date: '2024-04-23', total: '320,000 Ft', status: 'Draft' },
    { id: 'S0005', customer: 'Szabó Imre E.V.', date: '2024-04-23', total: '45,000 Ft', status: 'Sale Order' },
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'Draft': return 'draft';
      case 'Sent': return 'sent';
      case 'Sale Order': return 'sale';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'Draft': return 'Piszkozat';
      case 'Sent': return 'Elküldve';
      case 'Sale Order': return 'Visszaigazolva';
      default: return status;
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);

  const stages = ['Prospecting', 'Qualified', 'Negotiation', 'Closing'];

  return (
    <div className="sales-module">
      <div className="sales-header">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Értékesítés</h2>
          <div className="view-controls">
            <button className={`view-btn ${viewType === 'pipeline' ? 'active' : ''}`} onClick={() => setViewType('pipeline')}>
              <LayoutGrid size={18} /> Pipeline
            </button>
            <button className={`view-btn ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>
              <List size={18} /> Ajánlatok
            </button>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új lehetőség', 'success')}>
          <Plus size={20} />
          Új Lehetőség
        </button>
      </div>

      {viewType === 'pipeline' ? (
        <div className="sales-pipeline">
          <div className="pipeline-stats glass">
            <div className="stat-item">
              <span className="text-muted">Teljes Pipeline Érték</span>
              <strong>{formatCurrency(61000000)}</strong>
            </div>
            <div className="stat-item">
              <span className="text-muted">Várható Bevétel (Weighted)</span>
              <strong>{formatCurrency(36500000)}</strong>
              <span className="trend-up"><TrendingUp size={14} /> +12%</span>
            </div>
          </div>

          <div className="pipeline-kanban">
            {stages.map(stage => (
              <div key={stage} className="pipeline-column">
                <div className="column-header">
                  <h5>{stage}</h5>
                  <span className="count">{opportunities.filter(o => o.stage === stage).length}</span>
                </div>
                <div className="column-body">
                  {opportunities.filter(o => o.stage === stage).map(opp => (
                    <div key={opp.id} className="opportunity-card glass" onClick={() => addToast('Lehetőség megnyitása', 'info')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span className="opp-id">{opp.id}</span>
                        <span className="prob">{opp.probability}%</span>
                      </div>
                      <h4>{opp.title}</h4>
                      <p className="text-muted">{opp.customer}</p>
                      <div className="opp-footer">
                        <span className="opp-value">{formatCurrency(opp.value)}</span>
                        <div className="prob-bar">
                          <div className="fill" style={{ width: `${opp.probability}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="list-view">
          <table className="data-table">
            <thead>
              <tr>
                <th>Azonosító</th>
                <th>Vevő</th>
                <th>Dátum</th>
                <th>Összeg</th>
                <th>Státusz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quotations.map(quote => (
                <tr key={quote.id}>
                  <td><strong>{quote.id}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} className="text-muted" />
                      {quote.customer}
                    </div>
                  </td>
                  <td>{quote.date}</td>
                  <td className="amount-cell">{quote.total}</td>
                  <td>
                    <span className={`status-pill ${getStatusClass(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td>
                    <button className="text-muted"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Sales;

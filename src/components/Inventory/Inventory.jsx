import React, { useState } from 'react';
import { 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  Package, 
  BarChart2, 
  ArrowRightLeft,
  MoreVertical,
  Layers,
  Tag,
  Info,
  Filter,
  TrendingDown,
  History,
  MapPin,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Truck
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Inventory.css';

const Inventory = ({ addToast }) => {
  const [viewType, setViewType] = useState('kanban');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Poggyásztartó modul (Alumínium)', 
      category: 'Beltér', 
      price: '42,000 Ft', 
      stock: 15, 
      minStock: 10,
      sku: 'RW-INT-001',
      location: 'A-szektor, 04-B polc',
      history: [
        { date: '2024-04-22', type: 'IN', qty: 20, reason: 'Beszerzés #PO-102' },
        { date: '2024-04-23', type: 'OUT', qty: 5, reason: 'Gyártás RW/MO/003' }
      ]
    },
    { 
      id: 2, 
      name: 'Hőszigetelt kocsiablak', 
      category: 'Nyílászáró', 
      price: '158,000 Ft', 
      stock: 42, 
      minStock: 20,
      sku: 'RW-WIN-042',
      location: 'W-szektor, 10-C polc',
      history: [{ date: '2024-04-20', type: 'IN', qty: 50, reason: 'Beszállítás' }]
    },
    { 
      id: 3, 
      name: 'Automata tolóajtó rendszer', 
      category: 'Nyílászáró', 
      price: '450,000 Ft', 
      stock: 5, 
      minStock: 8,
      sku: 'RW-DOR-015',
      location: 'W-szektor, 02-A polc',
      history: [{ date: '2024-04-21', type: 'OUT', qty: 2, reason: 'Javítási munkalap' }]
    },
    { 
      id: 4, 
      name: 'Válaszfal elem (tűzgátló)', 
      category: 'Beltér', 
      price: '85,000 Ft', 
      stock: 0, 
      minStock: 5,
      sku: 'RW-PAR-012',
      location: 'P-szektor, 01-D polc',
      history: [{ date: '2024-04-15', type: 'OUT', qty: 10, reason: 'Készlet kimerült' }]
    },
  ]);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setActiveTab('overview');
  };
  
  const handleAdjustStock = (id, amount, reason = 'Kézi módosítás') => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + amount);
        auditLogService.log({
          user: 'Raktárkezelő',
          action: 'Készletmódosítás',
          module: 'Inventory',
          details: `${p.name} (${p.sku}) készlet változott: ${p.stock} -> ${newStock}. Ok: ${reason}`,
          severity: newStock <= p.minStock ? 'warning' : 'info'
        });
        return { ...p, stock: newStock };
      }
      return p;
    }));
    addToast('Készlet sikeresen frissítve', 'success');
  };

  return (
    <div className="inventory-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', padding: '12px', borderRadius: '12px' }}>
            <Package size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Raktárkészlet & Logisztika</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Valós idejű készletfigyelés és utánrendelés menedzsment</p>
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
          <button className="create-btn" onClick={() => addToast('Új tétel felvétele', 'info')}>
            <Plus size={20} /> Új Termék
          </button>
        </div>
      </div>

      <div className="inventory-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Összes Tétel</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>1,248 db</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Kritikus Szint</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e74c3c' }}>12 tétel</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Havi Forgalom</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>+42%</div>
        </div>
        <div className="stat-card glass">
          <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '5px' }}>Raktár Érték</p>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-color)' }}>145M Ft</div>
        </div>
      </div>

      {viewType === 'kanban' ? (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <div key={product.id} className={`kanban-card glass ${product.stock <= product.minStock ? 'warning-border' : ''}`} onClick={() => openProductDetails(product)} style={{ padding: '20px', borderRadius: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)' }}>{product.sku}</span>
                {product.stock <= product.minStock && (
                  <span className="status-badge danger" style={{ fontSize: '0.65rem' }}>Utánrendelés!</span>
                )}
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>{product.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} className="text-muted" />
                  <span style={{ fontSize: '0.8rem' }}>{product.location.split(',')[0]}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{product.stock} db</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MIN: {product.minStock}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Terméknév</th>
                <th>Helyszín</th>
                <th>Készlet</th>
                <th>Min. Szint</th>
                <th>Státusz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} onClick={() => openProductDetails(product)} style={{ cursor: 'pointer' }}>
                  <td><strong>{product.sku}</strong></td>
                  <td>{product.name}</td>
                  <td>{product.location}</td>
                  <td style={{ fontWeight: 700 }}>{product.stock} db</td>
                  <td className="text-muted">{product.minStock} db</td>
                  <td>
                    <span className={`status-badge ${product.stock > product.minStock ? 'active' : product.stock === 0 ? 'danger' : 'warning'}`}>
                      {product.stock > product.minStock ? 'Optimális' : product.stock === 0 ? 'Kimerült' : 'Kritikus'}
                    </span>
                  </td>
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
        title={`Készlet Adatlap: ${selectedProduct?.name}`}
        width="850px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="view-btn" onClick={() => handleAdjustStock(selectedProduct.id, -1, 'Selejtezés')}>Selejtezés (-1)</button>
            <button className="create-btn" onClick={() => handleAdjustStock(selectedProduct.id, 5, 'Raktári bevételezés')}>Bevételezés (+5)</button>
          </>
        }
      >
        {selectedProduct && (
          <div className="inventory-details-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Áttekintés</div>
              <div className={`settings-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Mozgásnapló</div>
            </div>

            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '15px', textTransform: 'uppercase' }}>Logisztikai adatok</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Pontos hely:</span>
                      <span style={{ fontWeight: 600 }}>{selectedProduct.location}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Kategória:</span>
                      <span style={{ fontWeight: 600 }}>{selectedProduct.category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Érték:</span>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{selectedProduct.price} / db</span>
                    </div>
                  </div>
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>Készlet szint</p>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: selectedProduct.stock <= selectedProduct.minStock ? '#e74c3c' : '#2ecc71' }}>{selectedProduct.stock}</div>
                  <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>Biztonsági készlet: {selectedProduct.minStock} db</p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="history-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedProduct.history.map((h, i) => (
                    <div key={i} className="glass" style={{ padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {h.type === 'IN' ? <ArrowUpRight color="#2ecc71" /> : <ArrowDownRight color="#e74c3c" />}
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.reason}</p>
                          <p className="text-muted" style={{ fontSize: '0.75rem' }}>{h.date}</p>
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, color: h.type === 'IN' ? '#2ecc71' : '#e74c3c' }}>{h.type === 'IN' ? '+' : '-'}{h.qty} db</span>
                    </div>
                  ))}
                  <button className="view-btn" style={{ width: '100%', marginTop: '10px' }}>
                    <History size={16} /> Teljes mozgásnapló megnyitása
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

export default Inventory;

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
  MapPin
} from 'lucide-react';
import Modal from '../UI/Modal';
import auditLogService from '../../services/AuditLogService';
import './Inventory.css';

const Inventory = ({ addToast }) => {
  const [viewType, setViewType] = useState('kanban');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Poggyásztartó modul (Alumínium)', 
      category: 'Beltér', 
      price: '42,000 Ft', 
      stock: 15, 
      sku: 'RW-INT-001',
      location: 'A-04-B',
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
      sku: 'RW-WIN-042',
      location: 'W-10-C',
      history: [
        { date: '2024-04-20', type: 'IN', qty: 50, reason: 'Beszállítás' }
      ]
    },
    { 
      id: 3, 
      name: 'Automata tolóajtó rendszer', 
      category: 'Nyílászáró', 
      price: '450,000 Ft', 
      stock: 5, 
      sku: 'RW-DOR-015',
      location: 'W-02-A',
      history: [
        { date: '2024-04-21', type: 'OUT', qty: 2, reason: 'Javítási munkalap' }
      ]
    },
    { 
      id: 4, 
      name: 'Válaszfal elem (tűzgátló)', 
      category: 'Beltér', 
      price: '85,000 Ft', 
      stock: 0, 
      sku: 'RW-PAR-012',
      location: 'P-01-D',
      history: [
        { date: '2024-04-15', type: 'OUT', qty: 10, reason: 'Készlet kimerült' }
      ]
    },
    { 
      id: 5, 
      name: 'WC kabin ajtó egység', 
      category: 'Nyílászáró', 
      price: '125,000 Ft', 
      stock: 8, 
      sku: 'RW-DOR-008',
      location: 'W-02-B',
      history: []
    },
    { 
      id: 6, 
      name: 'Kalaptartó háló szett', 
      category: 'Beltér', 
      price: '12,500 Ft', 
      stock: 60, 
      sku: 'RW-INT-088',
      location: 'A-05-A',
      history: []
    },
  ]);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const getStockStatus = (count) => {
    if (count === 0) return { label: 'Nincs készleten', class: 'out-of-stock' };
    if (count < 10) return { label: 'Alacsony készlet', class: 'low-stock' };
    return { label: 'Készleten', class: 'in-stock' };
  };

  const handleAdjustStock = (id, amount) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + amount);
        auditLogService.log({
          user: 'Raktárvezető',
          action: 'Készlet módosítva',
          module: 'Inventory',
          details: `${p.name} - Új készlet: ${newStock} db (Változás: ${amount})`,
          severity: newStock < 10 ? 'warning' : 'info'
        });
        return { ...p, stock: newStock };
      }
      return p;
    }));
    addToast('Készlet frissítve', 'success');
  };

  return (
    <div className="inventory-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', padding: '12px', borderRadius: '12px' }}>
            <Package size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Raktárkészlet</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Alkatrészek és késztermékek kezelése</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={`view-btn ${viewType === 'kanban' ? 'active' : ''}`} onClick={() => setViewType('kanban')}>
            <LayoutGrid size={18} />
          </button>
          <button className={`view-btn ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>
            <List size={18} />
          </button>
          <button className="create-btn" onClick={() => addToast('Új termék', 'success')}>
            <Plus size={20} />
            Hozzáadás
          </button>
        </div>
      </div>

      <div className="inventory-actions" style={{ marginBottom: '25px' }}>
        <div className="search-bar glass" style={{ maxWidth: '400px' }}>
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Keresés SKU vagy név alapján..." />
        </div>
      </div>

      {viewType === 'kanban' ? (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className={`product-card glass ${product.stock < 10 ? 'low-stock-border' : ''}`} onClick={() => openProductDetails(product)}>
              <div className="product-image">
                <Package size={48} strokeWidth={1} />
                <div className="product-price-tag">{product.price}</div>
              </div>
              <div className="product-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4>{product.name}</h4>
                  {product.stock < 10 && <AlertTriangle size={16} color="#ffc107" />}
                </div>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>SKU: {product.sku} | Loc: {product.location}</p>
                <div className="product-meta" style={{ marginTop: '10px' }}>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{product.category}</span>
                  <span className={`stock-badge ${getStockStatus(product.stock).class}`}>
                    {product.stock} db
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Terméknév</th>
                <th>Kategória</th>
                <th>Raktárhely</th>
                <th>Készlet</th>
                <th>Státusz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} onClick={() => openProductDetails(product)} style={{ cursor: 'pointer' }}>
                  <td><strong>{product.sku}</strong></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td><MapPin size={14} inline /> {product.location}</td>
                  <td style={{ fontWeight: 600 }}>{product.stock} db</td>
                  <td>
                    <span className={`stock-badge ${getStockStatus(product.stock).class}`}>
                      {getStockStatus(product.stock).label}
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Termék Adatlap: ${selectedProduct?.sku}`}
        width="800px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="view-btn" onClick={() => handleAdjustStock(selectedProduct.id, -1)}>Kiadás (-1)</button>
            <button className="create-btn" onClick={() => handleAdjustStock(selectedProduct.id, 10)}>Bevételezés (+10)</button>
          </>
        }
      >
        {selectedProduct && (
          <div className="product-details">
            <div style={{ display: 'flex', gap: '25px', marginBottom: '30px', padding: '20px', background: 'var(--bg-main)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
              <div className="glass" style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                <Package size={48} strokeWidth={1} color="var(--primary-color)" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{selectedProduct.name}</h3>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span className="text-muted">{selectedProduct.category}</span>
                  <span className={`stock-badge ${getStockStatus(selectedProduct.stock).class}`} style={{ fontSize: '0.9rem' }}>
                    {selectedProduct.stock} db készleten
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Egységár</p>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{selectedProduct.price}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px' }}>
              <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={18} color="var(--primary-color)" /> Készletmozgás Előzmények
                </h4>
                <div className="movement-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedProduct.history.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.type === 'IN' ? '#28a745' : '#dc3545' }}></div>
                        <div>
                          <p style={{ fontWeight: 600 }}>{item.reason}</p>
                          <p className="text-muted" style={{ fontSize: '0.75rem' }}>{item.date}</p>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: item.type === 'IN' ? '#28a745' : '#dc3545' }}>
                        {item.type === 'IN' ? '+' : '-'}{item.qty}
                      </span>
                    </div>
                  ))}
                  {selectedProduct.history.length === 0 && <p className="text-muted">Nincsenek korábbi mozgások.</p>}
                </div>
              </div>

              <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--primary-color)" /> Tárolási Információk
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>Raktár / Szekció</p>
                    <p style={{ fontWeight: 600 }}>Központi Raktár - {selectedProduct.location}</p>
                  </div>
                  <div>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>Veszélyességi szint</p>
                    <p style={{ fontWeight: 600 }}>Alacsony (L0)</p>
                  </div>
                  <div style={{ marginTop: '10px', padding: '15px', background: 'rgba(52, 152, 219, 0.05)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Utolsó leltározás: <strong>2024.04.01</strong></p>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Eltérés: <strong>0%</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;

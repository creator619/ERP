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
  Filter
} from 'lucide-react';
import Modal from '../UI/Modal';
import './Inventory.css';

const Inventory = ({ addToast }) => {
  const [viewType, setViewType] = useState('kanban');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const products = [
    { id: 1, name: 'Poggyásztartó modul (Alumínium)', category: 'Beltér', price: '42,000 Ft', stock: 15, sku: 'RW-INT-001' },
    { id: 2, name: 'Hőszigetelt kocsiablak (biztonsági)', category: 'Nyílászáró', price: '158,000 Ft', stock: 42, sku: 'RW-WIN-042' },
    { id: 3, name: 'Automata tolóajtó rendszer', category: 'Nyílászáró', price: '450,000 Ft', stock: 5, sku: 'RW-DOR-015' },
    { id: 4, name: 'Válaszfal elem (tűzgátló)', category: 'Beltér', price: '85,000 Ft', stock: 0, sku: 'RW-PAR-012' },
    { id: 5, name: 'WC kabin ajtó egység', category: 'Nyílászáró', price: '125,000 Ft', stock: 8, sku: 'RW-DOR-008' },
    { id: 6, name: 'Kalaptartó háló szett', category: 'Beltér', price: '12,500 Ft', stock: 60, sku: 'RW-INT-088' },
  ];

  const getStockStatus = (count) => {
    if (count === 0) return { label: 'Nincs készleten', class: 'out-of-stock' };
    if (count < 10) return { label: 'Alacsony készlet', class: 'low-stock' };
    return { label: 'Készleten', class: 'in-stock' };
  };

  return (
    <div className="inventory-module">
      <div className="inventory-header">
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

        <div className="inventory-actions" style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
            <div className="search-bar glass" style={{ width: '300px' }}>
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Keresés termékek között..." />
            </div>
            <button className="view-btn">
              <Filter size={18} />
              Szűrés
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="view-btn">
              <Layers size={18} />
              Raktárak
            </button>
            <button className="create-btn" onClick={() => addToast('Új termék', 'success')}>
              <Plus size={20} />
              Termék hozzáadása
            </button>
          </div>
        </div>
      </div>

      {viewType === 'kanban' ? (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card glass" onClick={() => openProductDetails(product)}>
              <div className="product-image">
                <Package size={48} strokeWidth={1} />
                <div className="product-price-tag">{product.price}</div>
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>SKU: {product.sku}</p>
                <div className="product-meta">
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
                <th>Kép</th>
                <th>Terméknév</th>
                <th>Kategória</th>
                <th>Ár</th>
                <th>Készlet</th>
                <th>SKU</th>
                <th>Státusz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} onClick={() => openProductDetails(product)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="product-list-img">
                      <Package size={20} />
                    </div>
                  </td>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stock} db</td>
                  <td>{product.sku}</td>
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

      {/* Product Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Termék részletes adatai"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="create-btn">Készlet módosítása</button>
          </>
        }
      >
        {selectedProduct && (
          <div className="product-details">
            <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
              <div className="product-image" style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-lg)' }}>
                <Package size={64} strokeWidth={1} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{selectedProduct.name}</h2>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <span className="tag">{selectedProduct.category}</span>
                  <span className={`stock-badge ${getStockStatus(selectedProduct.stock).class}`}>
                    {getStockStatus(selectedProduct.stock).label} ({selectedProduct.stock} db)
                  </span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                  {selectedProduct.price}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Tag size={16} /> SKU Azonosító
                </label>
                <p style={{ fontWeight: 500 }}>{selectedProduct.sku}</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Layers size={16} /> Raktárhely
                </label>
                <p style={{ fontWeight: 500 }}>A-04-B Szekció</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <BarChart2 size={16} /> Havi igény
                </label>
                <p style={{ fontWeight: 500 }}>~45 egység</p>
              </div>
              <div className="info-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Info size={16} /> Minőségi osztály
                </label>
                <p style={{ fontWeight: 500 }}>Kiemelt (Q1)</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;

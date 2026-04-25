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
  Truck,
  TrendingUp,
  Zap,
  Box,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import Modal from '../UI/Modal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import auditLogService from '../../services/AuditLogService';
import './Inventory.css';

const Inventory = ({ addToast }) => {
  const { products, setProducts } = useData();
  const [viewType, setViewType] = useState('kanban');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', stock: 0, minStock: 0, sku: '', abc: 'C', location: ''
  });

  const StockSparkline = ({ data, color = 'var(--primary-color)' }) => {
    const width = 100;
    const height = 30;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d / Math.max(...data, 10)) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="sparkline">
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

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

  const handleDeleteProduct = (id) => {
    const p = products.find(prod => prod.id === id);
    setProducts(prev => prev.filter(prod => prod.id !== id));
    setIsModalOpen(false);
    
    auditLogService.log({
      user: 'Raktárkezelő',
      action: 'Termék törlése',
      module: 'Inventory',
      details: `${p.name} (${p.sku}) véglegesen törölve a rendszerből.`,
      severity: 'danger'
    });
    addToast('Termék sikeresen törölve', 'success');
  };

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.sku) {
      addToast('A Terméknév és az SKU megadása kötelező!', 'warning');
      return;
    }
    
    const productToAdd = {
      ...newProduct,
      id: Date.now(),
      price: newProduct.price.includes('Ft') ? newProduct.price : `${newProduct.price} Ft`,
      stock: parseInt(newProduct.stock) || 0,
      minStock: parseInt(newProduct.minStock) || 0,
      trend: [0, 0, 0, 0, 0, parseInt(newProduct.stock) || 0, parseInt(newProduct.stock) || 0],
      batches: [{ id: `B-${Math.floor(1000 + Math.random() * 9000)}`, qty: parseInt(newProduct.stock) || 0, expiry: 'N/A', status: 'Passed' }],
      history: [{ date: new Date().toISOString().split('T')[0], type: 'IN', qty: parseInt(newProduct.stock) || 0, reason: 'Kezdeti készlet felvitele' }]
    };

    setProducts(prev => [...prev, productToAdd]);
    setIsCreateModalOpen(false);
    setNewProduct({ name: '', category: '', price: '', stock: 0, minStock: 0, sku: '', abc: 'C', location: '' });
    
    auditLogService.log({
      user: 'Raktárkezelő',
      action: 'Új Termék Létrehozva',
      module: 'Inventory',
      details: `${productToAdd.name} (${productToAdd.sku}) rögzítve ${productToAdd.stock} db kezdőkészlettel.`,
      severity: 'success'
    });
    addToast('Új termék sikeresen felvéve', 'success');
  };

  // Dinamikus statisztikák
  const totalValueNum = products.reduce((sum, p) => {
     const priceNum = parseInt(p.price.replace(/,/g, '').replace(' Ft', '')) || 0;
     return sum + (priceNum * p.stock);
  }, 0);
  const totalValueStr = totalValueNum > 1000000 
     ? (totalValueNum / 1000000).toFixed(1) + ' M Ft' 
     : totalValueNum.toLocaleString('hu-HU') + ' Ft';

  return (
    <div className="inventory-module">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(241, 196, 15, 0.1)', color: '#f1c40f', padding: '12px', borderRadius: '12px' }}>
            <Package size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Készletkezelés & Intelligens Raktár</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>AI Készlet-optimalizálás és ABC/XYZ analitika</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="view-controls glass" style={{ padding: '4px', borderRadius: '10px' }}>
            <button className={`view-btn ${viewType === 'kanban' || viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('kanban')}>Dashboard</button>
            <button className={`view-btn ${viewType === 'scan' ? 'active' : ''}`} onClick={() => setViewType('scan')}>QR Szkenner</button>
            <button className={`view-btn ${viewType === 'map' ? 'active' : ''}`} onClick={() => setViewType('map')}>Raktártérkép</button>
          </div>
          <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} /> Új Termék
          </button>
        </div>
      </div>

      {(viewType === 'kanban' || viewType === 'list') && (
        <div className="inventory-stats responsive-grid" style={{ marginBottom: '25px' }}>
           <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '5px' }}>KÉSZLET ÉRTÉK</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{totalValueStr}</div>
           </div>
           <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '5px' }}>KRITIKUS TÉTELEK</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#e74c3c' }}>{products.filter(p => p.stock <= p.minStock).length} db</div>
           </div>
           <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '5px' }}>FORGÁSI SEBESSÉG</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#2ecc71' }}>8.2x / év</div>
           </div>
           <div className="stat-card glass">
              <p className="text-muted" style={{ fontSize: '0.7rem', marginBottom: '5px' }}>ABC 'A' TÉTELEK</p>
              <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{products.filter(p => p.abc === 'A').length} db</div>
           </div>
        </div>
      )}

      {viewType === 'scan' && (
        <div className="glass" style={{ padding: '60px', borderRadius: '30px', textAlign: 'center' }}>
           <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '15px' }}>Intelligens QR Beolvasó</h3>
           <div className="qr-scanner-mock">
              <div className="scan-line"></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }}>
                 <Box size={140} />
              </div>
           </div>
           <button className="create-btn" style={{ marginTop: '30px' }} onClick={() => {
              addToast('RW-WIN-042 beolvasva', 'success');
              openProductDetails(products[1]);
           }}>Minta Beolvasás (RW-WIN-042)</button>
        </div>
      )}

      {viewType === 'map' && (
        <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Raktár Alaprajz (Hőtérkép)</h3>
              <div className="status-badge active">TELÍRETTÉG: 72%</div>
           </div>
           <div className="warehouse-map">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={`map-zone ${i === 3 || i === 8 ? 'active' : i === 12 || i === 18 ? 'warning' : ''}`}>
                   ZÓNA {String.fromCharCode(65 + (i % 5))}{Math.floor(i / 5) + 1}
                </div>
              ))}
           </div>
        </div>
      )}

      {(viewType === 'kanban' || viewType === 'list') && (
        viewType === 'kanban' ? (
          <div className="product-grid responsive-grid">
            {products.map(product => (
              <div key={product.id} className={`kanban-card glass ${product.stock <= product.minStock ? 'warning-border' : ''}`} onClick={() => openProductDetails(product)} style={{ padding: '25px', borderRadius: '20px', cursor: 'pointer', position: 'relative' }}>
                <div className={`abc-badge ${product.abc.toLowerCase()}`}>{product.abc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)' }}>{product.sku}</span>
                  <StockSparkline data={product.trend} color={product.stock <= product.minStock ? '#e74c3c' : '#2ecc71'} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>{product.name}</h4>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '15px' }}>{product.category}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} className="text-muted" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{product.location.split(',')[0]}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: product.stock <= product.minStock ? '#e74c3c' : 'inherit' }}>{product.stock} db</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>MIN: {product.minStock}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-container-responsive glass">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ABC</th>
                  <th>SKU</th>
                  <th>Terméknév</th>
                  <th>Trend</th>
                  <th>Helyszín</th>
                  <th>Készlet</th>
                  <th>Státusz</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} onClick={() => openProductDetails(product)} style={{ cursor: 'pointer' }}>
                    <td><div className={`abc-badge-small ${product.abc.toLowerCase()}`}>{product.abc}</div></td>
                    <td><strong>{product.sku}</strong></td>
                    <td>{product.name}</td>
                    <td><StockSparkline data={product.trend} color={product.stock <= product.minStock ? '#e74c3c' : '#2ecc71'} /></td>
                    <td style={{ fontSize: '0.8rem' }}>{product.location}</td>
                    <td style={{ fontWeight: 900 }}>{product.stock} db</td>
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
        )
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Termék Adatlap: ${selectedProduct?.name}`}
        width="950px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsModalOpen(false)}>Bezárás</button>
            <button className="view-btn" style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c' }} onClick={() => handleDeleteProduct(selectedProduct.id)}>Törlés</button>
            <button className="view-btn" onClick={() => handleAdjustStock(selectedProduct.id, -1, 'Selejtezés')}>Leltárhiány (-1)</button>
            <button className="create-btn" onClick={() => handleAdjustStock(selectedProduct.id, 10, 'Gyártási beérkezés')}>Bevételezés (+10)</button>
          </>
        }
      >
        {selectedProduct && (
          <div className="inventory-details-view">
            <div className="settings-nav" style={{ width: '100%', flexDirection: 'row', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: 0 }}>
              <div className={`settings-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Áttekintés</div>
              <div className={`settings-nav-item ${activeTab === 'traceability' ? 'active' : ''}`} onClick={() => setActiveTab('traceability')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Traceability</div>
              <div className={`settings-nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')} style={{ flex: 1, justifyContent: 'center', borderRadius: 0 }}>Mozgásnapló</div>
            </div>

            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <div className="glass" style={{ padding: '25px', borderRadius: '20px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>Készlet Stratégia</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                         <div className="stat-card glass" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>ABC Besorolás</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{selectedProduct.abc} kategória</div>
                         </div>
                         <div className="stat-card glass" style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <p className="text-muted" style={{ fontSize: '0.7rem' }}>Átlagos Fogyás</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>2.4 db / nap</div>
                         </div>
                      </div>
                   </div>
                   <div className="glass" style={{ padding: '25px', borderRadius: '20px', borderLeft: '4px solid #f1c40f' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                         <Zap size={20} color="#f1c40f" />
                         <h4 style={{ fontWeight: 800 }}>Smart Reorder Asszisztens</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                         A jelenlegi gyártási terv és a beszállítói lead-time (8 nap) alapján az optimális utánrendelési mennyiség 
                         <strong> {selectedProduct.minStock * 3} db</strong>. Javasolt rendelési dátum: Holnap.
                      </p>
                   </div>
                </div>
                <div className="glass" style={{ padding: '25px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                   <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '15px' }}>AKTUÁLIS KÉSZLET</p>
                   <div style={{ fontSize: '4rem', fontWeight: 900, color: selectedProduct.stock <= selectedProduct.minStock ? '#e74c3c' : '#2ecc71', lineHeight: 1 }}>{selectedProduct.stock}</div>
                   <p style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '5px' }}>darab</p>
                   <div style={{ marginTop: '20px', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                      Biztonsági szint: {selectedProduct.minStock} db
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'traceability' && (
               <div className="traceability-tab">
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '20px' }}>Aktív Sarzsok (Batches)</h4>
                  <div className="batch-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                     {selectedProduct.batches.map((b, i) => (
                        <div key={i} className="glass" style={{ padding: '15px', borderRadius: '15px', borderLeft: '4px solid #3498db' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{b.id}</span>
                              <span className="status-badge active" style={{ fontSize: '0.6rem' }}>{b.status}</span>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <span>Mennyiség: {b.qty} db</span>
                              <span>Lejárat: {b.expiry}</span>
                           </div>
                        </div>
                     ))}
                     {selectedProduct.batches.length === 0 && (
                        <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                           <AlertTriangle size={48} style={{ marginBottom: '10px' }} />
                           <p>Nincs aktív sarzs ehhez a tételhez.</p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'history' && (
              <div className="history-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedProduct.history.map((h, i) => (
                    <div key={i} className="glass" style={{ padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: h.type === 'IN' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           {h.type === 'IN' ? <ArrowUpRight size={18} color="#2ecc71" /> : <ArrowDownRight size={18} color="#e74c3c" />}
                        </div>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{h.reason}</p>
                          <p className="text-muted" style={{ fontSize: '0.75rem' }}>{h.date}</p>
                        </div>
                      </div>
                      <span style={{ fontWeight: 900, fontSize: '1.1rem', color: h.type === 'IN' ? '#2ecc71' : '#e74c3c' }}>{h.type === 'IN' ? '+' : '-'}{h.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Új Termék Felvétele"
        width="600px"
        footer={
          <>
            <button className="view-btn" onClick={() => setIsCreateModalOpen(false)}>Mégse</button>
            <button className="create-btn" onClick={handleCreateProduct}>Mentés és Felvétel</button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="settings-group">
            <label>SKU (Cikkszám) *</label>
            <input type="text" className="glass-input" value={newProduct.sku} onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})} placeholder="pl. RW-INT-001" />
          </div>
          <div className="settings-group">
            <label>Terméknév *</label>
            <input type="text" className="glass-input" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="pl. Hőszigetelt Ablak" />
          </div>
          <div className="settings-group">
            <label>Kategória</label>
            <input type="text" className="glass-input" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} placeholder="pl. Beltér" />
          </div>
          <div className="settings-group">
            <label>Egységár</label>
            <input type="text" className="glass-input" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="pl. 45000 Ft" />
          </div>
          <div className="settings-group">
            <label>Induló készlet</label>
            <input type="number" className="glass-input" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
          </div>
          <div className="settings-group">
            <label>Minimum (Biztonsági) készlet</label>
            <input type="number" className="glass-input" value={newProduct.minStock} onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})} />
          </div>
          <div className="settings-group">
            <label>ABC Besorolás</label>
            <select className="glass-input" value={newProduct.abc} onChange={(e) => setNewProduct({...newProduct, abc: e.target.value})}>
              <option value="A">A - Magas prioritás</option>
              <option value="B">B - Közepes prioritás</option>
              <option value="C">C - Alacsony prioritás</option>
            </select>
          </div>
          <div className="settings-group">
            <label>Raktári Lokáció</label>
            <input type="text" className="glass-input" value={newProduct.location} onChange={(e) => setNewProduct({...newProduct, location: e.target.value})} placeholder="pl. A-szektor, 01-B polc" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;

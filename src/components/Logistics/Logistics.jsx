import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Ship, 
  Plane, 
  MapPin, 
  Clock, 
  Package, 
  Navigation,
  Globe,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Modal from '../UI/Modal';
import './Logistics.css';

const Logistics = ({ addToast }) => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [newShipmentData, setNewShipmentData] = useState({
    id: `SHP-2024-${Math.floor(Math.random() * 1000)}`,
    origin: 'RailParts Raktár (HU)',
    destination: '',
    type: 'Road',
    items: '',
    eta: '',
    vessel: ''
  });
  
  // Animate progress on mount for visual WOW
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [shipmentList, setShipmentList] = useState([
    {
      id: 'SHP-2024-881',
      origin: 'Sanghaj, Kína',
      destination: 'Budapest, Magyarország',
      status: 'Transit',
      type: 'Sea',
      progress: 65,
      eta: '2024-05-12',
      items: '500 db Alumínium Öntvény',
      currentLocation: 'Szuezi-csatorna',
      vessel: 'MSC Isabella',
      events: [
        { time: '2024-04-10 08:30', text: 'Kikötés és berakodás Sanghajban', status: 'done' },
        { time: '2024-04-22 14:15', text: 'Áthaladás a Malaka-szoroson', status: 'done' },
        { time: '2024-04-24 09:00', text: 'Szuezi-csatorna belépés (Jelenlegi pozíció)', status: 'active' },
        { time: 'Tervezett', text: 'Kikötés Hamburgban / Vám', status: 'pending' }
      ]
    },
    {
      id: 'SHP-2024-912',
      origin: 'Hamburg, Németország',
      destination: 'Budapest, Magyarország',
      status: 'Customs',
      type: 'Road',
      progress: 90,
      eta: '2024-04-26',
      items: 'Knorr-Bremse Fékegységek',
      currentLocation: 'Bécs (Vámkezelés)',
      vessel: 'DAF XF-530 (H-LOG-12)',
      events: [
        { time: '2024-04-22 06:00', text: 'Indulás Hamburg terminálról', status: 'done' },
        { time: '2024-04-24 11:30', text: 'Határátlépés (Passau)', status: 'done' },
        { time: '2024-04-24 15:45', text: 'Vámkezelés megkezdve (Bécs)', status: 'active' },
        { time: 'Tervezett', text: 'Érkezés: RailParts Raktár (HU)', status: 'pending' }
      ]
    },
    {
      id: 'SHP-2024-773',
      origin: 'Ostrava, Csehország',
      destination: 'Budapest, Magyarország',
      status: 'Delivered',
      type: 'Rail',
      progress: 100,
      eta: '2024-04-22',
      items: 'Acél vázszerkezetek',
      currentLocation: 'RailParts Raktár (HU)',
      vessel: 'Rail Cargo Train 445',
      events: [
        { time: '2024-04-20 18:00', text: 'Berakodás Ostrava vasútállomás', status: 'done' },
        { time: '2024-04-22 07:15', text: 'Megérkezés: Csepel Szabadkikötő', status: 'done' },
        { time: '2024-04-22 10:30', text: 'Átvétel és raktározás befejezve', status: 'done' }
      ]
    }
  ]);

  useEffect(() => {
    setTimeout(() => setProgressLoaded(true), 200);
  }, []);

  const handlePlanShipment = () => {
    if (!newShipmentData.destination || !newShipmentData.items || !newShipmentData.eta) {
      addToast('Kérjük töltsön ki minden mezőt!', 'warning');
      return;
    }

    const newShp = {
      ...newShipmentData,
      status: 'Transit',
      progress: 0,
      currentLocation: 'Raktár - Előkészítés alatt',
      events: [
        { time: 'Most', text: 'Szállítás tervezve', status: 'done' },
        { time: 'Tervezett', text: 'Berakodás és indítás', status: 'active' }
      ]
    };

    setShipmentList([newShp, ...shipmentList]);
    setIsPlanning(false);
    addToast('Szállítási terv sikeresen rögzítve', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Transit': return '#3498db';
      case 'Customs': return '#f39c12';
      case 'Delivered': return '#2ecc71';
      case 'Alert': return '#e74c3c';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Transit': return 'Úton';
      case 'Customs': return 'Vám alatt';
      case 'Delivered': return 'Kézbesítve';
      case 'Alert': return 'Probléma';
      default: return status;
    }
  };

  const openShipment = (shp) => {
    setSelectedShipment(shp);
    setIsModalOpen(true);
  };

  return (
    <div className="logistics-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Globe size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Globális Logisztika (SCM)</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>Nemzetközi szállításkövetés és valós idejű telematika</p>
          </div>
        </div>
        <button 
          className="create-btn" 
          style={{ background: 'transparent', border: '1px solid #3498db', color: '#3498db', boxShadow: 'none' }} 
          onClick={() => setIsPlanning(true)}
        >
          <Navigation size={18} /> Szállítás Tervezése
        </button>
      </div>

      <Modal
        isOpen={isPlanning}
        onClose={() => setIsPlanning(false)}
        title="Új Szállítmány Tervezése"
        width="500px"
      >
        <div className="settings-row" style={{ maxWidth: '100%' }}>
          <div className="settings-group">
            <label>Célállomás *</label>
            <input 
              type="text" 
              placeholder="pl. Berlin, Németország" 
              value={newShipmentData.destination}
              onChange={(e) => setNewShipmentData({...newShipmentData, destination: e.target.value})}
            />
          </div>
          <div className="settings-group">
            <label>Szállított Áruk / Tételek *</label>
            <input 
              type="text" 
              placeholder="pl. 200 db Fékbetét" 
              value={newShipmentData.items}
              onChange={(e) => setNewShipmentData({...newShipmentData, items: e.target.value})}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="settings-group">
              <label>Várható Érkezés *</label>
              <input 
                type="date" 
                value={newShipmentData.eta}
                onChange={(e) => setNewShipmentData({...newShipmentData, eta: e.target.value})}
              />
            </div>
            <div className="settings-group">
              <label>Fuvarozó / Jármű</label>
              <input 
                type="text" 
                placeholder="pl. DHL Express" 
                value={newShipmentData.vessel}
                onChange={(e) => setNewShipmentData({...newShipmentData, vessel: e.target.value})}
              />
            </div>
          </div>
          <div className="settings-group">
            <label>Fuvar Típusa</label>
            <select 
              value={newShipmentData.type}
              onChange={(e) => setNewShipmentData({...newShipmentData, type: e.target.value})}
            >
              <option value="Road">Közúti (Truck)</option>
              <option value="Rail">Vasúti (Train)</option>
              <option value="Sea">Tengeri (Ship)</option>
              <option value="Air">Légi (Plane)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button className="view-btn" style={{ flex: 1 }} onClick={() => setIsPlanning(false)}>Mégse</button>
            <button className="create-btn" style={{ flex: 1, background: '#3498db' }} onClick={handlePlanShipment}>Terv Mentése</button>
          </div>
        </div>
      </Modal>

      <div className="shipment-grid">
        {shipmentList.map(shp => (
          <div key={shp.id} className="shipment-card" onClick={() => openShipment(shp)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: 'var(--bg-main)', borderRadius: '10px', color: getStatusColor(shp.status) }}>
                  {shp.type === 'Sea' ? <Ship size={20} /> : shp.type === 'Road' ? <Truck size={20} /> : <Plane size={20} />}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-color)' }}>{shp.id}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px' }}>Jármű: {shp.vessel}</div>
                </div>
              </div>
              <span className="status-badge" style={{ background: `${getStatusColor(shp.status)}15`, color: getStatusColor(shp.status), border: `1px solid ${getStatusColor(shp.status)}40` }}>
                {getStatusText(shp.status)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
              <span style={{ maxWidth: '40%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shp.origin.split(',')[0]}</span>
              <ChevronRight size={16} className="text-muted" />
              <span style={{ maxWidth: '40%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }}>{shp.destination.split(',')[0]}</span>
            </div>

            <div className="route-visualization">
              <div className="route-line">
                <div className="route-progress" style={{ width: progressLoaded ? `${shp.progress}%` : '0%' }}></div>
                <div className="route-marker start" style={{ borderColor: progressLoaded ? (shp.progress > 0 ? '#3498db' : 'var(--border-color)') : 'var(--border-color)' }}></div>
                <div className="route-marker current" style={{ left: progressLoaded ? `${shp.progress}%` : '0%' }}></div>
                <div className="route-marker end" style={{ borderColor: progressLoaded && shp.progress === 100 ? '#2ecc71' : 'var(--border-color)' }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Várható Érkezés (ETA)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 800 }}>
                  <Clock size={16} color="var(--text-muted)" /> {shp.eta}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Jelenlegi Pozíció</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', fontSize: '0.95rem', fontWeight: 800 }}>
                  <MapPin size={16} color={shp.status === 'Delivered' ? '#2ecc71' : '#e74c3c'} /> 
                  <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                     {shp.currentLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="port-monitor" style={{ marginTop: '35px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={20} color="#3498db" /> Port & Terminál Adatok (Élő)
        </h3>
        <div className="port-status-grid">
           {[
             { name: 'Port of Rotterdam', status: 'Torlódás', load: 85, color: '#e74c3c' },
             { name: 'Port of Shanghai', status: 'Tiszta', load: 42, color: '#2ecc71' },
             { name: 'Csepel Terminal HU', status: 'Tiszta', load: 30, color: '#2ecc71' },
             { name: 'Port of Hamburg', status: 'Mérsékelt', load: 65, color: '#f39c12' }
           ].map(port => (
             <div key={port.name} className="port-item">
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800 }}>{port.name}</span>
                  <span style={{ color: port.color, fontWeight: 800, fontSize: '0.8rem' }}>{port.status}</span>
               </div>
               <div style={{ height: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${port.load}%`, height: '100%', background: port.color, transition: 'width 1.5s ease-out' }}></div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                 <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Kapacitás:</span>
                 <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{port.load}%</span>
               </div>
             </div>
           ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedShipment ? `Szállítmány Részletei: ${selectedShipment.id}` : ''}
        width="650px"
        footer={
           <button className="view-btn" onClick={() => setIsModalOpen(false)}>Ablak Bezárása</button>
        }
      >
        {selectedShipment && (
          <div className="shipment-detail">
            <div style={{ padding: '20px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '15px', marginBottom: '30px' }}>
               <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '15px', color: 'var(--primary-color)' }}>Raktér Tartalma & Specifikációk</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <Package size={28} color="var(--primary-color)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{selectedShipment.items}</div>
                    <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      Súly: <span style={{ color: 'var(--text-main)' }}>12,400 kg</span> | Térfogat: <span style={{ color: 'var(--text-main)' }}>45 m³</span> | Fuvar típus: <span style={{ color: 'var(--text-main)' }}>{selectedShipment.type.toUpperCase()}</span>
                    </div>
                  </div>
               </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Navigation size={18} /> Követési Napló
            </h4>
            
            <div className="timeline">
               {selectedShipment.events.map((e, i) => (
                 <div key={i} className={`timeline-event ${e.status}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                             <p style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', color: e.status === 'pending' ? 'var(--text-muted)' : 'var(--text-main)' }}>{e.text}</p>
                             <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                {e.time === 'Tervezett' ? <Clock size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /> : ''} {e.time}
                             </p>
                          </div>
                          {e.status === 'active' && (
                             <span className="status-badge active" style={{ fontSize: '0.65rem' }}>MOST</span>
                          )}
                          {e.status === 'done' && (
                             <span style={{ color: '#2ecc71', fontSize: '0.8rem', fontWeight: 800 }}>Kész</span>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            
            <button className="create-btn" style={{ width: '100%', marginTop: '30px', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
               <ExternalLink size={16} /> Megnyitás teljes GIS Térképen
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Logistics;

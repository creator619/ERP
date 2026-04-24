import React, { useState } from 'react';
import { 
  Truck, 
  Ship, 
  Plane, 
  MapPin, 
  Clock, 
  Anchor, 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  ExternalLink,
  Navigation
} from 'lucide-react';
import Modal from '../UI/Modal';
import './Logistics.css';

const Logistics = ({ addToast }) => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shipments = [
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
        { time: '2024-04-10', text: 'Kikötés Sanghajban', status: 'done' },
        { time: '2024-04-22', text: 'Áthaladás Malaka-szoroson', status: 'done' },
        { time: '2024-04-24', text: 'Szuezi-csatorna belépés', status: 'active' }
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
        { time: '2024-04-22', text: 'Indulás Hamburgból', status: 'done' },
        { time: '2024-04-24', text: 'Határátlépés (Passau)', status: 'done' },
        { time: '2024-04-24', text: 'Vámkezelés megkezdve', status: 'active' }
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
        { time: '2024-04-20', text: 'Berakodás Ostrava', status: 'done' },
        { time: '2024-04-22', text: 'Megérkezés és Kirakodás', status: 'done' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Transit': return '#3498db';
      case 'Customs': return '#f1c40f';
      case 'Delivered': return '#2ecc71';
      case 'Alert': return '#e74c3c';
      default: return 'var(--text-muted)';
    }
  };

  const openShipment = (shp) => {
    setSelectedShipment(shp);
    setIsModalOpen(true);
  };

  return (
    <div className="logistics-wrapper">
      <div className="invoicing-header" style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <Globe size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Globális Logisztika & SCM</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Nemzetközi szállításkövetés és ellátási lánc monitor</p>
          </div>
        </div>
        <button className="create-btn" onClick={() => addToast('Új szállítás indítása', 'info')}>
          <Navigation size={20} /> Szállítás Tervezése
        </button>
      </div>

      <div className="shipment-grid">
        {shipments.map(shp => (
          <div key={shp.id} className="shipment-card glass" onClick={() => openShipment(shp)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  {shp.type === 'Sea' ? <Ship size={18} /> : shp.type === 'Road' ? <Truck size={18} /> : <Ship size={18} />}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{shp.id}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{shp.vessel}</div>
                </div>
              </div>
              <span className="status-badge" style={{ background: 'transparent', border: `1px solid ${getStatusColor(shp.status)}`, color: getStatusColor(shp.status) }}>
                {shp.status}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>{shp.origin.split(',')[0]}</span>
              <ArrowRight size={14} className="text-muted" />
              <span>{shp.destination.split(',')[0]}</span>
            </div>

            <div className="route-visualization">
              <div className="route-line">
                <div className="route-progress" style={{ width: `${shp.progress}%` }}></div>
                <div className="route-marker start"></div>
                <div className="route-marker current" style={{ left: `${shp.progress}%` }}></div>
                <div className="route-marker end"></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.7rem' }}>Várható Érkezés (ETA)</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: 700 }}>
                  <Clock size={14} /> {shp.eta}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ fontSize: '0.7rem' }}>Jelenlegi Helyszín</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', fontSize: '0.9rem', fontWeight: 700 }}>
                  <MapPin size={14} color="#e74c3c" /> {shp.currentLocation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="port-monitor glass" style={{ marginTop: '30px', background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '25px' }}>Kikötői és Terminál Állapotok</h3>
        <div className="port-status-grid">
           {[
             { name: 'Port of Rotterdam', status: 'Congested', load: 85, color: '#e74c3c' },
             { name: 'Port of Shanghai', status: 'Clear', load: 42, color: '#2ecc71' },
             { name: 'Terminal Budapest', status: 'Clear', load: 30, color: '#2ecc71' },
             { name: 'Port of Hamburg', status: 'Moderate', load: 65, color: '#f1c40f' }
           ].map(port => (
             <div key={port.name} className="port-item">
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700 }}>{port.name}</span>
                  <span style={{ color: port.color, fontWeight: 800 }}>{port.status}</span>
               </div>
               <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${port.load}%`, height: '100%', background: port.color }}></div>
               </div>
               <span className="text-muted" style={{ fontSize: '0.7rem' }}>Leterheltség: {port.load}%</span>
             </div>
           ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Szállítási Adatok: ${selectedShipment?.id}`}
        width="650px"
      >
        {selectedShipment && (
          <div className="shipment-detail">
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', marginBottom: '25px' }}>
               <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '15px' }}>Raktér Tartalom</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <Package size={24} color="var(--primary-color)" />
                  <div>
                    <p style={{ fontWeight: 700 }}>{selectedShipment.items}</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>Súly: 12,400 kg | Térfogat: 45 m³</p>
                  </div>
               </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '15px' }}>Szállítási Események</h4>
            <div className="timeline" style={{ position: 'relative', paddingLeft: '30px' }}>
               {selectedShipment.events.map((e, i) => (
                 <div key={i} style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-37px', 
                      top: '0', 
                      width: '14px', 
                      height: '14px', 
                      borderRadius: '50%', 
                      background: e.status === 'done' ? '#2ecc71' : 'var(--primary-color)',
                      border: '3px solid rgba(255,255,255,0.1)'
                    }}></div>
                    {i < selectedShipment.events.length - 1 && (
                      <div style={{ position: 'absolute', left: '-31px', top: '14px', width: '2px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{e.text}</span>
                       <span className="text-muted" style={{ fontSize: '0.75rem' }}>{e.time}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="view-btn" style={{ width: '100%', marginTop: '20px' }}>
               <ExternalLink size={16} /> Megnyitás a globális térképen
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Logistics;

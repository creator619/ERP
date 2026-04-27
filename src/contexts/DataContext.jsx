import React, { createContext, useContext, useState, useEffect } from 'react';
import auditLogService from '../services/AuditLogService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const generateHash = () => '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');

  // 0. Blockchain Ledgers
  const [ledgers, setLedgers] = useState({
    'AXLE-2024-001': {
      name: 'Nagysebességű Tengely (V3)',
      status: 'Blockchain Verified',
      finalHash: 'SHA256: 8f2a4c11e2e88b99d3d11a221f44e556...',
      steps: [
        { title: 'Alapanyag Beérkezés', date: '2024-04-10 08:30', actor: 'Beszerzés - Kovács J.', hash: '0x4f12...a9b2', details: 'Acélötvözet S355J2W, Tanúsítvány: EN 10204 3.1' },
        { title: 'CNC Esztergálás', date: '2024-04-12 14:15', actor: 'Gyártás - Nagy P.', hash: '0x8d33...f1e4', details: 'Gép: DMG MORI CTX, Program: AXLE_V3_FINAL' },
        { title: 'Hőkezelés', date: '2024-04-13 10:00', actor: 'Külső Partner - HeatTreat Kft.', hash: '0x2b44...c6d7', details: '600°C feszültségmentesítő izzítás' },
        { title: 'Ultrahangos Vizsgálat', date: '2024-04-15 09:45', actor: 'Minőségügy - Ügyvezető Igazgató', hash: '0x9a55...e8f9', details: 'Repedésmentes, Megfelelő' },
        { title: 'Blockchain Lezárás', date: '2024-04-24 14:00', actor: 'Rendszer AI', hash: '0x0f66...b1a2', details: 'Digitális Termék Útlevél generálva' }
      ]
    },
    'RW/MO/003': {
      name: 'Válaszfal elem (tűzgátló)',
      status: 'Blockchain Verified',
      finalHash: 'SHA256: e8f9c6d72b449a55...',
      steps: [
        { title: 'Alapanyag Beérkezés', date: '2024-04-17 08:30', actor: 'ERP Rendszer', hash: '0x1a2b...3c4d', details: 'Felhasznált: Tűzgátló panel' },
        { title: 'Gyártási Folyamat (MES)', date: '2024-04-18 14:15', actor: 'Minőségellenőrzés', hash: '0x5e6f...7a8b', details: 'Munkalap sorszám: RW/MO/003' },
        { title: 'Blockchain Lezárás', date: '2024-04-18 16:00', actor: 'RailParts Core', hash: '0x9c0d...1e2f', details: 'Útlevél Létrehozva (142 db)' }
      ]
    }
  });

  // 1. Initial Products State (Inventory)
  const [products, setProducts] = useState([
    { id: 1, name: 'Poggyásztartó modul (Alumínium)', category: 'Beltér', price: 42000, stock: 15, minStock: 10, sku: 'RW-INT-001' },
    { id: 2, name: 'Hőszigetelt kocsiablak', category: 'Nyílászáró', price: 158000, stock: 42, minStock: 20, sku: 'RW-WIN-042' },
    { id: 3, name: 'Automata tolóajtó rendszer', category: 'Nyílászáró', price: 450000, stock: 5, minStock: 8, sku: 'RW-DOR-015' },
    { id: 4, name: 'Válaszfal elem (tűzgátló)', category: 'Beltér', price: 85000, stock: 0, minStock: 5, sku: 'RW-PAR-012' },
    { id: 5, name: 'Alumínium profil (2m)', category: 'Nyersanyag', price: 12000, stock: 5, minStock: 50, sku: 'RAW-ALU-02' },
    { id: 6, name: 'Ajtómotor (DC-42)', category: 'Elektronika', price: 89000, stock: 12, minStock: 10, sku: 'RAW-MOT-42' },
    { id: 7, name: 'Edzett üveg (4mm)', category: 'Nyersanyag', price: 25000, stock: 5, minStock: 100, sku: 'RAW-GLS-04' },
    { id: 8, name: 'PVC keret profil', category: 'Nyersanyag', price: 4500, stock: 500, minStock: 200, sku: 'RAW-PVC-01' }
  ]);

  // 2. Initial Work Orders State (Manufacturing)
  const [workOrders, setWorkOrders] = useState([
    { 
      id: 'RW/MO/001', 
      product: 'Automata tolóajtó rendszer', 
      quantity: 5, 
      progress: 40, 
      currentStage: 1,
      status: 'In Progress', 
      deadline: '2024-04-28', 
      priority: 'High', 
      bom: [
        { item: 'Alumínium profil (2m)', sku: 'RAW-ALU-02', required: 20 },
        { item: 'Ajtómotor (DC-42)', sku: 'RAW-MOT-42', required: 5 }
      ]
    },
    { 
      id: 'RW/MO/002', 
      product: 'Hőszigetelt kocsiablak', 
      quantity: 24, 
      progress: 75, 
      currentStage: 3,
      status: 'In Progress', 
      deadline: '2024-04-22', 
      priority: 'Medium', 
      bom: [
        { item: 'Edzett üveg (4mm)', sku: 'RAW-GLS-04', required: 24 },
        { item: 'PVC keret profil', sku: 'RAW-PVC-01', required: 48 }
      ]
    }
  ]);

  // 3. Maintenance State
  const [machines, setMachines] = useState([
    { id: 'MC-101', name: 'Alumínium Profilvágó CNC', status: 'Healthy', health: 95, pdm: 42, downtimeCost: 15000, telemetry: [85, 87, 86, 90, 92, 88, 85], parts: [{ name: 'Vágótárcsa (T-200)', stock: 5, required: 1, status: 'ok' }] },
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, pdm: 8, downtimeCost: 25000, telemetry: [60, 65, 70, 75, 80, 85, 62], parts: [{ name: 'Főhenger szelep', stock: 0, required: 1, status: 'missing' }] }
  ]);

  const [maintenanceTasks, setMaintenanceTasks] = useState([
    { id: 'WO-001', machine: 'MC-102', task: 'Henger tömítés csere', priority: 'Magas', status: 'Várólista' }
  ]);

  // 4. Procurement State
  const [procurementOrders, setProcurementOrders] = useState([
    { id: 'PO/2024/001', supplier: 'Knorr-Bremse Vasúti Kft.', date: '2024-04-10', total: 4500000, status: 'Delivered', category: 'Alkatrész', approvalStep: 3, rating: 4.8, scores: { quality: 98, delivery: 95, price: 90, responsiveness: 88, innovation: 85 }, items: [{ name: 'Féktárcsa szett', qty: 20, price: 150000 }] }
  ]);

  const [procurementRequests, setProcurementRequests] = useState([]);

  // 5. Collaboration State
  const [comments, setComments] = useState({
    'NCR-2024-042': [{ id: 1, user: 'Kovács János', text: 'A beszállító jelezte, hogy a következő tétel már ellenőrizve lesz.', time: '10:15', role: 'Quality' }]
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'comment', entityId: 'NCR-2024-042', text: 'Új hozzászólás érkezett az NCR-042-höz', read: false, time: '1 órája' }
  ]);

  // --- NEW: MRP & Planning Logic ---
  const calculateMRP = () => {
    const aggregateRequirements = {};
    
    // Sum up all requirements from active work orders
    workOrders.filter(wo => wo.status !== 'Completed').forEach(wo => {
      wo.bom.forEach(item => {
        if (!aggregateRequirements[item.sku]) {
          aggregateRequirements[item.sku] = { 
            sku: item.sku, 
            name: item.item, 
            required: 0,
            orders: []
          };
        }
        aggregateRequirements[item.sku].required += item.required;
        aggregateRequirements[item.sku].orders.push(wo.id);
      });
    });

    // Compare with current stock
    return Object.values(aggregateRequirements).map(req => {
      const product = products.find(p => p.sku === req.sku);
      const stock = product ? product.stock : 0;
      const shortage = Math.max(0, req.required - stock);
      
      return {
        ...req,
        stock,
        shortage,
        status: shortage > 0 ? 'Shortage' : 'Available',
        recommendation: shortage > 0 ? `Beszerzés javasolt: ${shortage} db` : 'Készlet rendben'
      };
    });
  };

  const [mrpData, setMrpData] = useState([]);

  useEffect(() => {
    setMrpData(calculateMRP());
  }, [workOrders, products]);

  // AI Forecast Simulation
  const getForecast = () => {
    return [
      { month: 'Május', demand: 450, stock: 400, alert: true },
      { month: 'Június', demand: 380, stock: 520, alert: false },
      { month: 'Július', demand: 520, stock: 480, alert: true },
      { month: 'Augusztus', demand: 410, stock: 600, alert: false }
    ];
  };

  const addComment = (entityId, text, user = 'Simon Ernő', role = 'Management') => {
    const newComment = {
      id: Date.now(),
      user, text,
      time: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
      role
    };
    setComments(prev => ({ ...prev, [entityId]: [...(prev[entityId] || []), newComment] }));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const advanceWorkOrderStage = (woId, stagesCount) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === woId) {
        const nextStage = Math.min(wo.currentStage + 1, stagesCount);
        const nextProgress = (nextStage / stagesCount) * 100;
        return { ...wo, currentStage: nextStage, progress: nextProgress, status: nextProgress === 100 ? 'Completed' : 'In Progress' };
      }
      return wo;
    }));
  };

  const executeAIAction = (insight) => {
    // Shared AI logic
  };

  return (
    <DataContext.Provider value={{
      products, setProducts, 
      workOrders, setWorkOrders,
      advanceWorkOrderStage,
      ledgers: {},
      machines, setMachines,
      maintenanceTasks, setMaintenanceTasks,
      procurementOrders, setProcurementOrders,
      procurementRequests, setProcurementRequests,
      executeAIAction,
      comments, addComment,
      notifications, markNotificationAsRead,
      mrpData,
      forecast: getForecast()
    }}>
      {children}
    </DataContext.Provider>
  );
};

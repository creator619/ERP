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
    },
    'RW/MO/004': {
      name: 'Utastéri LED modul',
      status: 'Blockchain Verified',
      finalHash: 'SHA256: 1f44e5568f2a4c11...',
      steps: [
        { title: 'Alapanyag Beérkezés', date: '2024-04-11 08:30', actor: 'ERP Rendszer', hash: '0x3x4e...5d6f', details: 'Felhasznált: LED szalag (5m)' },
        { title: 'Gyártási Folyamat (MES)', date: '2024-04-12 11:15', actor: 'Minőségellenőrzés', hash: '0x7g8h...9i0j', details: 'Munkalap sorszám: RW/MO/004' },
        { title: 'Blockchain Lezárás', date: '2024-04-12 12:00', actor: 'RailParts Core', hash: '0x1k2l...3m4n', details: 'Útlevél Létrehozva (85 db)' }
      ]
    }
  });

  // 1. Initial Products State (Inventory)
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Poggyásztartó modul (Alumínium)', 
      category: 'Beltér', 
      price: '42,000 Ft', 
      stock: 15, 
      minStock: 10,
      sku: 'RW-INT-001',
      abc: 'B',
      location: 'A-szektor, 04-B polc',
      trend: [10, 12, 11, 15, 14, 18, 15],
      batches: [
        { id: 'B-8821', qty: 10, expiry: '2025-12-01', status: 'Passed' },
        { id: 'B-8822', qty: 5, expiry: '2026-01-15', status: 'Passed' }
      ],
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
      abc: 'A',
      location: 'W-szektor, 10-C polc',
      trend: [30, 35, 42, 40, 45, 42, 42],
      batches: [
        { id: 'B-9901', qty: 42, expiry: '2027-06-10', status: 'Passed' }
      ],
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
      abc: 'A',
      location: 'W-szektor, 02-A polc',
      trend: [12, 10, 8, 7, 6, 5, 5],
      batches: [
        { id: 'B-7712', qty: 5, expiry: '2026-03-20', status: 'Passed' }
      ],
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
      abc: 'C',
      location: 'P-szektor, 01-D polc',
      trend: [15, 12, 10, 8, 5, 2, 0],
      batches: [],
      history: [{ date: '2024-04-15', type: 'OUT', qty: 10, reason: 'Készlet kimerült' }]
    },
    { id: 5, name: 'Alumínium profil (2m)', category: 'Nyersanyag', price: '12,000 Ft', stock: 5, minStock: 50, sku: 'RAW-ALU-02', abc: 'C', location: 'R-szektor, 01-A', trend: [150,150,150,150,150,150,150], batches: [], history: [] },
    { id: 6, name: 'Ajtómotor (DC-42)', category: 'Elektronika', price: '89,000 Ft', stock: 12, minStock: 10, sku: 'RAW-MOT-42', abc: 'A', location: 'E-szektor, 02-B', trend: [12,12,12,12,12,12,12], batches: [], history: [] },
    { id: 7, name: 'Edzett üveg (4mm)', category: 'Nyersanyag', price: '25,000 Ft', stock: 5, minStock: 100, sku: 'RAW-GLS-04', abc: 'B', location: 'R-szektor, 05-A', trend: [200,200,200,200,200,200,200], batches: [], history: [] },
    { id: 8, name: 'PVC keret profil', category: 'Nyersanyag', price: '4,500 Ft', stock: 500, minStock: 200, sku: 'RAW-PVC-01', abc: 'C', location: 'R-szektor, 05-B', trend: [500,500,500,500,500,500,500], batches: [], history: [] }
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
      technician: 'Nagy Péter',
      workCenter: 'MC-101 (Profilvágó)',
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
      technician: 'Kovács János',
      workCenter: 'MC-103 (Festőkabin)',
      bom: [
        { item: 'Edzett üveg (4mm)', sku: 'RAW-GLS-04', required: 24 },
        { item: 'PVC keret profil', sku: 'RAW-PVC-01', required: 48 }
      ]
    },
    { 
      id: 'RW/MO/003', 
      product: 'Válaszfal elem (tűzgátló)', 
      quantity: 142, 
      progress: 100, 
      currentStage: 4,
      status: 'Completed', 
      deadline: '2024-04-18', 
      priority: 'Low', 
      technician: 'Szabó Anna',
      workCenter: 'MC-105 (Összeszerelő Sor)',
      bom: [
        { item: 'Tűzgátló panel', sku: 'RAW-PNL-99', required: 142 }
      ]
    },
    { 
      id: 'RW/MO/004', 
      product: 'Utastéri LED modul', 
      quantity: 85, 
      progress: 100, 
      currentStage: 4,
      status: 'Completed', 
      deadline: '2024-04-12', 
      priority: 'High', 
      technician: 'Kovács János',
      workCenter: 'MC-102 (Elektronika)',
      bom: [
        { item: 'LED szalag (5m)', sku: 'RAW-LED-05', required: 85 }
      ]
    }
  ]);

  // BOM Availability Check Hook
  const getBomStatus = (wo) => {
    return wo.bom.map(b => {
      const prodInStock = products.find(p => p.sku === b.sku);
      const available = prodInStock ? prodInStock.stock : 0;
      return {
        ...b,
        available,
        status: available >= b.required ? 'ok' : 'missing'
      };
    });
  };

  const advanceWorkOrderStage = (woId, stagesCount) => {
    let completed = false;
    let requiredBom = [];
    let endProduct = '';
    let endQty = 0;

    setWorkOrders(prev => prev.map(wo => {
      if (wo.id === woId) {
        const nextStage = Math.min(wo.currentStage + 1, stagesCount);
        const nextProgress = (nextStage / stagesCount) * 100;
        const nextStatus = nextProgress === 100 ? 'Completed' : 'In Progress';
        
        if (nextProgress === 100 && wo.status !== 'Completed') {
          completed = true;
          requiredBom = wo.bom;
          endProduct = wo.product;
          endQty = wo.quantity;
        }

        auditLogService.log({
          user: 'Gyártásvezető',
          action: 'Fázisváltás',
          module: 'Manufacturing',
          details: `${wo.product} (${woId}) fázisváltás (Stádium: ${nextStage}).`,
          severity: 'info'
        });

        return { ...wo, currentStage: nextStage, progress: nextProgress, status: nextStatus };
      }
      return wo;
    }));

    // Ha befejeztük a gyártást, levonjuk a BOM-ot és hozzáadjuk a végterméket
    if (completed) {
      setProducts(prevProducts => {
        let updatedProducts = [...prevProducts];

        // Anyagleadás
        requiredBom.forEach(item => {
          let pIdx = updatedProducts.findIndex(p => p.sku === item.sku);
          if (pIdx > -1) {
             updatedProducts[pIdx] = { 
                ...updatedProducts[pIdx], 
                stock: Math.max(0, updatedProducts[pIdx].stock - item.required),
                history: [{ date: new Date().toISOString().split('T')[0], type: 'OUT', qty: item.required, reason: `Felhasználás: ${woId}` }, ...updatedProducts[pIdx].history]
             };
          }
        });

        // Késztermék bevételezés
        let endIdx = updatedProducts.findIndex(p => p.name === endProduct);
        if (endIdx > -1) {
           updatedProducts[endIdx] = {
              ...updatedProducts[endIdx],
              stock: updatedProducts[endIdx].stock + endQty,
              history: [{ date: new Date().toISOString().split('T')[0], type: 'IN', qty: endQty, reason: `Gyártásból bevételezve: ${woId}` }, ...updatedProducts[endIdx].history]
           };
        }

        auditLogService.log({
          user: 'ERP System',
          action: 'Készletmozgás',
          module: 'Inventory',
          details: `${woId} munkalap befejezve. Anyagok leltárból levonva. Késztermék bevételezve: +${endQty} db.`,
          severity: 'success'
        });

        // Blockchain Főkönyvi bejegyzés generálása
        const now = new Date().toLocaleString('hu-HU');
        setLedgers(prev => ({
          ...prev,
          [woId]: {
            name: endProduct,
            status: 'Blockchain Verified',
            finalHash: `SHA256: ${generateHash().substring(2)}`,
            steps: [
              { title: 'Alapanyag Beérkezés', date: now, actor: 'ERP Rendszer', hash: generateHash().substring(0,18), details: `Felhasznált: ${requiredBom.map(b => b.item).join(', ')}` },
              { title: 'Gyártási Folyamat (MES)', date: now, actor: 'Minőségellenőrzés', hash: generateHash().substring(0,18), details: `Munkalap sorszám: ${woId}` },
              { title: 'Blockchain Lezárás', date: now, actor: 'RailParts Core', hash: generateHash().substring(0,18), details: `Útlevél Létrehozva (${endQty} db)` }
            ]
          }
        }));

        return updatedProducts;
      });
    }

    return completed;
  };

  return (
    <DataContext.Provider value={{
      products, setProducts, 
      workOrders, setWorkOrders,
      advanceWorkOrderStage,
      getBomStatus,
      ledgers
    }}>
      {children}
    </DataContext.Provider>
  );
};

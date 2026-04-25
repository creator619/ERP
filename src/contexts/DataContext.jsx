import React, { createContext, useContext, useState, useEffect } from 'react';
import auditLogService from '../services/AuditLogService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
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
    { id: 5, name: 'Alumínium profil (2m)', category: 'Nyersanyag', price: '12,000 Ft', stock: 150, minStock: 50, sku: 'RAW-ALU-02', abc: 'C', location: 'R-szektor, 01-A', trend: [150,150,150,150,150,150,150], batches: [], history: [] },
    { id: 6, name: 'Ajtómotor (DC-42)', category: 'Elektronika', price: '89,000 Ft', stock: 12, minStock: 10, sku: 'RAW-MOT-42', abc: 'A', location: 'E-szektor, 02-B', trend: [12,12,12,12,12,12,12], batches: [], history: [] },
    { id: 7, name: 'Edzett üveg (4mm)', category: 'Nyersanyag', price: '25,000 Ft', stock: 200, minStock: 100, sku: 'RAW-GLS-04', abc: 'B', location: 'R-szektor, 05-A', trend: [200,200,200,200,200,200,200], batches: [], history: [] },
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
      getBomStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

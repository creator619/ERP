import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // --- INVENTORY ---
  const [products, setProducts] = useState([
    { id: 1, name: 'Poggyásztartó modul (Alumínium)', category: 'Beltér', price: 42000, stock: 15, minStock: 10, sku: 'RW-INT-001' },
    { id: 2, name: 'Hőszigetelt kocsiablak', category: 'Nyílászáró', price: 158000, stock: 42, minStock: 20, sku: 'RW-WIN-042' },
    { id: 3, name: 'Automata tolóajtó rendszer', category: 'Nyílászáró', price: 450000, stock: 5, minStock: 8, sku: 'RW-DOR-015' }
  ]);

  // --- MANUFACTURING ---
  const [workOrders, setWorkOrders] = useState([
    { 
      id: 'RW/MO/001', product: 'Automata tolóajtó rendszer', quantity: 5, progress: 40, currentStage: 1,
      status: 'In Progress', startDate: '2024-04-20', deadline: '2024-05-10', priority: 'High', 
      machineId: 'MC-101', estimatedHours: 120,
      bom: [{ item: 'Alumínium profil (2m)', sku: 'RAW-ALU-02', required: 20 }]
    }
  ]);

  // --- MACHINES ---
  const [machines, setMachines] = useState([
    { id: 'MC-101', name: 'Alumínium Profilvágó CNC', status: 'Healthy', health: 95, capacity: 160, purchaseValue: 45000000, purchaseDate: '2023-01-10', depYear: 14.5 },
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, capacity: 160, purchaseValue: 12000000, purchaseDate: '2022-05-20', depYear: 14.5 }
  ]);

  // --- HR ---
  const [employees, setEmployees] = useState([
    { id: 'EMP-001', name: 'Kovács János', role: 'Szenior Hegesztő', department: 'Gyártás', salary: 650000, performance: 94, avatar: 'KJ', skills: { welding: 5, cnc: 2 }, leaveBalance: { total: 25, used: 12, sick: 4 }, certs: [] }
  ]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const skillDefinitions = [
    { id: 'welding', label: 'Hegesztés' }, { id: 'cnc', label: 'CNC Kezelés' }, { id: 'forklift', label: 'Targonca' }, { id: 'assembly', label: 'Összeszerelés' }
  ];

  // --- FINANCE ---
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({ cash: 25000000, ar: 18500000, ap: 12400000 });

  // --- OTHERS ---
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState({});
  const [procurementRequests, setProcurementRequests] = useState([]);

  // --- CALCULATIONS ---
  const calculateMRP = () => {
    // Biztosítjuk, hogy minden termékhez legyen 'orders' tömb, különben a Planning modul összeomlik
    return products.map(p => ({
      ...p,
      required: 0,
      shortage: Math.max(0, p.minStock - p.stock),
      status: p.stock < p.minStock ? 'Shortage' : 'Available',
      orders: [] // Üres lista a biztonság kedvéért
    }));
  };

  const calculateResourceLoading = () => {
    return machines.map(m => ({
      ...m,
      percentage: Math.floor(Math.random() * 40) + 40,
      loadedHours: 80,
      orderCount: 1,
      alert: false
    }));
  };

  const calculateAssets = () => {
    return machines.map(m => ({ ...m, netValue: m.purchaseValue * 0.8, totalDepreciation: m.purchaseValue * 0.2, monthlyDepreciation: 50000 }));
  };

  // --- ACTIONS ---
  const approveLeave = (id) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const addComment = (id, text) => {
    setComments(prev => ({ ...prev, [id]: [...(prev[id] || []), { id: Date.now(), user: 'Simon Ernő', text, time: 'Most' }] }));
  };

  return (
    <DataContext.Provider value={{
      products, setProducts, workOrders, setWorkOrders, machines, setMachines,
      employees, setEmployees, skillDefinitions, leaveRequests, setLeaveRequests, approveLeave,
      transactions, setTransactions, balances, setBalances, fixedAssets: calculateAssets(),
      notifications, setNotifications, comments, setComments, addComment,
      procurementRequests, setProcurementRequests,
      mrpData: calculateMRP(), resourceLoading: calculateResourceLoading(),
      advanceWorkOrderStage: () => {}, executeAIAction: () => {},
      forecast: [
        { month: 'Május', demand: 450, stock: 400, alert: true },
        { month: 'Június', demand: 380, stock: 520, alert: false }
      ]
    }}>
      {children}
    </DataContext.Provider>
  );
};

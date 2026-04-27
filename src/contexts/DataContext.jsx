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

  // --- HR & LEAVES ---
  const [employees, setEmployees] = useState([
    { 
      id: 'EMP-001', name: 'Kovács János', role: 'Szenior Hegesztő', department: 'Gyártás', 
      salary: 650000, performance: 94, avatar: 'KJ',
      skills: { welding: 5, cnc: 2, forklift: 4, assembly: 3 },
      leaveBalance: { total: 25, used: 12, sick: 4 },
      certs: [{ name: 'Minősített Hegesztő', expiry: '2025-06-12', status: 'valid' }]
    },
    { 
      id: 'EMP-002', name: 'Nagy Piroska', role: 'CNC Operátor', department: 'Gyártás', 
      salary: 520000, performance: 88, avatar: 'NP',
      skills: { welding: 1, cnc: 5, forklift: 2, assembly: 2 },
      leaveBalance: { total: 22, used: 5, sick: 0 },
      certs: []
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-101', empId: 'EMP-001', empName: 'Kovács János', type: 'Fizetett', start: '2024-05-10', end: '2024-05-15', days: 4, status: 'Pending' }
  ]);

  const skillDefinitions = [
    { id: 'welding', label: 'Hegesztés' }, { id: 'cnc', label: 'CNC Kezelés' }, { id: 'forklift', label: 'Targonca' }, { id: 'assembly', label: 'Összeszerelés' }
  ];

  // --- FINANCE ---
  const [transactions, setTransactions] = useState([
    { id: 'TX-001', date: '2024-04-25', account: 'Vevők', type: 'Debit', amount: 1500000, details: 'Számla kiegyenlítés' }
  ]);
  const [balances, setBalances] = useState({ cash: 25000000, ar: 18500000, ap: 12400000 });

  // --- COLLABORATION & SYSTEM ---
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState({});
  const [procurementRequests, setProcurementRequests] = useState([]);

  // --- CALCULATIONS ---
  const calculateAssets = () => {
    return machines.map(m => {
      const years = 2024 - new Date(m.purchaseDate).getFullYear();
      const dep = (m.purchaseValue * (m.depYear / 100)) * years;
      return { ...m, netValue: Math.max(0, m.purchaseValue - dep), totalDepreciation: dep, monthlyDepreciation: (m.purchaseValue * (m.depYear / 100)) / 12 };
    });
  };

  const calculateMRP = () => {
    return products.map(p => ({ ...p, required: 0, shortage: 0, status: 'Available' }));
  };

  const calculateResourceLoading = () => {
    return machines.map(m => ({ ...m, percentage: 45, loadedHours: 72, orderCount: 2 }));
  };

  // --- ACTIONS ---
  const approveLeave = (reqId) => {
    setLeaveRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
    const req = leaveRequests.find(r => r.id === reqId);
    if (req && req.type === 'Fizetett') {
      setEmployees(prev => prev.map(e => e.id === req.empId ? { ...e, leaveBalance: { ...e.leaveBalance, used: e.leaveBalance.used + req.days } } : e));
    }
  };

  const addComment = (entityId, text) => {
    const newComment = { id: Date.now(), user: 'Simon Ernő', text, time: 'Most', role: 'Management' };
    setComments(prev => ({ ...prev, [entityId]: [...(prev[entityId] || []), newComment] }));
  };

  const advanceWorkOrderStage = (id, count) => console.log('Advancing', id);
  const executeAIAction = (action) => console.log('AI Action', action);

  return (
    <DataContext.Provider value={{
      products, setProducts, workOrders, setWorkOrders, machines, setMachines,
      employees, setEmployees, skillDefinitions, leaveRequests, setLeaveRequests, approveLeave,
      transactions, setTransactions, balances, setBalances, fixedAssets: calculateAssets(),
      notifications, setNotifications, comments, setComments, addComment,
      procurementRequests, setProcurementRequests,
      mrpData: calculateMRP(), resourceLoading: calculateResourceLoading(),
      advanceWorkOrderStage, executeAIAction,
      forecast: [{ month: 'Május', demand: 450, stock: 400, alert: true }]
    }}>
      {children}
    </DataContext.Provider>
  );
};

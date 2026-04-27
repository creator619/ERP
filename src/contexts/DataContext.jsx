import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // --- INVENTORY & MANUFACTURING ---
  const [products, setProducts] = useState([
    { id: 1, name: 'Poggyásztartó modul (Alumínium)', category: 'Beltér', price: 42000, stock: 15, minStock: 10, sku: 'RW-INT-001' },
    { id: 2, name: 'Hőszigetelt kocsiablak', category: 'Nyílászáró', price: 158000, stock: 42, minStock: 20, sku: 'RW-WIN-042' },
    { id: 3, name: 'Automata tolóajtó rendszer', category: 'Nyílászáró', price: 450000, stock: 5, minStock: 8, sku: 'RW-DOR-015' }
  ]);

  const [workOrders, setWorkOrders] = useState([
    { id: 'RW/MO/001', product: 'Automata tolóajtó rendszer', quantity: 5, progress: 40, status: 'In Progress', startDate: '2024-04-20', deadline: '2024-05-10', priority: 'High', machineId: 'MC-101', estimatedHours: 120, bom: [{ item: 'Alumínium profil (2m)', sku: 'RAW-ALU-02', required: 20 }] }
  ]);

  const [machines, setMachines] = useState([
    { id: 'MC-101', name: 'Alumínium Profilvágó CNC', status: 'Healthy', health: 95, capacity: 160, purchaseValue: 45000000, purchaseDate: '2023-01-10', depYear: 14.5 },
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, capacity: 160, purchaseValue: 12000000, purchaseDate: '2022-05-20', depYear: 14.5 }
  ]);

  // --- NEW: HR & SKILLS ---
  const [employees, setEmployees] = useState([
    { 
      id: 'EMP-001', name: 'Kovács János', role: 'Szenior Hegesztő', department: 'Gyártás', 
      salary: 650000, performance: 94, avatar: 'KJ',
      skills: { welding: 5, cnc: 2, forklift: 4, assembly: 3 },
      certs: [
        { name: 'Minősített Hegesztő', expiry: '2025-06-12', status: 'valid' },
        { name: 'Targonca Jogosítvány', expiry: '2024-05-20', status: 'warning' }
      ]
    },
    { 
      id: 'EMP-002', name: 'Nagy Piroska', role: 'CNC Operátor', department: 'Gyártás', 
      salary: 520000, performance: 88, avatar: 'NP',
      skills: { welding: 1, cnc: 5, forklift: 2, assembly: 2 },
      certs: [
        { name: 'CNC Programozó', expiry: '2026-01-15', status: 'valid' }
      ]
    },
    { 
      id: 'EMP-003', name: 'Szabó Ernő', role: 'Minőségellenőr', department: 'Minőségügy', 
      salary: 580000, performance: 97, avatar: 'SZE',
      skills: { welding: 3, cnc: 3, forklift: 1, assembly: 5 },
      certs: [
        { name: 'ISO 9001 Auditor', expiry: '2024-12-01', status: 'valid' }
      ]
    }
  ]);

  const skillDefinitions = [
    { id: 'welding', label: 'Hegesztés' },
    { id: 'cnc', label: 'CNC Kezelés' },
    { id: 'forklift', label: 'Targonca' },
    { id: 'assembly', label: 'Összeszerelés' }
  ];

  // --- FINANCE ---
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({ cash: 25000000, ar: 18500000, ap: 12400000 });

  // --- FUNCTIONS ---
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

  const calculateAssets = () => {
    const currentYear = 2024;
    return machines.map(m => {
      const yearsInService = currentYear - new Date(m.purchaseDate).getFullYear();
      const totalDepreciation = (m.purchaseValue * (m.depYear / 100)) * yearsInService;
      return { ...m, netValue: Math.max(0, m.purchaseValue - totalDepreciation), totalDepreciation, monthlyDepreciation: (m.purchaseValue * (m.depYear / 100)) / 12 };
    });
  };

  return (
    <DataContext.Provider value={{
      products, setProducts, workOrders, setWorkOrders, machines, setMachines,
      employees, setEmployees, skillDefinitions,
      transactions, setTransactions, balances, setBalances, fixedAssets: calculateAssets(),
      procurementRequests: [], procurementOrders: [], notifications: [], comments: {},
      mrpData: [], resourceLoading: [], advanceWorkOrderStage,
      forecast: []
    }}>
      {children}
    </DataContext.Provider>
  );
};

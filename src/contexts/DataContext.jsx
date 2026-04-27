import React, { createContext, useContext, useState, useEffect } from 'react';
import auditLogService from '../services/AuditLogService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const generateHash = () => '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');

  // 1. Products State
  const [products, setProducts] = useState([
    { id: 1, name: 'Poggyásztartó modul (Alumínium)', category: 'Beltér', price: 42000, stock: 15, minStock: 10, sku: 'RW-INT-001' },
    { id: 2, name: 'Hőszigetelt kocsiablak', category: 'Nyílászáró', price: 158000, stock: 42, minStock: 20, sku: 'RW-WIN-042' },
    { id: 3, name: 'Automata tolóajtó rendszer', category: 'Nyílászáró', price: 450000, stock: 5, minStock: 8, sku: 'RW-DOR-015' }
  ]);

  // 2. Work Orders
  const [workOrders, setWorkOrders] = useState([
    { id: 'RW/MO/001', product: 'Automata tolóajtó rendszer', quantity: 5, progress: 40, status: 'In Progress', startDate: '2024-04-20', deadline: '2024-05-10', priority: 'High', machineId: 'MC-101', estimatedHours: 120, bom: [{ item: 'Alumínium profil (2m)', sku: 'RAW-ALU-02', required: 20 }] }
  ]);

  // 3. Machines & Fixed Assets (Bővítve pénzügyi adatokkal)
  const [machines, setMachines] = useState([
    { id: 'MC-101', name: 'Alumínium Profilvágó CNC', status: 'Healthy', health: 95, capacity: 160, purchaseValue: 45000000, purchaseDate: '2023-01-10', depYear: 14.5 },
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, capacity: 160, purchaseValue: 12000000, purchaseDate: '2022-05-20', depYear: 14.5 },
    { id: 'MC-103', name: 'Összeszerelő Sor B', status: 'Healthy', health: 88, capacity: 320, purchaseValue: 8000000, purchaseDate: '2023-08-15', depYear: 20 }
  ]);

  // 4. Procurement & Invoicing
  const [procurementRequests, setProcurementRequests] = useState([]);
  
  // --- NEW: Finance State ---
  const [transactions, setTransactions] = useState([
    { id: 'TX-001', date: '2024-04-25', account: 'Vevők', type: 'Debit', amount: 1500000, details: 'Számla kiegyenlítés: MÁV-042' },
    { id: 'TX-002', date: '2024-04-26', account: 'Beszállítók', type: 'Credit', amount: 850000, details: 'Alapanyag kifizetés: SteelDirect' },
    { id: 'TX-003', date: '2024-04-27', account: 'Bérek', type: 'Credit', amount: 4200000, details: 'Április havi bérköltség' }
  ]);

  const [balances, setBalances] = useState({
    cash: 25000000,
    ar: 18500000, // Accounts Receivable
    ap: 12400000  // Accounts Payable
  });

  // Calculate Fixed Assets Net Value
  const calculateAssets = () => {
    const currentYear = 2024;
    return machines.map(m => {
      const pDate = new Date(m.purchaseDate);
      const yearsInService = currentYear - pDate.getFullYear();
      const totalDepreciation = (m.purchaseValue * (m.depYear / 100)) * yearsInService;
      const netValue = Math.max(0, m.purchaseValue - totalDepreciation);
      
      return {
        ...m,
        netValue,
        totalDepreciation,
        monthlyDepreciation: (m.purchaseValue * (m.depYear / 100)) / 12
      };
    });
  };

  const [fixedAssets, setFixedAssets] = useState([]);

  useEffect(() => {
    setFixedAssets(calculateAssets());
  }, [machines]);

  const addTransaction = (account, type, amount, details) => {
    const newTx = {
      id: `TX-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      account, type, amount, details
    };
    setTransactions(prev => [newTx, ...prev]);
    
    // Update simple balances
    if (type === 'Debit') setBalances(prev => ({ ...prev, cash: prev.cash + amount }));
    else setBalances(prev => ({ ...prev, cash: prev.cash - amount }));
  };

  return (
    <DataContext.Provider value={{
      products, setProducts, 
      workOrders, setWorkOrders,
      machines, setMachines,
      procurementRequests, setProcurementRequests,
      transactions, addTransaction,
      balances,
      fixedAssets,
      mrpData: [], // Simulated from previous step
      resourceLoading: [], // Simulated from previous step
      forecast: []
    }}>
      {children}
    </DataContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // --- HR & EMPLOYEES ---
  const [employees, setEmployees] = useState([
    { 
      id: 'EMP-001', name: 'Kovács János', role: 'Szenior Hegesztő', department: 'Gyártás', 
      salary: 650000, performance: 94, avatar: 'KJ',
      skills: { welding: 5, cnc: 2, forklift: 4, assembly: 3 },
      leaveBalance: { total: 25, used: 12, sick: 4 },
      certs: [
        { name: 'Minősített Hegesztő', expiry: '2025-06-12', status: 'valid' },
        { name: 'Targonca Jogosítvány', expiry: '2024-05-20', status: 'warning' }
      ]
    },
    { 
      id: 'EMP-002', name: 'Nagy Piroska', role: 'CNC Operátor', department: 'Gyártás', 
      salary: 520000, performance: 88, avatar: 'NP',
      skills: { welding: 1, cnc: 5, forklift: 2, assembly: 2 },
      leaveBalance: { total: 22, used: 5, sick: 0 },
      certs: [{ name: 'CNC Programozó', expiry: '2026-01-15', status: 'valid' }]
    },
    { 
      id: 'EMP-003', name: 'Szabó Ernő', role: 'Minőségellenőr', department: 'Minőségügy', 
      salary: 580000, performance: 97, avatar: 'SZE',
      skills: { welding: 3, cnc: 3, forklift: 1, assembly: 5 },
      leaveBalance: { total: 28, used: 20, sick: 2 },
      certs: [{ name: 'ISO 9001 Auditor', expiry: '2024-12-01', status: 'valid' }]
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-101', empId: 'EMP-001', empName: 'Kovács János', type: 'Fizetett', start: '2024-05-10', end: '2024-05-15', days: 4, status: 'Pending' },
    { id: 'LR-102', empId: 'EMP-002', empName: 'Nagy Piroska', type: 'Betegszabadság', start: '2024-04-20', end: '2024-04-22', days: 2, status: 'Approved' }
  ]);

  const skillDefinitions = [
    { id: 'welding', label: 'Hegesztés' },
    { id: 'cnc', label: 'CNC Kezelés' },
    { id: 'forklift', label: 'Targonca' },
    { id: 'assembly', label: 'Összeszerelés' }
  ];

  // --- OTHERS ---
  const [products, setProducts] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [machines, setMachines] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState({ cash: 25000000, ar: 18500000, ap: 12400000 });
  const [procurementRequests, setProcurementRequests] = useState([]);

  // --- FUNCTIONS ---
  const approveLeave = (reqId) => {
    const request = leaveRequests.find(r => r.id === reqId);
    if (!request) return;

    setLeaveRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
    
    // Update employee balance if it was a paid leave
    if (request.type === 'Fizetett') {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === request.empId) {
          return {
            ...emp,
            leaveBalance: { ...emp.leaveBalance, used: emp.leaveBalance.used + request.days }
          };
        }
        return emp;
      }));
    } else if (request.type === 'Betegszabadság') {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === request.empId) {
              return {
                ...emp,
                leaveBalance: { ...emp.leaveBalance, sick: emp.leaveBalance.sick + request.days }
              };
            }
            return emp;
          }));
    }
  };

  return (
    <DataContext.Provider value={{
      employees, setEmployees, skillDefinitions,
      leaveRequests, setLeaveRequests, approveLeave,
      products, setProducts, workOrders, setWorkOrders, machines, setMachines,
      transactions, setTransactions, balances, setBalances,
      procurementRequests, setProcurementRequests,
      fixedAssets: [], mrpData: [], resourceLoading: [], advanceWorkOrderStage: () => {},
      forecast: []
    }}>
      {children}
    </DataContext.Provider>
  );
};

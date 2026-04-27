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
    { id: 3, name: 'Automata tolóajtó rendszer', category: 'Nyílászáró', price: 450000, stock: 5, minStock: 8, sku: 'RW-DOR-015' },
    { id: 4, name: 'Válaszfal elem (tűzgátló)', category: 'Beltér', price: 85000, stock: 0, minStock: 5, sku: 'RW-PAR-012' },
    { id: 5, name: 'Alumínium profil (2m)', category: 'Nyersanyag', price: 12000, stock: 5, minStock: 50, sku: 'RAW-ALU-02' },
    { id: 6, name: 'Ajtómotor (DC-42)', category: 'Elektronika', price: 89000, stock: 12, minStock: 10, sku: 'RAW-MOT-42' }
  ]);

  // 2. Work Orders (Linked to Machines for Resource Loading)
  const [workOrders, setWorkOrders] = useState([
    { 
      id: 'RW/MO/001', 
      product: 'Automata tolóajtó rendszer', 
      quantity: 5, 
      progress: 40, 
      currentStage: 1,
      status: 'In Progress', 
      startDate: '2024-04-20',
      deadline: '2024-05-10', 
      priority: 'High', 
      machineId: 'MC-101', // Linked to CNC
      estimatedHours: 120,
      bom: [{ item: 'Alumínium profil (2m)', sku: 'RAW-ALU-02', required: 20 }]
    },
    { 
      id: 'RW/MO/002', 
      product: 'Hőszigetelt kocsiablak', 
      quantity: 24, 
      progress: 75, 
      currentStage: 3,
      status: 'In Progress', 
      startDate: '2024-04-15',
      deadline: '2024-04-30', 
      priority: 'Medium', 
      machineId: 'MC-102', // Linked to Press
      estimatedHours: 80,
      bom: [{ item: 'PVC keret profil', sku: 'RAW-PVC-01', required: 48 }]
    },
    { 
      id: 'RW/MO/003', 
      product: 'Válaszfal elem (tűzgátló)', 
      quantity: 12, 
      progress: 10, 
      currentStage: 0,
      status: 'Pending', 
      startDate: '2024-05-02',
      deadline: '2024-05-20', 
      priority: 'Low', 
      machineId: 'MC-101', // Linked to CNC
      estimatedHours: 45,
      bom: [{ item: 'Alumínium profil (2m)', sku: 'RAW-ALU-02', required: 12 }]
    },
    { 
      id: 'RW/MO/004', 
      product: 'Egyedi Világítás Modul', 
      quantity: 50, 
      progress: 0, 
      currentStage: 0,
      status: 'Pending', 
      startDate: '2024-05-15',
      deadline: '2024-06-05', 
      priority: 'Medium', 
      machineId: 'MC-103', // Linked to Assembly
      estimatedHours: 200,
      bom: []
    }
  ]);

  // 3. Machines State
  const [machines, setMachines] = useState([
    { id: 'MC-101', name: 'Alumínium Profilvágó CNC', status: 'Healthy', health: 95, capacity: 160 }, // 160h/month
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, capacity: 160 },
    { id: 'MC-103', name: 'Összeszerelő Sor B', status: 'Healthy', health: 88, capacity: 320 }
  ]);

  const [procurementRequests, setProcurementRequests] = useState([]);
  const [comments, setComments] = useState({});
  const [notifications, setNotifications] = useState([]);

  // MRP Logic
  const calculateMRP = () => {
    const aggregateRequirements = {};
    workOrders.filter(wo => wo.status !== 'Completed').forEach(wo => {
      wo.bom.forEach(item => {
        if (!aggregateRequirements[item.sku]) {
          aggregateRequirements[item.sku] = { sku: item.sku, name: item.item, required: 0, orders: [] };
        }
        aggregateRequirements[item.sku].required += item.required;
        aggregateRequirements[item.sku].orders.push(wo.id);
      });
    });

    return Object.values(aggregateRequirements).map(req => {
      const product = products.find(p => p.sku === req.sku);
      const stock = product ? product.stock : 0;
      const shortage = Math.max(0, req.required - stock);
      return { ...req, stock, shortage, status: shortage > 0 ? 'Shortage' : 'Available', recommendation: shortage > 0 ? `Beszerzés javasolt: ${shortage} db` : 'Készlet rendben' };
    });
  };

  // Resource Loading Logic
  const calculateResourceLoading = () => {
    return machines.map(m => {
      const machineOrders = workOrders.filter(wo => wo.machineId === m.id && wo.status !== 'Completed');
      const loadedHours = machineOrders.reduce((acc, curr) => acc + curr.estimatedHours, 0);
      const percentage = Math.round((loadedHours / m.capacity) * 100);
      
      return {
        ...m,
        loadedHours,
        percentage,
        orderCount: machineOrders.length,
        alert: percentage > 100
      };
    });
  };

  const [mrpData, setMrpData] = useState([]);
  const [resourceLoading, setResourceLoading] = useState([]);

  useEffect(() => { 
    setMrpData(calculateMRP()); 
    setResourceLoading(calculateResourceLoading());
  }, [workOrders, products, machines]);

  const addComment = (entityId, text, user = 'Simon Ernő', role = 'Management') => {
    const newComment = { id: Date.now(), user, text, time: new Date().toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }), role };
    setComments(prev => ({ ...prev, [entityId]: [...(prev[entityId] || []), newComment] }));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DataContext.Provider value={{
      products, setProducts, 
      workOrders, setWorkOrders,
      machines, setMachines,
      procurementRequests, setProcurementRequests,
      comments, addComment,
      notifications, markNotificationAsRead,
      mrpData,
      resourceLoading,
      forecast: [
        { month: 'Május', demand: 450, stock: 400, alert: true },
        { month: 'Június', demand: 380, stock: 520, alert: false },
        { month: 'Július', demand: 520, stock: 480, alert: true }
      ]
    }}>
      {children}
    </DataContext.Provider>
  );
};

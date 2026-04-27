import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const getDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  };

  const railParts = [
    'Forgóváz keret (Acél)', 'Kerékpár tengely', 'Tárcsafék betét készlet', 'Pantográf (Áramszedő) egység',
    'Vészfék szelep modul', 'Utastájékoztató LED monitor', 'Beltéri világítás panel', 'Ülésváz szerkezet',
    'Kapaszkodó rúd (Inox)', 'Klíma kompresszor (HVAC)', 'Vezetőállás kijelző modul', 'Scharfenberg kuplung',
    'Homokoló berendezés', 'Ajtóműködtető pneumatika', 'Hőszigetelt ablakpanel', 'Hangosbemondó hangszóró',
    'USB töltőmodul', 'Tűzjelző szenzor', 'Vákuumos WC egység', 'Akkumulátor láda',
    'Hajtómű ház', 'Vezérlő kábelkorbács', 'Relészekrény modul', 'Sűrített levegő tartály',
    'Oldalfal burkolat', 'Padló alatti inverter', 'Tetőszerkezeti elem', 'Vízszintes lengéscsillapító',
    'Sínfék mágnes', 'Váltóvezérlő elektronika', 'Antenna modul (GPS/GSM-R)', 'Padlófűtés elem',
    'Utas számláló szenzor', 'Légrugó membrán', 'Vésznyitó fogantyú', 'Belső tükör (Vezetői)',
    'Hűtőventilátor egység', 'Áramátalakító (DC/AC)', 'Fényvisszaverő matrica készlet', 'Zárószerkezet (Automata)'
  ];

  const hungarianNames = [
    'Kovács János', 'Nagy Péter', 'Szabó Anna', 'Tóth Béla', 'Molnár Ákos', 'Varga Edit', 'Horváth Gábor',
    'Balogh Zsolt', 'Kerekes Lajos', 'Fekete Pál', 'Simon László', 'Kiss Mónika', 'Farkas Tamás',
    'Juhász Zoltán', 'Takács Eszter', 'Mészáros Attila', 'Papp Gergely', 'Gulyás Márta', 'Sipos Tibor',
    'Somogyi Endre', 'Vass Gábor', 'Németh Zoltán', 'Kovács Melinda', 'Bíró István', 'Gál Ferenc'
  ];

  const partners = ['Stadler Rail AG', 'Siemens Mobility', 'Knorr-Bremse', 'Bombardier', 'MÁV-Start', 'GYSEV', 'Alu-Pro Kft.', 'Elektro-Vasút Kft.'];

  const [products, setProducts] = useState(
    railParts.map((name, i) => ({
      id: i + 1,
      name,
      category: i < 10 ? 'Mechanika' : i < 20 ? 'Elektronika' : i < 30 ? 'Beltér' : 'Egyéb',
      price: Math.floor(Math.random() * 450000) + 15000,
      stock: Math.floor(Math.random() * 80) + 5,
      minStock: 15,
      sku: `RW-PRT-${1000 + i}`,
      abc: i < 5 ? 'A' : i < 15 ? 'B' : 'C',
      location: `A-szektor, 0${(i % 9) + 1}-C polc`,
      trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 10),
      batches: [{ id: `B-${2000 + i}`, qty: 10, expiry: '2026-06-01', status: 'Passed' }],
      history: []
    }))
  );

  const [workOrders, setWorkOrders] = useState(
    Array.from({ length: 35 }, (_, i) => ({
      id: `RW/MO/${2024}/${String(i + 1).padStart(3, '0')}`,
      product: railParts[i % railParts.length],
      quantity: Math.floor(Math.random() * 15) + 2,
      progress: i % 4 === 0 ? 100 : Math.floor(Math.random() * 95),
      currentStage: Math.floor(Math.random() * 4),
      status: i % 4 === 0 ? 'Completed' : 'In Progress',
      startDate: getDate(i + 5),
      deadline: getDate(i - 10),
      priority: i % 5 === 0 ? 'High' : 'Medium',
      machineId: `MC-10${(i % 3) + 1}`,
      technician: hungarianNames[i % hungarianNames.length],
      bom: [{ item: 'Alapanyag profil', sku: 'RAW-ALU-01', required: 20 }]
    }))
  );

  const [employees, setEmployees] = useState(
    Array.from({ length: 40 }, (_, i) => ({
      id: `EMP-${200 + i}`,
      name: hungarianNames[i % hungarianNames.length] + (i > 24 ? ` (Jr.)` : ''),
      role: i % 5 === 0 ? 'Csoportvezető' : i % 3 === 0 ? 'Mérnök' : 'Technikus',
      department: ['Gyártás', 'QA', 'Logisztika', 'HR', 'Pénzügy'][i % 5],
      salary: Math.floor(Math.random() * 400000) + 450000,
      performance: Math.floor(Math.random() * 20) + 80,
      avatar: hungarianNames[i % hungarianNames.length].split(' ').map(n => n[0]).join(''),
      skills: { welding: 4, cnc: 3 },
      leaveBalance: { total: 25, used: Math.floor(Math.random() * 15) + 5, sick: 1 },
      certs: ['ISO 9001 Expert', 'Szakmai Hegesztő']
    }))
  );

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-101', empId: 'EMP-200', empName: 'Kovács János', type: 'Fizetett', start: getDate(-2), end: getDate(-7), days: 5, status: 'Approved' },
    { id: 'LR-102', empId: 'EMP-201', empName: 'Nagy Péter', type: 'Betegszabadság', start: getDate(0), end: getDate(-3), days: 3, status: 'Approved' },
    { id: 'LR-103', empId: 'EMP-202', empName: 'Szabó Anna', type: 'Fizetett', start: getDate(-1), end: getDate(-5), days: 4, status: 'Approved' },
    { id: 'LR-104', empId: 'EMP-203', empName: 'Tóth Béla', type: 'Fizetett', start: getDate(-10), end: getDate(-15), days: 5, status: 'Pending' },
    { id: 'LR-105', empId: 'EMP-204', empName: 'Molnár Ákos', type: 'Apasági', start: getDate(-12), end: getDate(-20), days: 8, status: 'Pending' },
    { id: 'LR-106', empId: 'EMP-205', empName: 'Varga Edit', type: 'Fizetett', start: getDate(2), end: getDate(-3), days: 5, status: 'Approved' }
  ]);

  const [transactions, setTransactions] = useState(
    Array.from({ length: 50 }, (_, i) => ({
      id: `TRX-${7000 + i}`,
      date: getDate(i % 25),
      account: i % 3 === 0 ? '381 (Pénztár)' : i % 3 === 1 ? '311 (Vevők)' : '454 (Szállítók)',
      details: i % 2 === 0 ? `${partners[i % partners.length]} - Anyagköltség` : `${partners[i % partners.length]} - Elszámolt projektköltség`,
      type: i % 2 === 0 ? 'Credit' : 'Debit',
      amount: Math.floor(Math.random() * 2500000) + 50000
    }))
  );

  const [balances, setBalances] = useState({ cash: 42000000, ar: 15600000, ap: 9200000 });

  const [inspections, setInspections] = useState(
    Array.from({ length: 40 }, (_, i) => ({
      id: `INS-24-${100 + i}`,
      product: railParts[i % railParts.length],
      type: i % 2 === 0 ? 'Végátvétel (FQC)' : 'Soron közbeni (IPQC)',
      technician: hungarianNames[(i + 5) % hungarianNames.length],
      status: i % 12 === 0 ? 'Failed' : 'Passed',
      date: getDate(i % 15)
    }))
  );

  const [ncrs, setNcrs] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: `NCR-2024-${80 + i}`,
      title: `${railParts[i % railParts.length]} - ${i % 2 === 0 ? 'Méretbeli eltérés' : 'Felületi hiba'}`,
      source: i % 3 === 0 ? 'Gyártás' : 'Beszállítói',
      severity: i % 6 === 0 ? 'High' : 'Medium',
      status: i % 5 === 0 ? 'Closed' : 'Open',
      date: getDate(i % 20),
      description: `Az ellenőrzés során megállapított nem-megfelelőség a(z) ${railParts[i % railParts.length]} alkatrésznél.`
    }))
  );

  const [procurementOrders, setProcurementOrders] = useState(
    Array.from({ length: 35 }, (_, i) => ({
      id: `PO/2024/${500 + i}`,
      supplier: partners[i % partners.length],
      date: getDate(i % 30),
      total: Math.floor(Math.random() * 4500000) + 200000,
      status: i % 6 === 0 ? 'Delivered' : 'Ordered',
      category: i % 2 === 0 ? 'Alkatrész' : 'Alapanyag',
      approvalStep: 3,
      rating: 4.5,
      scores: { quality: 95, delivery: 90, price: 85, responsiveness: 92, innovation: 80 },
      items: [{ name: railParts[i % railParts.length], qty: 10, price: 150000 }]
    }))
  );

  const [procurementRequests, setProcurementRequests] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Készlethiány', message: 'RW-PRT-1002 készlete kritikus szinten.', time: '10 perce', severity: 'warning' },
    { id: 2, title: 'Sürgős NCR', message: 'NCR-2024-082 kivizsgálásra vár.', time: '1 órája', severity: 'danger' }
  ]);
  const [comments, setComments] = useState({});

  const [machines, setMachines] = useState([
    { id: 'MC-101', name: 'CNC Megmunkáló Központ', status: 'Healthy', health: 95, capacity: 160, purchaseValue: 45000000, purchaseDate: '2023-01-10', depYear: 14.5 },
    { id: 'MC-102', name: 'Hidraulikus Prés', status: 'Warning', health: 62, capacity: 160, purchaseValue: 12000000, purchaseDate: '2022-05-20', depYear: 14.5 },
    { id: 'MC-103', name: 'Lézerhegesztő Robot', status: 'Healthy', health: 92, capacity: 160, purchaseValue: 32000000, purchaseDate: '2023-08-15', depYear: 14.5 }
  ]);

  const approveLeave = (id) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
  };

  return (
    <DataContext.Provider value={{
      products, setProducts, workOrders, setWorkOrders, machines, setMachines,
      employees, setEmployees, transactions, setTransactions, balances, setBalances,
      inspections, setInspections, ncrs, setNcrs,
      procurementOrders, setProcurementOrders, procurementRequests, setProcurementRequests,
      notifications, setNotifications, comments, setComments, leaveRequests, setLeaveRequests, approveLeave,
      mrpData: products.map(p => ({ ...p, required: p.stock < p.minStock ? 50 : 0, shortage: 0, status: 'Available', orders: [] })),
      resourceLoading: machines.map(m => ({ ...m, percentage: 75, loadedHours: 40, orderCount: 5, alert: false })),
      fixedAssets: machines.map(m => ({ ...m, netValue: m.purchaseValue * 0.8, totalDepreciation: m.purchaseValue * 0.2, monthlyDepreciation: m.purchaseValue / 120 })),
      skillDefinitions: [{ id: 'welding', label: 'Hegesztés' }, { id: 'cnc', label: 'CNC Megmunkálás' }],
      leaveRequests,
      advanceWorkOrderStage: () => {},
      getBomStatus: () => [{ item: 'Acél profil', status: 'ok', available: 100 }],
      forecast: Array.from({ length: 6 }, (_, i) => ({ month: `${i+1}. hónap`, demand: 120, stock: 150, alert: false }))
    }}>
      {children}
    </DataContext.Provider>
  );
};

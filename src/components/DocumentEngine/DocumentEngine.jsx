import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  X, 
  FileCheck, 
  PieChart, 
  Cpu, 
  ChevronRight,
  Search,
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';
import './DocumentEngine.css';

const DocumentEngine = ({ addToast }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const reportTemplates = [
    { id: 'INV-TEMP', title: 'Hivatalos Számla Sablon', type: 'Finance', icon: <FileText size={20} />, color: '#3498db' },
    { id: 'AI-STRAT', title: 'AI Stratégiai Havi Jelentés', type: 'Intelligence', icon: <Cpu size={20} />, color: '#9b59b6' },
    { id: 'PRD-SHEET', title: 'Gyártási Munkarend (Daily)', type: 'Manufacturing', icon: <Printer size={20} />, color: '#e67e22' },
    { id: 'INV-AUDIT', title: 'Készlet Audit Riport', type: 'Inventory', icon: <PieChart size={20} />, color: '#2ecc71' }
  ];

  const recentDocs = [
    { id: 'DOC-1024', name: 'MÁV-START Áprilisi Számla', date: '2024-04-20', status: 'Generated' },
    { id: 'DOC-1025', name: 'OEE Hatékonysági Riport Q1', date: '2024-04-22', status: 'Archived' },
    { id: 'DOC-1026', name: 'Logisztikai Költségterv v2', date: '2024-04-23', status: 'Generated' }
  ];

  const openPreview = (doc) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleExport = (type) => {
    addToast(`${type} generálása folyamatban...`, 'info');
    setTimeout(() => {
      addToast('Dokumentum elkészült és letölthető!', 'success');
      window.print(); // Native print trigger for demonstration
    }, 1500);
  };

  return (
    <div className="doc-engine-module">
      <div className="invoicing-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="module-icon-container" style={{ background: 'rgba(52, 152, 219, 0.1)', color: '#3498db', padding: '12px', borderRadius: '12px' }}>
            <FileCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Riport- és Dokumentumközpont</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Hivatalos iratok, PDF exportok és AI elemzések kezelése</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
           <div className="search-box glass" style={{ display: 'flex', alignItems: 'center', padding: '0 15px', borderRadius: '10px', height: '45px' }}>
             <Search size={18} className="text-muted" />
             <input type="text" placeholder="Dokumentum keresése..." style={{ background: 'transparent', border: 'none', color: 'white', paddingLeft: '10px', outline: 'none' }} />
           </div>
        </div>
      </div>

      <div className="doc-engine-grid">
        <div className="templates-section">
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Riport Sablonok</h3>
          <div className="template-grid">
            {reportTemplates.map(t => (
              <div key={t.id} className="template-card glass" onClick={() => openPreview(t)}>
                <div style={{ padding: '15px', background: `${t.color}15`, color: t.color, borderRadius: '12px', marginBottom: '15px', width: 'fit-content' }}>
                  {t.icon}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '5px' }}>{t.title}</h4>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>{t.type} Module</p>
                <div className="template-hover-action">
                   <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>

          <div className="recent-docs-section glass" style={{ marginTop: '30px', padding: '25px', borderRadius: '24px' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>Legutóbb Generált Iratok</h3>
             <div className="docs-list">
                {recentDocs.map(doc => (
                  <div key={doc.id} className="doc-list-item">
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                       <div className="doc-type-icon"><FileText size={16} /></div>
                       <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{doc.name}</p>
                          <p className="text-muted" style={{ fontSize: '0.7rem' }}>{doc.id} • {doc.date}</p>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                       <button className="icon-btn-small" onClick={() => openPreview(doc)}><Eye size={14} /></button>
                       <button className="icon-btn-small" onClick={() => handleExport('PDF')}><Download size={14} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="doc-stats-sidebar">
           <div className="stat-card-mini glass">
              <p className="text-muted" style={{ fontSize: '0.7rem' }}>Havi Riportok</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>42 <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>+12%</span></div>
           </div>
           <div className="stat-card-mini glass" style={{ marginTop: '15px' }}>
              <p className="text-muted" style={{ fontSize: '0.7rem' }}>Tárhely Használat</p>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>2.4 <span style={{ fontSize: '0.8rem' }}>GB</span></div>
              <div className="mini-progress"><div style={{ width: '45%' }}></div></div>
           </div>
           
           <div className="ai-report-suggest glass" style={{ marginTop: '30px', padding: '20px', borderRadius: '20px', border: '1px solid rgba(155, 89, 182, 0.3)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9b59b6', marginBottom: '10px' }}>AI Riport Javaslat</h4>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '15px' }}>Az Oracle szerint érdemes lenne generálni egy "Költség-Haszon Elemzést" a Stadler projekt aktuális állásáról.</p>
              <button className="create-btn-small" style={{ background: '#9b59b6', width: '100%' }}>Riport Kérése</button>
           </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="doc-preview-overlay">
          <div className="doc-preview-modal glass">
            <div className="preview-header">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText color="var(--primary-color)" />
                  <span style={{ fontWeight: 800 }}>DOKUMENTUM ELŐNÉZET</span>
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="icon-btn" onClick={() => window.print()} title="Nyomtatás"><Printer size={18} /></button>
                  <button className="icon-btn" onClick={() => handleExport('PDF')} title="Letöltés"><Download size={18} /></button>
                  <button className="icon-btn close" onClick={() => setIsPreviewOpen(false)}><X size={18} /></button>
               </div>
            </div>
            
            <div className="a4-document">
               <div className="doc-header">
                  <div className="doc-logo">
                     <div className="logo-symbol">RP</div>
                     <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px' }}>RAILPARTS</h2>
                        <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.7 }}>Enterprise Resource Planning</p>
                     </div>
                  </div>
                  <div className="doc-info-meta">
                     <p><strong>Sorszám:</strong> {selectedDoc?.id || 'RP-DOC-2024-001'}</p>
                     <p><strong>Dátum:</strong> 2024. április 24.</p>
                  </div>
               </div>

               <div className="doc-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                     <div className="doc-party">
                        <p className="party-label">KIBOCSÁTÓ</p>
                        <p><strong>RailParts Ltd.</strong></p>
                        <p>Simon Ernő - Ügyvezető</p>
                        <p>1055 Budapest, Falk Miksa u. 12.</p>
                        <p>Adószám: 12345678-2-41</p>
                     </div>
                     <div className="doc-party" style={{ textAlign: 'right' }}>
                        <p className="party-label">CÍMZETT / ÜGYFÉL</p>
                        <p><strong>MÁV-START Zrt.</strong></p>
                        <p>Beszerzési Osztály</p>
                        <p>1087 Budapest, Könyves Kálmán krt. 54-60.</p>
                     </div>
                  </div>

                  <h1 className="doc-title">{selectedDoc?.title || 'HIVATALOS DOKUMENTUM'}</h1>

                  <table className="doc-table">
                     <thead>
                        <tr>
                           <th>Leírás</th>
                           <th style={{ textAlign: 'center' }}>Mennyiség</th>
                           <th style={{ textAlign: 'right' }}>Egységár</th>
                           <th style={{ textAlign: 'right' }}>Összesen</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>MÁV-START Kocsi Felújítás - Fázis 1 (Sliver-Line)</td>
                           <td style={{ textAlign: 'center' }}>1 db</td>
                           <td style={{ textAlign: 'right' }}>15.000.000 Ft</td>
                           <td style={{ textAlign: 'right' }}>15.000.000 Ft</td>
                        </tr>
                        <tr>
                           <td>Technikai Tanácsadás és Mérnöki Óradíj</td>
                           <td style={{ textAlign: 'center' }}>120 óra</td>
                           <td style={{ textAlign: 'right' }}>25.000 Ft</td>
                           <td style={{ textAlign: 'right' }}>3.000.000 Ft</td>
                        </tr>
                     </tbody>
                     <tfoot>
                        <tr>
                           <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700 }}>NETTÓ ÖSSZESEN:</td>
                           <td style={{ textAlign: 'right', fontWeight: 800 }}>18.000.000 Ft</td>
                        </tr>
                        <tr>
                           <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700 }}>ÁFA (27%):</td>
                           <td style={{ textAlign: 'right', fontWeight: 800 }}>4.860.000 Ft</td>
                        </tr>
                        <tr className="total-row">
                           <td colSpan="3" style={{ textAlign: 'right', fontWeight: 900 }}>BRUTTÓ FIZETENDŐ:</td>
                           <td style={{ textAlign: 'right', fontWeight: 900, color: 'var(--primary-color)' }}>22.860.000 Ft</td>
                        </tr>
                     </tfoot>
                  </table>

                  <div className="doc-footer-notes">
                     <p><strong>Megjegyzés:</strong> A kifizetés határideje a teljesítést követő 15 naptári nap. Kérjük, az utalás közleményében tüntessék fel a bizonylatszámot.</p>
                  </div>
               </div>

               <div className="doc-signature">
                  <div className="sig-line">
                     <p className="sig-name">Simon Ernő</p>
                     <p className="sig-title">Ügyvezető Igazgató</p>
                  </div>
                  <div className="sig-stamp">
                     <div className="stamp-inner">RP</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEngine;

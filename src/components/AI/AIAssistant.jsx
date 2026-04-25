import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, X, Send, Brain, AlertTriangle, CheckCircle2, ChevronRight, 
  BarChart2, Package, Coins, Loader2, Slash
} from 'lucide-react';
import aiService from '../../services/AIService';
import auditLogService from '../../services/AuditLogService';
import './AIAssistant.css';

const COMMANDS = [
  { trigger: '/készlet', label: 'Készlethiány előrejelzés', icon: <Package size={16} /> },
  { trigger: '/költség', label: 'Költségelemzés futtatása', icon: <Coins size={16} /> },
  { trigger: '/selejt', label: 'Selejt mutatók lekérése', icon: <BarChart2 size={16} /> }
];

const AIAssistant = ({ addToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [insights, setInsights] = useState([]);
  const [showCommands, setShowCommands] = useState(false);
  const [executingInsight, setExecutingInsight] = useState(null);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: 'Üdvözöllek! Én vagyok az ERP Copilot. Folyamatosan elemzem a rendszert a háttérben. Gépelj egy "/"-t a gyorsparancsokhoz!',
      hasInsights: true
    }
  ]);

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // Értesítések betöltése
    const currentInsights = aiService.getInsights();
    setInsights(currentInsights);
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, insights]);

  // Handle Slash Commands
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    if (val === '/') {
      setShowCommands(true);
    } else if (!val.startsWith('/')) {
      setShowCommands(false);
    }
  };

  const selectCommand = (cmd) => {
    setInputVal(cmd.trigger + ' ');
    setShowCommands(false);
    document.getElementById('ai-input').focus();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputVal };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputVal;
    setInputVal('');
    setShowCommands(false);
    setIsTyping(true);

    // Különleges parancsok kezelése
    setTimeout(() => {
      let responseText = 'Vettem! Mivel még béta fázisban vagyok, ajánlom az előkészített insight-ok használatát.';
      
      if (currentInput.startsWith('/készlet')) {
        responseText = 'Elemzem a nyersanyagokat... A jelenlegi gyártási ütemterv mellett a "Szénszálas lapok" 4 napon belül kritikus szintre csökkennek. Szeretnéd, ha generálnék egy beszerzési rendelést (PO)?';
      } else if (currentInput.startsWith('/költség')) {
        responseText = 'A múlt havi teljesítési adatok alapján az alapanyag-költségek az átlaghoz képest 4.2%-ot nőttek a 3-as gyáregységben.';
      } else if (currentInput.startsWith('/selejt')) {
        responseText = 'A hegesztőrobot (Sor-A) hibaaránya tegnap óta +1.5%. Karbantartási jegy generálása ajánlott.';
      }

      const gptResponse = { id: Date.now() + 1, sender: 'system', text: responseText };
      setMessages(prev => [...prev, gptResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const executeInsight = (insight) => {
    // 1. Felhasználói üzenet
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `Hajtsd végre: "${insight.recommendation}"` }]);
    setExecutingInsight(insight.id);
    setIsTyping(false); // Spinner megy a kártyán belül
    
    // 2. Szimulált háttérfolyamat (2 mp)
    setTimeout(() => {
      auditLogService.log({
        user: 'AI Copilot',
        action: 'Automatikus Művelet (Insight)',
        module: insight.type.toUpperCase(),
        details: `Végrehajtva: ${insight.recommendation}`,
        severity: 'success'
      });
      
      setInsights(prev => prev.filter(i => i.id !== insight.id));
      setExecutingInsight(null);
      
      const successMessage = {
        id: Date.now() + 1,
        sender: 'system',
        text: `✅ Kész! Az akció (${insight.recommendation}) sikeresen lefutott a(z) ${insight.type.toUpperCase()} modulban. Megtekintheted az Audit Logban.`
      };
      setMessages(prev => [...prev, successMessage]);
      
      if (addToast) addToast('AI Művelet sikeresen végrehajtva', 'success');
    }, 2000);
  };

  const getSeverityIcon = (sev) => {
    if (sev === 'high') return <AlertTriangle size={18} color="#e74c3c" />;
    if (sev === 'warning') return <AlertTriangle size={18} color="#f1c40f" />;
    return <CheckCircle2 size={18} color="var(--primary-color)" />;
  };

  return (
    <>
      <button className={`ai-fab ${insights.length > 0 && !isOpen ? 'has-insights' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={26} /> : <Sparkles size={26} />}
        {!isOpen && insights.length > 0 && <span className="ai-badge">{insights.length}</span>}
      </button>

      {isOpen && (
        <div className="ai-panel">
          <div className="ai-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(113, 75, 103, 0.1)', padding: '8px', borderRadius: '12px' }}>
                 <Brain size={24} color="var(--primary-color)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Smart ERP Copilot</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%' }}></div>
                  <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Rendszer elemzése aktív</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ai-panel-body">
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <div className={`ai-message ${msg.sender}`}>
                  <div className="ai-bubble">
                    {msg.text}
                  </div>
                </div>
                
                {/* Dinamikus Insight Kártyák */}
                {msg.hasInsights && insights.map(insight => (
                  <div key={insight.id} className={`ai-insight-card insight-${insight.severity}`}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                       {getSeverityIcon(insight.severity)}
                       <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{insight.title}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{insight.description}</p>
                    
                    <button 
                      className="ai-action-btn"
                      onClick={() => executeInsight(insight)}
                      disabled={executingInsight === insight.id}
                    >
                       <span>{executingInsight === insight.id ? 'Végrehajtás folyamatban...' : insight.recommendation}</span>
                       {executingInsight === insight.id ? (
                          <Loader2 size={16} className="spin-animation" style={{ animation: 'spin 1.5s linear infinite' }} />
                       ) : (
                          <ChevronRight size={16} />
                       )}
                    </button>
                  </div>
                ))}
              </React.Fragment>
            ))}
            
            {isTyping && (
              <div className="ai-message system">
                 <div className="ai-typing">
                   <span className="dot"></span>
                   <span className="dot"></span>
                   <span className="dot"></span>
                 </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
          
          <form className="ai-panel-footer" onSubmit={handleSend}>
            {/* Slash Command Suggester Popup */}
            {showCommands && (
               <div className="ai-command-menu">
                  <div style={{ padding: '4px 10px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>GYORSPARANCSOK</div>
                  {COMMANDS.map((cmd, idx) => (
                     <div key={idx} className="ai-command-item" onClick={() => selectCommand(cmd)}>
                        <span style={{ color: 'var(--primary-color)' }}>{cmd.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: '0.8rem', width: '65px' }}>{cmd.trigger}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cmd.label}</span>
                     </div>
                  ))}
               </div>
            )}

            <div className="ai-input-group">
              <span style={{ padding: '10px 5px 10px 15px', color: 'var(--text-muted)' }}><Slash size={16} /></span>
              <input 
                id="ai-input"
                type="text" 
                placeholder="Gépelj egy '/'-t a gyorsparancsokhoz..." 
                value={inputVal}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <button type="submit" className="ai-send-btn" disabled={isTyping || (!inputVal.trim() && !executingInsight)}>
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;

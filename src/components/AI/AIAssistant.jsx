import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Brain, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import aiService from '../../services/AIService';
import auditLogService from '../../services/AuditLogService';
import './AIAssistant.css';

const AIAssistant = ({ addToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [insights, setInsights] = useState([]);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: 'Üdvözöllek! Én vagyok a RailParts okos-asszisztense. Folyamatosan elemzem a rendszert a háttérben. Jelenleg a következő kritikus riasztásokat találtam az ERP-ben:'
    }
  ]);

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // Initial load of insights from the AI service
    const currentInsights = aiService.getInsights();
    setInsights(currentInsights);
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputVal };
    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const gptResponse = {
        id: Date.now() + 1,
        sender: 'system',
        text: 'Vettem az üzenetedet! Mivel én még csak egy prototípus Copilot vagyok, a fenti "Művelet Végrehajtása" gombokkal tudok egyelőre magabiztosan dolgozni. Ezt az adatot lefűzöm a kontextusomba!'
      };
      setMessages(prev => [...prev, gptResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const executeInsight = (insight) => {
    // Show user clicked it
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `Kérlek hajtsd végre a javaslatot: "${insight.recommendation}"` }]);
    setInsights(prev => prev.filter(i => i.id !== insight.id));
    setIsTyping(true);

    setTimeout(() => {
      auditLogService.log({
        user: 'AI Copilot',
        action: 'Automatikus Művelet',
        module: insight.type.toUpperCase(),
        details: `Az AI végrehajtotta a következő akciót: ${insight.recommendation}`,
        severity: 'success'
      });
      
      const successMessage = {
        id: Date.now() + 1,
        sender: 'system',
        text: `Kész! Sikeresen végrehajtottam a műveletet a(z) ${insight.type.toUpperCase()} modulban. Létrehoztam az audit bejegyzést is.`
      };
      setMessages(prev => [...prev, successMessage]);
      setIsTyping(false);
      
      if (addToast) {
         addToast('AI Művelet sikeresen végrehajtva', 'success');
      }
    }, 2000);
  };

  const getSeverityIcon = (sev) => {
    if (sev === 'high') return <AlertTriangle size={16} color="#e74c3c" />;
    if (sev === 'warning') return <AlertTriangle size={16} color="#f1c40f" />;
    return <CheckCircle2 size={16} color="#2ecc71" />;
  };

  return (
    <>
      <button className="ai-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        {!isOpen && insights.length > 0 && <span className="ai-badge">{insights.length}</span>}
      </button>

      {isOpen && (
        <div className="ai-panel">
          <div className="ai-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={20} color="var(--primary-color)" />
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Smart ERP Copilot</h3>
                <p className="text-muted" style={{ fontSize: '0.7rem' }}>Online • Elemzés folyamatban</p>
              </div>
            </div>
          </div>
          
          <div className="ai-panel-body">
            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <div className={`ai-message ${msg.sender}`}>
                  <div className="ai-bubble">
                    {msg.text}
                  </div>
                </div>
                
                {/* Ha ez volt az első rendszerüzenet, listázzuk ki alá az insightokat kártyaként */}
                {index === 0 && msg.sender === 'system' && insights.map(insight => (
                  <div key={insight.id} className={`ai-insight-card insight-${insight.severity}`}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                       {getSeverityIcon(insight.severity)}
                       <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{insight.title}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-color)', opacity: 0.9 }}>{insight.description}</p>
                    <button 
                      onClick={() => executeInsight(insight)}
                      style={{ 
                        marginTop: '5px', background: 'var(--bg-color)', color: 'var(--text-color)',
                        border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}>
                       <span>{insight.recommendation}</span>
                       <ChevronRight size={14} />
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
            <div className="ai-input-group">
              <input 
                type="text" 
                placeholder="Rendelj 50 plusz ablakot..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button type="submit" className="ai-send-btn" disabled={isTyping || !inputVal.trim()}>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;

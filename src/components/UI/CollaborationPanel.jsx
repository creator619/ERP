import React, { useState } from 'react';
import { Send, MessageSquare, Clock, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import './CollaborationPanel.css';

const CollaborationPanel = ({ entityId }) => {
  const { comments, addComment } = useData();
  const [inputText, setInputText] = useState('');
  
  const entityComments = comments[entityId] || [];

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    
    addComment(entityId, inputText);
    setInputText('');
  };

  return (
    <div className="collab-panel">
      <div className="collab-header">
        <MessageSquare size={18} />
        <h4>Belső Egyeztetés ({entityComments.length})</h4>
      </div>
      
      <div className="collab-messages">
        {entityComments.length > 0 ? (
          entityComments.map((msg) => (
            <div key={msg.id} className={`collab-msg ${msg.user === 'Simon Ernő' ? 'own' : ''}`}>
              <div className="msg-info">
                <span className="msg-user">{msg.user}</span>
                <span className="msg-role">{msg.role}</span>
                <span className="msg-time">{msg.time}</span>
              </div>
              <div className="msg-bubble">
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <div className="collab-empty">
            <MessageSquare size={32} style={{ opacity: 0.1, marginBottom: '10px' }} />
            <p>Nincs még hozzászólás.</p>
            <p className="text-muted" style={{ fontSize: '0.7rem' }}>Kezdje el a beszélgetést a lenti mezővel!</p>
          </div>
        )}
      </div>
      
      <form className="collab-input" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Írjon üzenetet a csapatnak..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" disabled={!inputText.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default CollaborationPanel;

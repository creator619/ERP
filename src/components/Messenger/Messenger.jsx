import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  Info
} from 'lucide-react';
import './Messenger.css';

const Messenger = ({ addToast }) => {
  const [activeContact, setActiveContact] = useState(1);
  const [message, setMessage] = useState('');

  const contacts = [
    { id: 1, name: 'Kovács János', role: 'IT Admin', status: 'online', avatar: 'KJ' },
    { id: 2, name: 'Nagy Péter', role: 'Gyártásvezető', status: 'offline', avatar: 'NP' },
    { id: 3, name: 'Szabó Anna', role: 'Értékesítés', status: 'online', avatar: 'SZA' },
    { id: 4, name: 'Molnár Emese', role: 'HR', status: 'online', avatar: 'ME' },
  ];

  const messages = [
    { id: 1, text: 'Szia Anna! Megnézted a Stadler projekt új rajzait?', time: '10:15', sent: true },
    { id: 2, text: 'Szia! Igen, éppen most töltöttem fel a Dokumentáció fülre.', time: '10:17', sent: false },
    { id: 3, text: 'Szuper, köszi! Akkor indítom a gyártási előkészítést.', time: '10:18', sent: true },
    { id: 4, text: 'Rendben, szólj ha kell még valami.', time: '10:20', sent: false },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      addToast('Üzenet elküldve', 'success');
      setMessage('');
    }
  };

  const activeUser = contacts.find(c => c.id === activeContact);

  return (
    <div className="messenger-module">
      <div className="messenger-container">
        <div className="contacts-list glass">
          <div className="contacts-header">
            <h3>Üzenetek</h3>
            <div className="search-bar" style={{ width: '100%', padding: '8px 12px' }}>
              <Search size={16} className="text-muted" />
              <input type="text" placeholder="Keresés..." style={{ fontSize: '0.85rem' }} />
            </div>
          </div>
          <div className="contacts-body">
            {contacts.map(c => (
              <div 
                key={c.id} 
                className={`contact-item ${activeContact === c.id ? 'active' : ''}`}
                onClick={() => setActiveContact(c.id)}
              >
                <div className="nav-avatar" style={{ position: 'relative' }}>
                  {c.avatar}
                  <div className={`status-indicator ${c.status}`} style={{ position: 'absolute', bottom: 0, right: 0 }}></div>
                </div>
                <div className="contact-info">
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</p>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-window glass">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="nav-avatar">{activeUser?.avatar}</div>
              <div>
                <p style={{ fontWeight: 600 }}>{activeUser?.name}</p>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>{activeUser?.status === 'online' ? 'Elérhető' : 'Nem elérhető'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }} className="text-muted">
              <Phone size={20} style={{ cursor: 'pointer' }} />
              <Video size={20} style={{ cursor: 'pointer' }} />
              <Info size={20} style={{ cursor: 'pointer' }} />
              <MoreVertical size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble ${msg.sent ? 'sent' : 'received'}`}>
                {msg.text}
                <span className="message-time">{msg.time}</span>
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <button type="button" className="text-muted"><Paperclip size={20} /></button>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Írjon üzenetet..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="button" className="text-muted"><Smile size={20} /></button>
            <button type="submit" className="send-btn">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messenger;

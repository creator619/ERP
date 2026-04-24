import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  Info,
  Hash,
  MessageSquare,
  Users,
  Image as ImageIcon,
  File as FileIcon
} from 'lucide-react';
import './Messenger.css';

const Messenger = ({ addToast }) => {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'channels'
  const [activeChatId, setActiveChatId] = useState(1);
  const [message, setMessage] = useState('');

  const contacts = [
    { id: 1, name: 'Kovács János', role: 'IT Admin', status: 'online', avatar: 'KJ' },
    { id: 2, name: 'Nagy Péter', role: 'Gyártásvezető', status: 'offline', avatar: 'NP' },
    { id: 3, name: 'Szabó Anna', role: 'Értékesítés', status: 'online', avatar: 'SZA' },
    { id: 4, name: 'Molnár Emese', role: 'HR', status: 'online', avatar: 'ME' },
  ];

  const channels = [
    { id: 101, name: 'Stadler-Projekt', type: 'project', members: 12 },
    { id: 102, name: 'Gyártás-Szerelősor', type: 'work', members: 45 },
    { id: 103, name: 'Minőségellenőrzés', type: 'quality', members: 8 },
    { id: 104, name: 'Logisztika-Hub', type: 'work', members: 24 },
  ];

  const initialMessages = [
    { id: 1, text: 'Szia Anna! Megnézted a Stadler projekt új rajzait?', time: '10:15', sent: true, sender: 'Én' },
    { id: 2, text: 'Szia! Igen, éppen most töltöttem fel a Dokumentáció fülre.', time: '10:17', sent: false, sender: 'Szabó Anna' },
    { id: 3, text: 'Szuper, köszi! Akkor indítom a gyártási előkészítést.', time: '10:18', sent: true, sender: 'Én' },
    { id: 4, text: 'Rendben, szólj ha kell még valami.', time: '10:20', sent: false, sender: 'Szabó Anna' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      addToast('Üzenet elküldve', 'success');
      setMessage('');
    }
  };

  const activeUser = contacts.find(c => c.id === activeChatId) || { name: channels.find(c => c.id === activeChatId)?.name, avatar: '#' };

  return (
    <div className="messenger-module">
      <div className="messenger-container glass">
        <div className="contacts-list">
          <div className="messenger-nav-tabs">
            <button className={activeTab === 'direct' ? 'active' : ''} onClick={() => setActiveTab('direct')}>
              <MessageSquare size={16} /> Direkt
            </button>
            <button className={activeTab === 'channels' ? 'active' : ''} onClick={() => setActiveTab('channels')}>
              <Hash size={16} /> Csatornák
            </button>
          </div>

          <div className="contacts-body">
            {activeTab === 'direct' ? (
              contacts.map(c => (
                <div key={c.id} className={`contact-item ${activeChatId === c.id ? 'active' : ''}`} onClick={() => setActiveChatId(c.id)}>
                  <div className="nav-avatar" style={{ position: 'relative' }}>
                    {c.avatar}
                    <div className={`status-indicator ${c.status}`} style={{ position: 'absolute', bottom: 0, right: 0 }}></div>
                  </div>
                  <div className="contact-info">
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>{c.role}</p>
                  </div>
                </div>
              ))
            ) : (
              channels.map(ch => (
                <div key={ch.id} className={`contact-item ${activeChatId === ch.id ? 'active' : ''}`} onClick={() => setActiveChatId(ch.id)}>
                  <div className="channel-icon">
                    <Hash size={18} />
                  </div>
                  <div className="contact-info">
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ch.name}</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>{ch.members} tag</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-window">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="nav-avatar" style={{ background: activeTab === 'channels' ? 'var(--primary-color)' : 'var(--bg-card)' }}>
                {activeTab === 'channels' ? <Hash size={18} /> : activeUser.avatar}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{activeUser.name}</p>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {activeTab === 'channels' ? 'Csoportos beszélgetés' : activeUser.status === 'online' ? 'Elérhető' : 'Nem elérhető'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }} className="text-muted">
              {activeTab === 'direct' && (
                <>
                  <Phone size={20} style={{ cursor: 'pointer' }} />
                  <Video size={20} style={{ cursor: 'pointer' }} />
                </>
              )}
              <MoreVertical size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div className="chat-messages">
            <div className="date-divider">Ma</div>
            {initialMessages.map(msg => (
              <div key={msg.id} className={`message-group ${msg.sent ? 'sent' : 'received'}`}>
                {!msg.sent && <div className="message-sender">{msg.sender}</div>}
                <div className="message-bubble">
                  {msg.text}
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <div className="input-actions-left">
              <button type="button" className="text-muted" onClick={() => addToast('Fájlcsatolás...', 'info')}><Paperclip size={20} /></button>
              <button type="button" className="text-muted" onClick={() => addToast('Képcsatolás...', 'info')}><ImageIcon size={20} /></button>
            </div>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Írjon üzenetet..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="input-actions-right">
              <button type="button" className="text-muted"><Smile size={20} /></button>
              <button type="submit" className="send-btn">
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messenger;

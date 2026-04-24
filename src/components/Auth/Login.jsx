import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import loginBg from '../../assets/login-bg.png';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="login-overlay"></div>
      
      <div className="login-card glass">
        <div className="login-logo">
          <div className="logo-box" style={{ background: '#2C3E50' }}>RP</div>
          <h1>RailParts ERP</h1>
          <p style={{ opacity: 0.7 }}>Vállalati belépési felület</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail cím</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="pelda@vasutalkatresz.hu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Jelszó</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Bejelentkezés
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; 2024 RailParts Manufacturing Ltd.</p>
          <p style={{ marginTop: '5px', fontSize: '0.75rem' }}>Verzió 1.2.0-stable</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

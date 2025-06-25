import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin-theme.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin') {
      // حفظ الجلسة مؤقتًا
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('❌ اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-title">🔐 دخول المشرف</h2>

      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="main-button">دخول</button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;

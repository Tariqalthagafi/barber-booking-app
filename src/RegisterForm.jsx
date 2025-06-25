import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './profile-theme.css';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('❌ كلمة المرور غير متطابقة.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('✅ تم إنشاء الحساب بنجاح!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('❌ فشل في إنشاء الحساب. قد يكون البريد مستخدم من قبل.');
    }
  };

  return (
    <div className="auth-container">
      <h2>📝 إنشاء حساب جديد</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="main-button">➕ إنشاء الحساب</button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;

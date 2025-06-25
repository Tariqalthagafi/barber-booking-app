import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './profile-theme.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/profile');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      setErrorMsg('❌ خطأ في تسجيل الدخول. تأكد من البريد وكلمة المرور.');
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 دخول الحلاق</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="main-button">➡️ تسجيل الدخول</button>
        {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
      </form>

      {/* خيارات إضافية */}
      <div className="auth-options">
        <p>
          نسيت كلمة المرور؟{' '}
          <span className="auth-link" onClick={() => navigate('/reset-password')}>
            اضغط هنا
          </span>
        </p>
        <p>
          ما عندك حساب؟{' '}
          <span className="auth-link" onClick={() => navigate('/register')}>
            أنشئ حساب جديد
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './profile-theme.css';

const Header = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('👋 تم تسجيل الخروج!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('❌ حدث خطأ أثناء الخروج.');
    }
  };

  return (
    <header className="header-bar">
      <div className="header-left" onClick={() => navigate('/')} title="الرئيسية">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="لوقو" className="header-logo" />

        <span className="header-title">مشط ومقص</span>
      </div>

      <div className="header-actions">
        {userLoggedIn ? (
          <>
            <button onClick={() => navigate('/profile')} className="secondary-button">👤 حسابي</button>
            <button onClick={handleLogout} className="main-button" style={{ marginRight: '8px' }}>🚪 خروج</button>
          </>
        ) : (
          <button onClick={() => navigate('/auth')} className="main-button">🔐 دخول</button>
        )}
      </div>
    </header>
  );
};

export default Header;

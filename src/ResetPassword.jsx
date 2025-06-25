import React, { useState } from 'react';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './profile-theme.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('📧 تم إرسال رابط استعادة كلمة المرور إلى بريدك.');
    } catch (err) {
      console.error(err);
      setMessage('❌ لم نتمكن من إرسال الرابط. تحقق من البريد.');
    }
  };

  return (
    <div className="auth-container">
      <h2>🔁 استعادة كلمة المرور</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="main-button">📩 إرسال رابط الاستعادة</button>
        {message && <p style={{ marginTop: '10px', color: message.includes('❌') ? 'red' : 'green' }}>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;

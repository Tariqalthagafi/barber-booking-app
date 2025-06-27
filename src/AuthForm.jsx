import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/profile');
    });
    return () => unsub();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegistering) {
      if (password !== confirm) {
        setErrorMsg('❌ كلمة المرور وتأكيدها غير متطابقين.');
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setErrorMsg('❌ فشل في إنشاء الحساب. تأكد من صحة البيانات.');
        console.error(error);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setErrorMsg('❌ خطأ في تسجيل الدخول. تحقق من البريد وكلمة المرور.');
        console.error(error);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg('⚠️ أدخل بريدك الإلكتروني أولاً لإرسال رابط الاستعادة.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetRequested(true);
      setSuccessMsg('📨 تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.');
    } catch (error) {
      setErrorMsg('❌ لم نتمكن من إرسال الرابط. حاول لاحقاً.');
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegistering ? '📝 إنشاء حساب جديد' : '🔐 دخول الحلاق'}</h2>

      <form onSubmit={handleSubmit}>
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

        {isRegistering && (
          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="auth-input"
            required
          />
        )}

        <button type="submit" className="main-button">
          {isRegistering ? '✅ إنشاء الحساب' : '➡️ تسجيل الدخول'}
        </button>

        {errorMsg && <p className="auth-error">{errorMsg}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}
      </form>

      {!isRegistering && (
        <p className="auth-reset">
          نسيت كلمة المرور؟{' '}
          <span className="auth-link" onClick={handleResetPassword}>
            اضغط هنا لإعادة التعيين
          </span>
        </p>
      )}

      <p className="auth-switch">
        {isRegistering ? 'عندك حساب؟' : 'ما عندك حساب؟'}{' '}
        <span className="auth-link" onClick={() => {
          setIsRegistering(prev => !prev);
          setErrorMsg('');
          setSuccessMsg('');
          setResetRequested(false);
        }}>
          {isRegistering ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;

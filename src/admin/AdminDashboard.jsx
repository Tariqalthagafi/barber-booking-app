// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import PendingBarberCard from './PendingBarberCard';
import './admin-theme.css';

const db = getFirestore();

const AdminDashboard = () => {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    const fetchPendingBarbers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'barbers'));
        const pending = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(barber => barber.pendingChanges && Object.keys(barber.pendingChanges).length > 0);
        setBarbers(pending);
      } catch (err) {
        console.error('❌ فشل في جلب الحلاقين:', err);
      }
    };

    fetchPendingBarbers();
  }, []);

  return (
    
    <div className="admin-container">
      <h2 className="admin-title">🛠️ مراجعة التعديلات المعلقة</h2>
      <button
  onClick={() => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/admin-login';
  }}
  className="logout-button"
>
  🚪 تسجيل الخروج
</button>


      {barbers.length === 0 ? (
        <p style={{ color: '#666' }}>لا توجد طلبات تعديل حالياً.</p>
      ) : (
        barbers.map(barber => (
          <PendingBarberCard key={barber.id} barber={barber} />
        ))
      )}
    </div>
  );
};

export default AdminDashboard;

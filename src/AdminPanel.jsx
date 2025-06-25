import React, { useEffect, useState } from 'react';
import { fetchAllBarbers } from './firebaseService';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

const AdminPanel = () => {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllBarbers();
      setBarbers(data);
    };
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'barbers', id), { approved: true });
      alert('✅ تم تفعيل الحلاق!');
      setBarbers((prev) =>
        prev.map((b) => (b.id === id ? { ...b, approved: true } : b))
      );
    } catch (error) {
      console.error('❌ فشل التفعيل:', error);
      alert('⚠️ حدث خطأ أثناء التفعيل.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛡️ لوحة التحكم (المشرف)</h2>
      {barbers.length === 0 ? (
        <p>🚫 لا يوجد حلاقون حتى الآن.</p>
      ) : (
        barbers.map((barber) => (
          <div key={barber.id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h4>{barber.name} - {barber.salon}</h4>
            <p>الحالة: {barber.approved ? '✅ مفعل' : '❌ غير مفعل'}</p>
            {!barber.approved && (
              <button onClick={() => handleApprove(barber.id)} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px' }}>
                ✅ تفعيل الحلاق
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPanel;

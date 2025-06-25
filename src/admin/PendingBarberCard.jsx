import React from 'react';
import './admin-theme.css';
import { approvePendingChange, rejectPendingChange } from './adminService';

const fieldsToReview = ['name', 'salon', 'image'];

const PendingBarberCard = ({ barber }) => {
  const { id, name, pendingChanges = {} } = barber;

  const approveChange = async (field) => {
    const newValue = pendingChanges[field];
    try {
      await approvePendingChange(id, field, newValue);
      alert(`✅ تم اعتماد التعديل على ${field}`);
    } catch (err) {
      console.error('فشل في الموافقة:', err);
    }
  };

  const rejectChange = async (field) => {
    try {
      await rejectPendingChange(id, field);
      alert(`❌ تم رفض التعديل على ${field}`);
    } catch (err) {
      console.error('فشل في الرفض:', err);
    }
  };

  return (
    <div className="pending-card">
      <h4>✂️ {name || 'اسم غير معروف'} - طلبات تعديل معلقة</h4>

      {fieldsToReview.map((field) => {
        const currentValue = barber[field];
        const proposedValue = pendingChanges[field];
        if (!proposedValue) return null;

        return (
          <div key={field} className="pending-field">
            <strong className="pending-label">
              {field === 'salon' ? 'اسم المحل' : field === 'image' ? 'الصورة' : 'الاسم'}:
            </strong>

            {field === 'image' ? (
              <div className="image-compare">
                <div>
                  <span>الحالية:</span>
                  <img src={currentValue} alt="current" className="preview" />
                </div>
                <div>
                  <span>المقترحة:</span>
                  <img src={proposedValue} alt="pending" className="preview" />
                </div>
              </div>
            ) : (
              <div className="text-compare">
                <span className="current">🟢 الحالية: {currentValue}</span>
                <span className="proposed">🟡 المقترحة: {proposedValue}</span>
              </div>
            )}

            <div className="actions">
              <button onClick={() => approveChange(field)} className="approve-button">✅ قبول</button>
              <button onClick={() => rejectChange(field)} className="reject-button">❌ رفض</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PendingBarberCard;

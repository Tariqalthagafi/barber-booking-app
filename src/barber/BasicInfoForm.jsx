import React, { useState, useEffect } from 'react';
import './BasicInfoForm.css'; // تأكد من إضافة التنسيقات المرافقة

const BasicInfoForm = ({ profile, onUpdateField }) => {
  const [editing, setEditing] = useState(false);
  const [localData, setLocalData] = useState({
    name: profile.name,
    salon: profile.salon,
    phone: profile.phone,
    offersKidsHaircut: profile.offersKidsHaircut,
    offersHomeService: profile.offersHomeService
  });

  const [saving, setSaving] = useState(false);

  // إعادة تحميل البيانات من البروفايل الخارجي عند تغيّره
  useEffect(() => {
    setLocalData({
      name: profile.name,
      salon: profile.salon,
      phone: profile.phone,
      offersKidsHaircut: profile.offersKidsHaircut,
      offersHomeService: profile.offersHomeService
    });
    setEditing(false);
  }, [profile]);

  const handleFieldClick = () => {
    if (!editing) setEditing(true);
  };

  const handleChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const promises = Object.entries(localData).map(([field, val]) =>
      val !== profile[field] ? onUpdateField(field, val) : null
    );
    await Promise.all(promises);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalData({
      name: profile.name,
      salon: profile.salon,
      phone: profile.phone,
      offersKidsHaircut: profile.offersKidsHaircut,
      offersHomeService: profile.offersHomeService
    });
    setEditing(false);
  };

  return (
    <div className="info-box">
      <h3 className="section-title">👤 المعلومات الأساسية</h3>

      <div className="field-group" onClick={handleFieldClick}>
        <label>اسم الحلاق</label>
        <input
          type="text"
          value={localData.name}
          readOnly={!editing}
          onChange={(e) => handleChange('name', e.target.value)}
          className={editing ? 'editable' : 'readonly'}
        />
        {profile.pendingChanges?.name && (
          <div className="pending-note">🕓 قيد المراجعة: {profile.pendingChanges.name}</div>
        )}
      </div>

      <div className="field-group" onClick={handleFieldClick}>
        <label>اسم الصالون</label>
        <input
          type="text"
          value={localData.salon}
          readOnly={!editing}
          onChange={(e) => handleChange('salon', e.target.value)}
          className={editing ? 'editable' : 'readonly'}
        />
        {profile.pendingChanges?.salon && (
          <div className="pending-note">🕓 قيد المراجعة: {profile.pendingChanges.salon}</div>
        )}
      </div>

      <div className="field-group" onClick={handleFieldClick}>
        <label>رقم الجوال</label>
        <input
          type="tel"
          value={localData.phone}
          readOnly={!editing}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={editing ? 'editable' : 'readonly'}
        />
      </div>

      <div className="checkboxes" onClick={handleFieldClick}>
        <label>
          <input
            type="checkbox"
            checked={localData.offersKidsHaircut}
            disabled={!editing}
            onChange={(e) => handleChange('offersKidsHaircut', e.target.checked)}
          />
          أقدّم حلاقة للأطفال 👶
        </label>
        <label>
          <input
            type="checkbox"
            checked={localData.offersHomeService}
            disabled={!editing}
            onChange={(e) => handleChange('offersHomeService', e.target.checked)}
          />
          أقدّم خدمة منزلية 🏠
        </label>
      </div>

      {editing && (
        <div className="form-actions">
          <button onClick={handleSave} disabled={saving} className="save-btn">
            {saving ? '💾 جاري الحفظ...' : '✅ حفظ'}
          </button>
          <button onClick={handleCancel} disabled={saving} className="cancel-btn">
            ❌ إلغاء
          </button>
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;

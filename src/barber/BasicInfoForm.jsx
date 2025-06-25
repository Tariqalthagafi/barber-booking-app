import React, { useState } from 'react';

const EditableField = ({ label, field, value, onSave, pendingValue, type = 'text' }) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleSave = () => {
    if (temp !== value) onSave(field, temp);
    setEditing(false);
  };

  const handleCancel = () => {
    setTemp(value);
    setEditing(false);
  };

  return (
    <div className="field-group">
      <label htmlFor={field}>{label}</label>
      <div className="input-with-controls">
        <input
          id={field}
          type={type}
          value={editing ? temp : value}
          readOnly={!editing}
          onChange={(e) => setTemp(e.target.value)}
          className="barber-input"
        />
        {pendingValue && <span className="pending-indicator">🟡 بانتظار المراجعة</span>}

        {!editing ? (
          <button onClick={() => setEditing(true)} className="edit-btn">✏️</button>
        ) : (
          <>
            <button onClick={handleSave} className="save-btn">✅</button>
            <button onClick={handleCancel} className="cancel-btn">❌</button>
          </>
        )}
      </div>
    </div>
  );
};

const BasicInfoForm = ({ profile, onUpdateField }) => {
  return (
    <div>
      <h3 className="section-title">👤 المعلومات الأساسية</h3>

      <EditableField
        label="اسم الحلاق"
        field="name"
        value={profile.name}
        onSave={onUpdateField}
        pendingValue={profile.pendingChanges?.name}
      />

      <EditableField
        label="اسم الصالون"
        field="salon"
        value={profile.salon}
        onSave={onUpdateField}
        pendingValue={profile.pendingChanges?.salon}
      />

      <EditableField
        label="رقم الجوال"
        field="phone"
        value={profile.phone}
        type="tel"
        onSave={onUpdateField}
      />

      <div className="field-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="offersKidsHaircut"
            checked={profile.offersKidsHaircut}
            onChange={(e) => onUpdateField('offersKidsHaircut', e.target.checked)}
          />
          أقدّم حلاقة للأطفال 👶
        </label>
      </div>
    </div>
  );
};

export default BasicInfoForm;

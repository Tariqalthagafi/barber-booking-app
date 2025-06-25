import React, { useState } from 'react';

const LocationForm = ({ profile, onAutoLocate, onUpdateField }) => {
  const [editing, setEditing] = useState(false);
  const [tempLocation, setTempLocation] = useState({ ...profile.location });

  const handleSave = () => {
    onUpdateField('location', tempLocation);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempLocation({ ...profile.location });
    setEditing(false);
  };

  return (
    <div>
      <h3 className="section-title">🗺️ الموقع الجغرافي</h3>

      <button
        onClick={onAutoLocate}
        className="secondary-button"
        style={{ marginBottom: '10px' }}
      >
        📍 تحديد موقعي تلقائيًا
      </button>

      <div className="barber-row">
        <input
          type="text"
          name="lat"
          placeholder="خط العرض (Latitude)"
          value={editing ? tempLocation.lat : profile.location.lat}
          readOnly={!editing}
          onChange={(e) =>
            setTempLocation((prev) => ({ ...prev, lat: e.target.value }))
          }
          className="barber-input half"
        />
        <input
          type="text"
          name="lng"
          placeholder="خط الطول (Longitude)"
          value={editing ? tempLocation.lng : profile.location.lng}
          readOnly={!editing}
          onChange={(e) =>
            setTempLocation((prev) => ({ ...prev, lng: e.target.value }))
          }
          className="barber-input half"
        />
      </div>

      <div className="input-with-controls" style={{ marginTop: '8px' }}>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="edit-btn">✏️ تعديل</button>
        ) : (
          <>
            <button onClick={handleSave} className="save-btn">✅ حفظ</button>
            <button onClick={handleCancel} className="cancel-btn">❌ إلغاء</button>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationForm;

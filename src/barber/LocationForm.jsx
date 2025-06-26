import React from 'react';

const LocationForm = ({ profile, onAutoLocate }) => {
  const handleRequestLocation = () => {
    const confirmed = window.confirm('📍 هل ترغب فعلاً في تحديث موقعك الجغرافي؟ سيتم استبدال الإحداثيات الحالية.');
    if (confirmed) {
      onAutoLocate();
    }
  };

  return (
    <div className="services-box">
      <h3 className="section-title">🗺️ الموقع الجغرافي</h3>

      <button
        onClick={handleRequestLocation}
        className="secondary-button"
        style={{ marginBottom: '10px' }}
      >
        📍 تحديد موقعي تلقائيًا
      </button>

      <div className="barber-row">
        <input
          type="text"
          value={profile.location.lat}
          readOnly
          className="barber-input half"
          placeholder="خط العرض (Latitude)"
        />
        <input
          type="text"
          value={profile.location.lng}
          readOnly
          className="barber-input half"
          placeholder="خط الطول (Longitude)"
        />
      </div>
    </div>
  );
};

export default LocationForm;

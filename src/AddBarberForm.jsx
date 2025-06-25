import React, { useState } from 'react';

const AddBarberForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    salon: '',
    phone: '',
    image: '',
    location: { lat: '', lng: '' },
    available: true,
    rating: 4.5,
    services: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'lat' || name === 'lng') {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.salon || !formData.phone || !formData.image) {
      alert('يرجى تعبئة جميع الحقول الضرورية');
      return;
    }
    onAdd({
      ...formData,
      rating: parseFloat(formData.rating),
      location: {
        lat: parseFloat(formData.location.lat),
        lng: parseFloat(formData.location.lng),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>تسجيل حلاق جديد</h2>

      <input
        type="text"
        name="name"
        placeholder="اسم الحلاق"
        value={formData.name}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="text"
        name="salon"
        placeholder="اسم الصالون"
        value={formData.salon}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="tel"
        name="phone"
        placeholder="رقم التواصل"
        value={formData.phone}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="text"
        name="image"
        placeholder="رابط صورة الحلاق"
        value={formData.image}
        onChange={handleChange}
        style={styles.input}
      />

      <div style={styles.locationRow}>
        <input
          type="text"
          name="lat"
          placeholder="خط العرض (Latitude)"
          value={formData.location.lat}
          onChange={handleChange}
          style={{ ...styles.input, width: '48%' }}
        />
        <input
          type="text"
          name="lng"
          placeholder="خط الطول (Longitude)"
          value={formData.location.lng}
          onChange={handleChange}
          style={{ ...styles.input, width: '48%' }}
        />
      </div>

      <button type="submit" style={styles.button}>حفظ الحلاق</button>
    </form>
  );
};

// 🎨 تنسيقات CSS-in-JS
const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    padding: '10px',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  locationRow: {
    display: 'flex',
    gap: '4%',
  },
};

export default AddBarberForm;

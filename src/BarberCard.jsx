import React, { useState } from 'react';
import './BarberCard.css';

const isAvailableNow = (workingHours) => {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const today = days[new Date().getDay()];
  const now = new Date().toTimeString().slice(0, 5); // HH:MM

  const periods = workingHours?.[today] || [];
  return periods.some(p => now >= p.from && now <= p.to);
};

const getTodayPeriodsLabel = (workingHours) => {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const today = days[new Date().getDay()];
  const periods = workingHours?.[today] || [];

  if (periods.length === 0) return 'غير متاح اليوم';
  return periods.map(p => `${p.from} - ${p.to}`).join('، ');
};

const BarberCard = ({
  name,
  salon,
  image,
  rating,
  services,
  phone,
  location,
  workingHours,
  offersKidsHaircut,
  offersHomeService
}) => {
  const [showServices, setShowServices] = useState(false);
  const toggleServices = () => setShowServices(!showServices);
  const available = isAvailableNow(workingHours);

  return (
    <div className={`barber-card ${showServices ? 'expanded' : ''}`}>
      <img src={image} alt={name} className="barber-image" />
      <h3 className="barber-name">{name}</h3>
      <p className="barber-salon">{salon}</p>

      <div className="barber-badges">
        {offersKidsHaircut && <span className="badge">👶 أطفال</span>}
        {offersHomeService && <span className="badge">🏠 منزلية</span>}
      </div>

      <div className="barber-rating">⭐ {rating}</div>

      <div className="barber-actions">
        <a
          href={`https://www.google.com/maps?q=${location?.lat},${location?.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          title="الموقع"
        >
          📍
        </a>

        <a href={`tel:${phone}`} title="اتصال">📞</a>

        <span title={getTodayPeriodsLabel(workingHours)}>
          {available ? '🟢' : '🔴'} ⏰
        </span>
      </div>

      <button onClick={toggleServices} className="toggle-button">
        {showServices ? 'إخفاء الخدمات' : 'عرض الخدمات'}
      </button>

      {showServices && (
        <ul className="services-list">
          {services.map((service, index) => (
            <li key={index}>
              <span>{service.name}</span>
              <span>{service.price} ريال</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BarberCard;

import React, { useState } from 'react';
import './BarberCard.css';

const isAvailableNow = (workingHours) => {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const today = days[new Date().getDay()];
  const now = new Date().toTimeString().slice(0, 5);
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
  offersHomeService,
  isExpanded,
  onToggle
}) => {
  const [showHours, setShowHours] = useState(false);
  const available = isAvailableNow(workingHours);
  const todayLabel = getTodayPeriodsLabel(workingHours);

  return (
    <div className={`barber-card ${isExpanded ? 'expanded' : ''}`}>
      {/* أعلى البطاقة */}
      <div className="card-header">
        <span className={`availability ${available ? 'available' : 'unavailable'}`}>
          {available ? 'متاح الآن' : 'غير متاح '}
        </span>

        <div className="service-tags">
          {offersKidsHaircut && <span className="tag">👶 أطفال</span>}
          {offersHomeService && <span className="tag">🏠 منزلية</span>}
        </div>
      </div>

      {/* صورة وتقييم */}
      <div className="barber-image-wrapper">
        <img src={image} alt={name} className="barber-image" />
        <div className="rating-badge">⭐ {rating}</div>
      </div>

      <h3 className="barber-name">{name}</h3>
      <p className="barber-salon">{salon}</p>

      {/* روابط */}
      <div className="barber-actions">
        <a href={`tel:${phone}`} title="اتصال">📞</a>
        <a
          href={`https://www.google.com/maps?q=${location?.lat},${location?.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          title="الموقع"
        >
          📍
        </a>
        <span
          className="clock-icon"
          title="عرض مواعيد اليوم"
          onClick={() => setShowHours(prev => !prev)}
        >
          ⏰
        </span>
      </div>

      {showHours && (
        <div className="working-hours-expanded">
          <p>مواعيد اليوم: {todayLabel}</p>
        </div>
      )}

      {/* زر توسيع الخدمات */}
      <button onClick={onToggle} className="toggle-button">
        {isExpanded ? '▲ إخفاء الخدمات' : '▼ عرض الخدمات'}
      </button>

      {isExpanded && (
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

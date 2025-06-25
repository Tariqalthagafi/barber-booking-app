import React, { useState } from 'react';
import './BarberCard.css';

const BarberCard = ({ name, image, rating, services }) => {
  const [showServices, setShowServices] = useState(false);

  const toggleServices = () => setShowServices(!showServices);

  return (
    <div className={`barber-card ${showServices ? 'expanded' : ''}`}>
      <img src={image} alt={name} className="barber-image" />
      <h3 className="barber-name">{name}</h3>
      <p className="barber-rating">⭐ {rating}</p>

      <div className="barber-actions">
        <span title="الموقع">📍</span>
        <span title="اتصال">📞</span>
        <span title="المواعيد">⏰</span>
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

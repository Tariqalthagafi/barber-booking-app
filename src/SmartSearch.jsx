import React, { useEffect, useState } from 'react';
import './profile-theme.css';

const SmartSearch = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    rating: 0,
    kids: false,
    offersHomeService: false,
    userLocation: null,
    openNow: true,
    nearby: true
  });

  // تحديد الموقع تلقائيًا
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFilters((prev) => ({
            ...prev,
            userLocation: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            }
          }));
        },
        () => {
          alert('⚠️ لم نتمكن من تحديد موقعك. سيتم عرض النتائج بدون ترتيب حسب القرب.');
        }
      );
    }
  }, []);

  // إشعار المكون الأب بالتغييرات
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const toggleKids = () => {
    setFilters((prev) => ({ ...prev, kids: !prev.kids }));
  };

  const toggleHome = () => {
    setFilters((prev) => ({ ...prev, offersHomeService: !prev.offersHomeService }));
  };

  const setRating = (value) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === value ? 0 : value
    }));
  };

  return (
    <div className="filter-bar">
      <button
        className={filters.openNow ? 'filter-btn active' : 'filter-btn'}
        onClick={() => setFilters((prev) => ({ ...prev, openNow: !prev.openNow }))}
      >
        ✅ متاح الآن
      </button>

      <button
        className={filters.kids ? 'filter-btn active' : 'filter-btn'}
        onClick={toggleKids}
      >
        👶 حلاقة أطفال
      </button>

      <button
        className={filters.offersHomeService ? 'filter-btn active' : 'filter-btn'}
        onClick={toggleHome}
      >
        🏠 خدمة منزلية
      </button>

      <button className="filter-btn disabled" disabled>
        📍 الأقرب إليك
      </button>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`star ${filters.rating >= star ? 'active' : ''}`}
            title={`تقييم ${star}`}
          >
            ⭐<span className="star-number">{star}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SmartSearch;

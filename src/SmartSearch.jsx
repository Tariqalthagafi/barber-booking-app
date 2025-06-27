import React, { useEffect, useState } from 'react';
import './SmartSearch.css';

const SmartSearch = ({ onFiltersChange }) => {
  const initialFilters = {
    rating: 0,
    kids: false,
    offersHomeService: false,
    userLocation: null,
    openNow: true,
    nearby: false
  };

  const [filters, setFilters] = useState(initialFilters);

  const handleToggleNearby = () => {
    if (!filters.userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setFilters((prev) => ({
              ...prev,
              nearby: true,
              userLocation: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              }
            }));
          },
          () => {
            alert('⚠️ تعذّر تحديد موقعك.');
          }
        );
      } else {
        alert('❌ متصفحك لا يدعم تحديد الموقع.');
      }
    } else {
      setFilters((prev) => ({ ...prev, nearby: !prev.nearby }));
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const setRating = (value) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === value ? 0 : value
    }));
  };

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  return (
    <div className="filter-panel">
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filters.openNow ? 'active' : ''}`}
          onClick={() => setFilters((prev) => ({ ...prev, openNow: !prev.openNow }))}
        >
          ✅ متاح الآن
        </button>

        <button
          className={`filter-btn ${filters.kids ? 'active' : ''}`}
          onClick={() => setFilters((prev) => ({ ...prev, kids: !prev.kids }))}
        >
          👶 حلاقة أطفال
        </button>

        <button
          className={`filter-btn ${filters.offersHomeService ? 'active' : ''}`}
          onClick={() => setFilters((prev) => ({ ...prev, offersHomeService: !prev.offersHomeService }))}
        >
          🏠 خدمة منزلية
        </button>

        <button
          className={`filter-btn ${filters.nearby ? 'active' : ''}`}
          onClick={handleToggleNearby}
        >
          📍 الأقرب إليك
        </button>

        <button
          className="filter-reset"
          onClick={handleResetFilters}
          title="إعادة تعيين الفلاتر"
        >
          ↺
        </button>
      </div>

      <div className="rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            className={`svg-star ${filters.rating >= star ? 'active' : ''}`}
            viewBox="0 0 24 24"
          >
            <polygon
              points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default SmartSearch;

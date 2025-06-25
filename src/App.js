import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { fetchAllBarbers } from './firebaseService';
import BarberCard from './BarberCard';
import AddBarberForm from './AddBarberForm';
import BarberProfile from './BarberProfile';
import AuthForm from './AuthForm';
import AdminPanel from './AdminPanel';
import Header from './Header';
import './profile-theme.css';
import RegisterForm from './RegisterForm.jsx';
import ResetPassword from './ResetPassword';
import SmartSearch from './SmartSearch';

import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import AdminRoute from './admin/AdminRoute';

const App = () => {
  const [allBarbers, setAllBarbers] = useState([]);
  const [displayedBarbers, setDisplayedBarbers] = useState([]);
  const [searchFilters, setSearchFilters] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialBarbers = async () => {
      try {
        const all = await fetchAllBarbers();
        const approved = all.filter(b => b.approved);
        setAllBarbers(approved);
        setDisplayedBarbers(approved);
      } catch (err) {
        console.error('❌ خطأ أثناء تحميل الحلاقين:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialBarbers();
  }, []);

  useEffect(() => {
    if (!searchFilters) return;
    const filtered = applyFilters(allBarbers, searchFilters);
    setDisplayedBarbers(filtered);
  }, [searchFilters, allBarbers]);

  const handleAddBarber = (newBarber) => {
    setAllBarbers(prev => [...prev, newBarber]);
    setDisplayedBarbers(prev => [...prev, newBarber]);
  };

  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <div className="home-container">
              <h2 style={{ marginBottom: '10px' }}>💈 استكشف أفضل الحلاقين</h2>

              <SmartSearch onFiltersChange={setSearchFilters} />

              {searchFilters && (
                <button
                  onClick={() => setSearchFilters(null)}
                  style={{ margin: '10px auto', display: 'block' }}
                  className="filter-btn"
                >
                  🔄 إعادة تعيين الفلاتر
                </button>
              )}

              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="spinner" />
                  <p style={{ marginTop: '8px', color: '#777' }}>جارٍ تحميل الحلاقين...</p>
                </div>
              ) : (
                <>
                  <p style={{ marginBottom: '10px', textAlign: 'center', color: '#555' }}>
                    ✂️ تم العثور على {displayedBarbers.length} حلاق{' '}
                    {searchFilters ? 'مطابق للفلاتر المختارة' : 'متاح حالياً'}
                  </p>

                  <div className="barbers-list">
                    {displayedBarbers.length > 0 ? (
                      displayedBarbers.map((barber, index) => (
                        <BarberCard key={index} {...barber} />
                      ))
                    ) : (
                      <p style={{ textAlign: 'center' }}>لا توجد نتائج تطابق الفلاتر المختارة.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          }
        />

        <Route path="/add-barber" element={<AddBarberForm onAdd={handleAddBarber} />} />
        <Route path="/profile" element={<BarberProfile />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

const applyFilters = (barbers, filters) => {
  const now = new Date();
  const currentTime = now.getHours() + now.getMinutes() / 60;

  const getDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return Infinity;
    const R = 6371;
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(loc1.lat * Math.PI / 180) *
      Math.cos(loc2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return barbers
    .filter(b => {
      if (!b.openingTime || !b.closingTime) return false;
      const [h1, m1] = b.openingTime.split(':').map(Number);
      const [h2, m2] = b.closingTime.split(':').map(Number);
      const open = h1 + m1 / 60;
      const close = h2 + m2 / 60;
      return filters.openNow ? currentTime >= open && currentTime < close : true;
    })
    .filter(b => b.rating >= (filters.rating || 0))
    .filter(b => !filters.kids || b.offersKidsHaircut)
    .map(b => {
      const dist = filters.userLocation
        ? getDistance(filters.userLocation, b.location)
        : Infinity;
      return { ...b, distance: dist };
    })
    .sort((a, b) => a.distance - b.distance);
};

export default App;

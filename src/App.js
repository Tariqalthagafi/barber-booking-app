import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
  const [expandedBarberId, setExpandedBarberId] = useState(null);

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

  const handleToggleCard = (barberId) => {
    setExpandedBarberId(prevId => (prevId === barberId ? null : barberId));
  };

  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <div className="home-container">
             

              <SmartSearch onFiltersChange={setSearchFilters} />

              

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
                      displayedBarbers
                        .filter(b => b.baseData && b.baseData.name)
                        .map((barber, index) => (
                          <BarberCard
                            key={barber.id || index}
                            name={barber.baseData.name}
                            salon={barber.baseData.salon}
                            image={barber.baseData.image}
                            rating={barber.metrics?.rating || 0}
                            services={barber.baseData.services}
                            phone={barber.baseData.phone}
                            location={barber.baseData.location}
                            workingHours={barber.baseData.workingHours}
                            offersKidsHaircut={barber.baseData.offersKidsHaircut}
                            offersHomeService={barber.baseData.offersHomeService}
                            isExpanded={expandedBarberId === (barber.id || index)}
                            onToggle={() => handleToggleCard(barber.id || index)}
                          />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const applyFilters = (barbers, filters) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const weekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const today = weekdays[now.getDay()];

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
    .filter(b => b.baseData && b.metrics)
    .filter(b => {
      const wh = b.baseData?.workingHours?.[today] || [];
      const isOpen = wh.some(period => currentTime >= period.from && currentTime <= period.to);
      return filters.openNow ? isOpen : true;
    })
    .filter(b => (b.metrics?.rating || 0) >= (filters.rating || 0))
    .filter(b => !filters.kids || b.baseData?.offersKidsHaircut)
    .filter(b => !filters.offersHomeService || b.baseData?.offersHomeService)
    .map(b => {
      const dist = filters.userLocation
        ? getDistance(filters.userLocation, b.baseData?.location)
        : Infinity;
      return { ...b, distance: dist };
    })
    .sort((a, b) => a.distance - b.distance);
};

export default App;

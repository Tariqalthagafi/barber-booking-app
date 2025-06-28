import React, { useState, useEffect } from 'react';
import './profile-theme.css';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import {
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  setDoc,
  getDoc,
  doc,
  getFirestore
} from 'firebase/firestore';

import BasicInfoForm from './barber/BasicInfoForm';
import ImageUploader from './barber/ImageUploader';
import LocationForm from './barber/LocationForm';
import WorkingHours from './barber/WorkingHours';
import ServicesList from './barber/ServicesList';
import StatusPanel from './barber/StatusPanel';
import RatingSummary from './barber/RatingSummary';

const db = getFirestore();
const sensitiveFields = ['name', 'salon', 'image'];

const isProfileComplete = (profile) => {
  const requiredFields = [
    'name',
    'salon',
    'phone',
    'image',
    'location',
    'workingHours'
  ];

  for (let field of requiredFields) {
    const value = profile[field];
    if (
      value === '' ||
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      return false;
    }
  }

  return true;
};

const BarberProfile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    salon: '',
    phone: '',
    image: '',
    location: { lat: '', lng: '' },
    rating: 4.5,
    services: [],
    offersKidsHaircut: false,
    offersHomeService: false,
    workingHours: {},
    membershipType: 'اشترك الآن',
    approved: false,
    pendingChanges: {}
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setAuthUser(user);
        fetchBarberProfile(user.uid);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsub();
  }, []);

  const fetchBarberProfile = async (userId) => {
    try {
      const docRef = doc(db, 'barbers', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProfile((prev) => ({
          ...prev,
          ...data,
          location: data.location || { lat: '', lng: '' },
          services: data.services || [],
          workingHours: data.workingHours || {},
          pendingChanges: data.pendingChanges || {},
          rating: data.rating || 4.5,
          membershipType: data.membershipType || 'اشترك الآن',
          approved: data.approved ?? false,
          offersKidsHaircut: data.offersKidsHaircut || false,
          offersHomeService: data.offersHomeService || false
        }));
        setImagePreview(data.image || '');
      }
    } catch (error) {
      console.error('فشل في تحميل بيانات الحلاق:', error);
    }
  };

  const handleFieldUpdate = async (fieldName, value) => {
    if (!authUser) {
      alert('❌ يجب تسجيل الدخول أولاً!');
      return;
    }

    const docRef = doc(db, 'barbers', authUser.uid);

    try {
      if (sensitiveFields.includes(fieldName)) {
        await setDoc(docRef, {
          pendingChanges: {
            ...(profile.pendingChanges || {}),
            [fieldName]: value
          }
        }, { merge: true });

        alert(`📤 تم إرسال تعديل "${fieldName}" لمراجعة الإدارة.`);
      } else {
        await setDoc(docRef, {
          [fieldName]: value
        }, { merge: true });

        alert(`✅ تم تحديث "${fieldName}" بنجاح.`);
      }

      setProfile(prev => ({
        ...prev,
        ...(sensitiveFields.includes(fieldName)
          ? { pendingChanges: { ...prev.pendingChanges, [fieldName]: value } }
          : { [fieldName]: value })
      }));
    } catch (err) {
      console.error('❌ فشل في تحديث الحقل:', err);
      alert('حدث خطأ أثناء حفظ التعديل.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      handleFieldUpdate('image', '');
      setImagePreview('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      handleFieldUpdate('image', reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAutoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleFieldUpdate('location', {
            lat: latitude.toString(),
            lng: longitude.toString()
          });
        },
        () => alert('❌ لم نتمكن من تحديد الموقع. تأكد من تفعيل GPS.')
      );
    } else {
      alert('❌ المتصفح لا يدعم تحديد الموقع.');
    }
  };

  const updateService = (newServices) => {
    handleFieldUpdate('services', newServices);
  };

  const addService = () => {};
  const removeService = () => {};

  const handleActivationRequest = async (updatedProfile) => {
    if (!authUser) {
      alert('❌ لا يمكن إرسال الطلب: المستخدم غير مسجل دخول.');
      return;
    }

    if (!isProfileComplete(updatedProfile)) {
      alert('❗ يرجى إكمال جميع الحقول الأساسية قبل إرسال الطلب.');
      return;
    }

    try {
      await setDoc(doc(db, 'barbers', authUser.uid), {
        ...updatedProfile,
        membershipType: 'طلب ترقية الحساب'
      }, { merge: true });

      setProfile((prev) => ({
        ...prev,
        membershipType: 'طلب ترقية الحساب'
      }));

      alert('📤 تم إرسال الطلب بنجاح، بانتظار الموافقة.');
    } catch (err) {
      console.error('فشل في إرسال طلب التفعيل:', err);
    }
  };

  return (
    <div className="barber-container">
      {!isLoggedIn ? (
        <div style={{ marginTop: '10px' }}>
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            🔒 يجب تسجيل الدخول لعرض بيانات البروفايل.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="secondary-button"
            style={{ marginTop: '8px' }}
          >
            🔐 دخول الحلاق
          </button>
        </div>
      ) : (
        <>
          <div className="barber-summary-box">
            <div className="summary-flex">
              <ImageUploader imagePreview={imagePreview} onUpload={handleImageUpload} />
              <div className="summary-details">
                <p className="approval-status">
                  {profile.approved ? '✅ تم اعتمادك من الإدارة' : '⏳ بانتظار الموافقة'}
                </p>
                <RatingSummary rating={profile.rating} />
                <StatusPanel
                  membershipType={profile.membershipType}
                  approved={profile.approved}
                  profile={profile}
                  setProfile={setProfile}
                  onRequestActivateExternal={handleActivationRequest}
                />
              </div>
            </div>
          </div>

          <BasicInfoForm profile={profile} onUpdateField={handleFieldUpdate} />
          <LocationForm profile={profile} onAutoLocate={handleAutoLocate} />
          <WorkingHours profile={profile} onUpdateField={handleFieldUpdate} />
          <ServicesList
            services={profile.services}
            onUpdate={updateService}
            onAdd={addService}
            onRemove={removeService}
          />

          <hr />
        </>
      )}
    </div>
  );
};

export default BarberProfile;

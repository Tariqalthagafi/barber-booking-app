import React from 'react';

const getStatusDisplay = (approved, membershipType) => {
  if (approved) return { text: 'معتمد ✅', color: '#28a745' };

  switch (membershipType?.trim()) {
    case 'طلب ترقية الحساب':
      return { text: 'بانتظار الموافقة ⏳', color: '#fd7e14' };
    default:
      return { text: 'غير مفعل ❌', color: '#6c757d' };
  }
};

const isPendingActivation = (type) =>
  !type || type.trim() === 'اشترك الآن';

const isProfileComplete = (profile) => {
  const requiredFields = [
    'name',
    'salon',
    'phone',
    'image',
    'location',
    'openingTime',
    'closingTime',
    'workingHours'
  ];

  return requiredFields.every((field) => {
    const value = profile[field];
    return value &&
      (typeof value !== 'object' || Object.keys(value).length > 0);
  });
};

const StatusPanel = ({
  membershipType,
  approved,
  profile,
  setProfile,
  onLogout,
  onRequestActivateExternal
}) => {
  const status = getStatusDisplay(approved, membershipType);

  const onRequestActivate = () => {
    if (!isProfileComplete(profile)) {
      alert('❗ يرجى إكمال جميع الحقول الأساسية قبل إرسال طلب التفعيل.');
      return;
    }

    const updatedProfile = {
      ...profile,
      membershipType: 'طلب ترقية الحساب'
    };

    setProfile(updatedProfile);
    if (onRequestActivateExternal) {
      onRequestActivateExternal(updatedProfile);
    }

    alert('📤 تم إرسال الطلب بنجاح، بانتظار الموافقة.');
  };

  return (
    <div>
      <h3 className="section-title">🏷️ معلومات الحساب / العضوية</h3>

      <div
        className="barber-status"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >
        <span>
          الحالة:
          <span
            style={{
              marginInlineStart: '6px',
              color: status.color,
              fontWeight: 'bold'
            }}
          >
            {status.text}
          </span>
        </span>

        {isPendingActivation(membershipType) && !approved && (
          <button
            onClick={onRequestActivate}
            className="secondary-button"
            style={{
              padding: '4px 10px',
              fontSize: '0.85rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📤 طلب التفعيل
          </button>
        )}
      </div>

      {isPendingActivation(membershipType) && !approved && (
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>
          أكمل بياناتك الأساسية ثم اضغط على "طلب التفعيل" لإرسال طلبك للإدارة.
        </p>
      )}

      <div className="barber-status">
        نوع العضوية: <span className="bold">{membershipType || 'اشترك الآن'}</span>
      </div>
    </div>
  );
};

export default StatusPanel;

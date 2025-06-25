import React, { useState } from 'react';

const daysOfWeek = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

const WorkingHours = ({ profile, onUpdateField }) => {
  const workingHours = profile.workingHours || {};
  const [editingPeriod, setEditingPeriod] = useState(null); // { day, index }
  const [tempTimes, setTempTimes] = useState({ from: '', to: '' });

  const updateDay = (day, newPeriods) => {
    const updated = { ...workingHours, [day]: newPeriods };
    onUpdateField('workingHours', updated);
  };

  const toggleDay = (day) => {
    const current = workingHours[day] || [];
    updateDay(day, current.length ? [] : [{ from: '', to: '' }]);
  };

  const handleEdit = (day, idx, current) => {
    setEditingPeriod({ day, index: idx });
    setTempTimes({ from: current.from, to: current.to });
  };

  const handleSave = () => {
    const { day, index } = editingPeriod;
    const updated = [...(workingHours[day] || [])];
    updated[index] = { ...tempTimes };
    updateDay(day, updated);
    setEditingPeriod(null);
    setTempTimes({ from: '', to: '' });
  };

  const handleCancel = () => {
    setEditingPeriod(null);
    setTempTimes({ from: '', to: '' });
  };

  const addPeriod = (day) => {
    const updated = [...(workingHours[day] || []), { from: '', to: '' }];
    updateDay(day, updated);
  };

  const removePeriod = (day, index) => {
    const updated = [...(workingHours[day] || [])];
    updated.splice(index, 1);
    updateDay(day, updated);
  };
  

  return (
    <div>
      <h3 className="section-title">🗓️ جدول ساعات العمل</h3>

      {daysOfWeek.map((day) => (
        <div key={day} className="day-block">
          <div className="day-header">
            <label>{day}</label>
            <button
              type="button"
              onClick={() => toggleDay(day)}
              className={`toggle-day-btn ${workingHours[day]?.length ? 'active' : ''}`}
            >
              {workingHours[day]?.length ? 'إغلاق اليوم' : 'تفعيل'}
            </button>
          </div>

          {workingHours[day]?.length > 0 && (
            <div className="periods-container">
              {workingHours[day].map((period, idx) => {
                const isEditing =
                  editingPeriod?.day === day && editingPeriod?.index === idx;

                return (
                  <div key={idx} className="period-row">
                    {isEditing ? (
                      <>
                        <input
                          type="time"
                          value={tempTimes.from}
                          onChange={(e) =>
                            setTempTimes((prev) => ({ ...prev, from: e.target.value }))
                          }
                        />
                        <span>إلى</span>
                        <input
                          type="time"
                          value={tempTimes.to}
                          onChange={(e) =>
                            setTempTimes((prev) => ({ ...prev, to: e.target.value }))
                          }
                        />
                        <button onClick={handleSave}>✅</button>
                        <button onClick={handleCancel}>❌</button>
                      </>
                    ) : (
                      <>
                        <span>{period.from || '--:--'}</span>
                        <span>إلى</span>
                        <span>{period.to || '--:--'}</span>
                        <button onClick={() => handleEdit(day, idx, period)}>✏️</button>
                        <button onClick={() => removePeriod(day, idx)}>🗑️</button>
                      </>
                    )}
                  </div>
                );
              })}

              {workingHours[day].length < 2 && (
                <button type="button" className="add-period-btn" onClick={() => addPeriod(day)}>
                  ➕ إضافة فترة
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkingHours;

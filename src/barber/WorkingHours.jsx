import React, { useState, useEffect } from 'react';
import './WorkingHours.css';

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
  const original = profile.workingHours || {};
  const [localHours, setLocalHours] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalHours({ ...original });
    setEditing(false);
  }, [profile]);

  const handleToggleDay = (day, checked) => {
    setEditing(true);
    setLocalHours(prev => {
      const updated = { ...prev };
      if (checked) {
        const prevDayIndex = daysOfWeek.indexOf(day) - 1;
        const prevDay = daysOfWeek[prevDayIndex >= 0 ? prevDayIndex : 0];
        const prevPeriods = prev[prevDay] || [];
        updated[day] = prevPeriods.length
          ? [...prevPeriods]
          : [{ from: '', to: '' }];
      } else {
        delete updated[day];
      }
      return updated;
    });
  };

  const handleTimeChange = (day, idx, field, value) => {
    setEditing(true);
    setLocalHours(prev => {
      const updated = { ...prev };
      const periods = [...(updated[day] || [])];
      periods[idx] = { ...periods[idx], [field]: value };
      updated[day] = periods;
      return updated;
    });
  };

  const addPeriod = (day) => {
    if ((localHours[day] || []).length >= 2) return;
    setEditing(true);
    setLocalHours(prev => {
      const updated = { ...prev };
      updated[day] = [...(updated[day] || []), { from: '', to: '' }];
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdateField('workingHours', localHours);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalHours({ ...original });
    setEditing(false);
  };

  return (
    <div className="hours-box">
      <h3 className="section-title">🗓️ جدول ساعات العمل</h3>

      <div className="days-grid">
        {daysOfWeek.map(day => {
          const periods = localHours[day] || [];
          const enabled = day in localHours;

          return (
            <div className="day-row" key={day}>
              <label className="day-label">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => handleToggleDay(day, e.target.checked)}
                />
                {day}
              </label>

              <div className="periods-wrapper">
                {enabled &&
                  periods.map((p, idx) => (
                    <div key={idx} className="period-fields">
                      <input
                        type="time"
                        value={p.from}
                        onChange={(e) => handleTimeChange(day, idx, 'from', e.target.value)}
                        className={editing ? 'editable' : 'readonly'}
                        readOnly={!editing}
                      />
                      <span>→</span>
                      <input
                        type="time"
                        value={p.to}
                        onChange={(e) => handleTimeChange(day, idx, 'to', e.target.value)}
                        className={editing ? 'editable' : 'readonly'}
                        readOnly={!editing}
                      />
                    </div>
                  ))}

                {enabled && periods.length < 2 && (
                  <button className="add-period-btn" onClick={() => addPeriod(day)}>
                    ➕ إضافة فترة
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="form-actions">
          <button onClick={handleSave} disabled={saving} className="save-btn">
            {saving ? '💾 جاري الحفظ...' : '✅ حفظ'}
          </button>
          <button onClick={handleCancel} disabled={saving} className="cancel-btn">
            ❌ إلغاء
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkingHours;

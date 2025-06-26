import React, { useState, useEffect } from 'react';
import './ServicesList.css';

const ServicesList = ({ services, onUpdate }) => {
  const [localServices, setLocalServices] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const calculateDiscountedPrice = (price, discount) => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discount) || 0;
    return (p - (p * d) / 100).toFixed(2);
  };

  useEffect(() => {
    const enriched = services.map(s => ({
      ...s,
      discount: s.discount ?? '',
      finalPrice: calculateDiscountedPrice(s.price, s.discount ?? 0)
    }));
    setLocalServices([...enriched, { name: '', price: '', discount: '', finalPrice: '' }]);
    setEditing(false);
  }, [services]);

  const handleFieldChange = (index, field, value) => {
    setEditing(true);
    setLocalServices(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        finalPrice:
          field === 'price' || field === 'discount'
            ? calculateDiscountedPrice(
                field === 'price' ? value : updated[index].price,
                field === 'discount' ? value : updated[index].discount
              )
            : updated[index].finalPrice
      };

      if (
        index === prev.length - 1 &&
        (field === 'name' || field === 'price') &&
        value.trim() !== ''
      ) {
        updated.push({ name: '', price: '', discount: '', finalPrice: '' });
      }

      return updated;
    });
  };

  const handleRemove = (index) => {
    setEditing(true);
    setLocalServices(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const valid = localServices.filter(
      (s) => s.name.trim() && s.price !== '' && !isNaN(s.price)
    );
    await onUpdate(valid);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    const reset = services.map(s => ({
      ...s,
      discount: s.discount ?? '',
      finalPrice: calculateDiscountedPrice(s.price, s.discount ?? 0)
    }));
    setLocalServices([...reset, { name: '', price: '', discount: '', finalPrice: '' }]);
    setEditing(false);
  };

  return (
    <div className="services-box">
      <h3 className="section-title">💼 قائمة الخدمات</h3>

      {localServices.map((service, index) => (
        <div key={index} className="barber-row" onClick={() => setEditing(true)}>
          <div className="field-group">
            <label>اسم الخدمة</label>
            <input
              type="text"
              value={service.name}
              onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
              placeholder="مثلاً: حلاقة شعر"
              className={editing ? 'editable' : 'readonly'}
              readOnly={!editing}
            />
          </div>

          <div className="field-group">
            <label>السعر (ريال)</label>
            <input
              type="number"
              value={service.price}
              onChange={(e) => handleFieldChange(index, 'price', e.target.value)}
              placeholder="50"
              className={editing ? 'editable' : 'readonly'}
              readOnly={!editing}
            />
          </div>

          <div className="field-group">
            <label>نسبة الخصم %</label>
            <input
              type="number"
              value={service.discount}
              onChange={(e) => handleFieldChange(index, 'discount', e.target.value)}
              placeholder="10"
              className={editing ? 'editable' : 'readonly'}
              readOnly={!editing}
            />
          </div>

          <div className="field-group">
            <label>السعر بعد الخصم</label>
            <input
              type="text"
              value={service.finalPrice}
              className="readonly"
              readOnly
            />
          </div>

          {editing && localServices.length > 1 && index < localServices.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(index);
              }}
              title="حذف الخدمة"
            >
              🗑️
            </button>
          )}
        </div>
      ))}

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

export default ServicesList;

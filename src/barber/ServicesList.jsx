import React, { useState } from 'react';

const ServicesList = ({ services, onAdd, onUpdate, onRemove }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempService, setTempService] = useState({ name: '', price: '' });

  const startEdit = (index, service) => {
    setEditingIndex(index);
    setTempService({ ...service });
  };

  const saveEdit = () => {
    if (!tempService.name || !tempService.price) return;
    onUpdate(editingIndex, 'name', tempService.name);
    onUpdate(editingIndex, 'price', tempService.price);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setTempService({ name: '', price: '' });
  };

  return (
    <div>
      <h3 className="section-title">💼 قائمة الخدمات</h3>

      {services.length === 0 && (
        <p style={{ fontStyle: 'italic', color: '#888' }}>لم تتم إضافة أي خدمة بعد.</p>
      )}

      {services.map((service, index) => {
        const isEditing = editingIndex === index;

        return (
          <div key={index} className="barber-row">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={tempService.name}
                  onChange={(e) => setTempService((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم الخدمة"
                  className="barber-input"
                />
                <input
                  type="number"
                  value={tempService.price}
                  onChange={(e) => setTempService((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="السعر"
                  className="barber-input"
                />
                <button onClick={saveEdit}>✅</button>
                <button onClick={cancelEdit}>❌</button>
              </>
            ) : (
              <>
                <span>{service.name || '--'}</span>
                <span>{service.price ? `${service.price} ريال` : '--'}</span>
                <button onClick={() => startEdit(index, service)}>✏️</button>
                <button onClick={() => onRemove(index)}>🗑️</button>
              </>
            )}
          </div>
        );
      })}

      {services.length < 10 && (
        <button onClick={onAdd} className="add-period-btn" style={{ marginTop: '8px' }}>
          ➕ إضافة خدمة جديدة
        </button>
      )}
    </div>
  );
};

export default ServicesList;

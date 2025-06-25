import React from 'react';

const SearchFilter = ({ searchTerm, onSearchChange }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="ابحث عن الحلاق..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          width: '100%',
          maxWidth: '300px',
        }}
      />
    </div>
  );
};

export default SearchFilter;

import React from 'react';
import './ImageUploader.css';

const ImageUploader = ({ imagePreview, onUpload }) => {
  const handleDelete = () => {
    onUpload({ target: { files: [] } });
  };

  const handleFileSelect = (e) => {
    onUpload(e);
  };

  return (
    <div className="image-container-side">
      <div className="image-wrapper">
        {imagePreview ? (
          <img src={imagePreview} alt="معاينة" className="profile-image" />
        ) : (
          <div className="placeholder-image">📸</div>
        )}
      </div>

      <div className="side-buttons">
        <label className="icon-button blue-button">
          {imagePreview ? '✏️' : '📤'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            hidden
          />
        </label>

        {imagePreview && (
          <button className="icon-button red-button" onClick={handleDelete}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

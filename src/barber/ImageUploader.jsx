import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ imagePreview, onUpload }) => {
  const [editing, setEditing] = useState(false);

  const handleDelete = () => {
    onUpload({ target: { files: [] } });
    setEditing(false);
  };

  const handleFileSelect = (e) => {
    onUpload(e);
    setEditing(false);
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
        {!editing ? (
          <button
            className="icon-button edit-button"
            onClick={() => setEditing(true)}
          >
            ✏️
          </button>
        ) : (
          <>
            <label className="icon-button green-button">
              📂
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                hidden
              />
            </label>
            <button
              className="icon-button cancel-button"
              onClick={() => setEditing(false)}
            >
              ❌
            </button>
          </>
        )}

        {imagePreview && !editing && (
          <button className="icon-button red-button" onClick={handleDelete}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

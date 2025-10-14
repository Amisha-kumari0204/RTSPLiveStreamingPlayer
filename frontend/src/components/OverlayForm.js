import React, { useState, useEffect } from 'react';

const OverlayForm = ({ onSave, currentOverlay, setCurrentOverlay }) => {
  const [formData, setFormData] = useState({
    type: 'text',
    content: '',
    x: 10,
    y: 30,
    size: 1,
  });

  useEffect(() => {
    if (currentOverlay) {
      setFormData(currentOverlay);
    } else {
      setFormData({ type: 'text', content: '', x: 10, y: 30, size: 1 });
    }
  }, [currentOverlay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    // Prevents the browser page from reloading on submission
    e.preventDefault();
    // Calls the handleSaveOverlay function in App.js
    onSave(formData);
    setFormData({ type: 'text', content: '', x: 10, y: 30, size: 1 });
    setCurrentOverlay(null);
  };

  return (
    <div className="form-container">
      <h4>{currentOverlay ? 'Edit Overlay' : 'Add New Overlay'}</h4>
      {/* This onSubmit is the key connection */}
      <form onSubmit={handleSubmit}>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="text">Text</option>
          <option value="logo">Logo</option>
        </select>
        {formData.type === 'text' ? (
          <input
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Overlay Text"
            required
          />
        ) : (
          <p><i>Logo uses 'logo-overlay.png' from public folder.</i></p>
        )}
        <input name="x" type="number" value={formData.x} onChange={handleChange} placeholder="X Position" />
        <input name="y" type="number" value={formData.y} onChange={handleChange} placeholder="Y Position" />
        <input name="size" type="number" step="0.1" value={formData.size} onChange={handleChange} placeholder="Size/Scale" />
        
        {/* This button must have type="submit" */}
        <button type="submit">{currentOverlay ? 'Update' : 'Add'} Overlay</button>
        {currentOverlay && <button type="button" onClick={() => setCurrentOverlay(null)}>Cancel Edit</button>}
      </form>
    </div>
  );
};

export default OverlayForm;
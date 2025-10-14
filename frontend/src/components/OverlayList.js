import React from 'react';

const OverlayList = ({ overlays, onEdit, onDelete }) => {
  return (
    <div className="list-container">
      <h4>Saved Overlays</h4>
      <ul>
        {overlays.map((overlay) => (
          <li key={overlay._id}>
            <span>
              <strong>{overlay.type.toUpperCase()}:</strong> {overlay.type === 'text' ? `"${overlay.content}"` : 'Default Logo'} @ ({overlay.x}, {overlay.y})
            </span>
            <div>
              <button onClick={() => onEdit(overlay)}>Edit</button>
              <button onClick={() => onDelete(overlay._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OverlayList;
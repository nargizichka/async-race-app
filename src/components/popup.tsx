import React, { useState } from 'react';
import './home.css';

interface CarData {
  id: number;
  name: string;
  color: string;
  index: number;
}

interface Props {
  carData: CarData;
  handleUpdate: (carData: CarData) => void;
  togglePopup: () => void;
  isPopupOpen?: boolean;
}

const Popup: React.FC<Props> = ({ carData, handleUpdate, togglePopup, isPopupOpen }) => {
  const [newName, setNewName] = useState<string>(carData.name);
  const [newColor, setNewColor] = useState<string>(carData.color);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewColor(e.target.value);
  };

  const handleSubmit = () => {
    handleUpdate({ ...carData, name: newName, color: newColor });
    togglePopup();
    window.location.reload();
  };

  return (
    <div className={`popup-container ${isPopupOpen ? 'active' : ''}`}>
      <div className="popup">
        <h2 className="popup-title">Edit Car</h2>
        <div className="popup-content">
          <div className="form-group">
            <label htmlFor="name" className="form-label">New Name:</label>
            <input type="text" id="name" value={newName} onChange={handleNameChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="color" className="form-label">New Color:</label>
            <input type="color" id="color" value={newColor} onChange={handleColorChange} className="form-input-color" />
          </div>
        </div>
        <div className="popup-actions">
          <button onClick={handleSubmit} className="btn-update">Update</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

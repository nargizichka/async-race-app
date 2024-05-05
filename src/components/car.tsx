import React, { useState, useEffect } from 'react';
import './home.css';
import Popup from './popup';

interface CarData {
  id: number;
  name: string;
  color: string;
  index: number;
}


interface CarProps {
  handleUpdate?: (updatedCarData: CarData) => void;
  carData: CarData;
  isRaceActive: boolean;
  handleRemoveCar: (id: number) => void;
  minAnimationDuration: number;
  animationDuration: string;
  submitCarData: (id: number, animationDuration: string) => void;
  startPage: number;
  endPage: number;
}

const Car: React.FC<CarProps> = ({ carData, isRaceActive, handleRemoveCar, minAnimationDuration, animationDuration, submitCarData, startPage, endPage }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<CarData>(carData);

  useEffect(() => {
    setIsMoving(isRaceActive);
    if (isRaceActive) {
      if (parseFloat(animationDuration) >= minAnimationDuration) {
        submitCarData(carData.id, parseFloat(animationDuration).toString());
      }
    }
  }, [isRaceActive, animationDuration, minAnimationDuration, carData.id]);

  useEffect(() => {
    setUpdatedData(carData);
  }, [carData]);

  const startCar = () => {
    setIsMoving(true);
  };

  const stopCar = () => {
    setIsMoving(false);
  };

  const removeCar = () => {
    handleRemoveCar(carData.id);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

const handleUpdate = (updatedCarData: CarData) => {
    setUpdatedData(updatedCarData);
  
    const url = `http://127.0.0.1:3000/garage/${updatedCarData.id}`;
    const method = 'PUT';
    const postData = {
      id: updatedCarData.id,
      name: updatedCarData.name,
      color: updatedCarData.color
    };
  
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update car data');
      }
      console.log('Car data updated successfully');
    })
    .catch(error => {
      console.error('Error updating car data:', error);
    });
    setIsPopupOpen(false);
  };
  


  if (carData.index>=startPage && carData.index <endPage) {
    return (
      <div className="elem">
        <div className="elemBtns">
          <div className="selectRemove">
            <button className="select" onClick={togglePopup}>select</button>
            <button className="remove" onClick={removeCar}>remove</button>
          </div>
          <div className="ab">
            <button className="a" onClick={startCar}>A</button>
            <button className="b" onClick={stopCar}>B</button>
          </div>
        </div>
        <div className="elemCar">
          <div className={`car ${isMoving ? 'moving' : ''}`} style={{ animationDuration: `${animationDuration}s` }}>
            <svg style={{ fill: carData.color }} className='carIcon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="55" width="55px" id="Car-Repair-Engine--Streamline-Ultimate">
              <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M14.25 21c0 0.2955 0.0582 0.5881 0.1713 0.861 0.113 0.273 0.2788 0.5211 0.4877 0.73 0.2089 0.2089 0.457 0.3747 0.73 0.4877 0.2729 0.1131 0.5655 0.1713 0.861 0.1713s0.5881 -0.0582 0.861 -0.1713c0.273 -0.113 0.5211 -0.2788 0.73 -0.4877 0.2089 -0.2089 0.3747 -0.457 0.4877 -0.73 0.1131 -0.2729 0.1713 -0.5655 0.1713 -0.861s-0.0582 -0.5881 -0.1713 -0.861c-0.113 -0.273 -0.2788 -0.5211 -0.4877 -0.73 -0.2089 -0.2089 -0.457 -0.3747 -0.73 -0.4877 -0.2729 -0.1131 -0.5655 -0.1713 -0.861 -0.1713s-0.5881 0.0582 -0.861 0.1713c-0.273 0.113 -0.5211 0.2788 -0.73 0.4877 -0.2089 0.2089 -0.3747 0.457 -0.4877 0.73 -0.1131 0.2729 -0.1713 0.5655 -0.1713 0.861Z" strokeWidth="0.5"></path>
              <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M3.75 21c0 0.5967 0.23705 1.169 0.65901 1.591 0.42196 0.4219 0.99425 0.659 1.59099 0.659 0.59674 0 1.16903 -0.2371 1.59099 -0.659 0.42196 -0.422 0.65901 -0.9943 0.65901 -1.591s-0.23705 -1.169 -0.65901 -1.591C7.16903 18.9871 6.59674 18.75 6 18.75c-0.59674 0 -1.16903 0.2371 -1.59099 0.659 -0.42196 0.422 -0.65901 0.9943 -0.65901 1.591Z" strokeWidth="0.5"></path>
              <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M14.382 21.75H8.11798" strokeWidth="0.5"></path>
              <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M3.881 21.75H2.25c-0.39782 0 -0.77936 -0.158 -1.06066 -0.4393C0.908035 21.0294 0.75 20.6478 0.75 20.25v-1.5c0 -0.7956 0.31607 -1.5587 0.87868 -2.1213 0.56261 -0.5626 1.32567 -0.8787 2.12132 -0.8787l1.835 -3.671c0.12463 -0.2492 0.3162 -0.4587 0.55323 -0.6051 0.23703 -0.1465 0.51016 -0.224 0.78877 -0.2239h4.9c0.2786 -0.0001 0.5517 0.0774 0.7888 0.2239 0.237 0.1464 0.4286 0.3559 0.5532 0.6051L15 15.75h5.25c0.7956 0 1.5587 0.3161 2.1213 0.8787 0.5626 0.5626 0.8787 1.3257 0.8787 2.1213v1.5c0 0.3978 -0.158 0.7794 -0.4393 1.0607s-0.6629 0.4393 -1.0607 0.4393h-3.13" strokeWidth="0.5"></path>
              <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" d="M15 15.75H3.75" strokeWidth="0.5"></path>
            </svg>
          </div>
          <p className="elemName">{updatedData.name}</p>
        </div>
        {isPopupOpen ? <Popup carData={carData} handleUpdate={handleUpdate} togglePopup={togglePopup} /> : null}
      </div>
    );
  }
  return null;
};

export default Car;

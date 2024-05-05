import React, { useState, useEffect } from 'react';
import './home.css';
import Car from './car';
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";
import Popup2 from './popup2'; 

interface CarData {
  id: number;
  wins?: number;
  duration: string;
  color: string;
  time: number;
  name: string;
  index: number;
}

interface WinnerData {
  wins: number;
  time: number;
}

interface RaceProps {
  isRaceActive: boolean;
}

const Race: React.FC<RaceProps> = ({ isRaceActive }) => {
  const history = useNavigate();

  const [allCars, setAllCars] = useState<CarData[]>([]);
  const [animationDurations, setAnimationDurations] = useState<string[]>([]);
  const [minAnimationDuration, setMinAnimationDuration] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupCar, setPopupCar] = useState<CarData | null>(null);
  const carsPerPage: number = 7;
  const [numberOfCars, setNumberOfCars] = useState<number>()
  useEffect(() => {
    if (!isRaceActive) {
      fetchCarsFromGarage();
    }
  }, [isRaceActive]);

  useEffect(() => {
    setMinAnimationDuration(Math.min(...animationDurations.map(duration => parseFloat(duration))));
  }, [animationDurations]);

  useEffect(() => {
    if (isRaceActive) {
      const popupTimeout = setTimeout(() => {
        const carIndex = animationDurations.findIndex(duration => parseFloat(duration) === minAnimationDuration);
        if (carIndex !== -1) {
          setPopupCar(allCars[carIndex]);
          setShowPopup(true);
        }
      }, 5000);

      return () => clearTimeout(popupTimeout);
    }
  }, [isRaceActive, minAnimationDuration, animationDurations, allCars]);

  useEffect(() => {
    if (showPopup) {
      const redirectTimeout = setTimeout(() => {
        redirectToWinnersPage();
      }, 6000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [showPopup]);

  const redirectToWinnersPage = () => {
    history('/winners');
  };

  const fetchCarsFromGarage = () => {
    fetch('http://127.0.0.1:3000/garage/')
      .then(response => response.json())
      .then((data: CarData[]) => {
        setNumberOfCars(data.length);
        setAllCars(data);
        const durations = Array(data.length).fill('').map(() => (Math.random() * 3 + 2).toFixed(2));
        setAnimationDurations(durations.map(duration => parseFloat(duration).toFixed(2)));
        setMinAnimationDuration(Math.min(...durations.map(duration => parseFloat(duration))));
      })
      .catch(error => {
        console.error('Error fetching cars data:', error);
      });
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const startCarIndex = currentPage * carsPerPage;
  const endCarIndex = Math.min(startCarIndex + carsPerPage, allCars.length);
  const carsInRace = [];
  for (let i = 0; i < allCars.length; i++) {
    carsInRace.push(allCars[i]);
    carsInRace[i].duration = animationDurations[i];
    carsInRace[i].index = i;
  }
  console.log(carsInRace);
  

  const handleRemoveCar = (id: number) => {
    setAllCars(allCars.filter(car => car.id !== id));
    setAnimationDurations(animationDurations.filter((_, index) => index !== id));
    fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'DELETE',
    })
    fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('Error removing car:', error);
      });
  };

  const submitCarData = async (carId: number, animationDuration: string) => {
    try {
      const winnerResponse = await fetch(`http://127.0.0.1:3000/winners/${carId}`);
      const isCarInWinners = winnerResponse.ok;
      let existingTime = 0;

      const postData: { wins: number, time: number } = {
        time: parseFloat(animationDuration),
        wins: 0
      };
  
      let method = 'POST';
      let url = 'http://127.0.0.1:3000/winners/';
  
      if (isCarInWinners) {
        method = 'PUT';
        url += carId;
        
        const winnerData = await winnerResponse.json() as WinnerData;
        existingTime = winnerData.time;
        postData.wins = (winnerData.wins || 0) + (parseFloat(animationDuration) === minAnimationDuration ? 1 : 0);

        if (parseFloat(animationDuration) < existingTime) {
          postData.time =  parseFloat(animationDuration);
        } 
        else {
          postData.time = existingTime;
        }

      } else {
        postData.wins = parseFloat(animationDuration) === minAnimationDuration ? 1 : 0;
      }
  
      const postResponse = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (!postResponse.ok) {
        throw new Error('Failed to submit car data');
      }
      console.log('Car data submitted successfully');
    } catch (error) {
      console.error('Error submitting car data:', error);
    }
  };  
  
  return (
    <div className="mainArea">
      <div className="cars">
        <h3>garage({numberOfCars})</h3>
      {carsInRace.map((car, index) => (
          <Car
            key={car.id} 
            carData={car}
            isRaceActive={isRaceActive}
            handleRemoveCar={handleRemoveCar}
            animationDuration={animationDurations[index]}
            minAnimationDuration={minAnimationDuration}
            submitCarData={() => submitCarData(car.id, car.duration)} 
            startPage={startCarIndex}
            endPage={endCarIndex}
          />
        ))}
      </div>
      <ReactPaginate
        pageCount={Math.ceil(allCars.length / carsPerPage)}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
      {popupCar && (
        <Popup2 popupCar={popupCar} onClose={() => setPopupCar(null)} />
      )}
    </div>
  );
};

export default Race;

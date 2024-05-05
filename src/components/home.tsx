import React, { useState } from 'react';
import './home.css';
import Race from './race';
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [color1, setColor1] = useState<string>('#ffffff');
  const [isRaceActive, setIsRaceActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carName, setCarName] = useState<string>('');

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor1(event.target.value);
  };

  const startRace = () => {
    if (!isRaceActive) {
      setIsRaceActive(true);
    }
  };

  const resetRace = () => {
    setIsRaceActive(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const postData = {
      name: carName,
      color: color1
    };

    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    };

    fetch('http://127.0.0.1:3000/garage/', options)
      .then(response => {
        setIsLoading(false);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setCarName('');
        setColor1('#ffffff');
        return response.json();
      })
      .then(data => {
        console.log('POST request succeeded with JSON response:', data);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error making POST request:', error);
      });
  };

  const generateRandomCars = () => {
    setIsLoading(true);
      const companies = ['Ford', 'Tesla', 'Mercedes', 'BMW', 'Audi', 'Mazda'];
    const models = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'II', 'JJ', 'KK', 'LL', 'MM', 
      'NN', 'OO', 'PP', 'QQ', 'RR', 'SS', 'TT', 'UU', 'VV', 'WW', 'XX', 'YY', 'ZZ',
      'A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8', 'I9', 'J0'
    ];
  
    const randomCars = Array.from({ length: 100 }, () => {
      const companyName = companies[Math.floor(Math.random() * companies.length)];
      const modelName = companyName === 'Tesla' ? 'Model ' +  models[Math.floor(Math.random() * models.length)]: models[Math.floor(Math.random() * models.length)];
      return {
        name: `${companyName} ${modelName}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
      };
    });
  
    const postRequests = randomCars.map(car => {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
      };
      return fetch('http://127.0.0.1:3000/garage/', options);
    });
  
    Promise.all(postRequests)
      .then(responses => {
        setIsLoading(false);
        console.log('All random cars posted successfully:', responses);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error posting random cars:', error);
      });
  };
  
  
  

  return (
    <div className="home">
      <div className="container">
        <div className="buttonsAll">
        <div className="buttons">
          <Link to='/'>
            <button className='garageBtn'>GARAGE</button>
          </Link>
          <Link to='/winners'>
            <button className='winnersBtn'>WINNERS</button>
          </Link>
        </div>
        <div className="instructions">
          <div className="instructionMain">
            <button className="race" onClick={startRace} disabled={isRaceActive}>race</button>
            <button className="reset" onClick={resetRace}>reset</button>
          </div>
          <div className="generate">
          <form onSubmit={handleFormSubmit}>
            <div className="createBrand">
              <input type="text" className="brand" placeholder='type car brand' value={carName} onChange={(e) => setCarName(e.target.value)} />
              <input type="color" className="colorPicker" value={color1} onChange={handleColorChange} />
              <button type="submit" className="creat" disabled={isLoading}>CREATE</button>
            </div>
          </form>
          <button className='generateRandom' onClick={generateRandomCars} disabled={isLoading}>Generate Cars</button>
          </div>
          </div>
        </div>
        <Race isRaceActive={isRaceActive} />
      </div>
    </div>
  );
};

export default Home;

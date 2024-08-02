import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TrackDetails from './TrackDetails';
import styled from 'styled-components';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #181818;
  color: white;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

function App() {
  const [musicData, setMusicData] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    fetch('https://cms.samespace.com/items/songs')
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setMusicData(data.data);
        } else {
          console.error('Fetched data is not in the expected format:', data);
        }
      })
      .catch(error => console.error('Error fetching music data:', error));
  }, []);

  const handleTrackChange = (index) => {
    setCurrentTrackIndex(index);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicData.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? musicData.length - 1 : prevIndex - 1
    );
  };

  return (
    <AppContainer className="App">
      <Sidebar tracks={musicData} setSelectedTrack={handleTrackChange} />
      <TrackDetails
        track={musicData[currentTrackIndex]}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </AppContainer>
  );
}

export default App;

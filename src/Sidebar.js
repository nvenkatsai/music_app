import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 100%;
  background-color: #121212;
  padding: 20px;
  overflow-y: auto;

  @media (min-width: 768px) {
    width: 25%;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
`;

const TrackList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TrackItem = styled.li`
  padding: 10px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #282828;
  }
`;

const TrackImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
`;

const TrackName = styled.div`
  margin-top: 10px;
  color: white;
`;

const TrackArtist = styled.div`
  color: #b3b3b3;
`;
const Title = styled.h1`
  color: #1db954;
  text-align: center;
  margin-bottom: 20px;
`;
const Sidebar = ({ tracks, setSelectedTrack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTracks = tracks.filter((track) =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarContainer>
      <Title>VPlayer</Title>
      <SearchBar
        type="text"
        placeholder="Search Song, Artist"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <TrackList>
        {filteredTracks.map((track, index) => (
          <TrackItem key={track.id} onClick={() => setSelectedTrack(index)}>
            <TrackImage src={track.cover} alt={`${track.name} cover`} />
            <TrackName>{track.name}</TrackName>
            <TrackArtist>{track.artist}</TrackArtist>
          </TrackItem>
        ))}
      </TrackList>
    </SidebarContainer>
  );
};

export default Sidebar;

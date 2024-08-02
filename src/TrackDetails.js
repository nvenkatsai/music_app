import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const DetailsContainer = styled.div`
  width: 100%;
  background-color: #181818;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (min-width: 768px) {
    width: 75%;
  }
`;

const CoverImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const TrackTitle = styled.h1`
  margin: 0;
  font-size: 2em;
`;

const ArtistName = styled.h2`
  margin: 10px 0;
  color: #b3b3b3;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5em;
  margin: 0 10px;
  cursor: pointer;

  &:hover {
    color: #1db954;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const ProgressBar = styled.input`
  width: 100%;
  margin: 0 10px;
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 0.8em;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const VolumeSlider = styled.input`
  width: 100px;
  margin-left: 10px;
`;

const AudioPlayer = styled.audio`
  display: none;
`;

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const TrackDetails = ({ track, onNext, onPrevious }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (track) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const newVolume = e.target.value;
      audio.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === '0');
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
        setIsMuted(false);
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  };

  if (!track) {
    return (
      <DetailsContainer>
        <p>Select a track to see details</p>
      </DetailsContainer>
    );
  }

  return (
    <DetailsContainer>
      <CoverImage src={track.cover} alt={`${track.name} cover`} />
      <TrackTitle>{track.name}</TrackTitle>
      <ArtistName>{track.artist}</ArtistName>
      <ControlsContainer>
        <ControlButton onClick={onPrevious}>⏮</ControlButton>
        <ControlButton onClick={handlePlayPause}>
          {isPlaying ? '⏸' : '▶️'}
        </ControlButton>
        <ControlButton onClick={onNext}>⏭</ControlButton>
      </ControlsContainer>
      <ProgressBarContainer>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <ProgressBar
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
        />
        <TimeDisplay>{formatTime(duration)}</TimeDisplay>
      </ProgressBarContainer>
      <VolumeContainer>
        <ControlButton onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </ControlButton>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </VolumeContainer>
      <AudioPlayer ref={audioRef} src={track.url} controls />
    </DetailsContainer>
  );
};

export default TrackDetails;

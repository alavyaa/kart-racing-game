import React, { useState } from 'react';
import './App.css';
import Lobby from './components/Lobby';
import Game from './components/Game';

function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby');
  const [roomCode, setRoomCode] = useState(null);
  const [username, setUsername] = useState(null);
  const [roomData, setRoomData] = useState(null);

  const handleStartGame = (code, user, room) => {
    setRoomCode(code);
    setUsername(user);
    setRoomData(room);
    setCurrentScreen('game');
  };

  const handleQuitGame = () => {
    setCurrentScreen('lobby');
    setRoomCode(null);
    setUsername(null);
    setRoomData(null);
  };

  return (
    <div className="app">
      {currentScreen === 'lobby' && (
        <Lobby onStartGame={handleStartGame} />
      )}
      {currentScreen === 'game' && (
        <Game
          roomCode={roomCode}
          username={username}
          initialRoomData={roomData}
          onQuit={handleQuitGame}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ color: "white", fontSize: "30px" }}>
      🚗 Game is working!
    </div>
  );
}
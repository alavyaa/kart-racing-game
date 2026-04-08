import React, { useState } from 'react';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import '../styles/Lobby.css';

export default function Lobby({ onStartGame }) {
  const [screen, setScreen] = useState('menu'); // menu, create, join

  return (
    <div className="lobby-container">
      {screen === 'menu' && (
        <div className="lobby-menu">
          <div className="lobby-header">
            <h1>🏎️ Kart Racing</h1>
            <p>Multiplayer Racing Game</p>
          </div>

          <div className="lobby-buttons">
            <button
              className="lobby-button primary"
              onClick={() => setScreen('create')}
            >
              Create Room
            </button>
            <button
              className="lobby-button secondary"
              onClick={() => setScreen('join')}
            >
              Join Room
            </button>
          </div>

          <div className="lobby-info">
            <p>Race against your friends in real-time multiplayer!</p>
          </div>
        </div>
      )}

      {screen === 'create' && (
        <CreateRoom onStartGame={onStartGame} onBack={() => setScreen('menu')} />
      )}

      {screen === 'join' && (
        <JoinRoom onStartGame={onStartGame} onBack={() => setScreen('menu')} />
      )}
    </div>
  );
}
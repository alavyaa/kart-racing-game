import React from 'react';
import PlayerStats from './PlayerStats';
import '../styles/Game.css';

export default function GameUI({
  roomCode,
  username,
  roomData,
  gameRunning,
  isHost,
  onStartGame,
  onStopGame,
  onQuit,
}) {
  return (
    <div className="game-ui">
      <div className="game-header">
        <div className="game-info">
          <h2>Room: {roomCode}</h2>
          <p>Players: {roomData?.playerCount || 0}/{roomData?.maxPlayers || 8}</p>
        </div>

        <div className="game-controls">
          {isHost && !gameRunning && (
            <button className="control-button start" onClick={onStartGame}>
              Start Game
            </button>
          )}
          {isHost && gameRunning && (
            <button className="control-button stop" onClick={onStopGame}>
              Stop Game
            </button>
          )}
          <button className="control-button quit" onClick={onQuit}>
            Quit
          </button>
        </div>
      </div>

      <div className="game-sidebar">
        <div className="sidebar-section">
          <h3>Players</h3>
          {roomData?.players && (
            <PlayerStats
              players={roomData.players}
              currentUsername={username}
            />
          )}
        </div>

        <div className="sidebar-section">
          <h3>Controls</h3>
          <div className="controls-info">
            <p><strong>W/↑</strong> - Accelerate</p>
            <p><strong>S/↓</strong> - Brake</p>
            <p><strong>A/←</strong> - Turn Left</p>
            <p><strong>D/→</strong> - Turn Right</p>
            <p><strong>Space</strong> - Drift</p>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Status</h3>
          <p>
            {gameRunning ? (
              <span className="status-running">● Game Running</span>
            ) : (
              <span className="status-waiting">● Waiting</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
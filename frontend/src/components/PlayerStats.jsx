import React from 'react';

export default function PlayerStats({ players, currentUsername }) {
  return (
    <div className="player-stats">
      {players.map((player) => (
        <div
          key={player.id}
          className={`player-stat ${
            player.username === currentUsername ? 'current' : ''
          }`}
        >
          <div className="player-color" style={{ backgroundColor: player.color }} />
          <div className="player-name">{player.username}</div>
          {player.username === currentUsername && <span className="current-badge">(You)</span>}
        </div>
      ))}
    </div>
  );
}
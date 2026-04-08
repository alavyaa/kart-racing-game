import React, { useEffect, useState, useRef } from 'react';
import {
  onRoomUpdated,
  onGameStarted,
  onGameStopped,
  leaveRoom,
} from '../services/socketService';
import { useGame } from '../hooks/useGame';
import GameUI from './GameUI';
import '../styles/Game.css';

export default function Game({ roomCode, username, initialRoomData, onQuit }) {
  const canvasRef = useRef(null);
  const [roomData, setRoomData] = useState(initialRoomData);
  const [gameRunning, setGameRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const {
    isRunning: engineRunning,
    error: engineError,
    initializeGame,
    updateGameState,
    startGame,
    stopGame,
  } = useGame(canvasRef, initialRoomData.players[0].id, roomCode);

  // Check if current player is host
  useEffect(() => {
    if (roomData) {
      setIsHost(roomData.hostId === initialRoomData.players[0].id);
    }
  }, [roomData, initialRoomData]);

  // Setup socket listeners
  useEffect(() => {
    const handleRoomUpdate = (updatedRoom) => {
      setRoomData(updatedRoom);
    };

    const handleGameStarted = (data) => {
      setGameRunning(true);
      initializeGame(roomData);
    };

    const handleGameStopped = () => {
      setGameRunning(false);
    };

    onRoomUpdated(handleRoomUpdate);
    onGameStarted(handleGameStarted);
    onGameStopped(handleGameStopped);

    return () => {
      // Cleanup listeners
    };
  }, [roomData, initializeGame]);

  const handleQuit = async () => {
    try {
      await leaveRoom();
      onQuit();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGameState = (gameState) => {
    updateGameState(gameState);
  };

  useEffect(() => {
    const { onGameStateUpdate } = require('../services/socketService');
    const listener = onGameStateUpdate(handleGameState);
    return () => {
      // Cleanup
    };
  }, []);

  if (error || engineError) {
    return (
      <div className="game-error">
        <h2>Error</h2>
        <p>{error || engineError}</p>
        <button onClick={handleQuit}>Back to Lobby</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <GameUI
        roomCode={roomCode}
        username={username}
        roomData={roomData}
        gameRunning={gameRunning}
        isHost={isHost}
        onStartGame={startGame}
        onStopGame={stopGame}
        onQuit={handleQuit}
      />

      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
}
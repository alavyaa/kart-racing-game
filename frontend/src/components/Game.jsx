import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  onRoomUpdated,
  onGameStarted,
  onGameStopped,
  onGameStateUpdate,
  offRoomUpdated,
  offGameStarted,
  offGameStopped,
  offGameStateUpdate,
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Validate initial room data before attempting to use it
  useEffect(() => {
    if (!initialRoomData || !initialRoomData.players || initialRoomData.players.length === 0) {
      setError('Invalid room data: no players found');
      return;
    }
    setIsInitialized(true);
  }, [initialRoomData]);

  const playerId = useMemo(
    () => (isInitialized ? initialRoomData?.players?.[0]?.id ?? null : null),
    [isInitialized, initialRoomData]
  );

  const {
    isRunning: engineRunning,
    error: engineError,
    initializeGame,
    updateGameState,
    startGame,
    stopGame,
  } = useGame(canvasRef, playerId, roomCode);

  // Check if current player is host
  useEffect(() => {
    if (roomData && playerId) {
      setIsHost(roomData.hostId === playerId);
    }
  }, [roomData, playerId]);

  // Setup socket listeners
  useEffect(() => {
    if (!isInitialized) return;

    const handleRoomUpdate = (updatedRoom) => {
      setRoomData(updatedRoom);
    };

    const handleGameStarted = () => {
      setGameRunning(true);
      if (roomData) {
        initializeGame(roomData);
      }
    };

    const handleGameStopped = () => {
      setGameRunning(false);
    };

    const handleGameState = (gameState) => {
      updateGameState(gameState);
    };

    onRoomUpdated(handleRoomUpdate);
    onGameStarted(handleGameStarted);
    onGameStopped(handleGameStopped);
    onGameStateUpdate(handleGameState);

    return () => {
      offRoomUpdated(handleRoomUpdate);
      offGameStarted(handleGameStarted);
      offGameStopped(handleGameStopped);
      offGameStateUpdate(handleGameState);
    };
  }, [isInitialized, roomData, initializeGame, updateGameState]);

  const handleQuit = async () => {
    try {
      await leaveRoom();
      onQuit();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error || engineError) {
    return (
      <div className="game-error">
        <h2>Error</h2>
        <p>{error || engineError}</p>
        <button onClick={handleQuit}>Back to Lobby</button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="game-loading">
        <h2>Loading Game...</h2>
        <p>Please wait while we initialize the game.</p>
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
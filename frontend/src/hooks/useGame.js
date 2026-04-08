import { useState, useCallback, useRef, useEffect } from 'react';
import { GameEngine } from '../game/GameEngine';
import { InputHandler } from '../game/InputHandler';
import {
  startGame,
  stopGame,
  sendPlayerInput,
} from '../services/socketService';

export const useGame = (canvasRef, playerId, roomCode) => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const gameEngineRef = useRef(null);
  const inputHandlerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const initializeGame = useCallback(async (roomData) => {
    try {
      if (!canvasRef.current) {
        throw new Error('Canvas reference not found');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      gameEngineRef.current = new GameEngine(canvas, ctx, roomData, playerId);
      inputHandlerRef.current = new InputHandler();

      setIsRunning(true);
      setError(null);

      // Start the game loop
      const gameLoop = () => {
        if (gameEngineRef.current) {
          const inputState = inputHandlerRef.current.getInputState();
          gameEngineRef.current.update(inputState);
          gameEngineRef.current.render();

          // Send input to server
          sendPlayerInput(inputState);
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } catch (err) {
      setError(err.message);
      setIsRunning(false);
    }
  }, [canvasRef, playerId]);

  const updateGameState = useCallback((gameState) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.updateGameState(gameState);
    }
  }, []);

  const handleStartGame = useCallback(async () => {
    try {
      await startGame();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleStopGame = useCallback(async () => {
    try {
      await stopGame();
      cleanup();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (gameEngineRef.current) {
      gameEngineRef.current.destroy();
      gameEngineRef.current = null;
    }
    if (inputHandlerRef.current) {
      inputHandlerRef.current.destroy();
      inputHandlerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isRunning,
    error,
    initializeGame,
    updateGameState,
    startGame: handleStartGame,
    stopGame: handleStopGame,
    cleanup,
  };
};
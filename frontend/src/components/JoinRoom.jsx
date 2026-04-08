import React, { useState, useEffect } from 'react';
import { joinRoom, listRooms } from '../services/socketService';
import { validateUsername, validateRoomCode } from '../utils/validators';
import '../styles/Lobby.css';

export default function JoinRoom({ onStartGame, onBack }) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    try {
      const rooms = await listRooms();
      setAvailableRooms(rooms);
    } catch (err) {
      console.error('Failed to load available rooms:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error);
      return;
    }

    const codeValidation = validateRoomCode(roomCode);
    if (!codeValidation.valid) {
      setError(codeValidation.error);
      return;
    }

    setLoading(true);

    try {
      const response = await joinRoom(username, codeValidation.code);
      onStartGame(codeValidation.code, username, response.room);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAvailable = async (code) => {
    setRoomCode(code);
    setLoading(true);

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error);
      setLoading(false);
      return;
    }

    try {
      const response = await joinRoom(username, code);
      onStartGame(code, username, response.room);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lobby-container">
      <div className="lobby-form">
        <h2>Join Room</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Your Name:</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              maxLength="20"
            />
          </div>

          <div className="form-group">
            <label htmlFor="roomCode">Room Code:</label>
            <input
              id="roomCode"
              type="text"
              placeholder="Enter 6-digit room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              disabled={loading}
              maxLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-buttons">
            <button
              type="submit"
              className="lobby-button primary"
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join'}
            </button>
            <button
              type="button"
              className="lobby-button secondary"
              onClick={onBack}
              disabled={loading}
            >
              Back
            </button>
          </div>
        </form>

        <div className="available-rooms">
          <button
            className="show-rooms-button"
            onClick={() => setShowAvailable(!showAvailable)}
          >
            {showAvailable ? 'Hide Available Rooms' : 'Show Available Rooms'} ({availableRooms.length})
          </button>

          {showAvailable && (
            <div className="rooms-list">
              {availableRooms.length === 0 ? (
                <p>No rooms available</p>
              ) : (
                availableRooms.map((room) => (
                  <div key={room.code} className="room-item">
                    <div className="room-info">
                      <div className="room-code">{room.code}</div>
                      <div className="room-host">Host: {room.hostUsername}</div>
                      <div className="room-players">
                        {room.playerCount}/{room.maxPlayers}
                      </div>
                    </div>
                    <button
                      className="join-room-button"
                      onClick={() => handleJoinAvailable(room.code)}
                      disabled={loading || !username}
                    >
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
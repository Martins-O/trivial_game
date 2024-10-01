import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { fetchGameRooms, createGameRoom,  } from '../api';
import {GameRoom} from "../types";

const LobbyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const GameRoomList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GameRoomItem = styled.li`
  background-color: #f0f0f0;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
`;

const CreateRoomForm = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const GameLobby: React.FC = () => {
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    const loadGameRooms = async () => {
      const rooms = await fetchGameRooms();
      setGameRooms(rooms);
    };
    loadGameRooms();
    const interval = setInterval(loadGameRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      const newRoom = await createGameRoom(newRoomName);
      setGameRooms([...gameRooms, newRoom]);
      setNewRoomName('');
    }
  };

  return (
    <LobbyContainer>
      <h2>Game Lobby</h2>
      <CreateRoomForm onSubmit={handleCreateRoom}>
        <Input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter room name"
        />
        <Button type="submit">Create Room</Button>
      </CreateRoomForm>
      <GameRoomList>
        {gameRooms.map((room) => (
          <GameRoomItem key={room.id}>
            <Link to={`/game/${room.name}`}>{room.name}</Link> ({room.players.length} players)
          </GameRoomItem>
        ))}
      </GameRoomList>
    </LobbyContainer>
  );
};

export default GameLobby;
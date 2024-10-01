import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Auth from './components/Auth';
import Game from './components/Game';
import Leaderboard from './components/LeaderBoard';
import GameLobby from './components/GameLobby';
import MultiplayerGame from './components/MultiplayerGame';
import { User } from "./types";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Navigation = styled.nav`
  margin-bottom: 20px;
`;

const NavLink = styled(Link)`
  margin-right: 10px;
  text-decoration: none;
  color: #333;
  &:hover {
    text-decoration: underline;
  }
`;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <AppContainer>
        <h1>Trivia Game</h1>
        {user ? (
          <>
            <Navigation>
              <NavLink to="/game">Single Player</NavLink>
              <NavLink to="/lobby">Multiplayer</NavLink>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
              <button onClick={() => setUser(null)}>Logout</button>
            </Navigation>
            <Routes>
              <Route path="/game" element={<Game />} />
              <Route path="/lobby" element={<GameLobby />} />
              <Route path="/game/:roomName" element={<MultiplayerGame />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<Navigate to="/game" replace />} />
            </Routes>
          </>
        ) : (
          <Auth onAuth={setUser} />
        )}
      </AppContainer>
    </Router>
  );
};

export default App;
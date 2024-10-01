import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchLeaderboard } from '../api';
import {UserProfile} from "../types";

const LeaderboardContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const LeaderboardRow = styled.tr`
  &:nth-child(even) {
    background-color: #e0e0e0;
  }
`;

const LeaderboardCell = styled.td`
  padding: 10px;
  text-align: left;
`;

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    };
    loadLeaderboard();
  }, []);

  return (
    <LeaderboardContainer>
      <h2>Leaderboard</h2>
      <LeaderboardTable>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <LeaderboardRow key={user.username}>
              <LeaderboardCell>{index + 1}</LeaderboardCell>
              <LeaderboardCell>{user.username}</LeaderboardCell>
              <LeaderboardCell>{user.total_score}</LeaderboardCell>
            </LeaderboardRow>
          ))}
        </tbody>
      </LeaderboardTable>
    </LeaderboardContainer>
  );
};

export default Leaderboard;

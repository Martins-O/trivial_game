import React from 'react';
import styled from 'styled-components';

const ScoreBoardContainer = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

interface Props {
  score: number;
  totalQuestions: number;
}

const ScoreBoard: React.FC<Props> = ({ score, totalQuestions }) => {
  return (
    <ScoreBoardContainer>
      <h3>Score: {score} / {totalQuestions}</h3>
    </ScoreBoardContainer>
  );
};

export default ScoreBoard;
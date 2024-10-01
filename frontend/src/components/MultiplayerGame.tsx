import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
// @ts-ignore
import useWebSocket, { ReadyState } from 'react-use-websocket';
import useSound from 'use-sound';
// @ts-ignore
import correctSound from '../sounds/correct.mp3';
// @ts-ignore
import incorrectSound from '../sounds/incorrect.mp3';

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PlayerList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const QuestionContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const AnswerButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #008CBA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color:#007B9A;
  }
`;

interface Question {
  id: number;
  text: string;
  answers: string[];
}

const MultiplayerGame: React.FC = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [playCorrectSound] = useSound(correctSound);
  const [playIncorrectSound] = useSound(incorrectSound);
  const [players, setPlayers] = useState<string[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://localhost:8000/ws/game/${roomName}/`);

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      switch (data.type) {
        case 'user_joined':
          setPlayers(prevPlayers => [...prevPlayers, data.username]);
          break;
        case 'game_started':
          setQuestion(data.question);
          break;
        case 'answer_result':
          if (data.is_correct) {
            playCorrectSound();
            setScores(prevScores => ({
              ...prevScores,
              [data.username]: (prevScores[data.username] || 0) + 1
            }));
          } else {
            playIncorrectSound();
          }
          break;
      }
    }
  }, [lastMessage, playCorrectSound, playIncorrectSound]);

  const handleAnswer = useCallback((answer: string) => {
    sendMessage(JSON.stringify({
      type: 'submit_answer',
      answer: answer
    }));
  }, [sendMessage]);

  const startGame = useCallback(() => {
    sendMessage(JSON.stringify({ type: 'start_game' }));
  }, [sendMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <GameContainer>
      <h2>Game Room: {roomName}</h2>
      <p>Connection status: {connectionStatus}</p>
      <PlayerList>
        {players.map(player => (
          <li key={player}>{player}: {scores[player] || 0}</li>
        ))}
      </PlayerList>
      {question ? (
        <QuestionContainer>
          <h3>{question.text}</h3>
          {question.answers.map((answer, index) => (
            <AnswerButton key={index} onClick={() => handleAnswer(answer)}>
              {answer}
            </AnswerButton>
          ))}
        </QuestionContainer>
      ) : (
        <button onClick={startGame}>Start Game</button>
      )}
    </GameContainer>
  );
};

export default MultiplayerGame;

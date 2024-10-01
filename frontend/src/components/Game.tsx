import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchRandomQuestions, fetchCategories } from '../api';
import Question from './Question';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';
import { Question as QuestionType, Category } from '../types';

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const Game: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  const startGame = async () => {
    const fetchedQuestions = await fetchRandomQuestions(10, selectedCategory, selectedDifficulty);
    setQuestions(fetchedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameOver(false);
    setTimeLeft(30);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    } else {
      setGameOver(true);
    }
  };

  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    } else {
      setGameOver(true);
    }
  };

  if (questions.length === 0) {
    return (
      <GameContainer>
        <h1>Trivia Game</h1>
        <GameControls>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </Select>
          <Select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
          <Button onClick={startGame}>Start Game</Button>
        </GameControls>
      </GameContainer>
    );
  }

  if (gameOver) {
    return (
      <GameContainer>
        <h1>Game Over</h1>
        <ScoreBoard score={score} totalQuestions={questions.length} />
        <Button onClick={startGame}>Play Again</Button>
      </GameContainer>
    );
  }
  return (
    <GameContainer>
      <ScoreBoard score={score} totalQuestions={questions.length} />
      <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} onTimeUp={handleTimeUp} />
      <Question
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        timeLeft={timeLeft}
      />
    </GameContainer>
  );
};

export default Game;


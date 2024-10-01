import React from 'react';
import styled from 'styled-components';
import { Question as QuestionType } from '../types';

const QuestionContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const QuestionText = styled.h2`
  margin-bottom: 15px;
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
    background-color: #007B9A;
  }
`;

interface Props {
  question: QuestionType;
  onAnswer: (isCorrect: boolean) => void;
  timeLeft: number;
}

const Question: React.FC<Props> = ({ question, onAnswer, timeLeft }) => {
  const answers = [
    question.correct_answer,
    question.wrong_answer1,
    question.wrong_answer2,
    question.wrong_answer3,
  ].sort(() => Math.random() - 0.5);

  return (
    <QuestionContainer>
      <QuestionText>{question.text}</QuestionText>
      <p>Category: {question.category.name} | Difficulty: {question.difficulty}</p>
      <p>Time left: {timeLeft} seconds</p>
      {answers.map((answer, index) => (
        <AnswerButton
          key={index}
          onClick={() => onAnswer(answer === question.correct_answer)}
          disabled={timeLeft === 0}
        >
          {answer}
        </AnswerButton>
      ))}
    </QuestionContainer>
  );
};

export default Question;

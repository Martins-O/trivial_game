export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserProfile {
  username: string;
  total_score: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  text: string;
  correct_answer: string;
  wrong_answer1: string;
  wrong_answer2: string;
  wrong_answer3: string;
  category: Category;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameRoom {
  id: number;
  name: string;
  players: User[];
  is_active: boolean;
}

export interface GameState {
  currentQuestion?: Question;
  players: {
    [username: string]: {
      score: number;
      hasAnswered: boolean;
    };
  };
  timeRemaining: number;
}
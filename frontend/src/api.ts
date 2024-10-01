import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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
  difficulty: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserProfile {
  username: string;
  total_score: number;
}

export interface GameRoom {
  id: number;
  name: string;
  players: User[];
  is_active: boolean;
}

// Authentication
export const login = async (username: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/accounts/login/`, { username, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/accounts/register/`, { username, email, password });
  return response.data;
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data;
};

// Questions
export const fetchRandomQuestions = async (
  count: number,
  category?: string,
  difficulty?: string
): Promise<Question[]> => {
  let url = `${API_URL}/questions/random/?count=${count}`;
  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;
  const response = await axios.get(url);
  return response.data;
};

// Leaderboard
export const fetchLeaderboard = async (): Promise<UserProfile[]> => {
  const response = await axios.get(`${API_URL}/leaderboard/`);
  return response.data;
};

// Game Rooms
export const fetchGameRooms = async (): Promise<GameRoom[]> => {
  const response = await axios.get(`${API_URL}/game-rooms/`);
  return response.data;
};

export const createGameRoom = async (name: string): Promise<GameRoom> => {
  const response = await axios.post(`${API_URL}/game-rooms/`, { name });
  return response.data;
};

export const joinGameRoom = async (roomId: number): Promise<GameRoom> => {
  const response = await axios.post(`${API_URL}/game-rooms/${roomId}/join/`);
  return response.data;
};

export const leaveGameRoom = async (roomId: number): Promise<void> => {
  await axios.post(`${API_URL}/game-rooms/${roomId}/leave/`);
};

// User Profile
export const updateUserProfile = async (userId: number, score: number): Promise<UserProfile> => {
  const response = await axios.patch(`${API_URL}/user-profile/${userId}/`, { total_score: score });
  return response.data;
};
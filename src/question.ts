export interface Question {
  id: string;
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  subcategory: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface ExamResult {
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  questions: AnsweredQuestion[];
  timeRemaining: number;
}

export interface AnsweredQuestion {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface StudyProgress {
  questionId: string;
  timesAnswered: number;
  timesCorrect: number;
  lastAnswered: string | null;
  isBookmarked: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type AppView = 'home' | 'study' | 'exam' | 'results' | 'review' | 'progress' | 'settings';

export type ExamState = 'idle' | 'running' | 'paused' | 'finished';

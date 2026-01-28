export interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export interface Chapter {
  id: number;
  name: string;
  tasks: Task[];
}

export interface Subject {
  id: number;
  name: string;
  color: string; // New property for subject color
  chapters: Chapter[];
}

export interface Session {
  id: number;
  subject: string;
  duration: number;
  questions: number;
  correctQuestions: number;
  date: string;
  completed: boolean;
}

export type TabType = 'pomodoro' | 'subjects' | 'stats' | 'calendar' | 'achievements' | 'library' | 'settings';

export type ColorMode = 'vibrant' | 'monochrome';

export type BackgroundMode = 'default' | 'grid' | 'dots' | 'aurora' | 'solid' | 'stars' | 'ocean' | 'sunset';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  isUnlocked: boolean;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  addedAt: string;
  completed?: boolean; // Indicates if the book has been read
}
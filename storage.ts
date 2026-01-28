import { Subject, Session, ColorMode, BackgroundMode, Book } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'study-subjects',
  SESSIONS: 'study-sessions',
  DAILY_GOAL: 'study-daily-goal',
  PRIMARY_COLOR: 'study-primary-color',
  COLOR_MODE: 'study-color-mode',
  BACKGROUND_MODE: 'study-background-mode',
  VOLUME: 'study-volume',
  NOTIFICATIONS: 'study-notifications-enabled',
  LIBRARY: 'study-library-books',
};

export const storageService = {
  getSubjects: (): Subject[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading subjects:', error);
      return [];
    }
  },

  saveSubjects: (subjects: Subject[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  },

  getSessions: (): Session[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  saveSessions: (sessions: Session[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  },

  getDailyGoal: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      return data ? parseInt(data, 10) : 120; // Default 2 hours (120 mins)
    } catch (error) {
      return 120;
    }
  },

  saveDailyGoal: (minutes: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, minutes.toString());
    } catch (error) {
      console.error('Error saving daily goal:', error);
    }
  },

  getPrimaryColor: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR) || '#ffffff';
    } catch (error) {
      return '#ffffff';
    }
  },

  savePrimaryColor: (color: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, color);
    } catch (error) {
      console.error('Error saving primary color:', error);
    }
  },

  getColorMode: (): ColorMode => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.COLOR_MODE);
      return (mode === 'vibrant' || mode === 'monochrome') ? mode : 'vibrant';
    } catch (error) {
      return 'vibrant';
    }
  },

  saveColorMode: (mode: ColorMode): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLOR_MODE, mode);
    } catch (error) {
      console.error('Error saving color mode:', error);
    }
  },

  getBackgroundMode: (): BackgroundMode => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.BACKGROUND_MODE);
      // Validate against known types
      if (['default', 'grid', 'dots', 'aurora', 'solid', 'stars', 'ocean', 'sunset'].includes(mode as string)) {
        return mode as BackgroundMode;
      }
      return 'default';
    } catch (error) {
      return 'default';
    }
  },

  saveBackgroundMode: (mode: BackgroundMode): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_MODE, mode);
    } catch (error) {
      console.error('Error saving background mode:', error);
    }
  },

  getVolume: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOLUME);
      return data ? parseFloat(data) : 0.5; // Default 50%
    } catch (error) {
      return 0.5;
    }
  },

  saveVolume: (volume: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
    } catch (error) {
      console.error('Error saving volume:', error);
    }
  },

  getNotificationsEnabled: (): boolean => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data !== null ? JSON.parse(data) : true;
    } catch (error) {
      return true;
    }
  },

  saveNotificationsEnabled: (enabled: boolean): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving notifications settings:', error);
    }
  },

  getBooks: (): Book[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading books:', error);
      return [];
    }
  },

  saveBooks: (books: Book[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(books));
    } catch (error) {
      console.error('Error saving books:', error);
    }
  },

  clearAll: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  // --- Backup Features ---

  createBackup: (): string => {
    const backup = {
      subjects: JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]'),
      sessions: JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]'),
      dailyGoal: localStorage.getItem(STORAGE_KEYS.DAILY_GOAL) || '120',
      primaryColor: localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR) || '#ffffff',
      colorMode: localStorage.getItem(STORAGE_KEYS.COLOR_MODE) || 'vibrant',
      backgroundMode: localStorage.getItem(STORAGE_KEYS.BACKGROUND_MODE) || 'default',
      volume: localStorage.getItem(STORAGE_KEYS.VOLUME) || '0.5',
      notificationsEnabled: localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || 'true',
      library: JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARY) || '[]'),
      timestamp: new Date().toISOString(),
      version: 1
    };
    return JSON.stringify(backup, null, 2);
  },

  restoreBackup: (jsonString: string): boolean => {
    try {
      const backup = JSON.parse(jsonString);
      
      // Validação de Segurança e Integridade
      // Garante que subjects e sessions sejam Arrays. Se for null/undefined/objeto, o app quebraria.
      if (!Array.isArray(backup.subjects) || !Array.isArray(backup.sessions)) {
        console.error("Formato de backup inválido: 'subjects' ou 'sessions' não são listas.");
        return false;
      }

      // Validação opcional da biblioteca
      if (backup.library && !Array.isArray(backup.library)) {
        console.error("Formato de backup inválido: 'library' não é uma lista.");
        return false;
      }

      // Salva os dados validados
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(backup.subjects));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(backup.sessions));
      
      if (backup.dailyGoal) localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, backup.dailyGoal);
      if (backup.primaryColor) localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, backup.primaryColor);
      if (backup.colorMode) localStorage.setItem(STORAGE_KEYS.COLOR_MODE, backup.colorMode);
      if (backup.backgroundMode) localStorage.setItem(STORAGE_KEYS.BACKGROUND_MODE, backup.backgroundMode);
      if (backup.volume) localStorage.setItem(STORAGE_KEYS.VOLUME, backup.volume);
      if (backup.notificationsEnabled) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, backup.notificationsEnabled);
      
      if (backup.library) {
        localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(backup.library));
      } else {
        // Se não tiver biblioteca no backup, reseta para array vazio para evitar undefined
        localStorage.setItem(STORAGE_KEYS.LIBRARY, '[]');
      }
      
      return true;
    } catch (error) {
      console.error("Falha na restauração do backup:", error);
      return false;
    }
  }
};
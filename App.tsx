import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Clock, BookOpen, BarChart3, Calendar as CalendarIcon, Flame, Settings as SettingsIcon, Trophy, Library as LibraryIcon } from 'lucide-react';
import { CustomStyles } from './components/CustomStyles';
import { PomodoroTimer } from './components/PomodoroTimer';
import { SubjectManager } from './components/SubjectManager';
import { Statistics } from './components/Statistics';
import { Calendar } from './components/Calendar';
import { Settings } from './components/Settings';
import { Achievements } from './components/Achievements';
import { Library } from './components/Library';
import { storageService } from './services/storage';
import { soundService } from './services/sound';
import { Subject, Session, TabType, ColorMode, BackgroundMode, Book } from './types';

const StudyTrackerApp = () => {
  // --- Main State ---
  const [activeTab, setActiveTab] = useState<TabType>('pomodoro');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(120);
  const [primaryColor, setPrimaryColor] = useState<string>('#ffffff');
  const [colorMode, setColorMode] = useState<ColorMode>('vibrant');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('default');
  const [volume, setVolume] = useState<number>(0.5);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);

  // --- Pomodoro State ---
  const [studyTime, setStudyTime] = useState<number | ''>(25);
  const [breakTime, setBreakTime] = useState<number | ''>(5);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionsResolved, setQuestionsResolved] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [correctQuestions, setCorrectQuestions] = useState(0);

  const intervalRef = useRef<number | null>(null);

  // --- Initialization ---
  const loadData = useCallback(() => {
    const loadedSubjects = storageService.getSubjects();
    const loadedSessions = storageService.getSessions();
    const loadedGoal = storageService.getDailyGoal();
    const loadedColor = storageService.getPrimaryColor();
    const loadedColorMode = storageService.getColorMode();
    const loadedBackgroundMode = storageService.getBackgroundMode();
    const loadedVolume = storageService.getVolume();
    const loadedNotifications = storageService.getNotificationsEnabled();
    const loadedBooks = storageService.getBooks();
    
    setSubjects(loadedSubjects);
    setSessions(loadedSessions);
    setDailyGoal(loadedGoal);
    setPrimaryColor(loadedColor);
    setColorMode(loadedColorMode);
    setBackgroundMode(loadedBackgroundMode);
    setVolume(loadedVolume);
    setNotificationsEnabled(loadedNotifications);
    setLibraryBooks(loadedBooks);
    
    // Apply volume immediately
    soundService.setVolume(loadedVolume);
  }, []);

  useEffect(() => {
    loadData();
    // Request notification permission if enabled
    if (Notification.permission === 'default') {
      // We don't force it immediately on load to not annoy user, 
      // it's handled in the timer or settings toggle
    }
  }, [loadData]);

  // --- Persistence ---
  const handleSaveSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    storageService.saveSubjects(newSubjects);
  }, []);

  const handleSaveSessions = useCallback((newSessions: Session[]) => {
    setSessions(newSessions);
    storageService.saveSessions(newSessions);
  }, []);
  
  const handleSaveGoal = useCallback((minutes: number) => {
    setDailyGoal(minutes);
    storageService.saveDailyGoal(minutes);
  }, []);
  
  const handleColorChange = useCallback((color: string) => {
    setPrimaryColor(color);
    storageService.savePrimaryColor(color);
  }, []);

  const handleColorModeChange = useCallback((mode: ColorMode) => {
    setColorMode(mode);
    storageService.saveColorMode(mode);
  }, []);

  const handleBackgroundModeChange = useCallback((mode: BackgroundMode) => {
    setBackgroundMode(mode);
    storageService.saveBackgroundMode(mode);
  }, []);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(vol);
    storageService.saveVolume(vol);
    soundService.setVolume(vol);
    // Play a short beep to test volume
    if (vol > 0) soundService.playStart(); 
  }, []);

  const handleNotificationsChange = useCallback((enabled: boolean) => {
    setNotificationsEnabled(enabled);
    storageService.saveNotificationsEnabled(enabled);
  }, []);

  const handleAddBook = useCallback((book: Book) => {
    const newBooks = [book, ...libraryBooks];
    setLibraryBooks(newBooks);
    storageService.saveBooks(newBooks);
  }, [libraryBooks]);

  const handleRemoveBook = useCallback((id: string) => {
    const newBooks = libraryBooks.filter(b => b.id !== id);
    setLibraryBooks(newBooks);
    storageService.saveBooks(newBooks);
  }, [libraryBooks]);

  const handleToggleBookStatus = useCallback((id: string) => {
    const newBooks = libraryBooks.map(book => 
      book.id === id ? { ...book, completed: !book.completed } : book
    );
    setLibraryBooks(newBooks);
    storageService.saveBooks(newBooks);
  }, [libraryBooks]);

  // --- Streak Logic ---
  const streak = useMemo(() => {
    // Helper to get YYYY-MM-DD from a Date object in local time
    const getLocalYMD = (date: Date) => {
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().split('T')[0];
    };

    const uniqueSessionDates = new Set(
      sessions.map(s => getLocalYMD(new Date(s.date)))
    );

    let count = 0;
    const today = new Date();
    const todayStr = getLocalYMD(today);

    // If we studied today, start count at 1 and look backwards from yesterday
    // If we didn't study today, look backwards from yesterday. If yesterday exists, streak is valid.
    
    let currentDate = today;
    
    // Check if today is present
    if (uniqueSessionDates.has(todayStr)) {
      count = 1;
    } 
    
    // Move to yesterday for the loop
    currentDate.setDate(currentDate.getDate() - 1);
    
    while (true) {
      const dateStr = getLocalYMD(currentDate);
      
      if (uniqueSessionDates.has(dateStr)) {
        count++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Break only if we also didn't study today (streak = 0) 
        // OR if we studied today (streak > 0) but missed the previous day.
        break;
      }
    }

    return count;
  }, [sessions]);

  // --- Title Calculation (Based on Achievement Counts) ---
  const userTitle = useMemo(() => {
    // Re-calculating stats for title logic (duplicated briefly from Achievements component to keep Header synced)
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const uniqueSubjects = new Set(sessions.map(s => s.subject)).size;
    const maxDurationSession = Math.max(...sessions.map(s => s.duration), 0);

    let unlockedCount = 0;
    
    // Check achievements (Must match logic in Achievements.tsx)
    if (sessions.length >= 1) unlockedCount++;
    if (maxDurationSession >= 50) unlockedCount++;
    if (totalMinutes >= 600) unlockedCount++;
    if (totalMinutes >= 6000) unlockedCount++;
    if (streak >= 3) unlockedCount++;
    if (streak >= 7) unlockedCount++;
    if (streak >= 30) unlockedCount++;
    if (uniqueSubjects >= 3) unlockedCount++;
    if (subjects.length >= 5) unlockedCount++;

    // Determine Title based on count
    if (unlockedCount >= 8) return "Mestre do Conhecimento";
    if (unlockedCount >= 6) return "Erudito";
    if (unlockedCount >= 4) return "Estudante Dedicado";
    if (unlockedCount >= 2) return "Aprendiz";
    return "Novato";
  }, [sessions, subjects, streak]);


  // --- Timer Logic ---
  const finishSession = useCallback(() => {
    if (!selectedSubject) return;

    const currentStudyTime = Number(studyTime) || 25;
    
    // Uses the full determined time for stats as requested
    const durationInMinutes = currentStudyTime;

    const newSession: Session = {
      id: Date.now(),
      subject: selectedSubject,
      duration: durationInMinutes,
      questions: questionsResolved,
      correctQuestions: correctQuestions,
      date: new Date().toISOString(),
      completed: true // Always mark as completed since user explicitly finalized or timer finished
    };

    const newSessions = [...sessions, newSession];
    handleSaveSessions(newSessions);

    setIsRunning(false);
    setTimeLeft(currentStudyTime * 60);
    setQuestionsResolved(0);
    setCorrectQuestions(0);
  }, [selectedSubject, studyTime, questionsResolved, correctQuestions, sessions, handleSaveSessions]);

  const handleTimerComplete = useCallback(() => {
    // Play sound when timer completes
    soundService.playAlarm();
    
    setIsRunning(false);
    const currentStudyTime = Number(studyTime) || 25;
    const currentBreakTime = Number(breakTime) || 5;

    if (!isBreak) {
      finishSession();
      setIsBreak(true);
      setTimeLeft(currentBreakTime * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(currentStudyTime * 60);
    }
  }, [isBreak, studyTime, breakTime, finishSession]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Check for timer completion
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning, handleTimerComplete]);


  const startTimer = useCallback(() => {
    if (!selectedSubject && !isBreak) {
      alert('Selecione uma matéria!');
      return;
    }
    setIsRunning(true);
  }, [selectedSubject, isBreak]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stopSession = useCallback(() => {
    const currentStudyTime = Number(studyTime) || 25;
    if (isBreak) {
      setIsRunning(false);
      setIsBreak(false);
      setTimeLeft(currentStudyTime * 60);
    } else {
      finishSession();
    }
  }, [isBreak, studyTime, finishSession]);

  // --- Subject Logic ---
  
  // High Contrast Neon Palette (Full Spectrum - Expanded)
  const SUBJECT_COLORS = [
    '#ef4444', // Neon Red
    '#f97316', // Neon Orange
    '#facc15', // Neon Yellow
    '#84cc16', // Neon Lime
    '#10b981', // Neon Emerald
    '#06b6d4', // Neon Cyan
    '#3b82f6', // Neon Blue
    '#8b5cf6', // Neon Violet
    '#d946ef', // Neon Fuchsia
    '#f43f5e', // Neon Rose
    '#14b8a6', // Neon Teal
    '#6366f1', // Neon Indigo
    '#ec4899', // Neon Pink
    '#0ea5e9', // Neon Sky
    '#a855f7', // Neon Purple
  ];

  // Monochrome Palette (Zinc Scale - Visible on dark backgrounds)
  const MONOCHROME_COLORS = [
    '#ffffff', // White
    '#fafafa', // Zinc 50
    '#f4f4f5', // Zinc 100
    '#e4e4e7', // Zinc 200
    '#d4d4d8', // Zinc 300
    '#a1a1aa', // Zinc 400
    '#71717a', // Zinc 500
    '#52525b', // Zinc 600 - Darkest visible
  ];

  const addSubject = (name: string) => {
    let selectedColor;
    
    // Choose palette based on Color Mode
    const palette = colorMode === 'vibrant' ? SUBJECT_COLORS : MONOCHROME_COLORS;
    
    // 1. Get colors currently in use
    const usedColors = new Set(subjects.map(s => s.color));
    
    // 2. Find colors from selected palette that are NOT in use
    const availableColors = palette.filter(color => !usedColors.has(color));
    
    // 3. If we have unused colors, pick one of them randomly
    if (availableColors.length > 0) {
       selectedColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    } else {
       // 4. If all colors are used, recycle from the full list (randomly)
       selectedColor = palette[Math.floor(Math.random() * palette.length)];
    }

    const newSubject: Subject = {
      id: Date.now(),
      name,
      color: selectedColor,
      chapters: []
    };
    handleSaveSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (id: number) => {
    handleSaveSubjects(subjects.filter(s => s.id !== id));
  };

  const addChapter = (subjectId: number) => {
    const newSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: [...subject.chapters, {
            id: Date.now(),
            name: 'Novo Capítulo',
            tasks: []
          }]
        };
      }
      return subject;
    });
    handleSaveSubjects(newSubjects);
  };

  const updateChapterName = (subjectId: number, chapterId: number, newName: string) => {
    const newSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: subject.chapters.map(chapter =>
            chapter.id === chapterId ? { ...chapter, name: newName } : chapter
          )
        };
      }
      return subject;
    });
    handleSaveSubjects(newSubjects);
  };

  const deleteChapter = (subjectId: number, chapterId: number) => {
    const newSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: subject.chapters.filter(c => c.id !== chapterId)
        };
      }
      return subject;
    });
    handleSaveSubjects(newSubjects);
  };

  const addTask = (subjectId: number, chapterId: number) => {
    const newSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: subject.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                tasks: [...chapter.tasks, {
                  id: Date.now(),
                  name: 'Nova Tarefa',
                  completed: false
                }]
              };
            }
            return chapter;
          })
        };
      }
      return subject;
    });
    handleSaveSubjects(newSubjects);
  };

  const updateTaskName = (subjectId: number, chapterId: number, taskId: number, newName: string) => {
    const newSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: subject.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                tasks: chapter.tasks.map(task =>
                  task.id === taskId ? { ...task, name: newName } : task
                )
              };
            }
            return chapter;
          })
        };
      }
      return subject;
    });
    handleSaveSubjects(newSubjects);
  };

  const toggleTask = (subjectId: number, chapterId: number, taskId: number) => {
    const newSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: subject.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                tasks: chapter.tasks.map(task =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                )
              };
            }
            return chapter;
          })
        };
      }
      return subject;
    });
    handleSaveSubjects(newSubjects);
  };

  const deleteTask = (subjectId: number, chapterId: number, taskId: number) => {
    const newSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          chapters: subject.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                tasks: chapter.tasks.filter(t => t.id !== taskId)
              };
            }
            return chapter;
          })
        };
      }
      return subject;
    });
    handleSaveSubjects(newSubjects);
  };

  // Get active subject for timer color (optional nice-to-have)
  const activeSubjectData = subjects.find(s => s.name === selectedSubject);

  return (
    <div className="app">
      <CustomStyles primaryColor={primaryColor} backgroundMode={backgroundMode} />
      <div className="header">
        <div className="header-content">
          <h1>Study Tracker</h1>
          
          <div className="badges-container">
            {/* Title Badge (Replaced Level) */}
            <div className="title-badge">
               <Trophy className="trophy-icon" size={20} />
               <div className="title-label">
                  <span className="title-text">{userTitle}</span>
                  <span>Título Atual</span>
               </div>
            </div>

            {/* Streak Badge */}
            <div className="streak-badge">
               <Flame className="fire-icon" size={24} fill="#f59e0b" />
               <div className="streak-label">
                  <span className="streak-count">{streak}</span>
                  <span>Streak</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'pomodoro' ? 'active' : ''}`} onClick={() => setActiveTab('pomodoro')}>
          <Clock size={18} /> Pomodoro
        </button>
        <button className={`tab ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => setActiveTab('subjects')}>
          <BookOpen size={18} /> Matérias
        </button>
        <button className={`tab ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
          <LibraryIcon size={18} /> Biblioteca
        </button>
        <button className={`tab ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>
          <Trophy size={18} /> Conquistas
        </button>
        <button className={`tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <BarChart3 size={18} /> Estatísticas
        </button>
        <button className={`tab ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
          <CalendarIcon size={18} /> Calendário
        </button>
         <button className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <SettingsIcon size={18} /> Configurações
        </button>
      </div>

      <div className="content">
        {activeTab === 'pomodoro' && (
          <PomodoroTimer
            isBreak={isBreak}
            isRunning={isRunning}
            timeLeft={timeLeft}
            studyTime={studyTime}
            breakTime={breakTime}
            selectedSubject={selectedSubject}
            questionsResolved={questionsResolved}
            correctQuestions={correctQuestions}
            subjects={subjects}
            onStart={startTimer}
            onPause={pauseTimer}
            onStop={stopSession}
            onStudyTimeChange={(val) => {
              setStudyTime(val);
              if (!isRunning) setTimeLeft((Number(val) || 1) * 60);
            }}
            onBreakTimeChange={setBreakTime}
            onStudyTimeBlur={() => {
              if (studyTime === '' || Number(studyTime) < 1) {
                setStudyTime(1);
                if (!isRunning) setTimeLeft(60);
              }
            }}
            onBreakTimeBlur={() => {
              if (breakTime === '' || Number(breakTime) < 1) {
                setBreakTime(1);
              }
            }}
            onSubjectChange={setSelectedSubject}
            onQuestionsResolvedChange={setQuestionsResolved}
            onCorrectQuestionsChange={(val) => setCorrectQuestions(Math.min(val, questionsResolved))}
            notificationsEnabled={notificationsEnabled}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectManager
            subjects={subjects}
            onAddSubject={addSubject}
            onDeleteSubject={deleteSubject}
            onAddChapter={addChapter}
            onDeleteChapter={deleteChapter}
            onUpdateChapterName={updateChapterName}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onUpdateTaskName={updateTaskName}
            onToggleTask={toggleTask}
          />
        )}

        {activeTab === 'library' && (
          <Library 
            myBooks={libraryBooks}
            onAddBook={handleAddBook}
            onRemoveBook={handleRemoveBook}
            onToggleStatus={handleToggleBookStatus}
          />
        )}

        {activeTab === 'achievements' && (
          <Achievements 
            sessions={sessions} 
            subjects={subjects} 
            streak={streak} 
          />
        )}

        {activeTab === 'stats' && (
          <Statistics sessions={sessions} subjects={subjects} />
        )}

        {activeTab === 'calendar' && (
          <Calendar 
            sessions={sessions} 
            dailyGoal={dailyGoal}
            onUpdateGoal={handleSaveGoal}
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            onDataImported={loadData} 
            primaryColor={primaryColor} 
            onColorChange={handleColorChange}
            colorMode={colorMode}
            onColorModeChange={handleColorModeChange}
            backgroundMode={backgroundMode}
            onBackgroundModeChange={handleBackgroundModeChange}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            notificationsEnabled={notificationsEnabled}
            onNotificationsChange={handleNotificationsChange}
          />
        )}
      </div>
    </div>
  );
};

export default StudyTrackerApp;
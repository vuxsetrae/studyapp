import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, ChevronDown, Check } from 'lucide-react';
import { Subject } from '../types';
import { soundService } from '../services/sound';

interface PomodoroTimerProps {
  isBreak: boolean;
  isRunning: boolean;
  timeLeft: number;
  studyTime: number | '';
  breakTime: number | '';
  selectedSubject: string;
  questionsResolved: number;
  correctQuestions: number;
  subjects: Subject[];
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onStudyTimeChange: (val: number | '') => void;
  onBreakTimeChange: (val: number | '') => void;
  onStudyTimeBlur: () => void;
  onBreakTimeBlur: () => void;
  onSubjectChange: (val: string) => void;
  onQuestionsResolvedChange: (val: number) => void;
  onCorrectQuestionsChange: (val: number) => void;
  notificationsEnabled: boolean;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isBreak,
  isRunning,
  timeLeft,
  studyTime,
  breakTime,
  selectedSubject,
  questionsResolved,
  correctQuestions,
  subjects,
  onStart,
  onPause,
  onStop,
  onStudyTimeChange,
  onBreakTimeChange,
  onStudyTimeBlur,
  onBreakTimeBlur,
  onSubjectChange,
  onQuestionsResolvedChange,
  onCorrectQuestionsChange,
  notificationsEnabled,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic Browser Title
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(timeLeft)} - ${isBreak ? 'Pausa' : 'Foco'}`;
    } else {
      document.title = 'Study Tracker';
    }
    
    // Reset title on unmount
    return () => {
       if (!isRunning) document.title = 'Study Tracker';
    };
  }, [timeLeft, isRunning, isBreak]);

  // Handle Notifications when timer hits 0 (Checked via previous state in logic, 
  // but strictly triggering notification here relies on effect monitoring transition to 0/stopping)
  useEffect(() => {
    if (timeLeft === 0 && !isRunning && notificationsEnabled) {
        if (Notification.permission === 'granted') {
             new Notification(isBreak ? "Intervalo Terminado!" : "Foco Terminado!", {
                body: isBreak ? "Hora de voltar aos estudos." : "Bom trabalho! Hora de uma pausa.",
                icon: "/favicon.ico" // Assuming favicon exists, or browser default
             });
        }
    }
  }, [timeLeft, isRunning, notificationsEnabled, isBreak]);

  const timerMax = isBreak ? (Number(breakTime) || 1) * 60 : (Number(studyTime) || 1) * 60;
  const progress = (timerMax - timeLeft) / timerMax * 100;

  const handleStart = () => {
    // Request permission on first interaction if needed
    if (notificationsEnabled && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    soundService.playStart();
    onStart();
  };

  const handleStop = () => {
    soundService.playStop();
    onStop();
  };
  
  // Find current subject object to get color
  const currentSubjectObj = subjects.find(s => s.name === selectedSubject);

  return (
    <div className="pomodoro-container">
      {/* MAIN CENTERED CARD */}
      <div className="timer-card">
        <div className="timer-header">
          <h2>{isBreak ? 'INTERVALO' : 'TEMPO DE ESTUDO'}</h2>
        </div>

        <div className="timer-circle">
          <svg className="timer-svg" viewBox="0 0 200 200">
            <circle className="timer-bg" cx="100" cy="100" r="90" />
            <circle
              className="timer-progress"
              cx="100"
              cy="100"
              r="90"
              style={{
                strokeDasharray: `${2 * Math.PI * 90}`,
                strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`
              }}
            />
          </svg>
          <div className="timer-display">
            <div className="time-text">{formatTime(timeLeft)}</div>
            {!isBreak && selectedSubject && (
              <div className="subject-display">{selectedSubject}</div>
            )}
          </div>
        </div>
        
        {/* Minimalist Inputs embedded in main card */}
        <div className="time-config-row">
          <div className="mini-config-item">
            <label className="mini-label">Foco (min)</label>
            <input
              type="number"
              value={studyTime}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === '' || inputValue === null) {
                  onStudyTimeChange('');
                  return;
                }
                const val = parseInt(inputValue, 10);
                if (!isNaN(val) && val >= 1) {
                  onStudyTimeChange(val);
                }
              }}
              onBlur={onStudyTimeBlur}
              className="mini-input"
              disabled={isRunning}
              min="1"
            />
          </div>

          <div className="mini-config-item">
            <label className="mini-label">Pausa (min)</label>
             <input
              type="number"
              value={breakTime}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === '' || inputValue === null) {
                  onBreakTimeChange('');
                  return;
                }
                const val = parseInt(inputValue, 10);
                if (!isNaN(val) && val >= 1) {
                  onBreakTimeChange(val);
                }
              }}
              onBlur={onBreakTimeBlur}
              className="mini-input"
              disabled={isRunning}
              min="1"
            />
          </div>
        </div>

        <div className="timer-controls">
          {!isRunning ? (
            <button onClick={handleStart} className="btn-primary">
              <Play size={20} /> Iniciar
            </button>
          ) : (
            <button onClick={onPause} className="btn-secondary">
              <Pause size={20} /> Pausar
            </button>
          )}
          <button onClick={handleStop} className="btn-danger">
            <Square size={20} /> Finalizar
          </button>
        </div>
      </div>

      {/* SECONDARY CARD - Hidden if on break or if user wants ultra clean look, but needed for functionality */}
      {!isBreak && (
        <div className="settings-card secondary-card">
          <div className="secondary-grid">
            <div className="setting-group" style={{gridColumn: 'span 3'}}>
              <label>Matéria Atual</label>
              
              {/* Custom Dropdown */}
              <div className="custom-select-container">
                {isDropdownOpen && (
                  <div className="click-overlay" onClick={() => setIsDropdownOpen(false)} />
                )}
                
                <div 
                  className={`custom-select-trigger ${isRunning ? 'disabled' : ''}`} 
                  onClick={() => !isRunning && setIsDropdownOpen(!isDropdownOpen)}
                >
                   {selectedSubject ? (
                     <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                        <div 
                          className="option-dot" 
                          style={{
                            backgroundColor: currentSubjectObj?.color || 'var(--primary-color)',
                            boxShadow: `0 0 5px ${currentSubjectObj?.color || 'var(--primary-color)'}`
                          }} 
                        />
                        {selectedSubject}
                     </div>
                   ) : (
                     <span style={{color: 'var(--text-muted)'}}>Selecione uma matéria...</span>
                   )}
                   <ChevronDown size={18} color="var(--text-muted)" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {isDropdownOpen && (
                  <div className="custom-select-options">
                     {subjects.length === 0 ? (
                       <div style={{padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                          Nenhuma matéria cadastrada.
                       </div>
                     ) : (
                       subjects.map(subject => (
                        <div 
                          key={subject.id} 
                          className={`custom-option ${selectedSubject === subject.name ? 'selected' : ''}`}
                          onClick={() => {
                            onSubjectChange(subject.name);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div 
                            className="option-dot" 
                            style={{
                              backgroundColor: subject.color || '#ccc',
                              boxShadow: `0 0 5px ${subject.color || '#ccc'}`
                            }} 
                          />
                          <span style={{flex: 1}}>{subject.name}</span>
                          {selectedSubject === subject.name && <Check size={16} color="var(--primary-color)" />}
                        </div>
                       ))
                     )}
                  </div>
                )}
              </div>

            </div>

            <div className="setting-group">
              <label>Questões</label>
              <input
                type="number"
                value={questionsResolved}
                onChange={(e) => onQuestionsResolvedChange(Number(e.target.value))}
                min="0"
                placeholder="Total"
              />
            </div>

            <div className="setting-group">
              <label>Acertos</label>
              <input
                type="number"
                value={correctQuestions}
                onChange={(e) => onCorrectQuestionsChange(Number(e.target.value))}
                min="0"
                max={questionsResolved}
                placeholder="Corretas"
              />
            </div>
            
            <div className="setting-group" style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
               <div style={{fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center'}}>
                 Aproveitamento: {questionsResolved > 0 ? Math.round((correctQuestions / questionsResolved) * 100) : 0}%
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
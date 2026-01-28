import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Session } from '../types';

interface CalendarProps {
  sessions: Session[];
  dailyGoal: number;
  onUpdateGoal: (minutes: number) => void;
}

interface DayData {
  totalDuration: number;
  totalQuestions: number;
  totalCorrect: number;
  subjects: Record<string, {
    duration: number;
    questions: number;
    correct: number;
  }>;
}

export const Calendar: React.FC<CalendarProps> = ({ sessions, dailyGoal, onUpdateGoal }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  // Helper to format minutes into H:MM
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  // Process session data
  const sessionsByDate = useMemo(() => {
    const grouped: Record<string, DayData> = {};
    
    sessions.forEach(session => {
      // Extract YYYY-MM-DD
      const dateKey = session.date.split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { 
          totalDuration: 0, 
          totalQuestions: 0,
          totalCorrect: 0,
          subjects: {} 
        };
      }
      
      grouped[dateKey].totalDuration += session.duration;
      grouped[dateKey].totalQuestions += (session.questions || 0);
      grouped[dateKey].totalCorrect += (session.correctQuestions || 0);
      
      if (!grouped[dateKey].subjects[session.subject]) {
        grouped[dateKey].subjects[session.subject] = {
          duration: 0,
          questions: 0,
          correct: 0
        };
      }
      
      grouped[dateKey].subjects[session.subject].duration += session.duration;
      grouped[dateKey].subjects[session.subject].questions += (session.questions || 0);
      grouped[dateKey].subjects[session.subject].correct += (session.correctQuestions || 0);
    });
    
    return grouped;
  }, [sessions]);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateKey(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateKey(null);
  };

  const days = [];
  // Empty slots for days before the 1st
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const data = sessionsByDate[dateStr];
    const isSelected = selectedDateKey === dateStr;
    
    // Goal Logic
    const duration = data ? data.totalDuration : 0;
    const isGoalMet = duration >= dailyGoal;
    const isWarning = duration > 0 && duration < dailyGoal;
    
    let goalClass = '';
    if (isGoalMet) goalClass = 'goal-met';
    else if (isWarning) goalClass = 'goal-warning';

    days.push(
      <div 
        key={d} 
        className={`calendar-day ${data ? 'has-data' : ''} ${isSelected ? 'selected' : ''} ${goalClass}`}
        onClick={() => data ? setSelectedDateKey(dateStr) : setSelectedDateKey(null)}
      >
        <span className="day-number">{d}</span>
        {data && (
          <>
            <div className="day-total-mini">{formatDuration(data.totalDuration)}</div>
            <div className="day-indicator">
              <div className="dot"></div>
            </div>
          </>
        )}
      </div>
    );
  }

  const selectedData = selectedDateKey ? sessionsByDate[selectedDateKey] : null;

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="goal-config">
           <Target size={20} color="#ffffff" />
           <label>Meta Diária (minutos):</label>
           <input 
             type="number" 
             value={dailyGoal} 
             onChange={(e) => onUpdateGoal(Number(e.target.value))}
             min="1"
           />
           <span className="goal-info">
             ({formatDuration(dailyGoal)})
           </span>
        </div>

        <div className="calendar-header-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CalendarIcon size={24} color="#ffffff" />
            <span className="month-title">{monthNames[month]} {year}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={prevMonth} className="nav-btn"><ChevronLeft size={20} /></button>
            <button onClick={nextMonth} className="nav-btn"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {days}
        </div>
      </div>

      {selectedData && selectedDateKey && (
        <div className="calendar-details">
          <div className="details-header">
            <h3>
              Resumo do dia 
              <span>
                {selectedDateKey.split('-').reverse().join('/')}
              </span>
            </h3>
            
            <div style={{display: 'flex', gap: '2rem', marginTop: '0.5rem', color: '#ccc', flexWrap: 'wrap'}}>
              <p>
                Tempo total: <span style={{color: '#fff', fontWeight: 'bold'}}>{formatDuration(selectedData.totalDuration)}</span>
              </p>
              <p>
                Total Questões: <span style={{color: '#fff', fontWeight: 'bold'}}>{selectedData.totalCorrect}/{selectedData.totalQuestions}</span>
              </p>
            </div>

            {/* Goal Progress Section */}
            <div className="goal-status-box">
              {selectedData.totalDuration >= dailyGoal ? (
                <div>
                  <span className="goal-status-text" style={{color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <CheckCircle2 size={18} /> Meta Diária Atingida!
                  </span>
                  <div className="goal-progress-bar">
                    <div className="goal-progress-fill" style={{width: '100%', background: '#22c55e'}}></div>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="goal-status-text" style={{color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <AlertTriangle size={18} /> Aviso: Faltam {formatDuration(dailyGoal - selectedData.totalDuration)} para a meta
                  </span>
                  <div className="goal-progress-bar">
                    <div 
                      className="goal-progress-fill" 
                      style={{
                        width: `${(selectedData.totalDuration / dailyGoal) * 100}%`, 
                        background: '#f97316'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="day-stats-grid">
            {Object.entries(selectedData.subjects).map(([subject, data]) => (
              <div key={subject} className="stat-box">
                <span className="stat-subject">{subject}</span>
                <div className="stat-row">
                  <span>Duração:</span>
                  <span>{formatDuration(data.duration)}</span>
                </div>
                <div className="stat-row">
                  <span>Questões:</span>
                  <span>{data.correct}/{data.questions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
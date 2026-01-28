import React, { useMemo } from 'react';
import { PieChart, BarChart3 } from 'lucide-react';
import { Session, Subject } from '../types';

interface StatisticsProps {
  sessions: Session[];
  subjects: Subject[];
}

export const Statistics: React.FC<StatisticsProps> = ({ sessions, subjects }) => {
  
  // Helper to get color for a subject name
  const getSubjectColor = (subjectName: string) => {
    const found = subjects.find(s => s.name === subjectName);
    return found?.color || '#a1a1aa'; // Default gray if not found
  };

  const timeBySubject = useMemo(() => {
    const result: Record<string, number> = {};
    sessions.forEach(session => {
      if (!result[session.subject]) {
        result[session.subject] = 0;
      }
      result[session.subject] += session.duration;
    });
    return result;
  }, [sessions]);

  const questionsBySubject = useMemo(() => {
    const result: Record<string, { total: number; correct: number }> = {};
    sessions.forEach(session => {
      if (!result[session.subject]) {
        result[session.subject] = { total: 0, correct: 0 };
      }
      result[session.subject].total += session.questions;
      result[session.subject].correct += session.correctQuestions;
    });
    return result;
  }, [sessions]);

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const hasTimeData = Object.keys(timeBySubject).length > 0;
  const hasQuestionData = Object.keys(questionsBySubject).length > 0;

  return (
    <div className="stats-container">
      <div className="stats-card">
        <div className="stats-header">
          <PieChart size={22} />
          <h2>Tempo de Estudo</h2>
        </div>

        {!hasTimeData ? (
          <div className="empty-stats">
            <p>Nenhuma sessão registrada.</p>
            <p>Complete um Pomodoro para ver as estatísticas!</p>
          </div>
        ) : (
          <div className="chart-container">
            <div className="pie-chart" style={{ position: 'relative' }}>
              {(() => {
                const total = Object.values(timeBySubject).reduce((a, b) => a + b, 0);
                let currentAngle = 0;

                // Geometry Settings
                const center = 100;
                const outerRadius = 90;
                const innerRadius = 62; // The size of the hole
                const padding = 2; // Extra padding for the inner stroke

                return (
                  <svg viewBox="0 0 200 200" className="pie-svg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                    {/* Background Track - Gives the chart form even if partial */}
                    <circle cx={center} cy={center} r={outerRadius} fill="#18181b" opacity="0.5" />

                    {Object.entries(timeBySubject).map(([subject, time]) => {
                      const percentage = time / total;
                      const angle = percentage * 360;
                      const startAngle = currentAngle;
                      currentAngle += angle;

                      // Fix: Handle cases where angle is 360 (full circle)
                      const isFullCircle = angle >= 359.9;
                      const color = getSubjectColor(subject);
                      
                      // Using the background card color for the stroke creates the "gap"
                      const strokeColor = "#18181b"; // Matches card background mostly

                      if (isFullCircle) {
                         return (
                          <g key={subject}>
                             <circle 
                              cx={center} 
                              cy={center} 
                              r={outerRadius} 
                              fill={color} 
                            />
                            {/* The "Hole" creates the Donut shape */}
                            <circle cx={center} cy={center} r={innerRadius} fill={strokeColor} />
                          </g>
                        );
                      }

                      // Calculate Path Coordinates
                      const r = outerRadius;
                      const x1 = center + r * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = center + r * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = center + r * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                      const y2 = center + r * Math.sin((startAngle + angle - 90) * Math.PI / 180);

                      const largeArc = angle > 180 ? 1 : 0;

                      return (
                         <path
                          key={subject}
                          d={`M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={color}
                          stroke={strokeColor}
                          strokeWidth="3"
                        />
                      );
                    })}
                    
                    {/* THE DONUT HOLE - The Core Visual */}
                    {/* 1. The main hole mask */}
                    <circle cx={center} cy={center} r={innerRadius} fill="#18181b" />
                    
                    {/* 2. The INTERNAL LINE - Defined stroke just inside the segments */}
                    <circle 
                      cx={center} 
                      cy={center} 
                      r={innerRadius - padding} 
                      fill="none" 
                      stroke="rgba(255, 255, 255, 0.15)" 
                      strokeWidth="1.5" 
                    />

                    {/* 3. Center Text Display */}
                    <text x={center} y={center - 10} className="chart-label">
                      TEMPO TOTAL
                    </text>
                    <text x={center} y={center + 25} className="chart-value">
                      {formatHours(total)}
                    </text>
                  </svg>
                );
              })()}
            </div>

            <div className="legend">
              {Object.entries(timeBySubject).map(([subject, time]) => {
                const total = Object.values(timeBySubject).reduce((a, b) => a + b, 0);
                const percentage = ((time / total) * 100).toFixed(1);
                const color = getSubjectColor(subject);

                return (
                  <div key={subject} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }} />
                    <div className="legend-text">
                      <span className="legend-subject">{subject}</span>
                      <span className="legend-value">{formatHours(time)} ({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="stats-card">
        <div className="stats-header">
          <BarChart3 size={22} />
          <h2>Questões por Matéria</h2>
        </div>

        {!hasQuestionData ? (
          <div className="empty-stats">
            <p>Nenhuma questão registrada.</p>
          </div>
        ) : (
          <div className="bar-chart">
            {Object.entries(questionsBySubject).map(([subject, data]) => {
              const maxQuestions = Math.max(...Object.values(questionsBySubject).map(d => d.total));
              const totalPercentage = (data.total / maxQuestions) * 100;
              const correctPercentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
              const accuracyRate = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0;
              const color = getSubjectColor(subject);

              return (
                <div key={subject} className="bar-item">
                  <div className="bar-label">
                    <span className="bar-subject">{subject}</span>
                    <span className="bar-values">{data.correct}/{data.total} ({accuracyRate}%)</span>
                  </div>
                  <div className="bar-container">
                    <div className="bar-fill bar-total" style={{ width: `${totalPercentage}%` }}>
                      <div className="bar-fill" style={{ width: `${correctPercentage}%`, background: color, boxShadow: `0 0 10px ${color}66` }} />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bar-legend">
              <div className="bar-legend-item">
                <div className="bar-legend-color bar-legend-total" />
                <span>Total</span>
              </div>
              <div className="bar-legend-item">
                <div className="bar-legend-color" style={{ background: 'var(--text-muted)' }} />
                <span>Corretas (Cor da Matéria)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
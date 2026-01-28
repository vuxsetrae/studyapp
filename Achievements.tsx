import React, { useMemo } from 'react';
import { Trophy, Medal, Target, Zap, Book, Clock, Library, CheckCircle2, Lock } from 'lucide-react';
import { Achievement, Session, Subject } from '../types';

interface AchievementsProps {
  sessions: Session[];
  subjects: Subject[];
  streak: number;
}

export const Achievements: React.FC<AchievementsProps> = ({ sessions, subjects, streak }) => {

  // Calculate Logic for Achievements
  const unlockedAchievements = useMemo(() => {
    const list: Achievement[] = [];
    
    // Helper stats
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const uniqueSubjects = new Set(sessions.map(s => s.subject)).size;
    const maxDurationSession = Math.max(...sessions.map(s => s.duration), 0);
    
    // 1. Time Based
    list.push({
      id: 'first_step',
      title: 'O Início',
      description: 'Complete sua primeira sessão de estudos.',
      icon: <Clock size={28} />,
      isUnlocked: sessions.length >= 1
    });

    list.push({
      id: 'iron_focus',
      title: 'Foco de Ferro',
      description: 'Complete uma sessão única com mais de 50 minutos.',
      icon: <Target size={28} />,
      isUnlocked: maxDurationSession >= 50
    });
    
    list.push({
      id: 'marathon',
      title: 'Maratona',
      description: 'Acumule 10 horas totais de estudo.',
      icon: <Clock size={28} />,
      isUnlocked: totalMinutes >= 600 // 10 hours
    });
    
    list.push({
      id: 'dedication',
      title: 'Dedicação Total',
      description: 'Acumule 100 horas totais de estudo.',
      icon: <Medal size={28} />,
      isUnlocked: totalMinutes >= 6000 // 100 hours
    });

    // 2. Streak Based
    list.push({
      id: 'trinity',
      title: 'Trindade',
      description: 'Mantenha uma sequência de 3 dias seguidos.',
      icon: <Zap size={28} />,
      isUnlocked: streak >= 3
    });

    list.push({
      id: 'golden_week',
      title: 'Semana de Ouro',
      description: 'Mantenha uma sequência de 7 dias seguidos.',
      icon: <Zap size={28} />,
      isUnlocked: streak >= 7
    });
    
    list.push({
      id: 'monthly_master',
      title: 'Mestre Mensal',
      description: 'Mantenha uma sequência de 30 dias seguidos.',
      icon: <Zap size={28} />,
      isUnlocked: streak >= 30
    });

    // 3. Subject Based
    list.push({
      id: 'polymath',
      title: 'Polímata',
      description: 'Estude pelo menos 3 matérias diferentes.',
      icon: <Book size={28} />,
      isUnlocked: uniqueSubjects >= 3
    });

    list.push({
      id: 'librarian',
      title: 'Bibliotecário',
      description: 'Crie pelo menos 5 matérias.',
      icon: <Library size={28} />,
      isUnlocked: subjects.length >= 5
    });

    return list;
  }, [sessions, subjects, streak]);

  const totalUnlocked = unlockedAchievements.filter(a => a.isUnlocked).length;
  const totalAchievements = unlockedAchievements.length;
  const progressPercent = (totalUnlocked / totalAchievements) * 100;

  // Rank Calculation
  const getNextRankInfo = () => {
    if (totalUnlocked < 2) return { next: 'Aprendiz', needed: 2 };
    if (totalUnlocked < 4) return { next: 'Estudante Dedicado', needed: 4 };
    if (totalUnlocked < 6) return { next: 'Erudito', needed: 6 };
    if (totalUnlocked < 8) return { next: 'Mestre do Conhecimento', needed: 8 };
    return { next: 'Lenda Viva', needed: 99 }; // Max rank
  };

  const nextRank = getNextRankInfo();

  return (
    <div className="achievements-container">
      
      <div className="achievements-card">
         <div className="stats-header">
            <Trophy size={22} />
            <h2>Conquistas & Títulos</h2>
          </div>
          
          <div className="progress-section">
             <div style={{ marginBottom: '1rem' }}>
               <span style={{ fontSize: '3rem', fontFamily: 'Bebas Neue', color: '#fff' }}>
                 {totalUnlocked}
               </span>
               <span style={{ fontSize: '1.5rem', fontFamily: 'Bebas Neue', color: 'var(--text-muted)' }}>
                 /{totalAchievements}
               </span>
             </div>
             
             {nextRank.needed !== 99 ? (
               <p className="next-rank-info">
                 Desbloqueie mais <strong>{nextRank.needed - totalUnlocked}</strong> conquistas para se tornar <br/>
                 <span className="next-rank-title">{nextRank.next}</span>
               </p>
             ) : (
               <p className="next-rank-info" style={{color: 'var(--primary-color)'}}>
                 Você atingiu o nível máximo!
               </p>
             )}
             
             <div className="goal-progress-bar" style={{ maxWidth: '400px', margin: '0 auto', height: '6px' }}>
                <div 
                  className="goal-progress-fill" 
                  style={{ width: `${progressPercent}%`, background: 'var(--primary-color)' }}
                ></div>
             </div>
          </div>

          <div className="achievements-grid">
            {unlockedAchievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon-box">
                  {React.cloneElement(achievement.icon, { 
                    color: achievement.isUnlocked ? 'var(--primary-color)' : '#666'
                  })}
                </div>
                
                <div className="achievement-content">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-desc">{achievement.description}</p>
                </div>
                
                <div className="achievement-status">
                  {achievement.isUnlocked ? (
                    <CheckCircle2 size={20} color="var(--primary-color)" />
                  ) : (
                    <Lock size={20} color="#666" />
                  )}
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};
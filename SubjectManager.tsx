import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Subject } from '../types';

interface SubjectManagerProps {
  subjects: Subject[];
  onAddSubject: (name: string) => void;
  onDeleteSubject: (id: number) => void;
  onAddChapter: (subjectId: number) => void;
  onDeleteChapter: (subjectId: number, chapterId: number) => void;
  onUpdateChapterName: (subjectId: number, chapterId: number, name: string) => void;
  onAddTask: (subjectId: number, chapterId: number) => void;
  onDeleteTask: (subjectId: number, chapterId: number, taskId: number) => void;
  onUpdateTaskName: (subjectId: number, chapterId: number, taskId: number, name: string) => void;
  onToggleTask: (subjectId: number, chapterId: number, taskId: number) => void;
}

export const SubjectManager: React.FC<SubjectManagerProps> = ({
  subjects,
  onAddSubject,
  onDeleteSubject,
  onAddChapter,
  onDeleteChapter,
  onUpdateChapterName,
  onAddTask,
  onDeleteTask,
  onUpdateTaskName,
  onToggleTask
}) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<number, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    onAddSubject(newSubjectName);
    setNewSubjectName('');
  };

  const toggleSubject = (id: number) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChapter = (key: string) => {
    setExpandedChapters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="subjects-container">
      <div className="add-subject-card">
        <input
          type="text"
          placeholder="Nome da nova matéria"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
        />
        <button onClick={handleAddSubject} className="btn-primary">
          <Plus size={18} /> Adicionar
        </button>
      </div>

      <div className="subjects-list">
        {subjects.map(subject => (
          <div key={subject.id} className="subject-card">
            <div className="subject-header">
              <div className="subject-title">
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="expand-btn"
                >
                  {expandedSubjects[subject.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                {/* Display Color Dot */}
                <div 
                  className="subject-color-tag" 
                  style={{ backgroundColor: subject.color || '#ccc', color: subject.color || '#ccc' }} 
                />
                <h3>{subject.name}</h3>
              </div>
              <div className="subject-actions">
                <button onClick={() => onAddChapter(subject.id)} className="btn-icon" title="Adicionar Capítulo">
                  <Plus size={16} />
                </button>
                <button onClick={() => onDeleteSubject(subject.id)} className="btn-icon btn-delete" title="Excluir">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedSubjects[subject.id] && (
              <div className="chapters-list">
                {subject.chapters.length === 0 ? (
                  <div className="empty-state">Nenhum capítulo ainda</div>
                ) : (
                  subject.chapters.map(chapter => {
                    const chapterKey = `${subject.id}-${chapter.id}`;
                    return (
                      <div key={chapter.id} className="chapter-card">
                        <div className="chapter-header">
                          <div className="chapter-title-section">
                            <button
                              onClick={() => toggleChapter(chapterKey)}
                              className="expand-btn-small"
                            >
                              {expandedChapters[chapterKey] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            {editingChapter === chapterKey ? (
                              <input
                                type="text"
                                value={chapter.name}
                                onChange={(e) => onUpdateChapterName(subject.id, chapter.id, e.target.value)}
                                onBlur={() => setEditingChapter(null)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') setEditingChapter(null);
                                }}
                                autoFocus
                                className="edit-input"
                                placeholder="Nome do capítulo"
                              />
                            ) : (
                              <h4>{chapter.name}</h4>
                            )}
                          </div>
                          <div className="chapter-actions">
                            {editingChapter !== chapterKey && (
                              <button 
                                onClick={() => setEditingChapter(chapterKey)} 
                                className="btn-icon-small btn-edit"
                                title="Editar nome"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                            )}
                            <button onClick={() => onAddTask(subject.id, chapter.id)} className="btn-icon-small" title="Adicionar Tarefa">
                              <Plus size={14} />
                            </button>
                            <button onClick={() => onDeleteChapter(subject.id, chapter.id)} className="btn-icon-small btn-delete" title="Excluir Capítulo">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {expandedChapters[chapterKey] && (
                          <div className="tasks-list">
                            {chapter.tasks.length === 0 ? (
                              <div className="empty-state-small">Nenhuma tarefa ainda</div>
                            ) : (
                              chapter.tasks.map(task => {
                                const taskKey = `${chapterKey}-${task.id}`;
                                return (
                                  <div key={task.id} className="task-item">
                                    <input
                                      type="checkbox"
                                      checked={task.completed}
                                      onChange={() => onToggleTask(subject.id, chapter.id, task.id)}
                                      id={`task-${task.id}`}
                                    />
                                    {editingTask === taskKey ? (
                                      <input
                                        type="text"
                                        value={task.name}
                                        onChange={(e) => onUpdateTaskName(subject.id, chapter.id, task.id, e.target.value)}
                                        onBlur={() => setEditingTask(null)}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter') setEditingTask(null);
                                        }}
                                        autoFocus
                                        className="edit-input-small"
                                        placeholder="Nome da tarefa"
                                      />
                                    ) : (
                                      <label
                                        htmlFor={`task-${task.id}`}
                                        className={task.completed ? 'completed' : ''}
                                      >
                                        {task.name}
                                      </label>
                                    )}
                                    <div className="task-actions">
                                      {editingTask !== taskKey && (
                                        <button 
                                          onClick={() => setEditingTask(taskKey)} 
                                          className="btn-icon-tiny btn-edit"
                                          title="Editar nome"
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                          </svg>
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => onDeleteTask(subject.id, chapter.id, task.id)} 
                                        className="btn-icon-tiny btn-delete"
                                        title="Excluir tarefa"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
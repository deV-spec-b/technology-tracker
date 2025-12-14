import { useState, useEffect } from 'react';
import './DeadlineSetter.css';

function DeadlineSetter({ technologies = [], onDeadlinesUpdate }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [selectedTechs, setSelectedTechs] = useState([]);

    useEffect(() => {
        const initialData = {};
        technologies.forEach(tech => {
            initialData[tech.id] = tech.deadline || '';
        });
        setFormData(initialData);
        setSelectedTechs(technologies.map(tech => tech.id));
    }, [technologies]);

    const validateForm = () => {
        const newErrors = {};
        
        selectedTechs.forEach(techId => {
            const deadline = formData[techId];
            
            if (deadline) {
                const deadlineDate = new Date(deadline);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (deadlineDate < today) {
                    newErrors[techId] = 'Дедлайн не может быть в прошлом';
                }

                if (isNaN(deadlineDate.getTime())) {
                    newErrors[techId] = 'Неверный формат даты';
                }
            }
        });

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    useEffect(() => {
        validateForm();
    }, [formData, selectedTechs]);

    const handleDeadlineChange = (techId, value) => {
        setFormData(prev => ({
            ...prev,
            [techId]: value
        }));
    };

    const handleTechSelection = (techId, isSelected) => {
        if (isSelected) {
            setSelectedTechs(prev => [...prev, techId]);
        } else {
            setSelectedTechs(prev => prev.filter(id => id !== techId));
        }
    };

    const handleSelectAll = () => {
        if (selectedTechs.length === technologies.length) {
            setSelectedTechs([]);
        } else {
            setSelectedTechs(technologies.map(tech => tech.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isFormValid || selectedTechs.length === 0) return;

        const updates = selectedTechs.map(techId => ({
            id: techId,
            deadline: formData[techId] || null
        }));

        if (onDeadlinesUpdate) {
            onDeadlinesUpdate(updates);
        }

        alert(`✅ Сроки изучения обновлены для ${updates.length} технологий`);
    };

    const handleResetAll = () => {
        const confirmReset = window.confirm('Вы уверены, что хотите сбросить все дедлайны?');
        if (confirmReset) {
            const resetData = {};
            technologies.forEach(tech => {
                resetData[tech.id] = '';
            });
            setFormData(resetData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="deadline-setter" noValidate>
            <div className="deadline-header">
                <h2>📅 Установка сроков изучения</h2>
                <div className="header-stats">
                    <span>Выбрано: {selectedTechs.length} из {technologies.length}</span>
                </div>
            </div>

            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {selectedTechs.length > 0 
                    ? `Выбрано ${selectedTechs.length} технологий для установки сроков` 
                    : 'Нет выбранных технологий'}
            </div>

            <div className="selection-controls">
                <button
                    type="button"
                    onClick={handleSelectAll}
                    className="btn-select-all"
                    aria-label={selectedTechs.length === technologies.length 
                        ? "Снять выделение со всех технологий" 
                        : "Выделить все технологии"}
                >
                    {selectedTechs.length === technologies.length ? '☑ Снять все' : '☐ Выбрать все'}
                </button>
                
                <button
                    type="button"
                    onClick={handleResetAll}
                    className="btn-reset"
                    aria-label="Сбросить все дедлайны"
                >
                    ⟳ Сбросить все
                </button>
            </div>

            <div className="tech-deadlines-list">
                {technologies.map(tech => {
                    const isSelected = selectedTechs.includes(tech.id);
                    const error = errors[tech.id];
                    
                    return (
                        <div 
                            key={tech.id} 
                            className={`tech-deadline-item ${isSelected ? 'selected' : ''}`}
                            role="listitem"
                        >
                            <div className="tech-selection">
                                <input
                                    type="checkbox"
                                    id={`tech-${tech.id}`}
                                    checked={isSelected}
                                    onChange={(e) => handleTechSelection(tech.id, e.target.checked)}
                                    aria-label={`Выбрать технологию ${tech.title} для установки срока`}
                                />
                                <label 
                                    htmlFor={`tech-${tech.id}`}
                                    className="tech-title"
                                >
                                    <strong>{tech.title}</strong>
                                    <span className="tech-category">({tech.category})</span>
                                    <span className={`status status-${tech.status}`}>
                                        {tech.status === 'completed' ? 'изучено' :
                                         tech.status === 'in-progress' ? 'в процессе' : 'не начато'}
                                    </span>
                                </label>
                            </div>
                            
                            <div className="deadline-input-container">
                                <label 
                                    htmlFor={`deadline-${tech.id}`}
                                    className="deadline-label"
                                >
                                    Дедлайн:
                                </label>
                                <input
                                    type="date"
                                    id={`deadline-${tech.id}`}
                                    value={formData[tech.id] || ''}
                                    onChange={(e) => handleDeadlineChange(tech.id, e.target.value)}
                                    className={`deadline-input ${error ? 'error' : ''}`}
                                    aria-describedby={error ? `error-${tech.id}` : undefined}
                                    aria-invalid={!!error}
                                    aria-required="false"
                                    disabled={!isSelected}
                                />
                                
                                {error && (
                                    <span 
                                        id={`error-${tech.id}`} 
                                        className="error-message" 
                                        role="alert"
                                    >
                                        {error}
                                    </span>
                                )}

                                {tech.deadline && !formData[tech.id] && (
                                    <div className="current-deadline">
                                        Текущий: {new Date(tech.deadline).toLocaleDateString('ru-RU')}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="validation-info">
                {Object.keys(errors).length > 0 && (
                    <div className="validation-errors" role="alert">
                        ⚠️ Исправьте {Object.keys(errors).length} ошибок перед сохранением
                    </div>
                )}
                
                {selectedTechs.length === 0 && (
                    <div className="no-selection-warning" role="alert">
                        ℹ️ Выберите хотя бы одну технологию для установки сроков
                    </div>
                )}
            </div>

            <div className="deadline-actions">
                <button
                    type="submit"
                    className="btn-save-deadlines"
                    disabled={!isFormValid || selectedTechs.length === 0}
                    aria-busy="false"
                >
                    💾 Сохранить сроки ({selectedTechs.length})
                </button>
                
                <button
                    type="button"
                    onClick={() => onDeadlinesUpdate && onDeadlinesUpdate([])}
                    className="btn-cancel"
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default DeadlineSetter;
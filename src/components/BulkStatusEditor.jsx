import { useState, useEffect } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies = [], onStatusUpdate }) {
    const [selectedTechs, setSelectedTechs] = useState([]);
    const [newStatus, setNewStatus] = useState('in-progress');
    const [updateProgress, setUpdateProgress] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateLog, setUpdateLog] = useState([]);

    const statusOptions = [
        { value: 'not-started', label: 'Не начато', color: '#dc3545' },
        { value: 'in-progress', label: 'В процессе', color: '#ffc107' },
        { value: 'completed', label: 'Изучено', color: '#28a745' }
    ];

    const statusCounts = {
        'not-started': technologies.filter(t => t.status === 'not-started').length,
        'in-progress': technologies.filter(t => t.status === 'in-progress').length,
        'completed': technologies.filter(t => t.status === 'completed').length
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

    const handleSelectByStatus = (status) => {
        const techsWithStatus = technologies
            .filter(tech => tech.status === status)
            .map(tech => tech.id);

        setSelectedTechs(prev => {
            const combined = [...new Set([...prev, ...techsWithStatus])];
            return combined;
        });
    };

    const handleDeselectAll = () => {
        setSelectedTechs([]);
    };

    const handleUpdateStatuses = async () => {
        if (selectedTechs.length === 0) {
            alert('⚠️ Выберите хотя бы одну технологию для обновления');
            return;
        }

        setIsUpdating(true);
        setUpdateProgress(0);
        setUpdateLog([]);

        const updates = selectedTechs.map(techId => {
            const tech = technologies.find(t => t.id === techId);
            return {
                id: techId,
                oldStatus: tech.status,
                newStatus: newStatus
            };
        });

        for (let i = 0; i < updates.length; i++) {
            const update = updates[i];

            await new Promise(resolve => setTimeout(resolve, 50));

            setUpdateProgress(Math.round(((i + 1) / updates.length) * 100));

            setUpdateLog(prev => [...prev, {
                id: update.id,
                title: technologies.find(t => t.id === update.id)?.title,
                oldStatus: update.oldStatus,
                newStatus: update.newStatus,
                timestamp: new Date().toLocaleTimeString()
            }]);
        }

        if (onStatusUpdate) {
            const statusUpdates = updates.map(u => ({
                id: u.id,
                status: u.newStatus
            }));
            onStatusUpdate(statusUpdates);
        }

        setTimeout(() => {
            setIsUpdating(false);
            setUpdateProgress(0);

            alert(`✅ Статусы обновлены для ${updates.length} технологий`);
        }, 500);
    };

    const getStatusLabel = (statusValue) => {
        const option = statusOptions.find(opt => opt.value === statusValue);
        return option ? option.label : statusValue;
    };

    const getStatusColor = (statusValue) => {
        const option = statusOptions.find(opt => opt.value === statusValue);
        return option ? option.color : '#6c757d';
    };

    return (
        <div className="bulk-status-editor">
            <div className="editor-header">
                <h2>🔄 Массовое редактирование статусов</h2>
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
                {isUpdating 
                    ? `Обновление статусов: ${updateProgress}% завершено` 
                    : `Выбрано ${selectedTechs.length} технологий для изменения статуса`}
            </div>

            <div className="status-statistics">
                <h3>📊 Текущее распределение:</h3>
                <div className="stats-grid">
                    {statusOptions.map(option => (
                        <div 
                            key={option.value}
                            className="stat-card"
                            style={{ borderLeftColor: option.color }}
                        >
                            <div className="stat-label">{option.label}</div>
                            <div className="stat-count">{statusCounts[option.value]}</div>
                            <button
                                type="button"
                                onClick={() => handleSelectByStatus(option.value)}
                                className="btn-select-status"
                                aria-label={`Выбрать все технологии со статусом ${option.label}`}
                            >
                                Выбрать все
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="selection-controls">
                <div className="selection-buttons">
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="btn-control"
                        aria-label={selectedTechs.length === technologies.length 
                            ? "Снять выделение со всех технологий" 
                            : "Выделить все технологии"}
                    >
                        {selectedTechs.length === technologies.length ? '☑ Снять все' : '☐ Выбрать все'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="btn-control"
                        aria-label="Снять выделение со всех технологий"
                        disabled={selectedTechs.length === 0}
                    >
                        ✕ Очистить выбор
                    </button>
                </div>
                
                <div className="selected-count">
                    Выбрано: <strong>{selectedTechs.length}</strong> технологий
                </div>
            </div>

            <div className="status-selection">
                <h3>🎯 Установить статус:</h3>
                <div className="status-options">
                    {statusOptions.map(option => (
                        <label 
                            key={option.value}
                            className={`status-option ${newStatus === option.value ? 'selected' : ''}`}
                            style={{ 
                                borderColor: option.color,
                                backgroundColor: newStatus === option.value ? `${option.color}20` : 'white'
                            }}
                        >
                            <input
                                type="radio"
                                name="newStatus"
                                value={option.value}
                                checked={newStatus === option.value}
                                onChange={(e) => setNewStatus(e.target.value)}
                                aria-label={`Установить статус "${option.label}"`}
                            />
                            <span className="status-dot" style={{ backgroundColor: option.color }} />
                            <span className="status-label">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {isUpdating && (
                <div className="update-progress" role="progressbar">
                    <div className="progress-header">
                        <span>Обновление статусов...</span>
                        <span>{updateProgress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${updateProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {updateLog.length > 0 && (
                <div className="update-log">
                    <h3>📝 Журнал изменений:</h3>
                    <div className="log-list">
                        {updateLog.map((log, index) => (
                            <div key={index} className="log-entry">
                                <div className="log-time">{log.timestamp}</div>
                                <div className="log-content">
                                    <strong>{log.title}</strong>
                                    <span className="log-change">
                                        <span 
                                            className="old-status" 
                                            style={{ color: getStatusColor(log.oldStatus) }}
                                        >
                                            {getStatusLabel(log.oldStatus)}
                                        </span>
                                        <span className="log-arrow"> → </span>
                                        <span 
                                            className="new-status" 
                                            style={{ color: getStatusColor(log.newStatus) }}
                                        >
                                            {getStatusLabel(log.newStatus)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="update-actions">
                <button
                    type="button"
                    onClick={handleUpdateStatuses}
                    className="btn-update-statuses"
                    disabled={selectedTechs.length === 0 || isUpdating}
                    aria-busy={isUpdating}
                >
                    {isUpdating ? (
                        <>
                            <span className="spinner"></span>
                            Обновление... ({updateProgress}%)
                        </>
                    ) : (
                        `🔄 Обновить статусы (${selectedTechs.length})`
                    )}
                </button>
                
                {selectedTechs.length === 0 && (
                    <div className="selection-hint" role="alert">
                        ℹ️ Выберите технологии для изменения статуса
                    </div>
                )}
            </div>

            <div className="tech-list">
                <h3>📋 Список технологий:</h3>
                <div className="tech-grid">
                    {technologies.map(tech => {
                        const isSelected = selectedTechs.includes(tech.id);
                        const statusColor = getStatusColor(tech.status);
                        
                        return (
                            <div 
                                key={tech.id}
                                className={`tech-card ${isSelected ? 'selected' : ''}`}
                                role="listitem"
                                aria-selected={isSelected}
                            >
                                <div className="tech-card-header">
                                    <input
                                        type="checkbox"
                                        id={`bulk-tech-${tech.id}`}
                                        checked={isSelected}
                                        onChange={(e) => handleTechSelection(tech.id, e.target.checked)}
                                        aria-label={`Выбрать технологию ${tech.title} для изменения статуса`}
                                    />
                                    <label 
                                        htmlFor={`bulk-tech-${tech.id}`}
                                        className="tech-card-title"
                                    >
                                        {tech.title}
                                    </label>
                                </div>
                                
                                <div className="tech-card-info">
                                    <div className="tech-category">{tech.category}</div>
                                    <div 
                                        className="current-status"
                                        style={{ color: statusColor }}
                                    >
                                        {getStatusLabel(tech.status)}
                                    </div>
                                </div>
                                
                                {tech.deadline && (
                                    <div className="tech-deadline">
                                        📅 {new Date(tech.deadline).toLocaleDateString('ru-RU')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BulkStatusEditor;
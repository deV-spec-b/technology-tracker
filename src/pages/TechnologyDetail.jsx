import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [technology, setTechnology] = useState(null);
    const [localNotes, setLocalNotes] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const tech = technologies.find(t => t.id === parseInt(techId));
            setTechnology(tech);
            if (tech) {
                setLocalNotes(tech.notes);
            }
        }
    }, [techId]);

    const handleStatusChange = (newStatus) => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology({ ...technology, status: newStatus });
        }
    };

    const handleSaveNotes = () => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, notes: localNotes } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            setTechnology({ ...technology, notes: localNotes });
            setIsEditing(false);
        }
    };

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <Link to="/technologies" className="btn">
                    ← Назад к списку
                </Link>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <h1>{technology.title}</h1>
            </div>

            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{technology.description}</p>
                </div>

                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="status-buttons">
                        <button
                            onClick={() => handleStatusChange('not-started')}
                            className={technology.status === 'not-started' ? 'active' : ''}
                        >
                            Не начато
                        </button>
                        <button
                            onClick={() => handleStatusChange('in-progress')}
                            className={technology.status === 'in-progress' ? 'active' : ''}
                        >
                            В процессе
                        </button>
                        <button
                            onClick={() => handleStatusChange('completed')}
                            className={technology.status === 'completed' ? 'active' : ''}
                        >
                            Завершено
                        </button>
                    </div>
                    <p className="current-status">
                        Текущий статус: <strong>{technology.status}</strong>
                    </p>
                </div>

                <div className="detail-section">
                    <h3>Мои заметки</h3>
                    {isEditing ? (
                        <div className="notes-edit">
                            <textarea
                                value={localNotes}
                                onChange={(e) => setLocalNotes(e.target.value)}
                                rows="4"
                                placeholder="Добавьте заметки..."
                            />
                            <div className="notes-actions">
                                <button onClick={handleSaveNotes} className="btn btn-primary">
                                    Сохранить
                                </button>
                                <button onClick={() => setIsEditing(false)} className="btn">
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="notes-view">
                            <p>{technology.notes || 'Заметок пока нет'}</p>
                            <button onClick={() => setIsEditing(true)} className="btn">
                                {technology.notes ? 'Редактировать' : 'Добавить заметки'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="detail-section">
                    <h3>Информация</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">ID:</span>
                            <span className="info-value">{technology.id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Категория:</span>
                            <span className="info-value">{technology.category || 'не указана'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Добавлено:</span>
                            <span className="info-value">Дата не указана</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;
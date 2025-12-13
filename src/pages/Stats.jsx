import { Link } from 'react-router-dom';
import '../App.css';

function Stats({ technologies }) { 
    
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;

    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const categories = {};
    technologies.forEach(tech => {
        if (tech.category) {
            categories[tech.category] = (categories[tech.category] || 0) + 1;
        }
    });

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'frontend': return '🌐';
            case 'backend': return '⚙️';
            case 'database': return '🗄️';
            case 'devops': return '🚀';
            case 'mobile': return '📱';
            case 'tools': return '🔧';
            default: return '📝';
        }
    };

    const getCategoryName = (category) => {
        switch(category) {
            case 'frontend': return 'Frontend';
            case 'backend': return 'Backend';
            case 'database': return 'Базы данных';
            case 'devops': return 'DevOps';
            case 'mobile': return 'Мобильная';
            case 'tools': return 'Инструменты';
            default: return 'Другое';
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>📊 Статистика</h1>
                <Link to="/technologies" className="btn">
                    ← Назад к списку
                </Link>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Общая информация</h3>
                    <div className="stat-item">
                        <span className="stat-label">Всего технологий:</span>
                        <span className="stat-value">{total}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Изучено:</span>
                        <span className="stat-value" style={{color: '#388e3c'}}>{completed}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">В процессе:</span>
                        <span className="stat-value" style={{color: '#f57c00'}}>{inProgress}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Не начато:</span>
                        <span className="stat-value" style={{color: '#d32f2f'}}>{notStarted}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Прогресс изучения</h3>
                    <div className="progress-info">
                        <span>Завершено: {completionPercentage}%</span>
                        <span>{completed} из {total}</span>
                    </div>
                    <div className="progress-bar-simple">
                        <div 
                            className="progress-fill-simple" 
                            style={{width: `${completionPercentage}%`}}
                        ></div>
                    </div>

                    <div className="status-breakdown">
                        <div className="status-item">
                            <span className="status-dot" style={{background: '#388e3c'}}></span>
                            <span>Завершено: {completed} ({completionPercentage}%)</span>
                        </div>
                        <div className="status-item">
                            <span className="status-dot" style={{background: '#f57c00'}}></span>
                            <span>В процессе: {inProgress} ({total > 0 ? Math.round((inProgress / total) * 100) : 0}%)</span>
                        </div>
                        <div className="status-item">
                            <span className="status-dot" style={{background: '#d32f2f'}}></span>
                            <span>Не начато: {notStarted} ({total > 0 ? Math.round((notStarted / total) * 100) : 0}%)</span>
                        </div>
                    </div>
                </div>

                {Object.keys(categories).length > 0 && (
                    <div className="stat-card">
                        <h3>Распределение по категориям</h3>
                        <div className="categories-list">
                            {Object.entries(categories)
                                .sort((a, b) => b[1] - a[1])
                                .map(([category, count]) => (
                                    <div key={category} className="category-item">
                                        <span className="category-name">
                                            {getCategoryIcon(category)} {getCategoryName(category)}
                                        </span>
                                        <span className="category-count">{count}</span>
                                    </div>
                                ))
                            }
                        </div>

                        {Object.keys(categories).length > 0 && (
                            <div className="category-stats">
                                <p className="category-summary">
                                    <strong>Самые изучаемые:</strong> {
                                        Object.entries(categories)
                                            .sort((a, b) => b[1] - a[1])
                                            .slice(0, 2)
                                            .map(([category, count]) => `${getCategoryName(category)} (${count})`)
                                            .join(', ')
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {technologies.length === 0 && (
                    <div className="empty-state">
                        <p>📝 Нет данных для статистики</p>
                        <p>Данные загружаются из API. Добавьте технологии, чтобы увидеть статистику</p>
                        <Link to="/add-technology" className="btn btn-primary">
                            Добавить первую технологию
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Stats;
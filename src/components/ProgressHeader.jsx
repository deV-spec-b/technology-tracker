import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return (
        <div className="progress-header">
            <h2>Прогресс изучения</h2>
            
            <div className="stats">
                <div className="stat-item">
                    <span className="stat-value">{total}</span>
                    <span className="stat-label">Всего технологий</span>
                </div>
                
                <div className="stat-item">
                    <span className="stat-value">{completed}</span>
                    <span className="stat-label">Изучено</span>
                </div>
                
                <div className="stat-item">
                    <span className="stat-value">{percentage}%</span>
                    <span className="stat-label">Выполнено</span>
                </div>
            </div>

            <div className='status-stats'>
                <div className='status-stat'>
                    <span className='status-count not-started'>{notStarted}</span>
                    <span className='status-label'>Не начали</span>
                </div>

                <div className='status-stat'>
                    <span className='status-count in-progress'>{inProgress}</span>
                    <span className='status-label'>В процессе</span>
                </div>

                <div className='status-stat'>
                    <span className='status-count completed'>{completed}</span>
                    <span className='status-label'>Изучено</span>
                </div>
            </div>
            
            <div className="progress-bar">
                <div 
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

export default ProgressHeader;
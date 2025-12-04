import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomSelect }) {
    return (
        <div className="quick-actions">
            <h3>⚡ Быстрые действия</h3>
            <div className="actions-buttons">
                <button 
                    className="action-btn mark-all"
                    onClick={onMarkAllCompleted}
                >
                    ✅ Отметить все как выполненные
                </button>
                
                <button 
                    className="action-btn reset-all"
                    onClick={onResetAll}
                >
                    🔄 Сбросить все статусы
                </button>
                
                <button 
                    className="action-btn random-select"
                    onClick={onRandomSelect}
                >
                    🎲 Случайный выбор следующей технологии
                </button>
            </div>
        </div>
    );
}

export default QuickActions;
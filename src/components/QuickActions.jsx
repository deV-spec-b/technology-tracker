import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ 
    onMarkAllCompleted, 
    onResetAll, 
    onRandomSelect, 
    technologies 
}) {
    const [showExportModal, setShowExportModal] = useState(false);
    
    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);
        
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setShowExportModal(true);
    };

    return (
        <div className="quick-actions">
            <h3>Быстрые действия</h3>
            <div className="action-buttons">
                <button onClick={onMarkAllCompleted} className="btn btn-success">
                    ☑ Отметить все как выполненные
                </button>
                <button onClick={onResetAll} className="btn btn-warning">
                    ☒ Сбросить все статусы
                </button>
                <button onClick={onRandomSelect} className="btn btn-info">
                    🎲 Выбрать случайную
                </button>
                <button onClick={handleExport} className="btn btn-export">
                    📥 Экспорт данных
                </button>
            </div>

            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <p>✅ Данные успешно экспортированы!</p>
                <p>Файл был скачан на ваш компьютер.</p>
                <div className="modal-actions">
                    <button 
                        onClick={() => setShowExportModal(false)}
                        className="btn btn-primary"
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default QuickActions;
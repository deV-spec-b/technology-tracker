import { useState, useEffect } from 'react';
import './DataImportExport.css';

function DataImportExport({ technologies = [], onTechnologiesUpdate }) {
    const [status, setStatus] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const importFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error('Неверный формат данных');
                }

                if (onTechnologiesUpdate) {
                    onTechnologiesUpdate(imported);
                }

                setStatus(`✅ Импортировано ${imported.length} технологий`);
            } catch (error) {
                setStatus('❌ Ошибка импорта: неверный формат файла');
            }
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    const exportToJSON = () => {
        try {
            const dataStr = JSON.stringify(technologies, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus('✅ Данные экспортированы в JSON');
        } catch (error) {
            setStatus('❌ Ошибка экспорта данных');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            importFromJSON({ target: { files: [file] } });
        }
    };

    return (
        <div className="data-import-export">
            <h1>📥 Импорт и экспорт данных</h1>

            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {status}
            </div>

            {status && (
                <div className="status-message" role="alert">
                    {status}
                </div>
            )}

            <div className="controls">
                <button
                    onClick={exportToJSON}
                    disabled={technologies.length === 0}
                >
                    📤 Экспорт в JSON
                </button>

                <label className="file-input-label">
                    📁 Импорт из JSON
                    <input
                        type="file"
                        accept=".json"
                        onChange={importFromJSON}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                Перетащите JSON-файл сюда
            </div>
        </div>
    );
}

export default DataImportExport;
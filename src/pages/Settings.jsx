import React, { useState } from 'react';
import useTechnologies from '../components/useTechnologies'; 

export function Settings() {
    const { technologies, restoreDefaultData } = useTechnologies();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmRestore, setShowConfirmRestore] = useState(false);
    const [message, setMessage] = useState('');

    const handleDeleteAll = () => {
        localStorage.removeItem('technologies');
        setMessage('Все данные удалены');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    const handleRestoreDefault = () => {
        restoreDefaultData();
        setMessage('Данные восстановлены по умолчанию');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Настройки</h1>
            </div>

            {message && (
                <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    background: '#e8f5e8',
                    color: '#2e7d32',
                    borderRadius: '6px',
                    border: '1px solid #c8e6c9'
                }}>
                    {message}
                </div>
            )}

            <div className="settings-content">
                <div className="setting-card">
                    <h3>Управление данными</h3>
                    <p>Технологий: {technologies.length}</p>
                    
                    <div className="setting-actions">
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowConfirmRestore(true)}
                        >
                            Восстановить данные по умолчанию
                        </button>
                        
                        <button 
                            className="btn btn-danger" 
                            onClick={() => setShowConfirmDelete(true)}
                        >
                            Удалить все данные
                        </button>
                    </div>

                    {showConfirmRestore && (
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '20px', 
                            background: '#fff', 
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px'
                        }}>
                            <p style={{ marginBottom: '15px', fontWeight: '500' }}>
                                Восстановить начальные данные?
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    className="btn btn-success" 
                                    onClick={handleRestoreDefault}
                                >
                                    Да, восстановить
                                </button>
                                <button 
                                    className="btn" 
                                    onClick={() => setShowConfirmRestore(false)}
                                    style={{ background: '#f5f5f5', color: '#333' }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    )}

                    {showConfirmDelete && (
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '20px', 
                            background: '#fff', 
                            border: '1px solid #ffcdd2',
                            borderRadius: '8px'
                        }}>
                            <p style={{ marginBottom: '15px', fontWeight: '500', color: '#d32f2f' }}>
                                Вы уверены, что хотите удалить ВСЕ данные? Это действие нельзя отменить.
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={handleDeleteAll}
                                >
                                    Да, удалить всё
                                </button>
                                <button 
                                    className="btn" 
                                    onClick={() => setShowConfirmDelete(false)}
                                    style={{ background: '#f5f5f5', color: '#333' }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="setting-card">
                    <h3>О приложении</h3>
                    <p>Трекер технологий v1.0</p>
                    <p>Данные сохраняются в браузере (localStorage)</p>
                </div>
            </div>
        </div>
    );
}

export default Settings;
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../App.css';

function Home() {
    const [hasTechnologies, setHasTechnologies] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        setHasTechnologies(!!saved && JSON.parse(saved).length > 0);
    }, []);

    return (
        <div className="page">
            <h1>Добро пожаловать в трекер технологий! 🚀</h1>
            
            {!hasTechnologies ? (
                <div className="welcome-message">
                    <p>📝 <strong>Начните работу:</strong> добавьте первую технологию</p>
                    <Link to="/add-technology" className="btn btn-primary">
                        ➕ Добавить технологию
                    </Link>
                </div>
            ) : (
                <div className="welcome-message">
                    <p>✅ <strong>Доступ открыт!</strong> У вас {hasTechnologies ? JSON.parse(localStorage.getItem('technologies')).length : 0} технологий</p>
                </div>
            )}
            
            <p className="page-description">
                Отслеживайте прогресс изучения технологий.
            </p>
            
            <div className="home-actions">
                <Link to="/technologies" className="btn btn-primary">
                    📚 Все технологии
                </Link>
                <Link to="/add-technology" className="btn btn-success">
                    ➕ Добавить
                </Link>
                <Link to="/stats" className="btn">
                    📊 Статистика
                </Link>
                <Link to="/settings" className="btn">
                    ⚙️ Настройки
                </Link>
            </div>
            
            <div className="features">
                <h2>Что можно делать:</h2>
                <ul>
                    <li>Добавлять технологии</li>
                    <li>Отмечать статус (не начато/в процессе/изучено)</li>
                    <li>Смотреть статистику</li>
                    <li>Управлять данными в настройках</li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
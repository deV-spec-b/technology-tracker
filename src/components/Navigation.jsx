import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoggedIn, username, onLogout }) {
    const location = useLocation();

    const users = [
        { id: 1, name: 'Анна' },
        { id: 2, name: 'Иван' },
        { id: 3, name: 'Мария' }
    ];

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/">
                    <h2>🚀 Трекер технологий</h2>
                </Link>
            </div>

            <ul className="nav-menu">
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        🏠 Главная
                    </Link>
                </li>

                {isLoggedIn ? (
                    <>
                        <li>
                            <Link to="/technologies" className={location.pathname === '/technologies' ? 'active' : ''}>
                                📚 Все технологии
                            </Link>
                        </li>
                        <li>
                            <Link to="/add-technology" className={location.pathname === '/add-technology' ? 'active' : ''}>
                                ➕ Добавить
                            </Link>
                        </li>
                        <li>
                            <Link to="/stats" className={location.pathname === '/stats' ? 'active' : ''}>
                                📊 Статистика
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                                ⚙️ Настройки
                            </Link>
                        </li>

                        <li className="dropdown">
                            <span>👥 Пользователи:</span>
                            <ul className="dropdown-menu">
                                {users.map(user => (
                                    <li key={user.id}>
                                        <Link to={`/user/${user.id}`} className="user-link">
                                            {user.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li className="user-info">
                            <span>Привет, {username}!</span>
                            <button onClick={onLogout} className="logout-btn">
                                Выйти
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                            🔐 Войти
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;
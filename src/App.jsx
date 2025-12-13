import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile'; 
import ProtectedRoute from './components/ProtectedRoute';
import useTechnologiesApi from './hooks/useTechnologiesApi';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const { technologies, loading, error, refetch, addTechnology } = useTechnologiesApi();

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = localStorage.getItem('username') || '';
        setIsLoggedIn(loggedIn);
        setUsername(user);
    }, []);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
    };

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <p>Загрузка технологий из API...</p>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <Navigation 
                    isLoggedIn={isLoggedIn}
                    username={username}
                    onLogout={handleLogout}
                />
                
                <main className="main-content">
                    {error && (
                        <div className="app-error">
                            <p>Ошибка загрузки данных: {error}</p>
                            <button onClick={refetch} className="btn">
                                Попробовать снова
                            </button>
                        </div>
                    )}
                    
                    <Routes>
                        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/user/:userId" element={<UserProfile />} />

                        <Route path="/technologies" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <TechnologyList 
                                    technologies={technologies}
                                    onRefresh={refetch}
                                />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/technology/:techId" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <TechnologyDetail technologies={technologies} />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/add-technology" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <AddTechnology onAddTechnology={addTechnology} />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/stats" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Stats technologies={technologies} />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/settings" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Settings />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
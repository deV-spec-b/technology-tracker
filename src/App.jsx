import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
import BulkStatusEditor from './components/BulkStatusEditor';
import DataImportExport from './components/DataImportExport';
import DeadlineSetter from './components/DeadlineSetter';
import ThemeToggle from './components/ThemeToggle';
import NotificationSnackbar from './components/NotificationSnackbar';

import { lightTheme, darkTheme } from './theme';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const { technologies, loading, error, refetch, addTechnology } = useTechnologiesApi();

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const user = localStorage.getItem('username') || '';
        const storedTheme = localStorage.getItem('darkMode');
        
        setIsLoggedIn(loggedIn);
        setUsername(user);
        if (storedTheme !== null) {
            setDarkMode(JSON.parse(storedTheme));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
        
        showNotification('Вы успешно вошли в систему!', 'success');
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        
        showNotification('Вы вышли из системы', 'info');
    };

    const handleThemeToggle = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const showNotification = (message, severity = 'info') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleNotificationClose = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    const currentTheme = darkMode ? darkTheme : lightTheme;

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <p>Загрузка технологий из API...</p>
            </div>
        );
    }

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <Router>
                <div className="App">
                    <Navigation 
                        isLoggedIn={isLoggedIn}
                        username={username}
                        onLogout={handleLogout}
                        darkMode={darkMode}
                        onThemeToggle={handleThemeToggle}
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
                                        onShowNotification={showNotification}
                                    />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/technology/:techId" element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <TechnologyDetail 
                                        technologies={technologies}
                                        onShowNotification={showNotification}
                                    />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/add-technology" element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <AddTechnology 
                                        onAddTechnology={addTechnology}
                                        onShowNotification={showNotification}
                                    />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/stats" element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <Stats technologies={technologies} />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/settings" element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <Settings onShowNotification={showNotification} />
                                </ProtectedRoute>
                            } />

                            <Route path="/deadlines" element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <DeadlineSetter 
                                        technologies={technologies}
                                        onShowNotification={showNotification}
                                    />
                                </ProtectedRoute>
                            } />

                            <Route path="/edit-statuses" element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <BulkStatusEditor 
                                        technologies={technologies}
                                        onShowNotification={showNotification}
                                    />
                                </ProtectedRoute>
                            } />

                            <Route path="/import-export" element={
                                <ProtectedRoute isLoggedIn={isLoggedIn}>
                                    <DataImportExport 
                                        technologies={technologies}
                                        onShowNotification={showNotification}
                                    />
                                </ProtectedRoute>
                            } />
                        </Routes>

                        <NotificationSnackbar
                            open={notification.open}
                            message={notification.message}
                            severity={notification.severity}
                            onClose={handleNotificationClose}
                        />
                    </main>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
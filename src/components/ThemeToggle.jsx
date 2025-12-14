import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function ThemeToggle({ onThemeChange }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme !== null) {
            const isDark = JSON.parse(storedTheme);
            setDarkMode(isDark);
            if (onThemeChange) {
                onThemeChange(isDark);
            }
        }
    }, [onThemeChange]);

    const handleToggle = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
        
        if (onThemeChange) {
            onThemeChange(newMode);
        }
    };

    return (
        <FormControlLabel
            control={
                <Switch 
                    checked={darkMode} 
                    onChange={handleToggle} 
                    color="primary"
                />
            }
            label={darkMode ? '🌙 Темная тема' : '☀️ Светлая тема'}
            sx={{ marginLeft: 'auto' }}
        />
    );
}

export default ThemeToggle;
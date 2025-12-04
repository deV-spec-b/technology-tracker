import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';

function App() {
    const [technologies, setTechnologies] = useState([
        { id: 1, title: "React Components", description: "Изучение базовых компонентов", status: "not-started" },
        { id: 2, title: "JSX Syntax", description: "Освоение синтаксиса JSX", status: "not-started" },
        { id: 3, title: "State Management", description: "Работа с состоянием компонентов", status: "not-started" },
        { id: 4, title: "React Hooks", description: "Использование хуков useState, useEffect", status: "not-started" },
        { id: 5, title: "Props & Context", description: "Передача данных между компонентами", status: "not-started" }
    ]);

    const [activeFilter, setActiveFilter] = useState('all');

    const changeTechnologyStatus = (id) => {
        setTechnologies(prevTech => prevTech.map(tech => {
            if (tech.id === id) {
                let nextStatus;
                if (tech.status === 'not-started') {
                    nextStatus = 'in-progress';
                } else if (tech.status === 'in-progress') {
                    nextStatus = 'completed';
                } else {
                    nextStatus = 'not-started';
                }
                return { ...tech, status: nextStatus };
            }
            return tech;
        }));
    };

    const markAllCompleted = () => {
        setTechnologies(prevTech => 
            prevTech.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    const resetAllStatuses = () => {
        setTechnologies(prevTech => 
            prevTech.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    const selectRandomTechnology = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTech.length > 0) {
            const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
            changeTechnologyStatus(randomTech.id);
            alert(`🎯 Следующая технология для изучения: "${randomTech.title}"`);
        } else {
            alert('🎉 Все технологии уже начаты или изучены!');
        }
    };

    const filteredTechnologies = technologies.filter(tech => {
        if (activeFilter === 'all') return true;
        return tech.status === activeFilter;
    });

    return (
        <div className="App">
            <h1>🚀 Трекер изучения технологий</h1>
            
            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                onRandomSelect={selectRandomTechnology}
            />
            
            <FilterButtons 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />
            
            <div className="technology-list">
                {filteredTechnologies.map(tech => (
                    <TechnologyCard
                        key={tech.id}
                        id={tech.id}
                        title={tech.title}
                        description={tech.description}
                        status={tech.status}
                        changeStatus={changeTechnologyStatus}
                    />
                ))}
                {filteredTechnologies.length === 0 && (
                    <div className="empty-state">
                        <p>📭 Нет технологий с выбранным статусом</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
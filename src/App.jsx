import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import useTechnologies from './components/useTechnologies';
import ProgressBar from './components/ProgressBar';

function App() {
    const {technologies, updateStatus, updateNotes, progress, updateMultipleStatuses} = useTechnologies();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const changeTechnologyStatus = (id) => {
        const tech = technologies.find(t => t.id === id);
        if (!tech) return;
        let nextStatus;
        if (tech.status === 'not-started') {
            nextStatus = 'in-progress';
        } else if (tech.status === 'in-progress') {
            nextStatus = 'completed';
        } else {
            nextStatus = 'not-started';
        }
        updateStatus(id, nextStatus);
    };

    const markAllCompleted = () => {
        const allIds = technologies.map(tech => tech.id);
        updateMultipleStatuses(allIds, 'completed');
    };

    const resetAllStatuses = () => {
        const allIds = technologies.map(tech => tech.id);
        updateMultipleStatuses(allIds, 'not-started');
    };

    const selectRandomTechnology = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTech.length > 0) {
            const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
            updateStatus(randomTech.id, 'in-progress');
            alert(`🎯 Следующая технология для изучения: "${randomTech.title}"`);
        } else {
            alert('🎉 Все технологии уже начаты или изучены!');
        }
    };

    const filteredByStatus = technologies.filter(tech => {
        if (activeFilter === 'all') return true;
        return tech.status === activeFilter;
    });

    const filteredTechnologies = filteredByStatus.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="App">
            <h1>🚀 Трекер изучения технологий</h1>

            <div className='main-progress'>
                <ProgressBar
                    progress={progress}
                    label='Общий прогресс изучения'
                    color='#2196F3'
                    animated={true}
                    height={25}
                />
            </div>
            
            <ProgressHeader technologies={technologies} />
            
            <QuickActions 
                onMarkAllCompleted={markAllCompleted}
                onResetAll={resetAllStatuses}
                onRandomSelect={selectRandomTechnology}
                technologies={technologies}
            />
            
            <FilterButtons 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />
            
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span>Найдено: {filteredTechnologies.length}</span>
            </div>

            <div className="technology-list">
                {filteredTechnologies.map(tech => (
                    <TechnologyCard
                        key={tech.id}
                        id={tech.id}
                        title={tech.title}
                        description={tech.description}
                        status={tech.status}
                        changeStatus={changeTechnologyStatus}
                        notes={tech.notes}
                        updateNotes={updateNotes}
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
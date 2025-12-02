import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
    const technologies = [
        { id: 1, title: "React Components", description: "Изучение базовых компонентов", status: "in-progress" },
        { id: 2, title: "JSX Syntax", description: "Освоение синтаксиса JSX", status: "not-started" },
        { id: 3, title: "State Management", description: "Работа с состоянием компонентов", status: "completed" }
    ];

    return (
        <div className="App">
            <h1>Трекер изучения технологий</h1>
            
            <ProgressHeader technologies={technologies} />
            
            <div className="technology-list">
                {technologies.map(tech => (
                    <TechnologyCard
                        key={tech.id}
                        title={tech.title}
                        description={tech.description}
                        status={tech.status}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
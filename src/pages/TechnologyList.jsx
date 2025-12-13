import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi'; 
import '../App.css';
import TechnologySearch from '../components/TechnologySearch';
import ResourceManager from '../components/ResourceManager';
import RoadmapImporter from '../components/RoadmapImporter';

function TechnologyList() { 
    const { technologies, loading, error, handleRetry } = useTechnologiesApi();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedTechForResources, setSelectedTechForResources] = useState(null);
    const [localTechnologies, setLocalTechnologies] = useState([]); 

    useEffect(() => {
        if (technologies.length > 0 && localTechnologies.length === 0) {
            console.log('Синхронизируем технологии:', technologies.length);
            setLocalTechnologies(technologies);
        }
    }, [technologies, localTechnologies.length]);

    if (loading) {
        return (
            <div className="page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Загрузка технологий...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="error-state">
                    <h2>Произошла ошибка</h2>
                    <p>{error}</p>
                    <button onClick={handleRetry} className="btn btn-primary">
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    const handleResourcesUpdate = (techId, updatedResources) => {
        const updatedTechs = localTechnologies.map(tech => 
            tech.id === techId 
                ? { ...tech, resources: updatedResources }
                : tech
        );
        setLocalTechnologies(updatedTechs);

        console.log('Ресурсы обновлены для технологии ID:', techId);
        console.log('Обновленные ресурсы:', updatedResources);
    };

    const filteredByStatus = localTechnologies.filter(tech => {
        if (activeFilter === 'all') return true;
        return tech.status === activeFilter;
    });

    const handleRoadmapImport = (importTechs) => {
        const updatedTechs = [...localTechnologies, ...importTechs];
        setLocalTechnologies(updatedTechs);
        console.log(`✅ Импортировано ${importTechs.length} технологий из дорожной карты`);

        alert(`✅ Успешно импортировано ${importTechs.length} технологий!`);
    };

    const filteredTechnologies = filteredByStatus.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии ({localTechnologies.length})</h1>
                <div className="header-actions">
                    <button onClick={handleRetry} className="btn btn-secondary">
                        🔄 Обновить из API
                    </button>
                    <Link to="/add-technology" className="btn btn-primary">
                        ➕ Добавить технологию
                    </Link>
                </div>
            </div>

            {localTechnologies.length === 0 && technologies.length > 0 && (
                <div style={{background: '#fff3cd', padding: '10px', borderRadius: '5px', marginBottom: '15px'}}>
                    <p>⚠️ Данные загружены, но не отображаются. Попробуйте обновить страницу.</p>
                    <button onClick={() => setLocalTechnologies(technologies)} style={{background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px'}}>
                        Принудительно показать технологии
                    </button>
                </div>
            )}

            <TechnologySearch
                technologies={localTechnologies}
                onSearch={(filteredTechs) => {
                    console.log('Отфильтрованные технологии:', filteredTechs);
                }}
            />

            <RoadmapImporter onImport={handleRoadmapImport} />

            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск технологий..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="filter-buttons">
                    <button 
                        className={activeFilter === 'all' ? 'active' : ''}
                        onClick={() => setActiveFilter('all')}
                    >
                        Все
                    </button>
                    <button 
                        className={activeFilter === 'not-started' ? 'active' : ''}
                        onClick={() => setActiveFilter('not-started')}
                    >
                        Не начаты
                    </button>
                    <button 
                        className={activeFilter === 'in-progress' ? 'active' : ''}
                        onClick={() => setActiveFilter('in-progress')}
                    >
                        В процессе
                    </button>
                    <button 
                        className={activeFilter === 'completed' ? 'active' : ''}
                        onClick={() => setActiveFilter('completed')}
                    >
                        Изучено
                    </button>
                </div>
            </div>

            <div className="technologies-grid">
                {filteredTechnologies.length > 0 ? (
                    filteredTechnologies.map(tech => (
                        <div key={tech.id} className="technology-item">
                            <h3>{tech.title}</h3>
                            <p>{tech.description}</p>
                            <div className="technology-meta">
                                <span className={`status status-${tech.status}`}>
                                    {tech.status === 'completed' ? 'изучено' :
                                     tech.status === 'in-progress' ? 'в процессе' : 'не начато'}
                                </span>

                                <button 
                                    onClick={() => setSelectedTechForResources(tech)}
                                    className="btn-resources"
                                    title="Управление ресурсами"
                                >
                                    📎 Ресурсы {tech.resources ? `(${tech.resources.length})` : ''}
                                </button>
                                
                                <Link to={`/technology/${tech.id}`} className="btn-link">
                                    Подробнее →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>Технологий пока нет или ничего не найдено.</p>
                        <p style={{fontSize: '0.9rem', color: '#666'}}>
                            Загружено из хука: {technologies.length} | Локально: {localTechnologies.length}
                        </p>
                        <Link to="/add-technology" className="btn btn-primary">
                            Добавить первую технологию
                        </Link>
                    </div>
                )}
            </div>

            {selectedTechForResources && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Управление ресурсами: {selectedTechForResources.title}</h3>
                            <button 
                                onClick={() => setSelectedTechForResources(null)}
                                className="modal-close"
                            >
                                ×
                            </button>
                        </div>
                        
                        <ResourceManager 
                            technology={selectedTechForResources}
                            onResourcesUpdate={(updatedResources) => {
                                handleResourcesUpdate(selectedTechForResources.id, updatedResources);
                            }}
                        />
                        
                        <div className="modal-footer">
                            <button 
                                onClick={() => setSelectedTechForResources(null)}
                                className="btn-close-modal"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TechnologyList;
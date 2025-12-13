import { useState, useEffect, useRef } from 'react';
import './RoadmapImporter.css';

function RoadmapImporter({ onImport }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [importing, setImporting] = useState(false);
    const [importedCount, setImportedCount] = useState(0);

    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    const predefinedRoadmaps = [
        {
            id: 'frontend-2024',
            name: 'Frontend Developer Roadmap 2024',
            description: 'Современный стек фронтенд разработчика',
            technologies: [
                { title: 'HTML5 & Semantic HTML', category: 'frontend', level: 'beginner' },
                { title: 'CSS3 & Flexbox/Grid', category: 'frontend', level: 'beginner' },
                { title: 'JavaScript ES6+', category: 'frontend', level: 'intermediate' },
                { title: 'React.js with Hooks', category: 'frontend', level: 'intermediate' },
                { title: 'TypeScript', category: 'frontend', level: 'advanced' },
                { title: 'Next.js / Remix', category: 'frontend', level: 'advanced' },
                { title: 'State Management (Redux/Zustand)', category: 'frontend', level: 'intermediate' },
                { title: 'Testing (Jest, React Testing Library)', category: 'frontend', level: 'intermediate' }
            ]
        },
        {
            id: 'backend-node',
            name: 'Backend Developer (Node.js)',
            description: 'Путь backend разработчика на Node.js',
            technologies: [
                { title: 'Node.js Fundamentals', category: 'backend', level: 'beginner' },
                { title: 'Express.js Framework', category: 'backend', level: 'intermediate' },
                { title: 'REST API Design', category: 'backend', level: 'intermediate' },
                { title: 'Databases (PostgreSQL/MongoDB)', category: 'backend', level: 'intermediate' },
                { title: 'Authentication & Authorization', category: 'backend', level: 'advanced' },
                { title: 'Docker & Containers', category: 'devops', level: 'intermediate' },
                { title: 'Message Queues (Redis/RabbitMQ)', category: 'backend', level: 'advanced' }
            ]
        },
        {
            id: 'devops',
            name: 'DevOps Roadmap',
            description: 'Инфраструктура и deployment',
            technologies: [
                { title: 'Linux & Bash Scripting', category: 'devops', level: 'beginner' },
                { title: 'Docker & Docker Compose', category: 'devops', level: 'intermediate' },
                { title: 'Kubernetes', category: 'devops', level: 'advanced' },
                { title: 'CI/CD (GitHub Actions, GitLab CI)', category: 'devops', level: 'intermediate' },
                { title: 'Cloud Platforms (AWS/Azure/GCP)', category: 'devops', level: 'advanced' },
                { title: 'Monitoring (Prometheus, Grafana)', category: 'devops', level: 'advanced' }
            ]
        }
    ];

    const searchTechnologies = async (query) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            setError(null);

            if (!query.trim()) {
                setResults([]);
                setLoading(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 800));

            const mockResults = predefinedRoadmaps
                .filter(roadmap => 
                    roadmap.name.toLowerCase().includes(query.toLowerCase()) ||
                    roadmap.technologies.some(tech => 
                        tech.title.toLowerCase().includes(query.toLowerCase())
                    )
                )
                .slice(0, 3);

            setResults(mockResults);

        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Ошибка поиска');
                console.error('Ошибка при поиске:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchTechnologies(value);
        }, 500);
    };

    const handleImportRoadmap = async (roadmap) => {
        try {
            setImporting(true);
            setError(null);

            await new Promise(resolve => setTimeout(resolve, 600));

            const technologiesToImport = roadmap.technologies.map((tech, index) => ({
                id: Date.now() + index,
                title: tech.title,
                description: `Из дорожной карты: ${roadmap.name}. Уровень: ${tech.level}`,
                category: tech.category,
                status: 'not-started',
                progress: 0,
                resources: [],
                createdAt: new Date().toISOString(),
                source: 'roadmap-import',
                roadmapId: roadmap.id
            }));

            if (onImport && typeof onImport === 'function') {
                onImport(technologiesToImport);
                setImportedCount(prev => prev + technologiesToImport.length);
            }

            setTimeout(() => {
                setImporting(false);
            }, 300);

        } catch (err) {
            setError('Ошибка импорта: ' + err.message);
            setImporting(false);
        }
    };

    const handleImportAll = () => {
        const allTechs = predefinedRoadmaps.flatMap(roadmap => 
            roadmap.technologies.map((tech, index) => ({
                id: Date.now() + index + Math.random(),
                title: tech.title,
                description: `Из дорожной карты: ${roadmap.name}`,
                category: tech.category,
                status: 'not-started',
                progress: 0,
                resources: [],
                createdAt: new Date().toISOString()
            }))
        );

        if (onImport) {
            onImport(allTechs.slice(0, 10)); 
            setImportedCount(prev => prev + Math.min(10, allTechs.length));
        }
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div className="roadmap-importer">
            <div className="importer-header">
                <h2>🗺️ Импорт дорожных карт</h2>
                {importedCount > 0 && (
                    <span className="imported-count">Импортировано: {importedCount}</span>
                )}
            </div>

            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск дорожных карт (например: frontend, backend, devops)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={importing}
                    />
                    {loading && <div className="search-loading">🔍 Поиск...</div>}
                </div>

                <button 
                    onClick={handleImportAll}
                    className="btn-import-all"
                    disabled={importing}
                >
                    {importing ? 'Импорт...' : '📥 Импортировать все примеры'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="predefined-roadmaps">
                <h3>Готовые дорожные карты:</h3>
                <div className="roadmaps-grid">
                    {predefinedRoadmaps.map(roadmap => (
                        <div key={roadmap.id} className="roadmap-card">
                            <div className="roadmap-info">
                                <h4>{roadmap.name}</h4>
                                <p className="roadmap-description">{roadmap.description}</p>
                                <div className="roadmap-stats">
                                    <span className="stat">
                                        📊 {roadmap.technologies.length} технологий
                                    </span>
                                    <span className="stat">
                                        🏷️ {[...new Set(roadmap.technologies.map(t => t.category))].join(', ')}
                                    </span>
                                </div>
                                <div className="tech-preview">
                                    {roadmap.technologies.slice(0, 3).map((tech, idx) => (
                                        <span key={idx} className="tech-tag">
                                            {tech.title}
                                        </span>
                                    ))}
                                    {roadmap.technologies.length > 3 && (
                                        <span className="tech-more">
                                            +{roadmap.technologies.length - 3} ещё
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleImportRoadmap(roadmap)}
                                disabled={importing}
                                className="btn-import-roadmap"
                            >
                                {importing ? '🔄 Импорт...' : '📥 Импортировать'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {searchTerm && results.length > 0 && (
                <div className="search-results">
                    <h3>Результаты поиска:</h3>
                    <div className="results-list">
                        {results.map(roadmap => (
                            <div key={roadmap.id} className="result-card">
                                <h4>{roadmap.name}</h4>
                                <p>{roadmap.description}</p>
                                <button
                                    onClick={() => handleImportRoadmap(roadmap)}
                                    className="btn-import-result"
                                >
                                    Импортировать ({roadmap.technologies.length} тех.)
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {searchTerm && !loading && results.length === 0 && (
                <div className="no-results">
                    <p>По запросу "{searchTerm}" ничего не найдено.</p>
                    <p>Попробуйте: frontend, backend, devops, react, node</p>
                </div>
            )}
        </div>
    );
}

export default RoadmapImporter;
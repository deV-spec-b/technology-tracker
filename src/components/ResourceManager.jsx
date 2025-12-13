import React, { useState, useEffect, useCallback } from 'react';
import './ResourceManager.css';

function ResourceManager({ technology, onResourcesUpdate }) {
    const [resources, setResources] = useState(technology.resources || []);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [apiData, setApiData] = useState(null);

    const fetchResourcesFromAPI = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        
        try {
            console.log(`Загружаем ресурсы для технологии: ${technology.title}`);

            let apiUrl = '';
            const techName = technology.title.toLowerCase();
            
            if (techName.includes('react') || techName.includes('vue') || techName.includes('angular')) {
                apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(technology.title)}+in:name&sort=stars&per_page=5`;
            } else if (techName.includes('node') || techName.includes('express') || techName.includes('nestjs')) {
                apiUrl = `https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&tagged=${encodeURIComponent(technology.title)}&site=stackoverflow&pagesize=5&filter=withbody`;
            } else {
                apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(technology.title)}+language:javascript&sort=stars&per_page=5`;
            }
            
            console.log('Запрос к API:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Ошибка API: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Данные получены от API:', data);

            const apiResources = transformApiData(data, technology.title, apiUrl.includes('github') ? 'github' : 'stackoverflow');
            
            setApiData(apiResources);
            
        } catch (error) {
            console.error('Ошибка загрузки из API:', error);
            setApiError(`Не удалось загрузить ресурсы: ${error.message}`);

            const fallbackData = generateFallbackResources(technology.title);
            setApiData(fallbackData);
            
        } finally {
            setIsLoading(false);
        }
    }, [technology.title]);

    const transformGitHubData = (data) => {
        if (!data.items) return [];
        
        return data.items.map(item => ({
            id: item.id,
            name: item.name,
            url: item.html_url,
            type: 'github',
            description: item.description || 'Описание отсутствует',
            stars: item.stargazers_count,
            language: item.language,
            source: 'GitHub'
        }));
    };

    const transformStackOverflowData = (data) => {
        if (!data.items) return [];
        
        return data.items.map(item => ({
            id: item.question_id,
            name: item.title,
            url: `https://stackoverflow.com/questions/${item.question_id}`,
            type: 'stackoverflow',
            description: `Голосов: ${item.score}, Ответов: ${item.answer_count}`,
            votes: item.score,
            isAnswered: item.is_answered,
            tags: item.tags,
            source: 'Stack Overflow'
        }));
    };

    const transformApiData = (data, techName, apiType) => {
        if (apiType === 'github') {
            return transformGitHubData(data);
        } else {
            return transformStackOverflowData(data);
        }
    };

    const generateFallbackResources = (techName) => {
        const baseUrls = {
            'react': 'https://react.dev',
            'node': 'https://nodejs.org',
            'javascript': 'https://developer.mozilla.org/ru/docs/Web/JavaScript',
            'typescript': 'https://www.typescriptlang.org',
            'python': 'https://python.org',
            'docker': 'https://docker.com'
        };
        
        const techKey = techName.toLowerCase();
        const baseUrl = baseUrls[techKey] || 'https://github.com';
        
        return [
            {
                id: 1,
                name: `Официальная документация ${techName}`,
                url: baseUrl,
                type: 'docs',
                description: 'Основная документация и руководства',
                source: 'Официальный сайт'
            },
            {
                id: 2,
                name: `${techName} на MDN Web Docs`,
                url: `https://developer.mozilla.org/search?q=${encodeURIComponent(techName)}`,
                type: 'docs',
                description: 'Документация на MDN',
                source: 'MDN'
            },
            {
                id: 3,
                name: `Курсы по ${techName}`,
                url: `https://freecodecamp.org/search?query=${encodeURIComponent(techName)}`,
                type: 'course',
                description: 'Бесплатные курсы и уроки',
                source: 'freeCodeCamp'
            }
        ];
    };

    useEffect(() => {
        if (technology && technology.title) {
            fetchResourcesFromAPI();
        }
    }, [technology, fetchResourcesFromAPI]);

    const addResourceFromAPI = (apiResource) => {
        const resourceToAdd = {
            ...apiResource,
            addedAt: new Date().toISOString(),
            isFromApi: true
        };
        
        const updatedResources = [...resources, resourceToAdd];
        setResources(updatedResources);
        
        if (onResourcesUpdate) {
            onResourcesUpdate(updatedResources);
        }
    };

    const addAllResourcesFromAPI = () => {
        if (!apiData || apiData.length === 0) return;
        
        const resourcesToAdd = apiData.map(item => ({
            ...item,
            addedAt: new Date().toISOString(),
            isFromApi: true
        }));
        
        const updatedResources = [...resources, ...resourcesToAdd];
        setResources(updatedResources);
        
        if (onResourcesUpdate) {
            onResourcesUpdate(updatedResources);
        }
    };
    
    const handleRemoveResource = (resourceId) => {
        const updatedResources = resources.filter(r => r.id !== resourceId);
        setResources(updatedResources);
        
        if (onResourcesUpdate) {
            onResourcesUpdate(updatedResources);
        }
    };
    
    const resourceTypes = {
        'github': { label: 'GitHub', color: '#24292e', icon: '🐙' },
        'stackoverflow': { label: 'Stack Overflow', color: '#f48024', icon: '🗨️' },
        'docs': { label: 'Документация', color: '#3498db', icon: '📚' },
        'course': { label: 'Курс', color: '#9b59b6', icon: '🎓' },
        'article': { label: 'Статья', color: '#f39c12', icon: '📰' }
    };
    
    return (
        <div className="resource-manager">
            <div className="resource-header">
                <h4>📡 Загрузка ресурсов для "{technology.title}"</h4>
                <span className="resource-count">{resources.length} добавлено</span>
            </div>

            <div className="api-section">
                <div className="api-header">
                    <h5>Ресурсы из внешних API</h5>
                    <button 
                        onClick={fetchResourcesFromAPI}
                        className="btn-refresh-api"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : '🔄 Обновить'}
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="loading-api">
                        <div className="spinner"></div>
                        <p>Загрузка ресурсов из API...</p>
                    </div>
                ) : apiError ? (
                    <div className="api-error">
                        <p>⚠️ {apiError}</p>
                        <p>Используются демо-данные</p>
                    </div>
                ) : null}
                
                {apiData && apiData.length > 0 && (
                    <>
                        <div className="api-resources-list">
                            {apiData.map(resource => (
                                <div key={resource.id} className="api-resource-item">
                                    <div className="api-resource-icon" style={{ backgroundColor: resourceTypes[resource.type]?.color }}>
                                        {resourceTypes[resource.type]?.icon}
                                    </div>
                                    
                                    <div className="api-resource-content">
                                        <h6>{resource.name}</h6>
                                        <p className="api-resource-desc">{resource.description}</p>
                                        <div className="api-resource-meta">
                                            <span className="api-resource-source">
                                                {resource.source}
                                                {resource.stars && ` · ⭐ ${resource.stars}`}
                                                {resource.language && ` · ${resource.language}`}
                                            </span>
                                            <a 
                                                href={resource.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="api-resource-link"
                                            >
                                                Открыть
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => addResourceFromAPI(resource)}
                                        className="btn-add-from-api"
                                    >
                                        Добавить
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="api-actions">
                            <button 
                                onClick={addAllResourcesFromAPI}
                                className="btn-add-all"
                            >
                                📥 Добавить все ресурсы из API
                            </button>
                            <p className="api-note">
                                Ресурсы загружены из {apiData[0]?.source === 'GitHub' ? 'GitHub API' : 'Stack Overflow API'}
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className="resources-list">
                <h5>Добавленные ресурсы ({resources.length})</h5>
                
                {resources.length === 0 ? (
                    <div className="empty-resources">
                        <p>Нет добавленных ресурсов.</p>
                        <p>Используйте кнопки выше для загрузки из API</p>
                    </div>
                ) : (
                    <div className="resources-grid">
                        {resources.map(resource => (
                            <div key={resource.id} className="resource-item">
                                <div className="resource-badge" style={{ backgroundColor: resourceTypes[resource.type]?.color }}>
                                    {resourceTypes[resource.type]?.icon}
                                </div>
                                
                                <div className="resource-main">
                                    <div className="resource-title">
                                        <h6>{resource.name}</h6>
                                        {resource.isFromApi && (
                                            <span className="api-badge">Из API</span>
                                        )}
                                    </div>
                                    
                                    <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="resource-url"
                                    >
                                        {resource.url.replace('https://', '').substring(0, 40)}...
                                    </a>
                                    
                                    <p className="resource-desc">{resource.description}</p>
                                    
                                    <div className="resource-footer">
                                        <span className="resource-source">{resource.source}</span>
                                        <span className="resource-date">
                                            {new Date(resource.addedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handleRemoveResource(resource.id)}
                                    className="btn-remove"
                                    title="Удалить ресурс"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResourceManager;
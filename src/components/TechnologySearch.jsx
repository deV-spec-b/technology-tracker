import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TechnologySearch.css'; 

function TechnologySearch({ technologies, onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const searchTimeoutRef = useRef(null);

    const performSearch = useCallback((query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        
        setIsSearching(true);

        setTimeout(() => {
            const filtered = technologies.filter(tech =>
                tech.title.toLowerCase().includes(query.toLowerCase()) ||
                tech.description.toLowerCase().includes(query.toLowerCase()) ||
                tech.category.toLowerCase().includes(query.toLowerCase())
            );
            
            setSearchResults(filtered);
            setIsSearching(false);

            if (onSearch) {
                onSearch(filtered);
            }
        }, 300); 
    }, [technologies, onSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!value.trim()) {
            setSearchResults([]);
            if (onSearch) onSearch(technologies); 
            return;
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearching(false);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        if (onSearch) {
            onSearch(technologies); 
        }
    };
    
    return (
        <div className="technology-search">
            <div className="search-header">
                <h3>🔍 Поиск технологий</h3>
                <div className="search-stats">
                    {searchTerm && (
                        <span className="search-info">
                            Найдено: {searchResults.length} из {technologies.length}
                        </span>
                    )}
                </div>
            </div>
            
            <div className="search-input-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Введите название, описание или категорию..."
                    className="search-input"
                    aria-label="Поиск технологий"
                />
                
                {searchTerm && (
                    <button 
                        onClick={handleClearSearch}
                        className="clear-button"
                        aria-label="Очистить поиск"
                    >
                        ✕
                    </button>
                )}
                
                {isSearching && (
                    <div className="searching-indicator">
                        <span className="spinner-small"></span>
                        <span>Поиск...</span>
                    </div>
                )}
            </div>

            <div className="quick-tags">
                <span className="tag-label">Быстрый поиск:</span>
                {['react', 'javascript', 'nodejs', 'frontend', 'backend'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => {
                            setSearchTerm(tag);
                            performSearch(tag);
                        }}
                        className="tag-button"
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {searchTerm && searchResults.length > 0 && (
                <div className="search-results">
                    <h4>Результаты поиска:</h4>
                    <div className="results-list">
                        {searchResults.map(tech => (
                            <div key={tech.id} className="result-item">
                                <h5>{tech.title}</h5>
                                <p className="result-description">
                                    {tech.description.length > 100 
                                        ? tech.description.substring(0, 100) + '...' 
                                        : tech.description}
                                </p>
                                <div className="result-meta">
                                    <span className="result-category">{tech.category}</span>
                                    <span className={`result-status status-${tech.status}`}>
                                        {tech.status === 'completed' ? 'изучено' :
                                         tech.status === 'in-progress' ? 'в процессе' : 'не начато'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {searchTerm && !isSearching && searchResults.length === 0 && (
                <div className="no-results">
                    <p>😔 По запросу "{searchTerm}" ничего не найдено</p>
                    <button onClick={handleClearSearch} className="btn-link">
                        Показать все технологии
                    </button>
                </div>
            )}
        </div>
    );
}

export default TechnologySearch;
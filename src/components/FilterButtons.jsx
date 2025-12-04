import './FilterButtons.css';

function FilterButtons({ activeFilter, setActiveFilter }) {
    const filters = [
        { id: 'all', label: 'Все технологии' },
        { id: 'not-started', label: 'Не начатые' },
        { id: 'in-progress', label: 'В процессе' },
        { id: 'completed', label: 'Выполненные' }
    ];

    return (
        <div className="filter-buttons">
            <h3>🔍 Фильтр по статусу</h3>
            <div className="filter-options">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter.id)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterButtons;
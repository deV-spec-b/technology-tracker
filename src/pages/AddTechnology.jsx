import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function AddTechnology({ onAddTechnology }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        status: 'not-started',
        difficulty: 'beginner'
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('Введите название технологии');
            return;
        }

        setSubmitting(true);
        
        try {
            await onAddTechnology({
                title: formData.title,
                description: formData.description,
                category: formData.category,
                status: formData.status,
                difficulty: formData.difficulty,
                resources: []
            });
            
            alert(`Технология "${formData.title}" успешно добавлена!`);
            navigate('/technologies');
            
        } catch (err) {
            alert('Ошибка при добавлении: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <h1>Добавить новую технологию</h1>
            </div>

            <form onSubmit={handleSubmit} className="add-technology-form">
                <div className="form-group">
                    <label htmlFor="title">Название технологии *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Например: React Hooks"
                        required
                        disabled={submitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Краткое описание технологии..."
                        rows="3"
                        disabled={submitting}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Категория</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Базы данных</option>
                        <option value="devops">DevOps</option>
                        <option value="tools">Инструменты</option>
                        <option value="other">Другое</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Статус изучения</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        <option value="not-started">Не начато</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Завершено</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="difficulty">Сложность</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        <option value="beginner">Начинающий</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Добавление...' : 'Добавить технологию'}
                    </button>
                    <button 
                        type="button" 
                        className="btn"
                        onClick={() => navigate('/technologies')}
                        disabled={submitting}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;
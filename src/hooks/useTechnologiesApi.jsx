import { useState, useEffect } from 'react';

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const DEMO_TECHNOLOGIES = [
        {
            id: 1,
            title: 'React: Основы и хуки',
            description: 'Изучение useState, useEffect и основных концепций React. Библиотека для создания пользовательских интерфейсов.',
            category: 'frontend, react, javascript',
            status: 'in-progress',
            progress: 65,
            resources: [
                { type: 'docs', name: 'Официальная документация', url: 'https://react.dev' },
                { type: 'tutorial', name: 'Учебник на русском', url: 'https://ru.reactjs.org' }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            title: 'Node.js и Express',
            description: 'Создание серверных приложений на JavaScript. Среда выполнения JavaScript на сервере.',
            category: 'backend, nodejs, javascript',
            status: 'not-started',
            progress: 10,
            resources: [
                { type: 'docs', name: 'Документация Node.js', url: 'https://nodejs.org' },
                { type: 'course', name: 'Руководства', url: 'https://nodejs.org/en/docs/guides/' }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            title: 'TypeScript для React',
            description: 'Типизированное надмножество JavaScript для больших проектов.',
            category: 'language, typescript, frontend',
            status: 'completed',
            progress: 100,
            resources: [
                { type: 'docs', name: 'Официальный сайт', url: 'https://www.typescriptlang.org' },
                { type: 'handbook', name: 'Справочник', url: 'https://www.typescriptlang.org/docs/' }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            title: 'MongoDB и Mongoose',
            description: 'NoSQL база данных и ODM для работы с Node.js. Хранение данных в документно-ориентированном формате.',
            category: 'database, mongodb, backend',
            status: 'in-progress',
            progress: 40,
            resources: [
                { type: 'docs', name: 'Документация MongoDB', url: 'https://mongodb.com' },
                { type: 'guide', name: 'Руководство Mongoose', url: 'https://mongoosejs.com' }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            title: 'Docker для разработчиков',
            description: 'Контейнеризация приложений и настройка окружения. Инструмент для создания, развертывания и управления контейнерами.',
            category: 'devops, docker, containers',
            status: 'not-started',
            progress: 0,
            resources: [
                { type: 'docs', name: 'Официальная документация', url: 'https://docker.com' },
                { type: 'tutorial', name: 'Учебник для начинающих', url: 'https://docs.docker.com/get-started/' }
            ],
            createdAt: new Date().toISOString()
        }
    ];

    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            console.log('✅ Устанавливаем демо-технологии:', DEMO_TECHNOLOGIES.length);
            setTechnologies(DEMO_TECHNOLOGIES);
            setError(null);
            
        } catch (err) {
            console.error('Ошибка при загрузке технологий:', err);
            setTechnologies(DEMO_TECHNOLOGIES);
            setError('Используются демо-данные');
        } finally {
            setLoading(false);
        }
    };

    const addTechnology = async (techData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newTech = {
                id: Date.now(), 
                ...techData,
                createdAt: new Date().toISOString()
            };

            setTechnologies(prev => [newTech, ...prev]);
            return newTech;
            
        } catch (err) {
            throw new Error('Не удалось добавить технологию');
        }
    };

    useEffect(() => {
        console.log('🔄 Загружаем технологии при монтировании компонента...');
        fetchTechnologies();
    }, []);

    return {
        technologies,
        loading,
        error,
        refetch: fetchTechnologies,
        addTechnology,
        handleRetry: fetchTechnologies
    };
}

export default useTechnologiesApi;
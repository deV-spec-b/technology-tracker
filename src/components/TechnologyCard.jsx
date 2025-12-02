import './TechnologyCard.css';

function TechnologyCard({title, description, status}) {
    return (
        <div className="TechnologyCard">
            <div className={`status ${status}`}>
                Статус: {status === 'completed' ? 'изучено' :
                        status === 'in-progress' ? 'в процессе' :
                        'не начали'}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default TechnologyCard;
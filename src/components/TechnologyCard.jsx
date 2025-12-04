import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({title, description, status, id, changeStatus, notes,updateNotes }) {
    const handleClick = () => {
        if (changeStatus) {
            changeStatus(id);
        }
    };

    return (
        <div className={`TechnologyCard status-${status}`}
        onClick={handleClick}
        >
            <div className={`status ${status}`}>
                Статус: {status === 'completed' ? 'изучено' :
                        status === 'in-progress' ? 'в процессе' :
                        'не начали'}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>

            <TechnologyNotes
                notes={notes}
                techId={id}
                onNotesChange={updateNotes}
            /> 
        </div>
    );
}

export default TechnologyCard;
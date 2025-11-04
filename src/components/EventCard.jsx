import React from 'react';
import './EventCard.css';

// We use "props" to pass the event data into this component
// Here, we are destructuring `event` directly from props
function EventCard({ event }) {
  
  // Helper function to get a simple color based on event type
  const getTagColor = (type) => {
    switch (type.toLowerCase()) {
      case 'hackathon':
        return 'tag-blue';
      case 'internship':
        return 'tag-green';
      case 'workshop':
        return 'tag-purple';
      default:
        return 'tag-grey';
    }
  };

  return (
    <div className="event-card">
      <div className="card-header">
        <span className={`tag ${getTagColor(event.type)}`}>
          {event.type}
        </span>
      </div>
      
      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <p className="card-organization">{event.organization}</p>
        
        <div className="card-details">
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
        </div>
        
        <p className="card-description">{event.description}</p>
      </div>
      
      <div className="card-footer">
        <div className="tags-container">
          {event.tags.map((tag) => (
            <span key={tag} className="tag tag-grey">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
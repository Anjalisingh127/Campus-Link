import React, { useState, useEffect } from 'react';
import { mockEvents } from '../data/mockData';
import EventCard from './EventCard';
import './EventList.css';

function EventList({ title, filterType }) {
  
  const [events, setEvents] = useState([]);
  // New state to store the user's search text
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // 1. First, filter by the page type (Hackathon, Internship, etc.)
    let filteredEvents = filterType 
      ? mockEvents.filter(event => event.type === filterType) 
      : mockEvents;
      
    // 2. Then, filter by the search query
    if (searchQuery) {
      filteredEvents = filteredEvents.filter(event => 
        // We check the title, description, and organization for the query
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
      
    setEvents(filteredEvents);
    
  // Updated dependencies: re-run this logic if filterType OR searchQuery changes
  }, [filterType, searchQuery]); 

  return (
    <div className="event-list-container">
      {/* The title is now dynamic from the prop */}
      <h2>{title}</h2>

      {/* --- New Search Bar --- */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by title, org, or keyword..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* --- End of Search Bar --- */}
      
      <div className="event-list">
        {/* If no events match, show a message */}
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="no-events-message">No events found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default EventList;
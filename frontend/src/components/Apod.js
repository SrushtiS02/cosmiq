// frontend/src/components/Apod.js

import React, { useState, useEffect } from 'react';
import './Apod.css';

export default function Apod() {
  const [date, setDate] = useState('');        // YYYY-MM-DD
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApod = async selectedDate => {
    setLoading(true);
    setError(null);
    try {
      const query = selectedDate ? `?date=${selectedDate}` : '';
      const res = await fetch(`/api/apod${query}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setApod(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount and whenever date changes
  useEffect(() => {
    fetchApod(date);
  }, [date]);

  return (
    <div className="apod-container">
      <div className="apod-controls">
        <label>
          Pick a date:&nbsp;
          <input
            type="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setDate(e.target.value)}
          />
        </label>
      </div>

      {loading && <p>Loading APOD…</p>}
      {error && <p style={{ color: 'salmon' }}>Error: {error}</p>}

      {apod && !loading && !error && (
        <>
          <h2 className="apod-title">{apod.title}</h2>
          <p className="apod-date">{apod.date}</p>

          {apod.media_type === 'image' ? (
            <img
              src={apod.url}
              alt={apod.title}
              className="apod-image"
            />
          ) : (
            <iframe
              title="APOD Video"
              src={apod.url}
              className="apod-video"
              frameBorder="0"
              allowFullScreen
            />
          )}

          <p className="apod-description">{apod.explanation}</p>
        </>
      )}
    </div>
  );
}

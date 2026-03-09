import React from 'react';
import './Loading.css';

const Loading = () => (
  <div className="loading-widget" aria-label="Loading">
    <div className="loading-widget-spinner" />
    <p className="loading-widget-text">Loading...</p>
  </div>
);

export default Loading;

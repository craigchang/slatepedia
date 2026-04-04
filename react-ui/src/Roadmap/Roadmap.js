import React from 'react';

import './Roadmap.css';

const nextFeatures = [
  'Filtering of fields in each resource.'
];

const futureFeatures = [
  'Tears of the Kingdom content to be appended to existing BOTW content.'
];

function Roadmap() {
  return (
    <div className="container roadmap-page">
      <h1 className="page-header">Development roadmap</h1>
      <p className="lead text-body-secondary mb-4">
        Planned enhancements for Slatepedia. There are no release dates here—<strong>Next</strong> is what we are
        working toward next, and <strong>Future</strong> is under consideration but not yet scheduled.
      </p>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card h-100 border-primary roadmap-card">
            <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
              <span>Next</span>
              <span className="badge bg-light text-primary">In progress</span>
            </div>
            <ul className="list-group list-group-flush">
              {nextFeatures.map((text) => (
                <li key={text} className="list-group-item d-flex align-items-start gap-2">
                  <i className="fa fa-arrow-right text-primary mt-1" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100 border-secondary roadmap-card">
            <div className="card-header bg-secondary text-white d-flex align-items-center justify-content-between">
              <span>Future</span>
              <span className="badge bg-light text-secondary">Considering</span>
            </div>
            <ul className="list-group list-group-flush">
              {futureFeatures.map((text) => (
                <li key={text} className="list-group-item d-flex align-items-start gap-2">
                  <i className="fa fa-lightbulb-o text-secondary mt-1" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;

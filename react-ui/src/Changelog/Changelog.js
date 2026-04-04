import React, { Component } from 'react';
import LoadingWidget from '../CommonComponents/Loading/Loading';

import './Changelog.css';

class Changelog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: null,
      fetching: true,
      error: null
    };
  }

  componentDidMount() {
    fetch('/api/changelog')
      .then(response => {
        if (!response.ok) throw new Error(`status ${response.status}`);
        return response.json();
      })
      .then(entries => this.setState({ entries, fetching: false, error: null }))
      .catch(e => this.setState({ entries: null, fetching: false, error: e.message }));
  }

  formatDate(isoString) {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  render() {
    const { entries, fetching, error } = this.state;

    if (fetching) {
      return (
        <div className="container">
          <h1 className="page-header">Changelog</h1>
          <LoadingWidget />
        </div>
      );
    }

    if (error) {
      return (
        <div className="container">
          <h1 className="page-header">Changelog</h1>
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <h1 className="page-header">Changelog</h1>
        <p className="changelog-intro">
          Recent changes to Slatepedia, in plain language. Summaries describe what you will notice on the site, not source files or internal structure. Updates are made continuously.
        </p>
        <ul className="list-group changelog-list">
          {entries && entries.map((entry, idx) => {
            const key = entry.version || String(idx);
            const title = (entry.title || '').trim();
            const message = (entry.message || '').trim();
            const version = (entry.version || '').trim() || '-';

            return (
            <li key={key} className="list-group-item changelog-item">
              <div className="changelog-item-header">
                <span className="changelog-version" title="Release version">
                  v{version}
                </span>
                <span className="changelog-date">{this.formatDate(entry.date)}</span>
              </div>
              <p className="changelog-message">{title}</p>
              {message ? (
                <div className="changelog-detail">{message}</div>
              ) : null}
            </li>
          )})}
        </ul>
      </div>
    );
  }
}

export default Changelog;

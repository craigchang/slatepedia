import React, { Component } from 'react';
import LoadingWidget from '../Other/Loading/Loading';

import './Changelog.css';

class Changelog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commits: null,
      fetching: true,
      error: null
    };
  }

  componentDidMount() {
    fetch('/api/commits?per_page=20')
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || `status ${response.status}`);
          });
        }
        return response.json();
      })
      .then(commits => {
        this.setState({
          commits,
          fetching: false,
          error: null
        });
      })
      .catch(e => {
        this.setState({
          commits: null,
          fetching: false,
          error: e.message
        });
      });
  }

  formatDate(isoString) {
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
    const { commits, fetching, error } = this.state;

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
          Recent commits and changes to Slatepedia. Updates are made continuously.
        </p>
        <ul className="list-group changelog-list">
          {commits && commits.map((commit) => (
            <li key={commit.sha} className="list-group-item changelog-item">
              <div className="changelog-item-header">
                <a
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="changelog-sha"
                  title="View on GitHub"
                >
                  {commit.sha.substring(0, 7)}
                </a>
                <span className="changelog-date">
                  {this.formatDate(commit.commit.author.date)}
                </span>
              </div>
              <p className="changelog-message">
                {commit.commit.message.split('\n')[0]}
              </p>
              {commit.commit.message.includes('\n') && (
                <pre className="changelog-detail">
                  {commit.commit.message.split('\n').slice(1).join('\n').trim()}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Changelog;

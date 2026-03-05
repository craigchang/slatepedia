import React, { Component } from 'react';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView';
import IconContainer from '../Other/IconContainer/IconContainer';

import './AnimalsDetail.css';
import '../Animals/AnimalSprites.css';

class AnimalsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: null,
      fetching: true
    };
  }

  componentDidMount() {
    fetch('/api' + this.props.location.pathname)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          json: json,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          json: null,
          fetching: false
        });
      });
  }

  showDetailView(animal) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={animal.name} folderName={"animals"} cssClassName={animal.cssClassName} spriteSheet={"animals"} />
              </td>
            </tr>
            { animal.description ? (
              <tr>
                <td>Description</td>
                <td><i className="fa fa-book" aria-hidden="true"></i> {animal.description}</td>
              </tr>
            ) : '' }
            <tr>
              <td>Common Locations</td>
              <td>
                { animal.commonLocations != null && animal.commonLocations.length > 0
                  ? animal.commonLocations.map((location, index) => (
                      <p key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {location}</p>
                    ))
                  : <span>—</span>
                }
              </td>
            </tr>
          </tbody>
        </DataDetailTableView>
      </div>
    );
  }

  render() {
    let view = null;

    if (this.state.fetching)
      view = '';
    else {
      if (this.state.json == null)
        view = (
          <h1 className="page-header">Animal Not Found :(</h1>
        );
      else
        view = (
          <div>
            <h1 className="page-header">{this.state.json.name}</h1>
            {this.showDetailView(this.state.json)}
          </div>
        );
    }

    return (
      <div className="container">
        {view}
      </div>
    );
  }
}

export default AnimalsDetail;

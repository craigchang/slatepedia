import React, { Component } from 'react';
import DataDetailTableView from '../CommonComponents/DataDetailTableView/DataDetailTableView';
import IconContainer from '../CommonComponents/IconContainer/IconContainer';

import './AnimalsDetail.css';
import '../Animals/AnimalSprites.css';
import '../Materials/MaterialsSprites.css';
import BonusEffect from '../CommonComponents/BonusEffect/BonusEffect';

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
            <tr>
              <td>Description</td>
              <td>
                { !animal.description ? '-' : <><i className="fa fa-book" aria-hidden="true"></i> {animal.description}</>}
              </td>
            </tr>
            <tr>
              <td>Unique Cooking Effects</td>
              <td>
                { !animal.uniqueCookingEffects ? '-' : <BonusEffect effectName={animal.uniqueCookingEffects} /> }
              </td>
            </tr>
            <tr>
              <td>Common Locations</td>
              <td>
                { 
                  !animal.commonLocations || animal.commonLocations.length == 0 ? '-' : 
                  animal.commonLocations.map((location, index) => (
                      <p key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {location}</p>
                  ))
                }
              </td>
            </tr>
          </tbody>
        </DataDetailTableView>

        { !animal.recoverableMaterials || animal.recoverableMaterials.length == 0 ? '' : (
          <div>
            <h2 className="page-header">Recoverable Materials</h2>
            <DataDetailTableView>
              <thead>
                <tr>
                  <td><b>Icon</b></td>
                  <td><b>Name</b></td>
                </tr>
              </thead>
              <tbody>
                {animal.recoverableMaterials.map((material, index) => {
                  const cssClassName = material.cssClassName || material.name.replace(/ /g, '-').replace(/'/g, '').toLowerCase();
                  return (
                    <tr key={index}>
                      <td>
                        <IconContainer propertyName={material.name} folderName="materials" cssClassName={cssClassName} spriteSheet="materials" small/>
                      </td>
                      <td style={{'vertical-align': 'middle'}}>
                        <i className="fa fa-cog"></i> <a href={"/materials/" + material.id}>{material.name}</a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataDetailTableView>
          </div>
        )}
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

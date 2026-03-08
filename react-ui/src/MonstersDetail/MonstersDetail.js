import React, { Component } from 'react';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView';
import IconContainer from '../Other/IconContainer/IconContainer';

import './MonstersDetail.css';
import '../Monsters/MonsterSprites.css';

class MonstersDetail extends Component {
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

  showDetailView(monster) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={monster.name} folderName={"monsters"} cssClassName={monster.cssClassName} spriteSheet={"monsters"} />
              </td>
            </tr>
            { monster.size === '' ? '' : 
              <tr>
                <td>Size</td>
                <td><i className="fa fa-user-plus" aria-hidden="true"></i> {monster.size}</td>
              </tr>
            }
            <tr>
              <td>HP</td>
              <td><i className="fa fa-heart" aria-hidden="true"></i> {monster.hp}</td>
            </tr>
            <tr>
              <td>Rank</td>
              <td><i className="fa fa-star" aria-hidden="true"></i> {monster.rank}</td>
            </tr>
            <tr>
              <td>Common Locations</td>
              <td>
                {monster.commonLocations != null && monster.commonLocations.map((location, index) => (     
                  <p key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {location}</p>
                ))}
              </td>
            </tr>

            { monster.notes === '' ? '' : 
              <tr>
                <td>Notes</td>
                <td><i className="fa fa-sticky-note" aria-hidden="true"></i> {monster.notes}</td>
              </tr>
            }
          </tbody>
        </DataDetailTableView>

        { !monster.itemDrops || monster.itemDrops.length === 0 ? '' : (
          <div>
            <h2 className="page-header">Item Drops</h2>
            <DataDetailTableView>
              <thead>
                <tr>
                  <td><b>Icon</b></td>
                  <td><b>Name</b></td>
                </tr>
              </thead>
              <tbody>
                {monster.itemDrops.map((itemDrop, index) => {
                  const category = itemDrop.category || 'other';
                  const showIcon = itemDrop.id !== 0 && category !== 'other';
                  const spriteSource = ['materials', 'weapons', 'armor', 'bows'].includes(category) ? category : 'materials';
                  const detailLink = category !== 'other' && itemDrop.id ? `/${category}/${itemDrop.id}` : null;
                  return (
                    <tr key={index}>
                      <td>
                        {showIcon ? <IconContainer propertyName={itemDrop.name} folderName={spriteSource} cssClassName={itemDrop.cssClassName} spriteSheet={spriteSource} small/> : ''}
                      </td>
                      <td>
                        {detailLink ? <a href={detailLink}>{itemDrop.name}</a> : itemDrop.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataDetailTableView>
          </div>
        )}

      </div>
    )
  }

  render() {
    let view = null;

    if (this.state.fetching)
      view = '';
    else {
      if (this.state.json == null)
        view = (
          <h1 className="page-header">Monster Not Found :(</h1>
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
    )
  }
}

export default MonstersDetail;
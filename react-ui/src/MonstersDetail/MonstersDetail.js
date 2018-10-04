import React, { Component } from 'react';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView';
import IconContainer from '../Other/IconContainer/IconContainer';

import './MonstersDetail.css';

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
                <IconContainer propertyName={monster.name} folderName={"monsters"} fileType={"jpg"} />
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
            { monster.itemDrops === null ? '' :  
              <tr>
                <td>Item Drops</td>
                <td>
                  {monster.itemDrops.map((itemDrop, index) => (     
                    itemDrop.id === 0 ? 
                      (
                        <p key={index}><i className="fa fa-cog" aria-hidden="true"></i> {itemDrop.name}</p>
                      )
                      :
                      (
                        <div key={index}>
                          <div style={{'display': 'inline-block', 'verticalAlign': 'middle'}}>
                            <IconContainer propertyName={itemDrop.name} folderName={"materials"} />
                            {/* <div className={classnames('sprite', itemDrop.cssClassName !== '' && itemDrop.cssClassName)}></div> */}
                          </div>
                          <span>
                            <span><a href={"/" + itemDrop.category + "/" + itemDrop.id}>{itemDrop.name} </a></span>
                          </span>
                        </div>
                      )
                  ))}
                </td>
              </tr>
            }

            { monster.notes === '' ? '' : 
              <tr>
                <td>Notes</td>
                <td><i className="fa fa-sticky-note" aria-hidden="true"></i> {monster.notes}</td>
              </tr>
            }
          </tbody>
        </DataDetailTableView>
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
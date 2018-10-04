import React, { Component } from 'react';
import _ from 'lodash';
import DataDetailTableView from '../Other/DataDetailTableView/DataDetailTableView'
import IconContainer from '../Other/IconContainer/IconContainer'

import './FoodDetail.css';

class FoodDetail extends Component {
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

  showDetailView(food) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={food.name} folderName={"food"} />
              </td>
            </tr>
            { !food.ingredient ? '' : 
              <tr>
                <td>Ingredient</td>
                <td>
                  { food.ingredient.id !== 0 ? 
                    <div>
                      <div style={{'display': 'inline-block', 'verticalAlign': 'middle'}}>
                        <IconContainer propertyName={food.ingredient.name} folderName={"materials"} />
                      </div>
                      <span><a href={"/materials/" + food.ingredient.id}>{food.ingredient.name}</a></span>
                    </div>
                    :
                    <p><i className="fa fa-cutlery" aria-hidden="true"></i> {food.ingredient.name}</p>
                  }
                </td>
              </tr>
            }
            <tr>
              <td>Sell Price</td>
              <td><i className="fa fa-diamond" aria-hidden="true"></i> {food.sellPrice} Rupees</td>
            </tr>
            <tr>
              <td>HP Recovery</td>
              <td><i className="fa fa-heart" aria-hidden="true"></i> {food.hpRecovery} HP</td>
            </tr>
            { food.notes === null ? '' :
              <tr>
                <td>Notes</td>
                <td><i className="fa fa-sticky-note-o" aria-hidden="true"></i> {food.notes}</td>
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
          <h1 className="page-header">Food Not Found :(</h1>
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

export default FoodDetail;
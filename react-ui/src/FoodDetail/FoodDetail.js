import React, { Component } from 'react';
import _ from 'lodash';
import DataDetailTableView from '../CommonComponents/DataDetailTableView/DataDetailTableView'
import IconContainer from '../CommonComponents/IconContainer/IconContainer'

import './FoodDetail.css';
import '../Food/FoodSprites.css';

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
                <IconContainer propertyName={food.name} folderName={"food"} cssClassName={food.cssClassName} spriteSheet={"food"} />
              </td>
            </tr>
            { food.description ? (
              <tr>
                <td>Description</td>
                <td><i className="fa fa-book" aria-hidden="true"></i> {food.description}</td>
              </tr>
            ) : '' }
            <tr>
              <td>Sell Price</td>
              <td><i className="fa fa-diamond" aria-hidden="true"></i> {food.sellPrice} Rupees</td>
            </tr>
            <tr>
              <td>HP Recovery</td>
              <td><i className="fa fa-heart" aria-hidden="true"></i> {food.hpRecovery} HP</td>
            </tr>
            {/* <tr>
              <td>Health Bar Recovery</td>
              <td><HealthBar health={food.hpRecovery} /></td>
            </tr> */}
            { food.notes === null ? '' :
              <tr>
                <td>Notes</td>
                <td><i className="fa fa-sticky-note-o" aria-hidden="true"></i> {food.notes}</td>
              </tr>
            }
            { !food.ingredients || food.ingredients.length === 0 ? '' : 
              <tr>
                <td>Ingredient (any of)</td>
                <td>
                  {food.ingredients.map((ingredient, index) => (
                    <div key={index} style={{ marginBottom: index < food.ingredients.length - 1 ? '0.5rem' : 0 }}>
                      { ingredient.id !== 0 ? 
                        <span>
                          <span style={{display: 'inline-block', verticalAlign: 'middle'}}>
                            <IconContainer propertyName={ingredient.name} folderName="materials" cssClassName={ingredient.cssClassName} spriteSheet="materials" small/>
                          </span>
                          <a href={"/materials/" + ingredient.id}>{ingredient.name}</a>
                        </span>
                        :
                        <span><i className="fa fa-cutlery" aria-hidden="true"></i> {ingredient.name}</span>
                      }
                    </div>
                  ))}
                </td>
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
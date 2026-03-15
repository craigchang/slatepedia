import React, { Component } from 'react';
import DataDetailTableView from '../CommonComponents/DataDetailTableView/DataDetailTableView';
import IconContainer from '../CommonComponents/IconContainer/IconContainer';

import './RecipesDetail.css';
import '../Food/FoodSprites.css';
import '../Recipes/RecipesSprites.css';

class RecipesDetail extends Component {
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

  showDetailView(recipe) {
    return (
      <div>
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer propertyName={recipe.name} folderName={"food"} cssClassName={recipe.cssClassName} spriteSheet={"food"} />
              </td>
            </tr>
            
              <tr>
                <td>Description</td>
                <td>
                  { recipe.description ? (
                    <><i className="fa fa-book" aria-hidden="true"></i> {recipe.description}</>
                  ) : '' }
                </td>
              </tr>
            
            <tr>
              <td>Ingredients</td>
              <td>
                {recipe.ingredients != null && recipe.ingredients.map((ingredient, index) => (     
                  ingredient.id === 0 ?
                    <p key={index}><i className="fa fa-cutlery" aria-hidden="true"></i> {ingredient.name}</p>
                    : 
                    <p key={index}><i className="fa fa-cutlery" aria-hidden="true"></i> <a href={"/materials/" + ingredient.id}>{ingredient.name}</a></p>
                ))}
              </td>
            </tr>
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
          <h1 className="page-header">Recipe Not Found :(</h1>
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

export default RecipesDetail;
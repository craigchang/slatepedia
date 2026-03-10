import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-3">Slatepedia</h1>
            <p>
              Slatepedia is a comprehensive online encyclopedia for <em>The Legend of Zelda: Breath of the Wild</em>. 
              Browse creatures, monsters, materials, equipment, recipes, and treasures—all with in-game descriptions, stats, locations, and cross-references.
              Updates to the site are made continuously—see the <a href="/changelog">changelog</a> for the latest commits.
            </p>
            <p>
              Use the <strong>Resources</strong> menu in the navigation bar to explore each category:{' '}
              <a href="/materials">Materials</a>{', '}
              <a href="/recipes">Recipes</a>{', '}
              <a href="/armor">Armor</a>{', '}
              <a href="/food">Food</a>{', '}
              <a href="/monsters">Monsters</a>{', '}
              <a href="/shields">Shields</a>{', '}
              <a href="/weapons">Weapons</a>{', '}
              <a href="/bows">Bows</a>, and <a href="/animals">Animals</a>. From any list view, click an item to see its full detail page. 
              Detail pages include links to related entries—for example, materials show which recipes use them, and monsters list their item drops with links to those materials.
            </p>
            <p>
              {/* <a className="btn btn-lg btn-primary" href="/about" role="button">About »</a> */}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
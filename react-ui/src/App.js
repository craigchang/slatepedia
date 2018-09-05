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
            <p>Slatepedia is an online encyclopedia that provides complete content, which include creatures, monsters, materials, equipment, recipes, and treasures, found in The Legend of Zelda: Breath of the Wild. </p>
            <p>
              <a className="btn btn-lg btn-primary" href="/about" role="button">About »</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';

class AppChild extends Component {
  constructor(props) {
    super(props);
    console.log(props)
  }
  render() {
    return (
      <div className="AppChild">
        child: {this.props.test.one}
      </div>
    )
  }
}

export default AppChild;
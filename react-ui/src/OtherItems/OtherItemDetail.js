import React, { Component } from 'react';
import IconContainer from '../CommonComponents/IconContainer/IconContainer';
import DataDetailTableView from '../CommonComponents/DataDetailTableView/DataDetailTableView';
import './OtherItemsSprites.css';
import './OtherItems.css';

class OtherItemDetail extends Component {
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

  showOtherItemDetailView(item) {
    return (
      <div className="other-item-detail">
        <DataDetailTableView>
          <tbody>
            <tr>
              <td>Icon</td>
              <td>
                <IconContainer
                  propertyName={item.name}
                  folderName="other"
                  cssClassName={item.cssClassName}
                  spriteSheet="other"
                />
              </td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{item.name}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{item.description ? <><i className="fa fa-book" aria-hidden="true"></i> {item.description}</> : '-'}</td>
            </tr>
          </tbody>
        </DataDetailTableView>
      </div>
    );
  }

  render() {
    let view = null;

    if (this.state.fetching) {
      view = '';
    } else if (this.state.json == null) {
      view = <h1 className="page-header">Item Not Found</h1>;
    } else {
      view = (
        <div>
          <h1 className="page-header">{this.state.json.name}</h1>
          {this.showOtherItemDetailView(this.state.json)}
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

export default OtherItemDetail;

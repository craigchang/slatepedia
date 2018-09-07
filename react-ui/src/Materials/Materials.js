import React, { Component } from 'react';
//import ListViewGrid from '../components/list-view-grid/ListViewGrid';
//import ScrollToTop from 'react-scroll-up';
import _ from 'lodash';

import './Materials.css';

class Materials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: null,
      jsonOriginal: null,
      fetching: true,
      view: 'grid'
    };
    this.renderGridView = this.renderGridView.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
    this.clickSortOrderBtn = this.clickSortOrderBtn.bind(this);
  }

  componentDidMount() {
    fetch('/api/materials')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          json: json,
          jsonOriginal: json,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          json: null,
          jsonOriginal: null,
          fetching: false
        });
      });
  }

  outputJson(json) {
    if (json && json.length > 0) {
      return json.map((material, index) => (
        <Material key={index} material={material} />
      ));
    }
  }

  switchToListView() {
    this.setState({view: 'list'});
  }

  renderGridView() {
    this.setState({view: 'grid'});
  }

  showGridView() {

    if (this.state.fetching)
      return (<div>fetching</div>)
    else
      return (
        <div className="table-responsive">
          <table className="table table-striped sortable">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Sell Price <img className="price-icon" src={`/img/other/green-rupee.png`}/></th>
                <th>HP Recovery</th>
                <th>Category</th>
                <th>Potency Grade</th>
                <th>Duration Factor</th>
                <th>Availabilities</th>
              </tr>
            </thead>
            <tbody>
              {this.state.fetching ? 'Fetching message from API' : this.outputJson(this.state.json)}
            </tbody>
          </table>
        </div>
      )
  }

  clickSortOrderBtn(event) {
    let sortOrderSpanEl = this.sortOrderInput.getElementsByTagName('span')[0];

    if (sortOrderSpanEl.className === 'glyphicon glyphicon-sort-by-attributes') {
      sortOrderSpanEl.title = 'descending';
      sortOrderSpanEl.className = 'glyphicon glyphicon-sort-by-attributes-alt';
    }
    else {
      sortOrderSpanEl.title = 'ascending';
      sortOrderSpanEl.className = 'glyphicon glyphicon-sort-by-attributes';
    }

    this.filterSearch(event);
  }

  filterSearch(event) {
    event.preventDefault();

    // Get the sort Order
    let sortOrderSpanEl = this.sortOrderInput.getElementsByTagName('span')[0];
    let sortOrder = sortOrderSpanEl.className === 'glyphicon glyphicon-sort-by-attributes' ? 'asc' : 'desc';
    let results = this.state.jsonOriginal.slice();

    // Name Input
    if (this.nameInput.value !== '') {
      results = _.filter(results, (obj) => {
        return obj.name.toLowerCase().indexOf(this.nameInput.value.toLowerCase()) !== -1;
      });
    }

    // Sort By Select
    if (this.sortSelect.value !== '') {
      results = _.orderBy(results, this.sortSelect.value, sortOrder);
    }

    this.setState({json: results});
  }

  render() {

    let view = '';

    switch(this.state.view) {
      case 'grid': view = this.showGridView(); break;
      case 'list': view = (
        {/*<ListViewGrid 
          json={this.state.json} 
          isFetching={this.state.fetching}
          url='/materials/'
          usesSprites={true}
          dataItems={[
            { data: 'sellPrice', icon: 'fa fa-diamond', label: 'Rupees', singular: true }, 
            { data: 'hpRecovery', icon: 'fa fa-heart', label: 'HP', singular: true },
            { data: 'category', icon: 'fa fa-tags', label: '', singular: true, nestedData: 'name' }, 
            { data: 'potencyGrade', icon: 'fa fa-thermometer-full', label: 'Potency Grade', singular: true }, 
            { data: 'durationFactor', icon: 'fa fa-clock-o', label: 'seconds duration', singular: true },
            { data: 'availabilities', icon: 'fa fa-map-marker', label: '', singular: false, arrayOfObjects: true }
          ]} />*/}
        ); break;
      default: view = this.renderListView(); break; 
    }

    return (
      <div>
        <div className="container-nonresponsive container-results">
          <h1 className="page-header">Materials</h1>
          <div className="filter-form">
            <form onSubmit={this.filterSearch}>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="input-group">
                    <span className="input-group-addon">
                      <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                    </span>
                    <input type="search" name="name" className="form-control" placeholder="Search by Name" ref={(input) => { this.nameInput = input; }} style={{'fontSize': '16px'}} onChange={this.filterSearch}/>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="input-group">
                    <select className="form-control" name="sort" ref={(select) => { this.sortSelect = select; }} onChange={this.filterSearch}>
                      <option value="">Sort By...</option>
                      <option value="name">Name</option>
                      <option value="sellPrice">Sell Price</option>
                      <option value="hpRecovery">HP Recovery</option>
                      <option value="category[name]">Category</option>
                      <option value="potencyGrade">Potency Grade</option>
                      <option value="durationFactor">Duration Factor</option>
                    </select>
                    <span className="input-group-btn">
                      <button className="btn btn-default btn-sort-order" type="button" title="ascending" ref={(sortOrderInput) => { this.sortOrderInput = sortOrderInput; }} onClick={this.clickSortOrderBtn}>
                        <span className="glyphicon glyphicon-sort-by-attributes" aria-hidden="true"></span>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>

              {/* 
              <h3 className="sub-header">Category Overview</h3>
              <div className="table-responsive">
                <table className="table table-striped" style={{width: '100%'}}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Added Effect</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hearty</td>
                      <td>Extra Hearts</td>
                    </tr>
                    <tr>
                      <td>Energizing</td>
                      <td>Stamina Restoration</td>
                    </tr>
                    <tr>
                      <td>Enduring</td>
                      <td>Extra Stamina</td>
                    </tr>
                    <tr>
                      <td>Fireproof</td>
                      <td>Flame Guard</td>
                    </tr>
                    <tr>
                      <td>Chilly</td>
                      <td>Heat Resistance</td>
                    </tr>
                    <tr>
                      <td>Spicy</td>
                      <td>Cold Resistance</td>
                    </tr>
                    <tr>
                      <td>Electro</td>
                      <td>Shock Resistance</td>
                    </tr>
                    <tr>
                      <td>Hasty</td>
                      <td>Movement Speed Up</td>
                    </tr>
                    <tr>
                      <td>Sneaky</td>
                      <td>Stealth Up</td>
                    </tr>
                    <tr>
                      <td>Mighty</td>
                      <td>Attack Up</td>
                    </tr>
                    <tr>
                      <td>Tough</td>
                      <td>Defense Up</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              */}

              {/* 

              <p>
                <button type="button" className={this.state.view === 'list' ? 'btn btn-primary' : 'btn btn-default'} onClick={this.switchToListView}>List View</button>
                <button type="button" className={this.state.view === 'grid' ? 'btn btn-primary' : 'btn btn-default'} onClick={this.renderGridView}>Grid View</button>
              </p>

               */}
          

          {
            // this.state.fetching && this.state.json && this.state.json.length > 0 ? 'Fetching Data' : 
            // (
            //   <ListGroupGrid 
            //     data-json={this.state.json}
            //     permalinkName="materials">
            //     <ListGroupGridCriteria 
            //       data-name="cssClassName"
            //       data-position="left"
            //       data-area="image" 
            //       data-icon=""/>
            //     <ListGroupGridCriteria 
            //       data-name="name"
            //       data-position="middle"
            //       data-area="header"
            //       data-icon=""/>
            //     <ListGroupGridCriteria 
            //       data-name="sellPrice"
            //       data-position="middle"
            //       data-area="body"
            //       data-icon="fa fa-diamond" 
            //       data-label="Rupees" 
            //       data-do-not-show-if-empty={false} />
            //     <ListGroupGridCriteria 
            //       data-name="hpRecovery" 
            //       data-position="middle"
            //       data-area="body" 
            //       data-icon="fa fa-heart" 
            //       data-label="HP" 
            //       data-do-not-show-if-empty={false} /> 
            //     <ListGroupGridCriteria 
            //       data-name="category.name" 
            //       data-level={2}
            //       data-position="middle" 
            //       data-area="body"
            //       data-icon="fa fa-tags" 
            //       data-label="Category" 
            //       data-do-not-show-if-empty={true} />
            //     <ListGroupGridCriteria 
            //       data-name="potencyGrade" 
            //       data-position="middle"
            //       data-area="body" 
            //       data-icon="fa fa-thermometer-full" 
            //       data-label="Potency Grade"
            //       data-do-not-show-if-empty={true} />
            //     <ListGroupGridCriteria 
            //       data-name="durationFactor"
            //       data-position="middle"
            //       data-area="body"
            //       data-icon="fa fa-diamond"
            //       data-label="seconds duration"
            //       data-do-not-show-if-empty={false} />
            //     <ListGroupGridCriteria 
            //       data-name="availabilities"
            //       data-nested={true}
            //       data-position="right"
            //       data-area="body"
            //       data-type="list"
            //       data-icon="fa fa-map-marker"
            //       data-label=""
            //       data-do-not-show-if-empty={false} />

            //   </ListGroupGrid>
            // )
          }             
          {view}           
        </div>

        {/* <ScrollToTop 
          showUnder={160}
          style={{bottom: "30px"}}>
          <a ref={(SOT) => { this.scrollToTopBtn = SOT; }}
             id="back-to-top" 
             href="#" 
             className="btn btn-primary btn-lg back-to-top"
             role="button" 
             title="Click to return on the top page" 
             data-toggle="tooltip" 
             data-placement="left">
             <span className="glyphicon glyphicon-chevron-up"></span>
          </a>
        </ScrollToTop> */}

      </div>
    );
  }
}

const Material = ({material}) => {

  let imageName = material.name.replace(/ /g, "-").replace(/'/g,"").toLowerCase();

  return (
    <tr>
      {/* <td data-value={material.id}>{material.id}</td> */}
      {/* <td style={{'verticalAlign': 'middle'}}><div className={'sprite ' + material.cssClassName}></div></td> */}
      <td><img className="resource-icon" src={`/img/materials/${imageName}.png`}/></td>
      <td data-value={material.name}>{material.name}</td>
      <td data-value={material.sellPrice}>{material.sellPrice}</td>
      <td data-value={material.hpRecovery}>{material.hpRecovery}</td>
      <td data-value={material.category == null ? '-' : material.category.name}>{material.category == null ? '-' : material.category.name}</td>
      <td data-value={material.potencyGrade === "" ? '-': material.potencyGrade}>{material.potencyGrade === "" ? '-': material.potencyGrade}</td>
      <td data-value={material.durationFactor}>{material.durationFactor}</td>
      <td>
      {/* {material.availabilities.map((availability, index) => (
        <span key={index}><i className="fa fa-map-marker" aria-hidden="true"></i> {availability.name}</span>
      ))} */}
      </td>
      <br/>
    </tr>
  )
}

export default Materials;

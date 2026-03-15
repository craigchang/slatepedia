// import React from 'react'
// import { Link } from 'react-router-dom'
//
// // The Header creates links that can be used to navigate
// // between routes.
// const Header = () => (
//   <header>
//     <nav>
//       <ul>
//         <li><Link to='/'>App</Link></li>
//         <li><Link to='/materials'>materials</Link></li>
//       </ul>
//     </nav>
//   </header>
// )

// export default Header

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Header.css';

const RESOURCE_LINKS = [
  { path: '/materials', label: 'Materials' },
  { path: '/recipes', label: 'Recipes' },
  { path: '/armor', label: 'Armor' },
  { path: '/food', label: 'Food' },
  { path: '/monsters', label: 'Monsters' },
  { path: '/shields', label: 'Shields' },
  { path: '/weapons', label: 'Weapons' },
  { path: '/bows', label: 'Bows' },
  { path: '/animals', label: 'Animals' }
];

class Header extends Component {
  isResourceActive(path) {
    const { pathname } = this.props.location || {};
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + '/');
  }

  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <a className="navbar-brand" href="/">Slatepedia</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Resources</a>
                <div className="dropdown-menu" aria-labelledby="dropdown01">
                  {RESOURCE_LINKS.map(({ path, label }) => {
                    const active = this.isResourceActive(path);
                    return (
                      <a
                        key={path}
                        className={`dropdown-item${active ? ' active' : ''}`}
                        href={path}
                      >
                        {label}
                        {active && <span className="sr-only">(current)</span>}
                      </a>
                    );
                  })}
                </div>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="/changelog">Changelog</a>
              </li>
            </ul>
            {/* <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form> */}
          </div>
            

        </nav>
      </header>
    );
  }
}

export default withRouter(Header);
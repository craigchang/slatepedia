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
//import { Link } from 'react-router-dom'
import './Header.css';

class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a className="navbar-brand" href="/">Slatepedia</a>
        {/* <Link className="navbar-brand" to='/'>Slatepedia</Link> */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              {/* <Link className="nav-link" to='/materials'>Materials <span className="sr-only">(current)</span></Link> */}
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li> */}
            {/* <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li> */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Resources</a>
              <div className="dropdown-menu" aria-labelledby="dropdown01">
                <a className="dropdown-item" href="/materials">Materials <span className="sr-only">(current)</span></a>
                {/* <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <a className="dropdown-item" href="#">Something else here</a> */}
              </div>
            </li>
          </ul>
          {/* <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form> */}
        </div>
          

      </nav>
    );
  }
}

export default Header;

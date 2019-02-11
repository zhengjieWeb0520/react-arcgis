import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

class Header extends Component{
  render(){
    const url = this.props.match.url
    return(
      <header>
        <nav>
          <ul>
            <li className='fl'><Link to={`${url}`}>arcgis4.X工具栏</Link></li>
          </ul>
        </nav>
      </header>
    )
  }
}
export default withRouter(Header)
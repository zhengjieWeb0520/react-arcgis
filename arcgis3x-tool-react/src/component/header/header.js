import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

class Header extends Component{
  render(){
    const url = this.props.match.url
    return(
      <header>
        <nav>
          <ul>
            <li className='fl'><Link to={`${url}`}>组件之间通信</Link></li>
            <li className='fl'><Link to={`${url}/reactRedux`}>reactRedux</Link></li>
          </ul>
        </nav>
      </header>
    )
  }
}
export default withRouter(Header)
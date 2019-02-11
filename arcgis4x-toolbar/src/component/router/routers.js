import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

//引入baseMap组件
import BaseMap from './../map/baseMap'

class RouteConfig extends Component{
  render() {
    const url = this.props.match.url
    return(
      <Switch>
        <Route path={`${url}`} exact component={BaseMap}></Route>
      </Switch>
    )
  }
} 
export default withRouter(RouteConfig)
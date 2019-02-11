import React from 'react'
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom'
//引入异步加载组件
import asyncComponent from './../asyncComponent'
//引入自定义组件
const asynsCommunicate = asyncComponent(()=>{return import('./../component/study/communicate')})
const asyncReactRedux = asyncComponent(()=>{return import('./../component/study/reactRedux')})
//首页路由配置
class RouteConfig extends React.Component{
  render () {
    const url = this.props.match.url
    return (
      <Switch>
        <Route path={`${ url }`} exact component={asynsCommunicate}/>
        <Route path={`${ url }/reactRedux`} component={asyncReactRedux}/>
      </Switch>
    )
  }
}
export default withRouter(RouteConfig)
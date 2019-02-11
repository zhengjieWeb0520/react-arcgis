import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from './../component/router/header'
import RouteConfig from './../component/router/routers'

export default class Main extends React.Component{
  render(){
    const url = this.props.match.url
    return (
      <div id = 'main'>
        <Header />
        <RouteConfig />
      </div>
    )
  }
}
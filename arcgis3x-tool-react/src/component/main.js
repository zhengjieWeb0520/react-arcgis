import React from 'react'
//引入组件
import Header from './../component/header/header'
import MainBody from './../router/header.route'
//主界面
export default class Main extends React.Component{
  render () {
    return (
      <div>
        <Header/>
        <MainBody/>
      </div>
    )
  }
}

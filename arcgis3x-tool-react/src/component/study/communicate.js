import React, { Component } from 'react'
import CommunicateChild from './communicateChild'

export default class Communicate extends Component{
  constructor(props){
    super(props)
    this.fartherProps = '我是父组件的值，子组件需要我'
    this.handleClick = this.handleClick.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.state = {
      email: ''
    }  
  }
  //传递给子组件的方法
  methodToChild(){
    alert("子组件调用父组件的方法")
  }
  //绑定子组件
  onRef = (ref) => {
    //this.child即为子组件
    this.child = ref
  }
  //执行调用子组件的方法
  handleClick(){
    this.child.methodToParent()
  }
  //子组件调用父组件的方法传值
  handleEmail(val){
    this.setState({
      email: val
    });
  }
  render(){
    let param = {
      fartherProps: this.fartherProps
    }
    console.log(this.props)
    return(
      <div id="Communicate">
        <h1>父子组件之间的通信</h1>
        <p>{'-----------------------父组件-----------------------'}</p>
        <div>
          <h2>我是父组件</h2>
          <h3>{'父组件调用子组件的方法'}</h3>
          <p><button onClick={this.handleClick}>调用子组件方法</button></p>
          <h3>{'父组件调用子组件的值'}</h3>
          <div>用户邮箱：{this.state.email}</div>
        </div>
        <br/>
        <p>{'-----------------------子组件-----------------------'}</p>
        <CommunicateChild param={param} methodToChild={this.methodToChild.bind(this)} onRef={this.onRef} handleEmail={this.handleEmail}/>
      </div>
    )
  }
}
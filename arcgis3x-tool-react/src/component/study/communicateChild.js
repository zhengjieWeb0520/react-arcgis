import React, { Component } from 'react'

export default class CommunicateChild extends Component{
  constructor(props){
    super(props)
    this.getParentMethod = this.getParentMethod.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.childProps = "我是子组件的值，父组件调用我"
  }
  //获取父组件的方法
  getParentMethod(){
    this.props.methodToChild()
  }
  //组件render后调用父组件的方法把子组件的this传递给父组件
  componentDidMount(){
    this.props.onRef(this)
    this.props.handleEmail(this.childProps)
  }
  //父组件调用该方法
  methodToParent(){
    alert("父组件调用到子组件的方法了")
  }
  //传值给父组件
  handleChange(){
    var val = this.refs.emailDom.value;
    val = val.replace(/[^0-9|a-z|\@|\.]/ig,"");
    this.props.handleEmail(val);
  }
  render(){
    return(
      <div id="CommunicateChild">
        <div>
          <h3>子组件调用父组件的值</h3>
          <p>{this.props.param.fartherProps}</p>
          <h3>子组件调用父组件的方法</h3>
          <p><button onClick={this.getParentMethod}>调用父组件的方法</button></p>
          <h3>子组件调用父组件的方法传值给父组件</h3>
          <p><input ref='emailDom' type="text" onChange={this.handleChange}/></p>
        </div>
      </div>
    )
  }
}
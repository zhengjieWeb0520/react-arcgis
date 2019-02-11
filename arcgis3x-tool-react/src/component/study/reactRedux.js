import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addGUN, removeGUN, addGUNAsync } from './../../redux/count.redux'

class ReactReduxStudy extends Component{
  render(){
    console.log(this.props)
    const num = this.props.counter.counter;
    const addGUN = this.props.addGUN
    const removeGUN =  this.props.removeGUN
    const addGUNAsync = this.props.addGUNAsync
    return (
      <div className="App">
        <h1>现在有机枪{num}把</h1>
        <button onClick={addGUN}>申请武器</button>
        <button onClick={removeGUN}>回收武器</button> 
        <button onClick={addGUNAsync}>过两天回收武器</button>  
      </div>
    )
  }
}
ReactReduxStudy = connect(
  state => ({
    counter : state,
  }),
  { addGUN, removeGUN, addGUNAsync }
)(ReactReduxStudy)

export default ReactReduxStudy
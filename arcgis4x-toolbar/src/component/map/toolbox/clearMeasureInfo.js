import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ObjectEquals } from './../../../common/common'

class ClearMeasureInfo extends Component{
  constructor(props){
    super(props)
    //绑定this
    this.clearGraphic = this.clearGraphic.bind(this)
    //初始化state
  }
  //清除
  clearGraphic(){
    this.state.mapView.graphics.removeAll();
  }
  componentWillReceiveProps(nextProps){
    //当初始化化地图加载后将view对象设置为state值
    if(!ObjectEquals(nextProps, this.props)){
      this.setState({
        mapView: nextProps.baseMap.activeView
      })
    }
  }
  render(){
    return(
      <li className='fl' onClick={this.clearGraphic}>
        清除
      </li>
    )
  }
}
ClearMeasureInfo = connect(
  state => ({
    baseMap: state.loadBaseMap
  }),
  {}
)(ClearMeasureInfo)

export default ClearMeasureInfo
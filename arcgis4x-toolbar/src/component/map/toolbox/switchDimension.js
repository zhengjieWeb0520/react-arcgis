import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initBaseMap } from './../../../redux/baseMapRedux'
import { ObjectEquals } from './../../../common/common'

class SwithDimension extends Component{
  constructor(props){
    super(props)
    this.switchDimension = this.switchDimension.bind(this)
    //初始化state
    this.state = {
      mapView: {},
      mapDimension: "3D"
    }
  }
  //2,3D切换
  switchDimension(){
    console.log(this.state.mapView)
    //获取当前地图的信息
    let id = this.state.mapView.id
    let center = [this.state.mapView.center.longitude, this.state.mapView.center.latitude] 
    let zoom = this.state.mapView.zoom
    //底图切换
    if(this.state.mapDimension === '3D'){
      this.props.initBaseMap(this.state.mapDimension, center, zoom, this.state.mapView.map.allLayers.items[0].title, 'mapContainer')
      this.setState({
        mapDimension: "2D"
      })
    }else if(this.state.mapDimension === '2D'){
      this.props.initBaseMap(this.state.mapDimension, center, zoom, this.state.mapView.map.allLayers.items[0].title, 'mapContainer')
      this.setState({
        mapDimension: "3D"
      })
    }
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
      <li className='fl' onClick={this.switchDimension}>
        { this.state.mapDimension }
      </li>
    )
  }
}
SwithDimension = connect(
  state => ({
    baseMap: state.loadBaseMap
  }),
  { initBaseMap }
)(SwithDimension)
export default SwithDimension

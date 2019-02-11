import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ObjectEquals } from './../../../common/common'
import { initBaseMap } from './../../../redux/baseMapRedux'

class SwitchBaseMap extends Component{
  constructor(props){
    super(props)
    //绑定this
    this.switchBaseMap = this.switchBaseMap.bind(this)
    //初始化state
    this.state = {
      mapView: {},
      mapTitle: "地图"
    }
  }
  switchBaseMap(){
    //获取当前地图的信息
    let id = this.state.mapView.id
    let center = [this.state.mapView.center.longitude, this.state.mapView.center.latitude] 
    let zoom = this.state.mapView.zoom
    //底图切换
    if(this.state.mapTitle === '地图'){
      this.props.initBaseMap(id, center, zoom, this.state.mapTitle, 'mapContainer')
      this.setState({
        mapTitle: "影像"
      })
    }else if(this.state.mapTitle === '影像'){
      this.props.initBaseMap(this.state.mapView.id, center, this.state.mapView.zoom, this.state.mapTitle, 'mapContainer')
      this.setState({
        mapTitle: "地图"
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
      <li className='fl' onClick={this.switchBaseMap}>
        {this.state.mapTitle}
      </li>
    )
  }
}
SwitchBaseMap = connect(
  state => ({
    baseMap: state.loadBaseMap
  }),
  { initBaseMap }
)(SwitchBaseMap)
export default SwitchBaseMap
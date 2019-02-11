import React, { Component } from 'react'
import { connect } from 'react-redux'
import { defaultZoom, defaultCenter } from './mapConfig'
import { initBaseMap } from './../../redux/baseMapRedux'
import AddLayers from './layers/addLayers'
import ToolBar from './toolbar'
class BaseMap extends Component{
  constructor(props){
    super(props)
  }
  componentDidMount(){
    //初始化地图为“2D”“影像图”效果
    this.props.initBaseMap('2D', defaultCenter, defaultZoom, '影像', 'mapContainer')
  }
  render(){
    return(
      <div id='baseMap' className='baseMap'>
        <div id='mapContainer'>
        </div>
        <ToolBar />
        <AddLayers />
      </div>
    )
  }
}
BaseMap = connect(
  state => ({
    baseMap: state.loadBaseMap
  }),
  { initBaseMap }
)(BaseMap)

export default BaseMap
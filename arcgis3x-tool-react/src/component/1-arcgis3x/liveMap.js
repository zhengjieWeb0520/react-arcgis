import React from 'react'
import { connect } from 'react-redux'
import { initGisBaseMap } from './../../redux/1-arcgis3x/baseMap.redux'
import ToolBar from './toolBar'
class LiveMap extends React.Component{
  constructor(props){
    super(props)
  }
  componentDidMount(){
    this.props.initGisBaseMap('mapContent')
  }
  render() {
    return (
      <div id='mapContainer'>
        <ToolBar />
        <div className = 'toolTip'></div>
        <div id='mapContent' className='mapContent'>
        </div>
      </div>
    )
  }
}
LiveMap = connect(
  state => ({
    gisBaseMap: state.gisBaseMap,
  }),
  {initGisBaseMap}
)(LiveMap)
export default LiveMap
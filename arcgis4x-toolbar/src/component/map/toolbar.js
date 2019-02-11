import React, { Component } from 'react'
import SwitchBaseMap from './toolbox/switchBaseMap'
import SwithDimension from './toolbox/switchDimension'
import MeasureLength from './toolbox/measureLengthToolbar'
import MeasureArea from './toolbox/measureAreaToolbar'
import ClearMeasure from './toolbox/clearMeasureInfo'
class ToolBar extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div id='ToolBar' className='toolbar'>
        <ul>
          <SwitchBaseMap />
          <SwithDimension />
          <MeasureLength />
          <MeasureArea />
          <ClearMeasure />
        </ul>
      </div>
    )
  }
}
export default ToolBar

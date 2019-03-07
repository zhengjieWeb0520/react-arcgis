import React from 'react'
import { connect } from 'react-redux'
import { layesConfig } from './../../component/2-arcgis3x-tool/mapConfig'
import { getMosicalParam } from './../../units/common'
import axios from 'axios'
class ToolBar extends React.Component{
  constructor(props){
    super(props)
    this.layerArray = []
  }
  componentDidMount () {
    let toolBarUl = document.querySelector('.toolBar ul')
    toolBarUl.addEventListener('click', e => {
      if (e.target.outerText === '添加Feature(line)'){
        this.props.gisBaseMap.activeView.addFeatureLineLayer(layesConfig[0].name, layesConfig[0].value, layesConfig[0].expression ,[0, 0, 255])
        this.layerArray.push(layesConfig[0].name)
      }
      if (e.target.outerText === '添加Feature(polygon)') {
        this.props.gisBaseMap.activeView.addFeatureFillLayer(layesConfig[1].name, layesConfig[1].value, layesConfig[1].expression ,layesConfig[1].valueArray, false, res => {
          console.log(res)
        })
        this.layerArray.push(layesConfig[1].name)
      }
      if (e.target.outerText === '添加Feature') {
        this.props.gisBaseMap.activeView.addFeatureLayer(layesConfig[2].name, layesConfig[2].value)
        this.layerArray.push(layesConfig[2].name)
      }
      if (e.target.outerText === '添加Dynamic') {  
        this.props.gisBaseMap.activeView.addDynamicLayer(layesConfig[3].name, layesConfig[3].value)
        this.layerArray.push(layesConfig[3].name)
      }

      if (e.target.outerText === '添加镶嵌数据集') { 
        axios.post('/ouiesWebserver/images/productCfg.xml').then(res => {
          console.log(res.data)
          let parser = new DOMParser()
          let xmldoc = parser.parseFromString(res.data, 'text/xml')

          let renderData = getMosicalParam('H8_LST', xmldoc)
          this.props.gisBaseMap.activeView.queryService(layesConfig[4].name, layesConfig[4].value, `Name='aaaaaa'`, renderData)
        })
      }
      if (e.target.outerText === '删除图层'){
        this.props.gisBaseMap.activeView.removeMultiLayers(this.layerArray)
      }
    })
  }
  mapClick = () => {
    this.props.gisBaseMap.activeView.mapClick(res=>{
      console.log(res)
      let left = res.data.clientX
      let right = res.data.clientY
      document.querySelector('.toolTip').style.display = 'block'
      document.querySelector('.toolTip').style.left = left + 'px'
      document.querySelector('.toolTip').style.top = right + 'px'
    })
  }
  render () {
    return (
      <div className= 'toolBar'>
        <ul>
          <li>点击</li>
          <li>添加Feature(line)</li>
          <li>添加Feature(polygon)</li>
          <li>添加Feature</li>
          <li>添加Dynamic</li>
          <li>添加图片</li>
          <li>添加镶嵌数据集</li>
          <li>删除图层</li>
          <li>绘制点</li>
          <li>绘制线</li>
          <li>绘制面</li>
        </ul>
      </div>
    )
  }
}
ToolBar = connect(
  state => ({
    gisBaseMap: state.gisBaseMap,
  }),
  {}
)(ToolBar)
export default ToolBar
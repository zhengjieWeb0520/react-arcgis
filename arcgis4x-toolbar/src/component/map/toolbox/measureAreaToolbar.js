import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { connect } from 'react-redux'
import { ObjectEquals } from './../../../common/common'

class MeasureAreaToolbar extends Component{
  constructor(props){
    super(props)
    //绑定this
    this.measureArea = this.measureArea.bind(this)
    //初始化state
    this.state = {
      mapView: {}
    }

  }
  //测量面积
  measureArea(){
    let _this = this;
    esriLoader.loadModules([
      "esri/views/2d/draw/Draw",
      ]).then(([Draw])=>{
          let draw = new Draw({
              view: this.state.mapView
          })
          let action = draw.create("polygon");
          this.state.mapView.focus();
          action.on("vertex-add", function (evt) {
              _this.createPolygonGraphic(evt.vertices, 0);
            });
          
            action.on("vertex-remove", function (evt) {
              _this.createPolygonGraphic(evt.vertices, 0);
            });
          
            action.on("cursor-update", function (evt) {
            _this.createPolygonGraphic(evt.vertices, 0);
            });
          
            action.on("draw-complete", function (evt) {
              _this.createPolygonGraphic(evt.vertices, 1)
            });
      })   
  }
  //创建面并测量面积
  createPolygonGraphic(vertices, index){
    this.state.mapView.graphics.removeAll();
    esriLoader.loadModules(["esri/Graphic","esri/geometry/geometryEngine", "esri/geometry/Polygon"]).then(([Graphic,geometryEngine,Polygon])=>{
        let polygon = new Polygon({
          rings: vertices,
          spatialReference: this.state.mapView.spatialReference
        })
        let graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill", // autocasts as SimpleFillSymbol
            color: [178, 102, 234, 0.8],
            style: "solid",
            outline: { // autocasts as SimpleLineSymbol
              color: [255, 255, 255],
              width: 2
            }
          }
        })
        this.state.mapView.graphics.add(graphic);
        //侧面积
        if(index === 1){
          let area = geometryEngine.geodesicArea(polygon, "square-kilometers")
        
          if(area < 0){
            let  simplifiedPolygon = geometryEngine.simplify(polygon);
            if (simplifiedPolygon) {
              area = geometryEngine.geodesicArea(simplifiedPolygon, "square-kilometers");
            }
          }
          //标注
          let textGraphic = new Graphic({
            geometry: polygon.centroid,
            symbol: {
              type: "text",
              color: "white",
              haloColor: "black",
              haloSize: "1px",
              text: area.toFixed(2) + " km2",
              xoffset: 3,
              yoffset: 3,
              font: { // autocast as Font
                size: 14,
                family: "sans-serif"
              }
            }
          });
          this.state.mapView.graphics.add(textGraphic)
        }
    })
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
      <li className='fl' onClick={this.measureArea}>
        测面积
      </li>
    )
  }
}
MeasureAreaToolbar = connect(
  state => ({
    baseMap: state.loadBaseMap
  }),
  {}
)(MeasureAreaToolbar)
export default MeasureAreaToolbar
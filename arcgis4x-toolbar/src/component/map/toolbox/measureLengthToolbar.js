import React, { Component } from 'react'
import esriLoader from 'esri-loader'
import { connect } from 'react-redux'
import { ObjectEquals } from './../../../common/common'

class MeasureLengthToolbar extends Component{
  constructor(props){
    super(props)
    //绑定this
    this.measureLength = this.measureLength.bind(this)
    //初始化state
    this.state = {
      mapView: {},
    }
  }
  //测距离
  measureLength(){
    let _this = this;
    esriLoader.loadModules([
        "esri/views/2d/draw/Draw"
    ]).then(([Draw])=>{
        let draw = new Draw({
            view: this.state.mapView
        })
        //let geometryService =new GeometryService(this.geometryService);
        let action = draw.create("polyline");
        this.state.mapView.focus();
        action.on("vertex-add", function (evt) {
            _this.createPolylineGraphic(evt.vertices, 0);
          });
        
          action.on("vertex-remove", function (evt) {
            _this.createPolylineGraphic(evt.verticesm, 0);
          });
        
          action.on("cursor-update", function (evt) {
           _this.createPolylineGraphic(evt.vertices, 0);
          });
        
          action.on("draw-complete", function (evt) {
            _this.createPolylineGraphic(evt.vertices, 1)
          });
    })
  }
  //创建线图层并计算长度
  createPolylineGraphic(vertices, index){
    this.state.mapView.graphics.removeAll();
    esriLoader.loadModules([
      "esri/Graphic", 
      "esri/geometry/geometryEngine",
      "esri/geometry/Polyline",
      "esri/geometry/Point"]).then(([Graphic, geometryEngine, Polyline, Point])=>{
        let polyline = {
                type: "polyline",
                paths: vertices,
                spatialReference: this.state.mapView.spatialReference
            }
        let line = new Polyline({
            paths: vertices,
            spatialReference: this.state.mapView.spatialReference
        })
        let graphic = new Graphic({
            geometry: line,
            symbol: {
                type: "simple-line", // autocasts as SimpleLineSymbol
                color: [4, 90, 141],
                width: 3,
                cap: "round",
                join: "round"
            }           
        })
        this.state.mapView.graphics.add(graphic);
        if(index == 1){
          let length = geometryEngine.geodesicLength(line, "kilometers")
          if(length < 0){
            let  simplifiedPolyline = geometryEngine.simplify(line);
            if (simplifiedPolyline) {
              length = geometryEngine.geodesicLength(simplifiedPolyline, "kilometers");
            }
          }
        
        //获取线条的最后一个点
        let pointArr = [];
        for(let i = 0; i < line.paths[0].length; i++){
          if(i === line.paths[0].length - 1){
            pointArr = line.paths[0][i]
          }
        }
        //标注
        let point = new Point({
          type: "point",              
          x: pointArr[0],
          y: pointArr[1],
          z: 0,
          spatialReference: this.state.mapView.spatialReference
        })

        let textGraphic = new Graphic({
          geometry: point,
          symbol: {
            type: "text",
            color: "black",
            haloColor: "black",
            haloSize: "1px",
            text: length.toFixed(2) + " km",
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
      <li className='fl' onClick={this.measureLength}>
        测距离
      </li>
    )
  }
}
MeasureLengthToolbar = connect(
  state => ({
    baseMap: state.loadBaseMap
  }),
  {  }
)(MeasureLengthToolbar)
export default MeasureLengthToolbar
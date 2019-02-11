import React from 'react'
import esriLoader from 'esri-loader'
import { connect } from 'react-redux'
import { Checkbox } from 'antd'
import { ObjectEquals } from './../../../common/common'
import Windy from './../../windy'
import $ from 'jquery'

class AddLayers extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mapView: {}
    }
  }
  handleChange =(e, type)=>{
    if(type === 'FeatureLayer'){
      if(e.target.checked === true){
        this.addFeatureLayer()
      }else if(e.target.checked === false){
        this.removeLayer('FeatureLayer')
      }
    }else if (type === 'windy'){
      if(e.target.checked === true){
        this.addWindyLayer()
      }else if(e.target.checked === false){
        this.removeLayer('windy')
      }
    }
  }
  addWindyLayer(){
    esriLoader.loadModules([
      "esri/layers/RasterLayer",
      "esri/request"
    ]).then(([RasterLayer, esriRequest])=>{
    let [windy, rasterLayer, windData] = [, ,];
    let _this = this;
    let canvasSupport = supports_canvas();
    function supports_canvas() {
      return !!document.createElement("canvas").getContext;
    }
    var myquery = $.ajax({
      url: "/fengchang.json",
      // url: "http://192.168.1.185:8080/arcgis3_11/arcgisTest/UV_test.json",
      success: function(data) {
        console.log(data);
        windData = {
          Bound: data.Bound,
          Info: data.Info
        };
      }
    });
    function redraw() {
      $.when(myquery).done(function() {
        rasterLayer._element.width = _this.myMap.width;
        rasterLayer._element.height = _this.myMap.height;
        let [wind, xy, index, lon, lat, windStep] = [, , , , ,];
        let [color, colorIndex] = [,];
        let extent = _this.myMap.geographicExtent;
        let myZoom = _this.myMap.getZoom();
        let [bound, windAry] = [windData.Bound, windData.Info];
        let size = windAry.length;
        let [xStart, yStart, xNums, yNums] = [
          bound[0],
          bound[2],
          bound[4],
          bound[5]
        ];
        let [xStep, yStep] = [
          (bound[1] - bound[0]) / (xNums - 1),
          (bound[3] - bound[2]) / (yNums - 1)
        ];
        switch (myZoom) {
          case 9:
            windStep = 2;
            break;
          case 8:
            windStep = 4;
            break;
          case 7:
            windStep = 6;
            break;
          case 6:
            windStep = 8;
            break;
          case 5:
            windStep = 16;
            break;
          case 4:
            windStep = 28;
            break;
          case 3:
            windStep = 48;
            break;
          case 2:
            windStep = 88;
            break;
          case 1:
            windStep = 164;
            break;
          default:
            break;
        }
        for (let row = 0; row < yNums; row += windStep) {
          lat = yStart + row * yStep;
          for (let col = 0; col < xNums; col += windStep) {
            lon = xStart + col * xStep;
            index = row * xNums + col;
            if (index >= size) {
              break;
            }
            wind = windAry[index];
            colorIndex = wind[1];
            if (0 <= colorIndex < 1) {
              color = "#A5F8FE";
            } else if (1 <= colorIndex < 2) {
              color = "#8CF0FF";
            } else if (2 <= colorIndex < 3) {
              color = "#5BD3EC";
            } else if (3 <= colorIndex < 4) {
              color = "#44BFD1";
            } else if (4 <= colorIndex < 5) {
              color = "#35A1A3";
            } else if (5 <= colorIndex < 6) {
              color = "#1F8884";
            } else if (6 <= colorIndex < 7) {
              color = "#187773";
            } else if (7 <= colorIndex < 8) {
              color = "#02615D";
            } else if (8 <= colorIndex < 9) {
              color = "#00414D";
            } else if (9 <= colorIndex < 10) {
              color = "#003034";
            } else if (10 <= colorIndex < 11) {
              color = "#001D21";
            } else if (11 <= colorIndex < 12) {
              color = "#000E1B";
            } else {
              color = "#00081B";
            }
            xy = windy.getXY(
              lat,
              lon,
              [[extent.xmin, extent.ymin], [extent.xmax, extent.ymax]],
              _this.myMap.width,
              _this.myMap.height
            );
            let ctx = rasterLayer._element.getContext("2d");
            ctx.moveTo(xy[0], xy[1]);
            ctx.lineWidth = 3;
            windy.drawWindShape(2, ctx, wind[0], wind[1], 20, xy, color);
          }
        }
      });
    }

    if (canvasSupport) {
      rasterLayer = new RasterLayer(null, {
        opacity: 0.55
      });
      this.state.mapView.map.add(rasterLayer);

      // this.myMap.on("extent-change", redraw);
      // this.myMap.on("resize", function() {});
      // this.myMap.on("zoom-start", redraw);
      // this.myMap.on("pan-start", redraw);

      // let layersRequest = esriRequest("/fengchang.json",{
      //   // url: "./UV_test.json",
      //   // url: './gfs.json',
      //   // url: './testgfs.json',
      //   // url: './testpoint.json',
      //   content: {},
      //   handleAs: "json"
      // });
      // layersRequest.then(
      //   function(response) {
      //     windy = new Windy({ canvas: rasterLayer._element, data: response });
      //     redraw();
      //   },
      //   function(error) {
      //     console.log("Error: ", error.message);
      //   }
      // );
      var url = "/fengchang.json";

      esriRequest(url, {
        responseType: "json"
      }).then(function(response){
        // The requested data
        windy = new Windy({ canvas: rasterLayer._element, data: response });
        redraw();
      });
    } else {
      //dom.byId("MyMapDiv").innerHTML =
        //"This browser doesn't support canvas. Visit <a target='_blank' href='http://www.caniuse.com/#search=canvas'>caniuse.com</a> for supported browsers";
    }
    })
  }
  removeLayer(){

  }
  addFeatureLayer(){
    let _this = this
    esriLoader.loadModules([
      "esri/layers/FeatureLayer",
      "esri/tasks/QueryTask",
      "esri/tasks/support/Query",
      "esri/renderers/ClassBreaksRenderer"
    ]).then(([FeatureLayer, QueryTask, Query, ClassBreaksRenderer])=>{
      var citiesLayerUrl = "http://192.168.1.111:6080/arcgis/rest/services/DBZQ/TESTCOLOR/FeatureServer/0"; // Represents the REST endpoint for a layer of cities.
      var queryTask = new QueryTask({
        url: citiesLayerUrl
      });
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "NAME = '测试面'";  // Return all cities with a population greater than 1 million
      // When resolved, returns features and graphics that satisfy the query.
      queryTask.execute(query).then(function(results){
        let layerAttributes = results.features[0].attributes
        let renderValue = []
        results.features.forEach((item, index)=>{
          let obj = {
            value: item.attributes.COLOR,
            color: item.attributes.COLOR
          }
          renderValue.push(obj)
        })
        var citiesRenderer = {
          type: "simple",
          symbol: { type: "simple-fill" },
          visualVariables: [{
            type: "color",
            field: "MIN3",
            stops: [{ value: '2.0', color: "#FDA10B" },
                  { value: '6.0', color: "#0BFD89" }]
          }]
        };
        let fetureLayer = new FeatureLayer({
          id: 'FeatureLayer',
          url: 'http://192.168.1.111:6080/arcgis/rest/services/DBZQ/TESTCOLOR/FeatureServer/0',
          renderer: citiesRenderer
        })
        console.log(fetureLayer)
        _this.state.mapView.map.add(fetureLayer)
      });
    })
  }
  removeLayer(layerId){
    let displayLayer = this.state.mapView.map.findLayerById(layerId)
    if(displayLayer){
      this.state.mapView.map.remove(displayLayer)
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
    return (
      <div id='addLayers' className = 'addLayers'>
        <div>
          <p><Checkbox onChange={(v, type)=>this.handleChange(v,'FeatureLayer')} value={'FeatureLayer'}>FeatureLayer</Checkbox></p>
          <p><Checkbox onChange={(v, type)=>this.handleChange(v,'windy')} value={'windy'}>windy</Checkbox></p>
        </div>
      </div>
    )
  }
}

AddLayers = connect(
  state => ({
    baseMap: state.loadBaseMap
  }),
  {}
)(AddLayers)
export default AddLayers
import React, { Component } from "react";
import esriLoader from "esri-loader";

//在线切片底图服务
export default class GisServerMap extends Component {
  constructor(props) {
    super(props);
    this.tileMapUrl =
      "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
  }
  componentDidMount() {
    this.initMap();
  }
  initMap() {
    const mapURL = {
      url: "https://js.arcgis.com/4.7/"
    };
    esriLoader
      .loadModules(
        [
          "esri/Map",
          "esri/Basemap",
          "esri/layers/TileLayer",
          "esri/views/MapView",
          "esri/views/SceneView",
          "dojo/domReady!"
        ],
        mapURL
      )
      .then(([Map, Basemap, TileLayer, MapView, SceneView]) => {
        let layer = new TileLayer({
          url: this.tileMapUrl
        });
        //实例化底图对象
        let baseMap = new Basemap({
          baseLayers: [layer],
          title: "Custom Basemap",
          id: "myBasemap"
        });
        //实例化地图对象
        let map = new Map({
          basemap: baseMap
        });
        //实例化view
        //2D
        let view2D = new MapView({
          center: [120.2, 32.1],
          map: map,
          container: "mapDiv2D",
          zoom: 5
        });
        //3D
        let view3D = new SceneView({
          center: [120.2, 32.1],
          map: map,
          container: "mapDiv3D",
          zoom: 1
        });
      });
  }
  render() {
    let style = {
      width: "50%",
      height: "100%",
      float: 'left'
    };
    return (
      <div id="GisServerMap" className="mapContent">
        <div id="mapDiv2D" style={style} />
        <div id="mapDiv3D" style={style} />
        <div style={{clear: 'both'}} />
      </div>
    );
  }
}

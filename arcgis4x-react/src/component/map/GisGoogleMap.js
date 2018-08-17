import React, { Component } from "react";
import esriLoader from "esri-loader";
import {
  onlineDigitalURL,
  onlineSatelliteURL,
  onlineAnooMarkerURL
} from "./../config";

export default class GisGoogleMap extends Component {
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
          "esri/config",
          "esri/views/MapView",
          "esri/views/SceneView",
          "esri/geometry/Extent",
          "esri/geometry/SpatialReference",
          "esri/layers/TileLayer",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/Ground",
          "dojo/on",
          "dojo/domReady!"
        ],
        mapURL
      )
      .then(
        ([
          Map,
          Basemap,
          esriConfig,
          MapView,
          SceneView,
          Extent,
          SpatialReference,
          TileLayer,
          WebTileLayer,
          TileInfo,
          Ground,
          on
        ]) => {
          //实例化坐标系
          let spatialReference = new SpatialReference({ wkid: 102100 });
          //实例化初始范围
          //let extent = new Extent({xmax: 13371824.0074, xmin: 8175464.5009, ymax: 5180434.2587, ymin: 3109500.2107,spatialReference});
          let extent = new Extent(
            95.56,
            36.28,
            125.65,
            45.33,
            new SpatialReference({ wkid: 4326 })
          );
          //实例化TileInfo
          let tileInfo = new TileInfo({
            rows: 256,
            cols: 256,
            compressionQuality: 0,
            origin: { x: -20037508.342787, y: 20037508.342787 },
            spatialReference: { wkid: 102113 },
            lods: [
              {
                level: 3,
                scale: 73957190.948944,
                resolution: 19567.8792409999
              },
              {
                level: 4,
                scale: 36978595.474472,
                resolution: 9783.93962049996
              },
              {
                level: 5,
                scale: 18489297.737236,
                resolution: 4891.96981024998
              },
              { level: 6, scale: 9244648.868618, resolution: 2445.98490512499 },
              { level: 7, scale: 4622324.434309, resolution: 1222.99245256249 },
              { level: 8, scale: 2311162.217155, resolution: 611.49622628138 },
              { level: 9, scale: 1155581.108577, resolution: 305.748113140558 },
              { level: 10, scale: 577790.554289, resolution: 152.874056570411 },
              { level: 11, scale: 288895.277144, resolution: 76.4370282850732 },
              { level: 12, scale: 144447.638572, resolution: 38.2185141425366 },
              { level: 13, scale: 72223.819286, resolution: 19.1092570712683 },
              { level: 14, scale: 36111.909643, resolution: 9.55462853563415 },
              { level: 15, scale: 18055.954822, resolution: 4.77731426794937 },
              { level: 16, scale: 9027.977411, resolution: 2.38865713397468 },
              { level: 17, scale: 4513.988705, resolution: 1.19432856685505 },
              { level: 18, scale: 2256.994353, resolution: 0.597164283559817 },
              { level: 19, scale: 1128.497176, resolution: 0.298582141647617 }
            ]
          });
          //实例化电子地图
          let digitalLayer = new WebTileLayer({
            id: "digitalMap",
            title: "digitalMap",
            urlTemplate: onlineDigitalURL,
            tileInfo: tileInfo,
            spatialReference: new SpatialReference({ wkid: 102100 })
          });
          //实例化影像图
          let satelliteLayer = new WebTileLayer({
            id: "satelliteMap",
            title: "satelliteMap",
            urlTemplate: onlineSatelliteURL,
            tileInfo: tileInfo,
            spatialReference: new SpatialReference({ wkid: 102100 })
          });
          //实例化地图标注
          let AnooMarkerLayer = new WebTileLayer({
            id: "anooMarkerMap",
            title: "anooMarkerMap",
            urlTemplate: onlineAnooMarkerURL,
            tileInfo: tileInfo,
            spatialReference: new SpatialReference({ wkid: 102100 })
          });
          //实例化Basemap对象
          let baseMap = new Basemap({
            baseLayers: [digitalLayer]
          });
          //实例化Map对象
          let mapControl = new Map({
            basemap: baseMap
          });
          //实例化MapView对象
          let mapView = new MapView({
            map: mapControl,
            container: "mapDiv",
            center: [10754619.8603, 4269984.3426],
            extent: extent,
            zoom: 1
          });
        }
      );
  }
  render() {
    let style = {
      width: "100%",
      height: "100%"
    };
    return (
      <div id="GisGoogleMap" className="mapContent">
        <div id="mapDiv" style={style} />
      </div>
    );
  }
}

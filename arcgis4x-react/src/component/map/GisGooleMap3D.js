import React, { Component } from "react";
import esriLoader from "esri-loader";
import {
  onlineDigitalURL,
  onlineSatelliteURL,
  onlineAnooMarkerURL
} from "./../config";

export default class GisGoogleMap3D extends Component {
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
          "esri/config",
          "esri/request",
          "esri/Color",
          "esri/views/SceneView",
          "esri/views/MapView",
          "esri/widgets/LayerList",
          "esri/layers/BaseTileLayer",
          "esri/layers/support/TileInfo",
          "dojo/domReady!"
        ],
        mapURL
      )
      .then(
        ([
          Map,
          esriConfig,
          esriRequest,
          Color,
          SceneView,
          MapView,
          LayerList,
          BaseTileLayer,
          TileInfo
        ]) => {
          let TintLayer = BaseTileLayer.createSubclass({
            properties: {
              urlTemplate: null,
              tint: {
                value: null,
                type: Color
              }
            },
            // generate the tile url for NumericalForecastSlide given level, row and column
            getTileUrl: function(level, row, col) {
              return this.urlTemplate
                .replace("{z}", level)
                .replace("{x}", col)
                .replace("{y}", row);
            },
            fetchTile: function(level, row, col) {
              let url = this.getTileUrl(level, row, col);
              return esriRequest(url, {
                responseType: "image",
                allowImageDataAccess: true
              }).then(
                function(response) {
                  // when esri request resolves successfully
                  // get the image from the response
                  var image = response.data;
                  var width = this.tileInfo.size[0];
                  var height = this.tileInfo.size[0];

                  // create NumericalForecastSlide canvas with 2D rendering context
                  var canvas = document.createElement("canvas");
                  var context = canvas.getContext("2d");
                  canvas.width = width;
                  canvas.height = height;

                  // Draw the blended image onto the canvas.
                  context.drawImage(image, 0, 0, width, height);

                  return canvas;
                }.bind(this)
              );
            }
          });
          esriConfig.request.corsEnabledServers.push("http://www.google.cn/");

          let stamenTileLayer = new TintLayer({
            urlTemplate:
              "http://www.google.cn/maps/vt/lyrs=s@157&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil",
            tint: new Color("#004FBB"),
            title: "影像"
          });
          let AnooMarkerLayer = new TintLayer({
            urlTemplate:
              "http://www.google.cn/maps/vt/lyrs=h@177000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil",
            tint: new Color("#004FBB"),
            title: "标注"
          });
          let digitalTileLayer = new TintLayer({
            urlTemplate:
              "http://www.google.cn/maps/vt/lyrs=m@226000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil",
            tint: new Color("#004FBB"),
            title: "地图"
          });
          let map = new Map({
            layers: [digitalTileLayer, AnooMarkerLayer]
          });
          //2D
          let view2D = new MapView({
            id: "2D",
            container: "mapDiv2D",
            map: map,
            center: [110.1, 23.8],
            zoom: 2
          });
          //3D
          let view3D = new SceneView({
            id: "3D",
            container: "mapDiv3D",
            map: map,
            center: [110.1, 23.8],
            zoom: 1
          });
        }
      );
  }
  render() {
    let style = {
      width: "50%",
      height: "100%",
      float: "left"
    };
    return (
      <div id="GisGoogleMap" className="mapContent">
        <div id="mapDiv2D" style={style} />
        <div id="mapDiv3D" style={style} />
        <div style={{clear: 'both'}}></div>
      </div>
    );
  }
}

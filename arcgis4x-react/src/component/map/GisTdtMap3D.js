import React, { Component } from "react";
import esriLoader from "esri-loader";
import {
  onlineDigitalURL,
  onlineSatelliteURL,
  onlineAnooMarkerURL
} from "./../config";

export default class GisTdtMap3D extends Component {
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
          esriConfig.request.corsEnabledServers.push("http://t0.tianditu.com/");

          let stamenTileLayer = new TintLayer({
            urlTemplate:
              "http://t0.tianditu.com/DataServer?T=vec_c&x={col}&y={row}&l={level}",
            tint: new Color("#004FBB"),
            title: "影像"
          });
          let AnooMarkerLayer = new TintLayer({
            urlTemplate:
              "http://t0.tianditu.com/DataServer?T=cva_c&x={col}&y={row}&l={level}",
            tint: new Color("#004FBB"),
            title: "标注"
          });
          let digitalTileLayer = new TintLayer({
            urlTemplate:
              "http://t0.tianditu.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={level}&TileRow={row}&TileCol={col}&style=default&format=tiles",
            tint: new Color("#004FBB"),
            title: "地图"
          });
          let map = new Map({
            layers: [stamenTileLayer, AnooMarkerLayer]
          });
          let view = new MapView({
            id: "2D",
            container: "mapDiv",
            map: map,
            center: [110.1, 23.8],
            zoom: 2
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
      <div id="GisTdtMap3D" className="mapContent">
        <div id="mapDiv" style={style} />
      </div>
    );
  }
}

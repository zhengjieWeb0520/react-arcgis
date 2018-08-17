import React, { Component } from "react";
import esriLoader from "esri-loader";
import {
  onlineAMapDigitalURL,
  onlineAMapSatelliteURL,
  onlineAMapAnooMarkerURL
} from "./../config";

export default class GisAMap extends Component {
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
          "esri/widgets/LayerList",
          "esri/layers/BaseTileLayer",
          "esri/views/MapView",
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
          LayerList,
          BaseTileLayer,
          MapView
        ]) => {
          // *******************************************************
          // Custom tile layer class code
          // Create a subclass of BaseTileLayer
          // *******************************************************

          let TintLayer = BaseTileLayer.createSubclass({
            properties: {
              urlTemplate: null,
              tint: {
                value: null,
                type: Color
              }
            },

            // generate the tile url for a given level, row and column
            getTileUrl: function(level, row, col) {
              return this.urlTemplate
                .replace("{z}", level)
                .replace("{x}", col)
                .replace("{y}", row);
            },

            // This method fetches tiles for the specified level and size.
            // Override this method to process the data returned from the server.
            fetchTile: function(level, row, col) {
              // call getTileUrl() method to construct the URL to tiles
              // for a given level, row and col provided by the LayerView
              var url = this.getTileUrl(level, row, col);

              // request for tiles based on the generated url
              // set allowImageDataAccess to true to allow
              // cross-domain access to create WebGL textures for 3D.
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

                  // create a canvas with 2D rendering context
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

          // *******************************************************
          // Start of JavaScript application
          // *******************************************************

          // Add stamen url to the list of servers known to support CORS specification.
          esriConfig.request.corsEnabledServers.push("webst01.is.autonavi.com");

          // Create a new instance of the TintLayer and set its properties
          let digitallTileLayer = new TintLayer({
            urlTemplate: onlineAMapDigitalURL,
            tint: new Color("#004FBB"),
            title: "高德"
          });
          let satelliteTileLayer = new TintLayer({
            urlTemplate: onlineAMapSatelliteURL,
            tint: new Color("#004FBB"),
            title: "高德"
          });
          let stamenTileLayer = new TintLayer({
            urlTemplate: onlineAMapAnooMarkerURL,
            tint: new Color("#004FBB"),
            title: "高德"
          });

          // add the new instance of the custom tile layer the map
          let map = new Map({
            layers: [satelliteTileLayer, stamenTileLayer]
          });

          // create a new scene view and add the map
          //2d
          let view2D = new MapView({
            container: "mapDiv2D",
            map: map,
            center: [110.1, 23.8],
            zoom: 3
          });
          //3d
          let view3D = new SceneView({
            container: "mapDiv3D",
            map: map,
            center: [110.1, 23.8],
            zoom: 1          
          })
        }
      );
  }
  render() {
    let style = {
      width: "50%",
      height: "100%",
      float: 'left'
    };
    return (
      <div id="GisAMap" className="mapContent">
        <div id="mapDiv2D" style={style} />
        <div id="mapDiv3D" style={style} />
        <div style={{clear: 'both'}} />
      </div>
    );
  }
}

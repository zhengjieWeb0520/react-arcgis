import React, { Component } from 'react'
import esriLoader from 'esri-loader'

export default class GisTdtMap extends Component{
    componentDidMount(){
        this.initMap()
    }
    initMap(){
        const mapURL = {
            url : "http://localhost/arcgis_js_api/library/3.22/3.22/dojo/dojo.js"
        }
        esriLoader.loadModules([
          "esri/map", 
          "esri/SpatialReference", 
          "esri/layers/tdtLayer",
          "esri/geometry/Extent",
          "dojo/domReady!"
        ], mapURL).then(([Map, SpatialReference, tdtLayer, Extent])=>{
              let  extent = new Extent(95.56, 36.28, 125.65, 45.33, new SpatialReference({ wkid: 4326 }))
              //定义地图
              let map = new Map('mapDiv', {
                  logo: false,
                  slider: false,
                  showLabels: true,
                  extent: extent,
                  zoom: 3
              })
              let tiledLayer = new tdtLayer({
                layertype: "road"
              })
              let labelLayer = new tdtLayer({
                layertype: "label"
              })
              map.addLayers([tiledLayer, labelLayer]);
        })
    }
    render(){
        let style = {
            width: '100%',
            height: '100%'
        }
        return(
            <div id="GisTdtMap" className="mapContent">
                <div id="mapDiv" style = {style}></div>
            </div>
        )
    }
}
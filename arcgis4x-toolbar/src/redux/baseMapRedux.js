import esriLoader from 'esri-loader'
import {  arc_api_js_url, onlineSatelliteURL, onlineAnooMarkerURL, onlineDigitalURL } from './../component/map/mapConfig'

const BASEMAPVIEW = 'BASEMAPVIEW'
const CLEARBASEMAP = 'CLEARBASEMAP'

const initState = {
  activeView: {}
}

export function loadBaseMap(state = initState, action){
  switch(action.type){
    case BASEMAPVIEW:
      return Object.assign({}, state, {
        activeView: action.data
      })
    case CLEARBASEMAP:
      return Object.assign({}, state, {
        activeView: {}
      })
    default:
      return state
  }
}

function switchMap(data){
  return { data: data, type: BASEMAPVIEW}
}

export function initBaseMap(dimensionType, centerParame, zoomParame, mapType, mapContainer){
  return dispatch =>{
    const mapOption = {
      url: arc_api_js_url
    }
    esriLoader.loadModules([
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
    ], mapOption).then(([Map, esriConfig, esriRequest, Color,
      SceneView, MapView, LayerList, BaseTileLayer ,TileInfo]) =>{
        //配置BaseTileLayer
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
            return this.urlTemplate.replace("{z}", level).replace("{x}",
                col).replace("{y}", row);
          },
          fetchTile: function(level, row, col){
            let url =  this.getTileUrl(level, row, col);
            return esriRequest(url, {
              responseType: "image",
              allowImageDataAccess: true
            }).then(function(response) {
              // when esri request resolves successfully
              // get the image from the response
              let image = response.data;
              let width = this.tileInfo.size[0]
              let height = this.tileInfo.size[0]

              // create NumericalForecastSlide canvas with 2D rendering context
              let canvas = document.createElement("canvas")
              let context = canvas.getContext("2d")
              canvas.width = width
              canvas.height = height


              // Draw the blended image onto the canvas.
              context.drawImage(image, 0, 0, width, height)

              return canvas
            }.bind(this))
          }
        })
        //设置配置地址
        esriConfig.request.corsEnabledServers.push("http://www.google.cn/");
        //实例化影像图层
        let stamenTileLayer = new TintLayer({
          urlTemplate: onlineSatelliteURL,
          tint: new Color("#004FBB"),
          title: "影像"
        })
        //实例化标注图层
        let AnooMarkerLayer = new TintLayer({
          urlTemplate: onlineAnooMarkerURL,
          tint: new Color("#004FBB"),
          title: "标注"           
        })
        //实例化地图图层
        let digitalTileLayer = new TintLayer({
          urlTemplate: onlineDigitalURL,
          tint: new Color("#004FBB"),
          title: "地图"
        })
        //根据mapType判断底图的类型     
        let baseLayers = mapType === '影像' ? [stamenTileLayer, AnooMarkerLayer] : [digitalTileLayer, AnooMarkerLayer]       
        //实例化map对象
        let map = new Map({
          layers: baseLayers
        })
        //定义View参数
        let viewConfig = {
          id: dimensionType,
          container: mapContainer,
          map: map,
          center: centerParame,
          zoom: zoomParame
        }
        //定义空view
        let activeView = {}
        if(dimensionType === '2D'){
          activeView = new MapView(viewConfig)
        }else if(dimensionType === '3D'){
          activeView = new SceneView(viewConfig)
        }
        dispatch(switchMap(activeView))
      })
  }
}
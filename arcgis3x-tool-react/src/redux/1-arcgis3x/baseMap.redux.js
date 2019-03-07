import esriLoader from 'esri-loader'
import NewMap from './../../component/2-arcgis3x-tool/arcgisTool'
import { arcgis_api_js } from './../../component/2-arcgis3x-tool/mapConfig'

const BASEMAP = 'BASEMAP'

const initState = {
  activeView: {}
}
export function gisBaseMap(state = initState, action) {
  switch (action.type) {
    case BASEMAP:
      return Object.assign({}, state, {
        activeView: action.data
      })
    default:
      return state
  }
}

//初始化地图
export function initGisBaseMap(mapDiv) {
  return dispatch => {
    const mapOption = {
      url: arcgis_api_js
    }
    esriLoader.loadModules([
      "esri/map",
      "esri/layers/gaodeLayer",
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/layers/MapImageLayer", 
      "esri/layers/MapImage",
      "esri/SpatialReference",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol",
      "esri/tasks/QueryTask", 
      "esri/tasks/query",
      "esri/layers/LabelClass",
      "esri/symbols/Font",
      "esri/Color",
      "esri/renderers/UniqueValueRenderer",
      "esri/symbols/TextSymbol",
      'esri/layers/ArcGISImageServiceLayer',
      'esri/layers/RasterFunction',
      'esri/layers/ImageServiceParameters',
    ], mapOption).then(([
      map, gaodeLayer, FeatureLayer, GraphicsLayer, ArcGISDynamicMapServiceLayer, MapImageLayer,
      MapImage, SpatialReference, SimpleLineSymbol, SimpleFillSymbol, QueryTask, query, LabelClass,
      Font, Color, UniqueValueRenderer, TextSymbol, ArcGISImageServiceLayer, RasterFunction, ImageServiceParameters
    ])=>{
      let initMap = {
        domID: mapDiv,
        center: [112, 32],
        zoom: 4,
        mapType: ["road"]
      }
      let mapControl = new NewMap(initMap, map, gaodeLayer, FeatureLayer, GraphicsLayer, ArcGISDynamicMapServiceLayer, MapImageLayer,
        MapImage, SpatialReference, SimpleLineSymbol, SimpleFillSymbol, QueryTask, query, LabelClass,
        Font, Color, UniqueValueRenderer, TextSymbol, ArcGISImageServiceLayer, RasterFunction, ImageServiceParameters)
      dispatch({type: BASEMAP, data: mapControl})
    })
  }
}
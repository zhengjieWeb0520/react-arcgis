

import {allColor} from './allColor'

let gaodeLayer, FeatureLayer, GraphicsLayer, ArcGISDynamicMapServiceLayer, MapImageLayer,
MapImage, SpatialReference, SimpleLineSymbol, SimpleFillSymbol, QueryTask, query, LabelClass,
Font, Color, UniqueValueRenderer, TextSymbol, ArcGISImageServiceLayer, RasterFunction, ImageServiceParameters;

export default class NewMap {
  constructor(initMap, Map, gaodeLayer1, FeatureLayer1, GraphicsLayer1, ArcGISDynamicMapServiceLayer1, MapImageLayer1,
    MapImage1, SpatialReference1, SimpleLineSymbol1, SimpleFillSymbol1, QueryTask1, query1, LabelClass1,
    Font1, Color1, UniqueValueRenderer1, TextSymbol1, ArcGISImageServiceLayer1, RasterFunction1, ImageServiceParameters1){
    
    gaodeLayer = gaodeLayer1
    FeatureLayer = FeatureLayer1
    GraphicsLayer = GraphicsLayer1
    ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer1
    MapImageLayer = MapImageLayer1
    MapImage = MapImage1
    SpatialReference = SpatialReference1
    SimpleLineSymbol = SimpleLineSymbol1
    SimpleFillSymbol = SimpleFillSymbol1
    QueryTask = QueryTask1
    query = query1
    LabelClass = LabelClass1
    Font = Font1
    Color = Color1
    UniqueValueRenderer = UniqueValueRenderer1
    TextSymbol = TextSymbol1
    ArcGISImageServiceLayer = ArcGISImageServiceLayer1
    RasterFunction = RasterFunction1
    ImageServiceParameters = ImageServiceParameters1
    
    this.newMap = new Map(initMap.domID,{
      logo: false,
      slider: false,
      showAttribution: false,
      showLabels: true,
      zoom: initMap.zoom,
      center: initMap.center,
      minZoom: 2,//最小空间等级
      maxZoom: 10,//最大空间等级
    })
    let tiledLayer = new gaodeLayer({
      layertype: initMap.mapType[0]
    })
    this.newMap.addLayer(tiledLayer)
    // 鼠标移入事件
    this.newMap.on('mouse-move', res=>{
    })
    //
  }
  /*
  *查询图层
  * layerName:图层id或者图层索引
  * */
  queryLayers (layerName) {
    let type = typeof layerName
    let layerInfo = type === 'number' 
    ? this.newMap.getLayer(this.newMap.layerIds[layerName])
    : this.newMap.getLayer(layerName)
    return layerInfo
  }
  /*
   *查询所有图层
   * */
  queryAllLayers() {
    let layers = this.newMap.getLayersVisibleAtScale(this.newMap.getScale());
    return layers
  }
  /*
  *移除图层
  * layerName:图层id或者图层索引
  * */
  removeLayers (layerName) {
    let layerInfo = this.queryLayers(layerName)
    if (layerInfo) {
      this.newMap.removeLayer(layerInfo)
    }
  }
  /*
  *移除多图层
  * layerName:图层id或者图层索引
  * */
  removeMultiLayers (removeLayers = []) {
    debugger
    let allLayers = this.queryAllLayers()
    for (let i = 0; i < allLayers.length; i++) {
      for (let j = 0; j < removeLayers.length; j++) {
        if (allLayers[i].id === removeLayers[j]) {
          if (this.newMap) {
            let layerType = removeLayers[j].includes('windParticle')
              ? 2
              : removeLayers[j].includes('windArrow') || removeLayers[j].includes('windPlume') || removeLayers[j].includes('surface_fillGraph')
              ? 1
              : removeLayers[j].includes('surface_fillGraph') || removeLayers[j].includes('depth_fillGraph')
              ? 4
              : 0
              this.removeLayers(allLayers[i].id)
          }
        }
      }
    }
  }
  /*
  * 添加带有查询的矢量图层(添加等值线)
  * layerName:图层名
  * url:图层路径
  * expression:查询条件
  * color:等值线颜色 颜色数组 [0,0,255]
  * */
  addFeatureLineLayer (layerName, url, expression, color) {
    console.log(url)
    let featherLayer = this.queryLayers(layerName)
    let definitionExpression = expression ? expression : ''
    let lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), 1);
    //定义唯一值渲染器，对字段RENDER进行渲染，lineSymbol是默认的渲染符号
    let renderer = new UniqueValueRenderer(lineSymbol, "RENDER")
    //定义label渲染方案
    let labelSymbol = new TextSymbol().setColor(
      new Color(color)).setFont(
      new Font("12pt").setWeight(Font.WEIGHT_BOLD))
    let json = {
      "labelExpressionInfo": {"value": "{VALUE}"},
      "useCodedValues": false,
      "labelPlacement": "above-right",
      "fieldInfos": [{fieldName: "VALUE"}]
    }
    let labelClass = new LabelClass(json)
    labelClass.symbol = labelSymbol

    if (featherLayer) {
      //this.newMap.removeLayer(featherLayer)
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
      featherLayer.setLabelingInfo([labelClass])
    } else {
      featherLayer = new FeatureLayer(url, {
        id: layerName,
        showLabels: true,
      })
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
      featherLayer.setLabelingInfo([labelClass])
    }
    this.newMap.addLayer(featherLayer)
    
  }
  /*
* 添加带有查询的矢量图层(添加填充图)
* layerName:图层名
* url:图层路径
* expression:查询条件
* valueArray: 分级值的数组
* flag：是否去除最小值，ture去除，false不去除
* */
  addFeatureFillLayer (layerName, url, expression, valueArray, flag, callback) {
    let featherLayer = this.queryLayers(layerName)
    let definitionExpression = expression ? expression : ''

    let colorStep = Math.floor(allColor.length / (valueArray.length + 1))
    let colorArray = []
    allColor.forEach((item, index) => {
      if (index % colorStep === 0)
        colorArray.push(item)
    })

    let lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0, 0]), 1);
    let fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color("#FFFFCC"));
    //定义唯一值渲染器，对字段alias进行渲染，fill是默认的渲染符号
    let renderer = new UniqueValueRenderer(fill, "RENDER")

    valueArray.forEach((item, index) => {
      let selectColor = allColor[index * colorStep]
      let selectColor2 = allColor[index * colorStep + 1]
      if (index === 0) {
        if (flag === true) {
          renderer.addValue(item + '_0', new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([colorArray[index][1], colorArray[index][2], colorArray[index][3], 0])))
          renderer.addValue(item + '_1', new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([colorArray[index + 1][1], colorArray[index + 1][2], colorArray[index + 1][3]])))
        }else {
          renderer.addValue(item + '_0', new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([colorArray[index][1], colorArray[index][2], colorArray[index][3]])))
          renderer.addValue(item + '_1', new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([colorArray[index + 1][1], colorArray[index + 1][2], colorArray[index + 1][3]])))
        }
      } else {
        renderer.addValue(item + '_0', new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([colorArray[index][1], colorArray[index][2], colorArray[index][3]])))
        renderer.addValue(item + '_1', new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([colorArray[index + 1][1], colorArray[index + 1][2], colorArray[index + 1][3]])))
      }

    })

    if (featherLayer) {
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
    } else {
      featherLayer = new FeatureLayer(url, {
        id: layerName,
        showLabels: true,
        opacity: 0.7,
      })
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
    }
    this.newMap.addLayer(featherLayer)
    featherLayer.on('update-end', res => {
      if (callback && res.error === false) {
        console.log(res)
        callback({
          status: 'ok'
        })
      }
    })
  }
  /*
  * 添加普通矢量图层
  * layerName:图层名
  * url:图层路径
  * */
  addFeatureLayer (layerName, url) {
    let featherLayer = this.queryLayers(layerName)
    if(featherLayer){
      this.removeLayers(featherLayer)
    }else{
      featherLayer = new FeatureLayer(url, {
        id: layerName,
        showLabels: true,
        opacity: 0.7,
      })
    }
    this.newMap.addLayer(featherLayer)
  }
  /*
  * 添加普通动态图层
  * layerName:图层名
  * url:图层路径
  * */
  addDynamicLayer (layerName, url) {
    let dynamicLayer = this.queryLayers(layerName)
    if(dynamicLayer){
      this.removeLayers(dynamicLayer)
    }else{
      dynamicLayer = new ArcGISDynamicMapServiceLayer(url,{
        id: layerName,
        opacity: 0.8
      })
    }
    this.newMap.addLayer(dynamicLayer)
  }
    /*
  * 查询镶嵌数据集
  * layerName:图层名
  * url:arcgis服务
  * queryInfo:查询内容
  * renderData:渲染方法
  * */
  queryService (layerName, url, queryInfo, renderData) {
    let resampleRF = new RasterFunction({
      functionName: "Resample",
      variableName: "Raster",
      functionArguments:{
          "ResamplingType" :1,
          "Raster":"$$"
      }
    })
    let remapRF = new RasterFunction();
    remapRF.functionName = "Remap";
    remapRF.functionArguments = {
      "InputRanges": renderData.inputRanges,
      "OutputValues": renderData.outputValues,
      "Raster": resampleRF
    };
    remapRF.outputPixelType = "U8";
    let ColorFunction = new RasterFunction();
    ColorFunction.functionName = "Colormap";
    ColorFunction.functionArguments = {
      "Colormap": renderData.colorMap,
      "Raster": remapRF
    };
    let params = new ImageServiceParameters();
    params.renderingRule = ColorFunction;

    let serviceLayer = new ArcGISImageServiceLayer(url, {
      id: layerName,
      opacity: 0.7,
      imageServiceParameters: params,
    })
    serviceLayer.setDefinitionExpression(queryInfo)
    this.newMap.addLayer(serviceLayer)
  }
  mapClick (callback) {
    this.newMap.on("click", function (evt) {
      if(callback){
        callback({
          data: evt,
        })
      }
    })
  }
}
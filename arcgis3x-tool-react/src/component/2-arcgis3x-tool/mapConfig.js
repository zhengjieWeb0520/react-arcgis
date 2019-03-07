export const arcgis_api_js = 'http://localhost/arcgis_js_api/library/3.26/3.26/init.js'




export const layesConfig = [
  {
    name: 'lineFeather',
    value: 'http://192.168.1.111:6080/arcgis/rest/services/DBZQ/formatLine/MapServer/4',
    expression : `PRODUCTID = '201812262000-003-500-AT'`
  },
  {
    name: 'fillFeature',
    value: 'http://192.168.1.111:6080/arcgis/rest/services/DBZQ/landFill/FeatureServer/0',
    expression: `PRODUCTID='8f3e9c5a-839b-4832-a505-4d017fe9d18d'`,
    valueArray:  ["980.0", "985.0", "990.0", "995.0", "1000.0", "1005.0", "1010.0"]
  },
  {
    name: 'commonFeature',
    value: 'http://192.168.1.182:6080/arcgis/rest/services/Anhui/cityMapService/MapServer/1'
  },
  {
    name: 'commonDynamic',
    value: 'http://192.168.1.182:6080/arcgis/rest/services/DBZQ/regionBorder/MapServer'
  },
  {
    name: 'mosaicDataSet',
    value: 'http://192.168.1.182:6080/arcgis/rest/services/Anhui/H8LST/ImageServer'
  }
]
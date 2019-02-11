import axios from 'axios'
import store from '../vuex/store'

/**
 * 使用Vuex的store之前需要先引入，
 * 1.通过store.state.tokenStr获取属性值
 * 2.通过store.commit('mutations中的方法名',tokenStr)设置属性值
 */

function initAxios() {//初始化配置
  //设置api访问基路径
  axios.defaults.baseURL = 'http://121.11.2012iot.com/';
  axios.defaults.headers.common['tokenStr'] = store.state.tokenStr;//这里使用了Vuex中的常量（需要先引入store）
  axios.defaults.headers.post['Content-Type'] = 'application/json';
}

/**
 * 说明：我这里默认的服务器返回的最外层对象如下，
 * {code: 0, message: null, obj: "1766", tokenStr: "MTc2Nl90b2tlbl8tMTUzMDY5MTE3MTMxNA=="}
 * 如果你们的服务器返回不是这样，需要在 backview 方法中做相应的更改
 *
 * catch 1.捕获请求异常
 *       2.捕获处理异常【包含response使用不当】
 *
 *
 * 提交表单
 *    let formData = new FormData();
 *    formData.append('name', this.name);
 *    formData.append('age', this.age);
 *    formData.append('file', this.file);
 *    axios.post(hasParamUrl, params).then(function (response){}catch(error){}
 *
 */

/**
 * GET 方式请求数据
 * @param hasParamUrl  请求url（已经拼接好的路径）
 * @param callback 回调函数
 */
export function getData(hasParamUrl, callback) {
  if (hasParamUrl == null) return
  initAxios();
  axios.get(hasParamUrl).then(function (response) {
    backView(response, callback)
  }).catch(function (error) {
    callback(null, "请求报错")
    console.log(error);
  })
}

/**
 * POST 方式请求
 * @param hasParamUrl 请求url
 * @param params  (如下的param)
 *      var param = new URLSearchParams;
 *      param.append("name", "mirzhao");
 * @param callback 回调函数
 */
export function postData(requestUrl, params, callback) {
  initAxios();
  axios.post(requestUrl, params).then(function (response) {
    store.commit("setTokenStr", response.data.tokenStr)//存储token到Vuex的state
    backView(response, callback)
  }).catch(function (error) {
    callback(null, "请求报错")
    console.log(error);
  })
}

/**
 * POST 方式请求（传送到服务器的是一个json对象）
 * @param requestUrl 请求url
 * @param params  (如下的param)
 *      var param = new URLSearchParams;
 *      param.append("name", "mirzhao");
 * @param callback 回调函数
 */
export function postStringParamData(requestUrl, params, callback) {
  initAxios();
  axios.post(requestUrl, JSON.stringify(params)).then(function (response) {
    backView(response, callback)
  }).catch(function (error) {
    callback(null, "请求报错" + error)
    console.log(error);
  })
}

/**
 * 上传文件——可以同时上传多个
 * @param uploadFileUrl
 * @param formData
 *      let formData = new FormData(); //创建form对象
 *      param.append('file',file1,fileName1);//通过append向form对象添加数据
 *      param.append('file',file2,fileName2);//通过append向form对象添加数据
 *      param.append('file',file3,fileName3);//通过append向form对象添加数据
 */
export function postFile(uploadFileUrl, formData, callback) {
  let config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  axios.post(uploadFileUrl, formData, config).then(function (response) {
    backView(response, callback)
  }).catch(function (error) {
    callback(null, "请求报错" + error)
    console.log(error);
  })
}

/**
 * 获取到数据后——统一处理最外层对象
 * @param response
 * @param callback
 */
function backView(response, callback) {
  console.log(response.data);//打印返回的数据实体  reponse.data才是服务器返回的数据
  if (response != null && response.data != null && response.data.code == 0) {
    console.log("请求成功")
    store.commit("setTokenStr", response.data.tokenStr)
    if (callback != null) {
      callback(response.data.obj, null)
    }
  } else {
    console.log("请求失败")
    if (callback != null) {
      callback(null, response.data.message)
    }
  }
}

// console.log(response.status);//服务器返回的状态
// console.log(response.statusText);
// console.log(response.headers);
// console.log(response.config);

export default {
  getData,
  postData,
  postStringParamData,
  postFile
}
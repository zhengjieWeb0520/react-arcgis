//三个数字加一个逗号
export function toThousands(num) {
	let result = [],
		counter = 0
	num = (num || 0).toString().split('')
	for (let i = num.length - 1; i >= 0; i--) {
		counter++
		result.unshift(num[i])
		if (!(counter % 3) && i !== 0) {
			result.unshift(',')
		}
	}
	return result.join('')
}

//获取节点子元素
export function getChildNode(dom) {
	let nodes = []
	let childrens = dom.childNodes
	for (let i = 0; i < childrens.length; i++) {
		if (childrens[i].nodeType === 1) {
			nodes.push(childrens[i])
		}
	}
	return nodes
}

/**
 * 获取相邻元素
 * @param ele 参考物元素
 * @param type 类型，上一个(1)or下一个(0)
 * @return 返回查找到的元素Dom对象，无则返回null
 */
export function getNearEle(ele, type) {
	type = type === 1 ? 'previousSibling' : 'nextSibling'
	var nearEle = ele[type]
	while (nearEle) {
		if (nearEle.nodeType === 1) {
			return nearEle
		}
		nearEle = nearEle[type]
		if (!nearEle) {
			break
		}
	}
	return null
}

//判断两个对象是否相等
export function ObjectEquals(object1, object2) {
	for (let propName in object1) {
		if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
			return false
		} else if (typeof object1[propName] !== typeof object2[propName]) {
			return false
		}
	}
	for (let propName in object2) {
		if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
			return false
		} else if (typeof object1[propName] !== typeof object2[propName]) {
			return false
		}
		if (!object1.hasOwnProperty(propName)) continue

		if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
			if (!ObjectEquals(object1[propName], object2[propName])) return false
		} else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
			if (!ObjectEquals(object1[propName], object2[propName])) return false
		} else if (object1[propName] !== object2[propName]) {
			return false
		}
	}
	return true
}

//判断数组是否相同
export function ArrayEquals(arry1, arry2) {
	if (!arry2) {
		return false
	}
	if (arry1.length !== arry2.length) {
		return false
	}
	for (var i = 0, l = arry1.length; i < l; i++) {
		if (arry1[i] instanceof Array && arry2[i] instanceof Array) {
			if (!arry1[i].ArrayEquals(arry2[i])) return false
		} else if (arry1[i] != arry2[i]) {
			return false
		}
	}
	return true
}

//小数转换百分比并且保留小数点后两位
export function PercentNum(num) {
	let Nnum = Number(num * 100).toFixed(2)
	Nnum += '%'
	return Nnum
}

//获取元素样式兼容性写法
export function getStyle(obj, style) {
	return obj.currentStyle ? obj.currentStyle[style] : getComputedStyle(obj, false)[style]
}

//模仿jq animate效果
export function animate(obj, styleJson, callback) {
	clearInterval(obj.timer)
	// 开启定时器
	obj.timer = setInterval(function() {
		//假设所有动作都已完成成立。
		var flag = true
		for (var styleName in styleJson) {
			//1.取当前属性值
			var iMov = 0
			// 透明度是小数，所以得单独处理
			iMov =
				styleName === 'opacity'
					? Math.round(parseFloat(getStyle(obj, styleName)) * 100)
					: parseInt(getStyle(obj, styleName), 10)
			//2.计算速度
			var speed = 0
			//缓冲处理，这边也可以是固定值
			speed = (styleJson[styleName] - iMov) / 8
			//区分透明度及小数点，向上取整，向下取整
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
			//3.判断是否到达预定值
			if (Number.parseInt(styleJson[styleName], 10) !== iMov) {
				flag = false
				//判断结果是否为透明度
				if (styleName === 'opacity') {
					obj.style[styleName] = (iMov + speed) / 100
					obj.style.filter = 'alpha(opacity:' + (iMov + speed) + ')'
				} else {
					obj.style[styleName] = iMov + speed + 'px'
				}
			}
		}
		//到达设定值，停止定时器，执行回调
		if (flag) {
			clearInterval(obj.timer)
			if (callback) {
				callback()
			}
		}
	}, 40)
}

//文字滚动构造函数,父级ID、ul父元素
export function TextScrollTop(fatherId, rollWrapClass, gap = 0, size = 2) {
	let domSize = {},
		domValue = {},
		// animateTime = 300,
		scrollTime = 3000,
		autoScroll
	//获取dom元素，最外层
	domSize.moduleId = document.getElementById(fatherId)
	domSize.rollWrap = domSize.moduleId.querySelector('.' + rollWrapClass)
	domSize.rollWrapUl = getChildNode(domSize.rollWrap)[0]
	domSize.rollWrapLis = getChildNode(domSize.rollWrapUl)

	if (domSize.rollWrapLis[0]) {
		domValue.liNums = domSize.rollWrapLis.length
		domValue.ulHeight = domSize.rollWrapUl.offsetHeight
		domValue.liHeight = domSize.rollWrapLis[0].offsetHeight

		this.init = function() {
			autoPlay()
			pausePlay()
		}
	} else {
		this.init = () => {}
	}

	function play() {
		if (size === 1) {
			animate(domSize.rollWrapUl, { 'margin-top': '-' + (domValue.liHeight + gap) }, function() {
				domSize.rollWrapUl.style.marginTop = 0
				domSize.rollWrapUl.appendChild(getChildNode(domSize.rollWrapUl)[0])
			})
		} else {
			animate(domSize.rollWrapUl, { 'margin-top': '-' + (domValue.liHeight + gap) }, function() {
				domSize.rollWrapUl.style.marginTop = 0
				domSize.rollWrapUl.appendChild(getChildNode(domSize.rollWrapUl)[0])
				domSize.rollWrapUl.appendChild(getChildNode(domSize.rollWrapUl)[0])
			})
		}
	}

	function autoPlay() {
		if (domValue.liHeight * domValue.liNums > domValue.ulHeight) {
			autoScroll = setInterval(function() {
				play()
			}, scrollTime)
		}
	}

	function pausePlay() {
		domSize.rollWrapUl.onmouseenter = function() {
			clearInterval(autoScroll)
		}

		domSize.rollWrapUl.onmouseleave = function() {
			autoPlay()
		}
	}
}

/*
获取元素索引值
@params
father    父级dom元素
children  获取索引的元素
*/
export function Index(father, children) {
	let childrens = getChildNode(father)
	return childrens.indexOf(children)
}

/*
获取文件名包括后缀
@params
filepath  文件路径
*/
export function GetFileName(filepath) {
	if (filepath !== '') {
		let filePath = filepath
		let names = filePath.split('\\')
		let fileName = names[names.length - 1]
		return fileName
	}
}

/*
获取文件后缀
@params
filepath  文件路径
*/
export function GetFileExt(filepath) {
	if (filepath !== '') {
		let ext = '.' + filepath.replace(/.+\./, '')
		return ext
	}
}

/*
获取文件名不包括后缀
@params
filepath  文件路径
*/
export function GetFileNameNoExt(filepath) {
	if (filepath !== '') {
		let filename = GetFileName(filepath)
		let filename1 = filename.split('.')
		return filename1[0]
	}
}

/*
字符串逆转
@params
str     逆转前字符串
*/
export function StrTurn(str) {
	if (str !== '') {
		var str1 = ''
		for (var i = str.length - 1; i >= 0; i--) {
			str1 += str.charAt(i)
		}
		return str1
	}
}

/*
日期格式化
@params
data    new Date()对象
fmt     yyyy-MM-dd hh:mm:ss
*/
export function dataFormat(date, fmt) {
	var o = {
		'M+': date.getMonth() + 1, //月份
		'd+': date.getDate(), //日
		'h+': date.getHours(), //小时
		'm+': date.getMinutes(), //分
		's+': date.getSeconds(), //秒
		'q+': Math.floor((date.getMonth() + 3) / 3), //季度
		S: date.getMilliseconds() //毫秒
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
		}
	}
	return fmt
}

/*
经纬度转墨卡托
@params
lonlat     转换前经纬度坐标的对象
*/
export function lonlat2mercator(lonlat) {
	var mercator = {
		x: 0,
		y: 0
	}
	var x = (lonlat.x * 20037508.34) / 180
	var y = Math.log(Math.tan(((90 + lonlat.y) * Math.PI) / 360)) / (Math.PI / 180)
	y = (y * 20037508.34) / 180
	mercator.x = x
	mercator.y = y
	return mercator
}

/*
墨卡托转经纬度
@params
lonlat     转换前墨卡托坐标的对象
*/
export function mercator2lonlat(mercator) {
	var lonlat = {
		x: 0,
		y: 0
	}
	var x = (mercator.x / 20037508.34) * 180
	var y = (mercator.y / 20037508.34) * 180
	y = (180 / Math.PI) * (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2)
	lonlat.x = x
	lonlat.y = y
	return lonlat
}
export function formatDegree(coordinate) {
	var degreeCoor = {
		x: '',
		y: ''
	}
	var x_value = coordinate.x
	var y_value = coordinate.y
	x_value = Math.abs(x_value)
	var x_v1 = Math.floor(x_value) //度
	var x_v2 = Math.floor((x_value - x_v1) * 60) //分
	var x_v3 = Math.round(((x_value - x_v1) * 3600) % 60) //秒
	var x = x_v1 + '°' + x_v2 + "'" + x_v3 + '"'

	y_value = Math.abs(y_value)
	var y_v1 = Math.floor(y_value) //度
	var y_v2 = Math.floor((y_value - y_v1) * 60) //分
	var y_v3 = Math.round(((y_value - y_v1) * 3600) % 60) //秒
	var y = y_v1 + '°' + y_v2 + "'" + y_v3 + '"'

	degreeCoor.x = x
	degreeCoor.y = y
	return degreeCoor
}

/*
提示弹出，封装antd
@params
message     antd的message组件
str     提示文字
*/
export function toast(message, str, type) {
	if (str !== '') {
		message.destroy()
		message.config({
			top: document.documentElement.clientHeight - 200,
			duration: 1
		})
		switch (type) {
			case 'success':
				message.success(str)
				break
			case 'warning':
				message.warning(str)
				break
			case 'error':
				message.error(str)
				break
			case 'info':
				message.info(str)
				break
			default:
				message.warning(str)
		}
		// message.info(str)
	}
}

/*
loading，封装antd
@params
message     antd的message组件
str         提示文字
duration    持续时间
onClose     关闭后的回调函数
*/
export function Loading(message, str, duration, onClose) {
	if (str !== '') {
		message.destroy()
		message.config({
			top: document.documentElement.clientHeight / 2
		})
		message.loading(str, duration, onClose)
	}
}

/*
默认点击事件
@params
dom     需要点击的节点
*/
export function imitateClick(dom) {
	if (dom) {
		let e = document.createEvent('MouseEvents')
		e.initEvent('click', true, true)
		dom.dispatchEvent(e)
	}
}

/*
日期是一位的话前面补零
@params
num     日期
*/
export function addZero(num) {
	return num < 10 ? '0' + num : num
}

//初始开始时间(当前时间减一周)
export function initTime() {
	let date = new Date()
	let startDate = date.getDate() - 7
	let getMonth = date.getMonth()
	let startYear = date.getFullYear()
	if (startDate <= 0) {
		if (getMonth === 1) {
			startDate = 28 + startDate
		}
		startDate = 30 + startDate
		getMonth = getMonth - 1
		date.setMonth(getMonth)
	}
	if (getMonth <= 0) {
		getMonth = 11
		startYear = startYear - 1
		date.setMonth(getMonth)
		date.setYear(startYear)
	}
	date.setDate(startDate)
	return date
}

/*
数组拷贝
@params
arr     原数组
*/

export function copyArr(arr) {
	let newArr = []
	arr.forEach(item => {
		newArr.push(item)
	})
	return newArr
}

/*
数组去重
@params
arr     原数组
*/
export function uniqueArr(arr) {
	let newArr = Array.from(new Set(arr))
	return newArr
}

//去除active
export function removeActive(navlistLis) {
	for (let i = 0; i < navlistLis.length; i++) {
		navlistLis[i].querySelector('.navName').classList.remove('active')
	}
}

/*
接口数据格式转化成antd需要的树结构
@params
data     接口树结构数组
*/
export function getTreeData(data) {
	let treeData = []
	data.forEach((item, index) => {
		treeData.push({
			title: item.nodeName,
			key: item.id,
			children: []
		})

		if (item.subTree) {
			item.subTree.forEach((item1, index1) => {
				treeData[index].children.push({
					title: item1.nodeName,
					key: item1.id,
					children: []
				})

				if (item1.subTree) {
					item1.subTree.forEach((item2, index2) => {
						treeData[index].children[index1].children.push({
							title: item2.nodeName,
							key: item2.id,
							children: []
						})

						if (item2.subTree) {
							item2.subTree.forEach((item3, index3) => {
								treeData[index].children[index1].children[index2].children.push({
									title: item3.nodeName,
									key: item3.id,
									children: []
								})
							})
						}
					})
				}
			})
		}
	})

	return treeData
}

//方向转换
export function direction(data) {
	if (
		data == '-99991' ||
		data == '-99992' ||
		data == '-99993' ||
		data == '-99994' ||
		data == '-99999' ||
		data == null
	) {
		return '----'
	}
	// data = data / 10

	if ((data >= 0 && data <= 22.5) || (data >= 337.5 && data <= 360)) {
		return '北风'
	} else if (data > 22.5 && data <= 67.5) {
		return '东北风'
	} else if (data > 67.5 && data <= 112.5) {
		return '东风'
	} else if (data > 112.5 && data <= 157.5) {
		return '东南风'
	} else if (data > 157.5 && data <= 202.5) {
		return '南风'
	} else if (data > 202.5 && data <= 247.5) {
		return '西南风'
	} else if (data > 247.5 && data <= 292.5) {
		return '西风'
	} else if (data > 292.5 && data < 337.5) {
		return '西北风'
	} else {
		return '---'
	}
}

/**
 * 解析XML获取镶嵌数据集参数
 * productMark：产品标识
 * productXml：xml文件结构
 */
export function getMosicalParam (productMark, productXml) {
  let nodeList = productXml.getElementsByTagName('Plugin')
  let inputRanges = []
  let outputValues = []
  let colorMap = []
  let labelArray = []
  // let pixLabel
  // let nodata = ''
  let unit
  for (let i = 0; i <= nodeList.length - 1; i++) {
    if (nodeList[i].attributes[0].value === productMark) {
      // pixLabel = nodeList[i].getElementsByTagName('ProdDesp')[0].textContent
      unit = nodeList[i].getElementsByTagName('ReMaps')[0].attributes[0].value
      // nodata = nodeList[i].getElementsByTagName('ReMaps')[0].attributes[1].value
      let reMapDom = nodeList[i].childNodes[5].getElementsByTagName('ReMap')
      for (let j = 0; j <= reMapDom.length - 1; j++) {
        let reMapAttr = reMapDom[j].attributes
        let minValue = Number(reMapAttr[1].value)
        let maxValue = Number(reMapAttr[2].value)
        let revLevel = Number(reMapAttr[3].value)
        let colorValue = reMapAttr[4].value.split(',')
        let colorArr = []
        inputRanges.push(minValue)
        inputRanges.push(maxValue)
        outputValues.push(revLevel)
        colorArr.push(revLevel)
        colorValue.forEach(item => {
          colorArr.push(Number(item))
        })
        colorMap.push(colorArr)
        labelArray.push(reMapAttr[5].value)
      }
    }
  }
  let data = {
    inputRanges: inputRanges,
    outputValues: outputValues,
    colorMap: colorMap,
    labelArray: labelArray
  }
  return data
}
/**
 * 画图例
 * @param {*} number
 */
export function drawLegend (Colormap, labelArray, productMark, canvasId, canvasClass) {
  let dataObj = []
  Colormap.forEach((element, index) => {
    let colorString = []
    element.forEach((item, index) => {
      if (index !== 0) {
        colorString.push(item)
      }
    })
    let levelName = labelArray[index]
    let obj = {
      tname: levelName,
      color: `rgb(${colorString[0]},${colorString[1]},${colorString[2]})`
    }
    dataObj.push(obj)
  })
  console.log(dataObj)
  let canvas = document.getElementById(canvasId)
  var ctx = canvas.getContext('2d')
  let widthArray = []
  for (var i = 0; i < dataObj.length; i++) {
    let txt = dataObj[i].tname
    widthArray.push(ctx.measureText(txt).width)
  }
  let maxItemWidth = Math.max(...widthArray)

  var yheight = 30
  yheight += dataObj.length * 27 // 计算canvas高度
  canvas.width = 60 + maxItemWidth
  canvas.height = yheight

  ctx.fillStyle = 'rgba(248, 251, 255, 0.2)'
  ctx.fillRect(0, 0, 200, yheight) // 绘制底图
  ctx.font = '16px Arial'
  ctx.fillStyle = '#000'
  let str = productMark
  let startWidth = (canvas.width - ctx.measureText(str).width) / 2
  ctx.fillText(str, startWidth, 20)
  document.querySelector(canvasClass).style.display = 'block'

  for (let i = 0; i < dataObj.length; i++) {
    // 实现文字前面带色块
    ctx.fillStyle = dataObj[i].color // 块颜色
    // 实现色块的边框
    ctx.moveTo(10, 60 + (i - 1) * 25)
    ctx.lineTo(10 + 25, 60 + (i - 1) * 25)
    ctx.lineTo(10 + 25, 60 + (i - 1) * 25 + 15)
    ctx.lineTo(10, 60 + (i - 1) * 25 + 15)
    ctx.closePath()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#8C7A58'
    ctx.strokeRect = '#8C7A58'
    ctx.stroke()
    ctx.fillRect(10, 60 + (i - 1) * 25, 25, 15) // 颜色块：x,y,w,h
    ctx.font = '12px Arial'
    ctx.fillStyle = '#555'
    let txt = dataObj[i].tname
    ctx.fillText(txt, 40, 72 + (i - 1) * 25) // 文字
  }
}


/*
服务器本地ip切换
*/
// export const serverIp = 'http://10.19.0.12:8080/htht-ocean'
// export const serverIp = 'http://192.168.1.182:8084/htht-ocean'
export const serverIp = '/htht-ocean'
// export const serverIp = ''

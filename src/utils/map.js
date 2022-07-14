import DrawingManager from '@/extra/DrawingManager/index'
const EARTHRADIUS = 6370996.81
const styleOptions = {
  strokeColor: '#5E87DB', // 边线颜色
  fillColor: '#5E87DB', // 填充颜色。当参数为空时，圆形没有填充颜色
  strokeWeight: 2, // 边线宽度，以像素为单位
  strokeOpacity: 1, // 边线透明度，取值范围0-1
  fillOpacity: 0.2 // 填充透明度，取值范围0-1
}
const labelOptions = {
  borderRadius: '2px',
  background: '#FFFBCC',
  border: '1px solid #E1E1E1',
  color: '#703A04',
  fontSize: '12px',
  letterSpacing: '0',
  padding: '5px'
}

export const coordinateTypeList = {
  polygon: 3,
  circle: 1,
  rectangle: 2
}

export default class MapUtils {
  constructor(map, BMap) {
    this.map = map
    this.BMap = BMap
    this.dms = new Map()
  }

  getOverlayType(overlay) {
    if (overlay instanceof this.BMap.Polygon) {
      return 'polygon'
    } else if (overlay instanceof this.BMap.Circle) {
      return 'circle'
    } else {
      return null
    }
  }

  static toggleEditing(overlay, flag) {
    flag ? overlay.enableEditing() : overlay.disableEditing()
  }

  static degreeToRad(degree) {
    return Math.PI * degree / 180
  }

  static getDistance(initPos, targetPos) {
    if (
      initPos.lat === targetPos.lat && initPos.lng === targetPos.lng ||
      !initPos ||
      !targetPos
    ) {
      return 0
    }
    const x1 = this.degreeToRad(initPos.lng)
    const y1 = this.degreeToRad(initPos.lat)
    const x2 = this.degreeToRad(targetPos.lng)
    const y2 = this.degreeToRad(targetPos.lat)
    return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)))
  }

  static fixPoints(arr = [], fn) {
    if (!arr.length) return []
    const result = []
    fn = fn || ((p, res) => {
      res.push(p)
    })
    for (let i = 0; i < arr.length; i++) {
      const cur = arr[i]
      if (i === 0 || i === arr.length - 1) {
        fn(cur, result)
        if (i === arr.length - 1) {
          break
        }
      }
      const next = arr[i + 1]
      if (cur.lat !== next.lat || next.lng !== cur.lng) {
        fn(cur, result)
      }
    }
    return result
  }

  // const mapManager = new MapUtils(this.Map, this.BMap)
  // console.log(mapManager.calcLineLength(allPoints))
  // 计算轨迹路线长度
  static calcLineLength(pointArr = []) {
    let dis = 0
    if (pointArr.length < 2) return dis
    for (let i = 0; i < pointArr.length - 1; i++) {
      const initPos = pointArr[i]
      const targetPos = pointArr[i + 1]
      if (initPos.lat === targetPos.lat && initPos.lng === targetPos.lng) {
        continue
      }
      const len = this.getDistance(initPos, targetPos)
      dis = dis + len
    }
    return dis
  }

  isPoint(p) {
    return p instanceof this.BMap.Point
  }

  genPoint(p) {
    if (this.isPoint(p)) {
      return p
    } else {
      const { lng, lat } = p
      return new this.BMap.Point(lng, lat)
    }
  }

  panTo(p) {
    this.map.panTo(this.genPoint(p))
  }

  centerAndZoom(points) {
    if (!points.length) return
    points = points.map((son) => {
      return this.genPoint(son)
    })
    const view = this.map.getViewport(points)
    const { center, zoom } = view
    const betterZoom = zoom < 5 ? 5 : zoom > 18 ? 18 : zoom - 1
    this.map.centerAndZoom(center, betterZoom)
  }

  drawPolygon(polygon = [], options = styleOptions) {
    const overlay = new this.BMap.Polygon(polygon, { ...styleOptions, ...options })
    this.map.addOverlay(overlay)
    MapUtils.toggleEditing(overlay, true)
    overlay.coordinateType = coordinateTypeList.polygon
    return overlay
  }

  createDrawingManager(options = {}) {
    const drawingManager = new DrawingManager(this.map, {
      // isOpen: true,        // 是否开启绘制模式
      enableCalculate: false, // 绘制是否进行测距测面
      enableSorption: true, // 是否开启边界吸附功能
      sorptiondistance: 20, // 边界吸附距离
      circleOptions: styleOptions, // 圆的样式
      polylineOptions: styleOptions, // 线的样式
      polygonOptions: styleOptions, // 多边形的样式
      rectangleOptions: styleOptions, // 矩形的样式
      labelOptions: labelOptions, // label样式
      enableDrawingTool: true, // 是否显示工具栏
      drawingToolOptions: {
        drawingModes: [
          BMAP_DRAWING_POLYGON // 多边形
          // BMAP_DRAWING_MARKER,
          // BMAP_DRAWING_CIRCLE, // 圆
          // BMAP_DRAWING_POLYLINE,
          // BMAP_DRAWING_RECTANGLE // 矩形
        ]
      },
      ...options
    })

    // this.dms.set(drawingManager, drawingManager)
    return drawingManager
  }
}

// initDraw() {
//   const mapUtil = new MapUtils(this.Map, this.BMap)
//   const drawingType = 'polygon'
//   let drawingManager = this.drawingManager
//   if (!drawingManager) {
//     drawingManager = mapUtil.createDrawingManager()
//     drawingManager.setDrawingMode(drawingType)
//     this.drawingManager = drawingManager
//   }
//   drawingManager.addEventListener('polygoncomplete', function(e, overlay) {
//     overlay.addEventListener('click', function(...a) {
//       drawingManager.open()
//     })
//   })
//   const initPoints = [
//     {
//       'lng': 110.317277,
//       'lat': 36.871209
//     },
//     {
//       'lng': 112.046623,
//       'lat': 36.771366
//     },
//     {
//       'lng': 111.637283,
//       'lat': 36.270186
//     },
//     {
//       'lng': 110.519647,
//       'lat': 36.374403
//     }
//   ]
//   const overlay = mapUtil.drawPolygon(initPoints)
//   console.log(overlay)
// },
// draw() {
//   const drawingType = 'polygon'
//   if (!drawingManager) this.initDraw()
//   const drawingManager = this.drawingManager
//   // 进行绘制
//   if (drawingManager._isOpen && drawingManager.getDrawingMode() === drawingType) {
//     drawingManager.close()
//   } else {
//     drawingManager.setDrawingMode(drawingType)
//     drawingManager.open()
//   }
// }

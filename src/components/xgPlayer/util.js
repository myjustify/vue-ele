// 获取视频类型
import extName from 'ext-name'

export function getVideoType(playUrl) {
  const res = playUrl.split('?').filter(Boolean)[0]
  if (res.endsWith('/flv')) {
    return {
      type: 'flv',
      ext: '',
      mime: 'video/x-flv'
    }
  }
  const result = extName(res)
  if (playUrl.startsWith('ws')) {
    return {
      type: 'ws-flv',
      ext: '',
      mime: 'video/x-flv'
    }
  } else if (result.length) {
    return {
      ext: result[0].ext,
      mime: result[0].mime,
      type: result[0].ext
    }
  } else {
    return {
      text: 'mp4',
      mime: 'video/mp4',
      type: 'mp4'
    }
  }
}

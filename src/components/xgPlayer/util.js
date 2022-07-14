// 获取视频类型
import extName from 'ext-name'

export function getVideoType(playUrl) {
  const result = extName(playUrl)
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

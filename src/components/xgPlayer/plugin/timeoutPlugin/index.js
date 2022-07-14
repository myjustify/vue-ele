import { getVideoType } from '@/components/xgPlayer/util'
// import xgPlayer from 'xgplayer'
// const { removeClass, addClass } = xgPlayer.util
export const timeoutPlugin = {
  name: 'timeoutPlugin',
  method: function() {
    const player = this
    // let root = player.root
    let timeoutId = null
    const { timeoutNums } = player.config
    if (!timeoutNums) return
    function waitingFn() {
      console.log('timeoutPlugin')
      const { type } = getVideoType(player.config.url)
      timeoutId = setTimeout(() => {
        timeoutId = null
        console.log(player.readyState)
        if (player.readyState === '没有关于音频/视频是否就绪的信息') {
          if (type === 'flv' || type === 'ws-flv') {
            setTimeout(() => {
              player.__flv__.destroy()
              player.emit('error')
            })
          } else if (type === 'm3u8') {
            player._context.destroyInstances()
            player.emit('error')
          } else {
            player.video.src = ''
            // addClass(root, 'xgplayer-pause')
            // addClass(root, 'xgplayer-nostart')
            // removeClass(root, 'xgplayer-is-enter')
          }
        }
      }, timeoutNums)
    }

    player.on('ready', waitingFn)
    player.on('timeoutPlugin', waitingFn)
    function destroyFunc() {
      if (timeoutId) {
        timeoutId = null
        clearTimeout(timeoutId)
      }

      player.off('ready', waitingFn)
    }
    player.once('destroy', destroyFunc)
  }
}

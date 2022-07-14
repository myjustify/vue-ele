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
    function waitingFn(flag) {
      console.log('timeoutPlugin')
      const now = Date.now()
      const { type } = getVideoType(player.config.url)
      timeoutId = setTimeout(() => {
        timeoutId = null
        console.log(player.readyState, Date.now() - now)
        if (player.readyState === '没有关于音频/视频是否就绪的信息') {
          if (type === 'flv' || type === 'ws-flv') {
            setTimeout(() => {
              player.destroy()
              player.emit('error', flag)
            })
          } else if (type === 'm3u8') {
            player._context.destroyInstances()
            player.emit('error', flag)
          } else {
            player.video.src = ''
            // addClass(root, 'xgplayer-pause')
            // addClass(root, 'xgplayer-nostart')
            // removeClass(root, 'xgplayer-is-enter')
          }
        }
      }, timeoutNums)
    }

    function waitingFn1() {
      waitingFn(true)
    }
    function waitingFn2() {
      waitingFn(false)
    }

    player.once('complete', waitingFn1)
    player.once('canplay', clearSto)
    player.on('timeoutPlugin', waitingFn2)

    function destroyFunc() {
      clearSto()
      player.off('timeoutPlugin', waitingFn2)
    }

    function clearSto() {
      if (timeoutId) {
        console.log('clearSto')
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
    player.once('destroy', destroyFunc)
  }
}

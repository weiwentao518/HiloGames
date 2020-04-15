(function (ns) {

  var Audios = ns.Audios = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    resources: [],

    load: function () {
      this.resources = [
        {
          id: 'startBgm',
          src: 'audios/startBg.mp3',
          loop: true,
          autoplay: true,
        },
        {
          id: 'playBgm',
          src: 'audios/playBg.mp3',
          loop: true,
          volume: 0.5,
        },
        {
          id: 'hurt',
          src: 'audios/hurt.mp3'
        },
        {
          id: 'boom',
          src: 'audios/boom.mp3'
        },
        {
          id: 'gameover',
          src: 'audios/gameover.mp3'
        },
        {
          id: 'skillPre',
          src: 'audios/skill-yingfenshen.mp3'
        },
        {
          id: 'skillCur',
          src: 'audios/skill-luoxuanwan.mp3'
        },
      ]

      this.resources.forEach(({ id, src, loop = false, autoplay = false }) => {
        this[id] = new Audio()
        this[id].src = src
        this[id].loop = loop
        this[id].volume = 0
        this[id].autoplay = autoplay
      })
    },
  })

  Audios.great = true

})(window.game)
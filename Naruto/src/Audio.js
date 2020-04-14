(function (ns) {

  var Audios = ns.Audios = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    constructors: function () {
      this.startBg = new Hilo.WebAudio({
        loop: true,
        // autoPlay: true,
        src: 'audios/startBg.mp3',
      })

      this.playBg = new Hilo.WebAudio({
        loop: true,
        src: 'audios/playBg.mp3'
      })

      this.skillPre = new Hilo.WebAudio({
        loop: false,
        src: 'audios/skill-yingfenshen.mp3'
      })

      this.skillCur = new Hilo.WebAudio({
        loop: false,
        src: 'audios/skill-luoxuanwan.mp3'
      })

      this.hurt = new Hilo.WebAudio({
        loop: false,
        src: 'audios/man-hurt.mp3',
      })

      this.hurt.load()
      this.playBg.load()
      this.startBg.load()

      this.playBg.setVolume(0.5)
    },

    load: function () {
      var resources = [
        {
          id: 'startBg',
          src: 'audios/startBg.mp3',
          loop: true,
          autoplay: true,
        },
        {
          id: 'playBg',
          src: 'audios/playBg.mp3',
          loop: true,
          volume: 0.5,
        },
        {
          id: 'hurt',
          src: 'audios/man-hurt.mp3'
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

      resources.forEach(({ id, src, loop = false, volume = 1, autoplay = false }) => {
        this[id] = new Audio()
        this[id].src = src
        this[id].loop = loop
        this[id].volume = volume
        this[id].autoplay = autoplay
      })
    },
  })

  Audios.great = true

})(window.game)
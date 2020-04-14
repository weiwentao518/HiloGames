(function (ns) {

  var Audio = ns.Audio = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    load: function () {
      var resources = [
        {
          id: 'startBg',
          src: 'audios/青鸟.mp3'
        },
        {
          id: 'playBg',
          src: 'audios/playBg.mp3'
        },
        {
          id: 'hurt',
          src: 'audios/man-hurt.mp3'
        },
      ]

      this.queue = new Hilo.LoadQueue()
      this.queue.add(resources)
      this.queue.on('completes', this.onComplete.bind(this))
      this.queue.start()
      console.log(this.queue.getLoaded())
    },

    constructor: function () {
      console.log(1111)
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
  })

  Audio.great = true

})(window.game)
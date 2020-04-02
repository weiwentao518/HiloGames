(function (ns) {

  var Audio = ns.Audio = Hilo.Class.create({
    constructor: function (props) {
      // Audio.superclass.constructor.call(this, props);

      this.background = new Hilo.WebAudio({
        loop: true,
        // autoPlay: true,
        src: '/naruto/audios/background.mp3',
      })

      this.background.load()
      this.background.play()
    },
  })

  Audio.great = true

})(window.game)
(function (ns) {

  var Audio = ns.Audio = Hilo.Class.create({
    constructor: function (props) {
      // Audio.superclass.constructor.call(this, props);

      this.background = new Hilo.WebAudio({
        loop: true,
        // autoPlay: true,
        src: '/naruto/audios/bg.mp3',
      })

      this.background.load()
    },
  })

  Audio.great = true

})(window.game)
(function (ns) {

  var ReadyScene = ns.ReadyScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (props) {
      ReadyScene.superclass.constructor.call(this, props)
      this.init(props)
    },

    init: function (props) {
      // background
      var background = new Hilo.Bitmap({
        image: props.background,
        width: props.width,
        height: props.height,
      })

      // 开始按钮
      var playBtn = new Hilo.Bitmap({
        id: 'startBtn',
        image: props.playBtn,
        x: 20,
        y: 800,
      })

      this.addChild(background, playBtn)
    }
  })

})(window.game)
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
        y: 700,
      })

      var tutorial = new Hilo.Bitmap({
        id: 'tutorialBtn',
        image: props.tutorialBtn,
        x: 20,
        y: 900,
      })

      var dialog = new Hilo.Bitmap({
        id: 'dialog',
        image: props.dialog,
        width: 920,
        height: 692,
        x: 150,
        y: 100,
        alpha: 0,
        visible: false
      })

      this.addChild(background, playBtn, tutorial, dialog)
    }
  })

})(window.game)
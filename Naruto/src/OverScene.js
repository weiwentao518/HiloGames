(function (ns) {

  var OverScene = ns.OverScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (props) {
      OverScene.superclass.constructor.call(this, props)
      this.init(props)
    },

    init: function (props) {
      var background = new Hilo.Bitmap({
        id: 'reStartBtn',
        image: props.images.background,
        width: ns.width,
        height: ns.height,
        alpha: 0
      })

      var fail = new Hilo.Bitmap({
        id: 'fail',
        image: props.images.fail,
        scaleX: 1.5,
        scaleY: 1.5,
        x: 380,
        y: 100,
        alpha: 0,
      })

      var scoreBg = new Hilo.Bitmap({
        id: 'scoreBg',
        image: props.images.scoreBg,
        x: 350,
        y: 400,
        alpha: 0
      })

      // var scoreText = new Hilo.Bitmap({
      //   id: 'scoreText',
      //   image: props.images.scoreText,
      //   width: 1000,
      //   height: 2000,
      //   scaleX: 20,
      //   scaleY: 20,
      // })

      var scoreLabel = new Hilo.BitmapText({
        id: 'score',
        glyphs: props.numberGlyphs,
        scaleX: 0.8,
        scaleY: 0.8,
        letterSpacing: 4,
        text: 0
      })

      var reStartBtn = new Hilo.Bitmap({
        id: 'reStartBtn',
        image: props.images.button,
        width: 350,
        height: 150,
        x: 420,
        y: 700,
      })

      scoreLabel.x = scoreBg.x + 100
      scoreLabel.y = scoreBg.y + 50

      this.addChild(
        background,
        reStartBtn,
        fail,
        scoreBg,
        scoreLabel,
      )
    },

    init0: function (props) {
      var board = new Hilo.Bitmap({
        id: 'board',
        image: props.image,
        rect: [0, 0, 590, 298]
      })

      var gameover = new Hilo.Bitmap({
        id: 'gameover',
        image: props.image,
        rect: [0, 298, 508, 158]
      })

      var reStartBtn = new Hilo.Bitmap({
        id: 'reStartBtn',
        image: props.button,
        width: 280,
        height: 120,
        x: 100,
        y: 800,
      })

      var scoreLabel = new Hilo.BitmapText({
        id: 'score',
        glyphs: props.numberGlyphs,
        scaleX: 0.5,
        scaleY: 0.5,
        letterSpacing: 4,
        text: 0
      })

      var bestLabel = new Hilo.BitmapText({
        id: 'best',
        glyphs: props.numberGlyphs,
        scaleX: 0.5,
        scaleY: 0.5,
        letterSpacing: 4
      })

      var whiteMask = new Hilo.View({
        id: 'mask',
        width: this.width,
        height: this.height,
        alpha: 0,
        background: '#fff'
      })

      this.addChild(gameover, board, reStartBtn, scoreLabel, bestLabel, whiteMask)
    },

    show: function (score) {
      this.visible = true
      this.getChildById('score').setText(score)
      // this.getChildById('best').setText(bestScore)

      Hilo.Tween.to(this.getChildById('background'), {
        alpha: 1
      }, {
        duration: 100
      })
      Hilo.Tween.to(this.getChildById('fail'), {
        alpha: 1,
        y: this.getChildById('fail').y + 150
      }, {
        duration: 200,
        delay: 200
      })
      Hilo.Tween.to(this.getChildById('scoreBg'), {
        alpha: 1,
        y: this.getChildById('scoreBg').y + 150
      }, {
        duration: 200,
        delay: 200
      })
      Hilo.Tween.to(this.getChildById('reStartBtn'), {
        alpha: 1
      }, {
        duration: 100,
        delay: 600
      })
    },

    hide: function () {
      this.visible = false
      this.getChildById('background').alpha = 0
      this.getChildById('board').alpha = 0
      this.getChildById('score').alpha = 0
      this.getChildById('best').alpha = 0
      this.getChildById('start').alpha = 0
      this.getChildById('board').y -= 150
      this.getChildById('score').y -= 150
      this.getChildById('best').y -= 150
    }
  });

})(window.game);
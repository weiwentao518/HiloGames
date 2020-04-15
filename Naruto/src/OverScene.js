(function (ns) {

  var OverScene = ns.OverScene = Hilo.Class.create({
    Extends: Hilo.Container,

    timer: null,

    constructor: function (props) {
      OverScene.superclass.constructor.call(this, props)
      this.init(props)
    },

    init: function (props) {
      var background = new Hilo.Bitmap({
        id: 'background',
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
        x: 800,
        y: 500,
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

      var score = new Hilo.BitmapText({
        id: 'score',
        glyphs: props.numberGlyphs,
        scaleX: 0.8,
        scaleY: 0.8,
        letterSpacing: 4,
        text: 0,
        alpha: 0,
        visible: false,
      })

      var reStartBtn = new Hilo.Bitmap({
        id: 'reStartBtn',
        image: props.images.button,
        width: 350,
        height: 150,
        x: 420,
        y: 750,
        alpha: 0,
      })

      score.x = scoreBg.x - 350
      score.y = scoreBg.y + 50

      this.addChild(
        background,
        reStartBtn,
        fail,
        scoreBg,
        score,
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

      var score = new Hilo.BitmapText({
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

      this.addChild(gameover, board, reStartBtn, score, bestLabel, whiteMask)
    },

    show: function (score) {
      this.visible = true
      let scoreTemp = 0

      Hilo.Tween.to(this.getChildById('background'), {
        alpha: 1
      }, {
        duration: 200,
        delay: 0,
      })
      Hilo.Tween.to(this.getChildById('fail'), {
        alpha: 1,
        y: this.getChildById('fail').y + 150
      }, {
        duration: 300,
        delay: 300
      })
      Hilo.Tween.to(this.getChildById('scoreBg'), {
        alpha: 1,
        x: this.getChildById('scoreBg').x - 450
      }, {
        duration: 300,
        delay: 300
      })
      Hilo.Tween.to(this.getChildById('score'), {
        alpha: 1,
        visible: true,
      }, {
        duration: 100,
        delay: 400
      })
      Hilo.Tween.to(this.getChildById('reStartBtn'), {
        alpha: 1,
        y: this.getChildById('reStartBtn').y - 50
      }, {
        duration: 300,
        delay: 700
      })

      // 数字递增动画
      setTimeout(() => {
        this.timer = setInterval(() => {
          scoreTemp += 10
          if (scoreTemp <= score) {
            this.getChildById('score').setText(scoreTemp)
          } else {
            this.timer && clearInterval(this.timer)
          }
        }, 32)
      }, 400)
    },

    hide: function () {
      this.visible = false
      this.getChildById('background').alpha = 0
      this.getChildById('fail').alpha = 0
      this.getChildById('score').alpha = 0
      this.getChildById('scoreBg').alpha = 0
      this.getChildById('reStartBtn').alpha = 0

      this.getChildById('fail').y -= 150
      this.getChildById('scoreBg').x += 450
      this.getChildById('reStartBtn').y += 50
    }
  });

})(window.game);
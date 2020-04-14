(function () {
  var Databus = new window.Databus()
  var {
    // Utils
    randomInt,
    randomDirection,
    // 常量
    BG_CORNER,
  } = Databus

  window.onload = function () {
    game.init()
  }

  var game = window.game = {
    width: 0,
    height: 0,

    asset: null,
    stage: null, // 舞台
    state: null, // 状态机：ready 准备、playing 游戏中、over 结束
    ticker: null,
    score: 0, // 分数
    level: 1, // 关卡
    enemys: [], // 敌人列表
    enemyAmount: 5, // 敌人数量
    bloodAmount: 100, // 初始血量：100%

    bg: null,
    role: null,
    gameReadyScene: null,
    gameOverScene: null,

    init: function () {
      this.asset = new game.Asset()
      this.asset.on('complete', function (e) {
        this.asset.off('complete')
        this.initStage()
      }.bind(this))
      this.asset.load()

      this.audio = new game.Audio()

      setTimeout(() => {
        this.audio.startBg.play()
      }, 1000)
    },

    initStage: function () {
      this.width = Math.min(10000, 600) * 2
      this.height = Math.min(10000, 600) * 2
      this.scale = 0.5

      //舞台画布
      var renderType = location.search.indexOf('dom') != -1 ? 'dom' : 'canvas'

      //舞台
      this.stage = new Hilo.Stage({
        renderType: renderType,
        width: this.width,
        height: this.height,
        scaleX: this.scale,
        scaleY: this.scale
      })
      document.body.appendChild(this.stage.canvas)

      //启动计时器
      this.ticker = new Hilo.Ticker(60)
      this.ticker.addTick(Hilo.Tween)
      this.ticker.addTick(this.stage)
      this.ticker.start(true)

      // 绑定交互事件
      this.onKeydown = this.onKeydown.bind(this)
      this.onKeyup = this.onKeyup.bind(this)
      this.stage.enableDOMEvent(Hilo.event.POINTER_START, true)
      // this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this))

      // WASD键控制
      if (document.addEventListener) {
        document.addEventListener('keydown', this.onKeydown)

        document.addEventListener('keyup', this.onKeyup)
      }

      //舞台更新
      this.stage.onUpdate = this.onUpdate.bind(this)

      //初始化
      this.initBackground()
      this.initScenes()
      this.initRole()
      this.initEnemy()
      this.initCurrentScore()

      //准备游戏
      this.level === 1 ? this.gameReady() : this.gameStart()
    },

    onKeydown: function (e) {
      if (this.role.isDead || this.role.usingSkill) return

      switch (e.keyCode) {
        case 32: this.role.useSkill()
        break
        case 87: this.role.run('up')
        break
        case 65: this.role.run('left')
        break
        case 68: this.role.run('right')
        break
        case 83: this.role.run('down')
        break
        default: this.role.stand()
      }
    },

    onKeyup: function (e) {
      if (e.keyCode === 32 || this.role.usingSkill) return
      console.log({keyCode: e.keyCode, tag: (e.keyCode === 32 || this.role.usingSkill)})
      this.role.stand()
    },

    initBackground: function () {
      //背景
      var bgImg = this.asset.bg;
      this.bg = new Hilo.Bitmap({
        id: 'bg',
        image: bgImg,
        scaleX: this.width / bgImg.width,
        scaleY: this.height / bgImg.height
      }).addTo(this.stage)

      // 门
      this.door = new Hilo.Bitmap({
        id: 'door',
        image: this.asset.door,
        x: 125,
        y: 12,
        width: 50,
        height: 60,
      }).addTo(this.stage)

      // 宝箱
      this.treasure = new Hilo.Bitmap({
        id: 'treasure',
        image: this.asset.treasure,
        x: this.width - 150,
        y: this.height / 2,
        width: 40,
        height: 40,
      }).addTo(this.stage)

      // 血槽：先画一个空血槽，再画一个血槽
      new Hilo.Bitmap({
        id: 'bloodEmpty',
        image: this.asset.bloodEmpty,
        x: 800,
        y: 6,
        width: 390,
        height: 60,
      }).addTo(this.stage)

      this.blood = new Hilo.Bitmap({
        id: 'blood',
        image: this.asset.bloodFull,
        x: 832,
        y: 20,
      }).addTo(this.stage)
    },

    initScenes: function () {
      //准备场景
      this.gameReadyScene = new game.ReadyScene({
        id: 'readyScene',
        width: this.width,
        height: this.height,
        background: this.asset.bgStart,
        button: this.asset.playBtn,
      }).addTo(this.stage)

      //结束场景
      this.gameOverScene = new game.OverScene({
        id: 'overScene',
        images: {
          fail: this.asset.fail,
          button: this.asset.playAgainBtn,
          scoreBg: this.asset.scoreBg,
          scoreText: this.asset.scoreText,
          background: this.asset.bgEnd,
        },
        numberGlyphs: this.asset.numberGlyphs,
        visible: false
      }).addTo(this.stage)

      // 绑定开始按钮事件
      this.gameReadyScene.getChildById('startBtn').on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation()
        this.gameStart()
      }.bind(this))

      this.gameOverScene.getChildById('reStartBtn').on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation()
        this.gameOverScene.hide()
        this.gameStart()
      }.bind(this))
    },

    initCurrentScore: function () {
      // 当前分数
      this.currentScore = new Hilo.BitmapText({
        id: 'score',
        glyphs: this.asset.numberGlyphs,
        text: this.score || '0',
        textAlign: 'center',
        scaleX: 0.5,
        scaleY: 0.5,
        visible: false
      }).addTo(this.stage)

      this.scoreTag = new Hilo.Bitmap({
        id: 'scoreTag',
        image: this.asset.scoreTag,
        x: 270,
        y: 8,
        width: 100,
        height: 50,
        visible: false
      }).addTo(this.stage)

      //设置当前分数的位置
      this.currentScore.x = 450
      this.currentScore.y = 10
    },

    initRole: function () {
      this.role = new game.Role({
        id: 'role',
        atlas: this.asset.roleAtlas,
        speed: 12 + this.level,
        startX: 100,
        startY: this.height / 2 - 20,
      }).addTo(this.stage, 3)
    },

    initEnemy: function () {

      for (let i = 0; i < this.enemyAmount; i++) {
        const dog = new game.Enemy({
          id: 'dog',
          atlas: this.asset.shuimuAtlas,
          speed: 5 + this.level,
          hurt: 10,
          direction: randomDirection(),
          startX: randomInt(200, BG_CORNER.right),
          startY: randomInt(60, BG_CORNER.bottom),
        }).addTo(this.stage, 3)

        dog.getReady()
        this.enemys.push(dog)
      }
    },

    onUpdate: function (delta) {
      if (this.state !== 'playing') return

      if (this.audio.startBg.playing) {
        this.audio.startBg.stop()
      }

      if (this.role.hitTestObject(this.treasure) && !this.role.usingSkill) {
        // If the treasure is touching the explorer, center it over the explorer
        this.catching = true
        this.treasure.x = this.role.x + 15
        this.treasure.y = this.role.y - 20
      }

      this.enemys.forEach(enemy => {
        if (enemy.hitTestObject(this.role) && !this.role.isInvincible && !this.role.usingSkill) {
          // If the treasure is touching the explorer, center it over the explorer
          Databus.fire('beInjured', this.role)
          this.setBlood(-enemy.hurt)
          // this.setBlood(-100)

          if (this.catching) {
            const { x, y } = this.treasure
            this.tween = Hilo.Tween.to(this.treasure, {
              x: x + 10,
              y: y + 10,
            }, {
              duration: 200,
              reverse: false,
              loop: false
            })
            this.tween.start()
            this.catching = false
          }
        }
      })

      if (this.treasure.hitTestObject(this.door)) {
        this.score += 10
        this.currentScore.setText(this.score)

        this.gameNextLevel()
      }
    },

    setBlood: function (percent) {
      var next = (this.bloodAmount += percent)
      next = next > 100 ? 100 : next
      next = next < 0 ? 0 : next
      this.bloodAmount = next
      this.role.isInvincible = true
      setTimeout(() => {
        this.role.isInvincible = false
      }, 1000)

      var bloodLength = 315 * this.bloodAmount / 100
      this.blood.setImage(this.asset.bloodFull, [0, 0, bloodLength, 33])

      if (next === 0) {
        this.role.isDead = true
        this.gameOver()
      }
    },

    gameReady: function () {
      this.state = 'ready'
      this.score = 0
      this.scoreTag.visible = false
      this.currentScore.visible = false
      this.gameReadyScene.visible = true
      this.role.getReady()
    },

    gameStart: function () {
      this.state = 'playing'
      this.scoreTag.visible = true
      this.currentScore.visible = true
      this.currentScore.setText(this.score)
      this.gameReadyScene.visible = false
      this.role.getReady()
      this.audio.startBg.stop()
      this.audio.playBg.play()
    },

    gameNextLevel: function () {
      this.state = 'next'
      this.level += 1
      this.enemyAmount += 1
      this.catching = false
      this.ticker.stop()
      this.ticker.removeTick(Hilo.Tween)
      this.ticker.removeTick(this.stage)
      this.role.removeFromParent()
      this.enemys.forEach(i => i.removeFromParent())
      this.stage.removeAllChildren()
      document.removeEventListener('keydown', this.onKeydown)
      document.removeEventListener('keyup', this.onKeyup)
      this.initStage()
    },

    gameOver: function () {
      if (this.state !== 'over') {
        this.state = 'over'
        this.scoreTag.visible = false
        this.currentScore.visible = false
        this.gameOverScene.show(this.score)
        this.gameReadyScene.getChildById('startBtn').off()
      }
    },
  }

})();
(function () {
  var Databus = new window.Databus()
  var {
    // Utils
    randomInt,
    randomDirection,
    hitTestRectangle,
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
    stage: null,
    ticker: null,
    state: null,
    score: 0,

    bg: null,
    role: null,
    bloodAmount: 100,
    gameReadyScene: null,
    gameOverScene: null,

    init: function () {
      this.asset = new game.Asset()
      this.asset.on('complete', function (e) {
        this.asset.off('complete')
        this.initStage()
      }.bind(this))
      this.asset.load()
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

      //绑定交互事件
      this.stage.enableDOMEvent(Hilo.event.POINTER_START, true)
      // this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this))

      // WASD键控制
      if (document.addEventListener) {
        document.addEventListener('keydown', function (e) {
          this.onKeydown(e)
        }.bind(this))

        document.addEventListener('keyup', function (e) {
          this.onKeyup(e)
        }.bind(this))
      }

      //舞台更新
      this.stage.onUpdate = this.onUpdate.bind(this)

      //初始化
      this.initBackground()
      // this.initScenes()
      this.initRole()
      this.initEnemy()
      // this.initCurrentScore()

      //准备游戏
      // this.gameReady()
    },

    onKeydown: function (e) {
      if (this.role.isDead) return

      switch (e.keyCode) {
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

    onKeyup: function () {
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
        x: 75,
        y: 10,
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

      console.log(this.blood)
      this.blood.setImage(this.asset.bloodFull, [0, 0, 315, 30])
    },

    initScenes: function () {
      //准备场景
      this.gameReadyScene = new game.ReadyScene({
        id: 'readyScene',
        width: this.width,
        height: this.height,
        image: this.asset.ready
      }).addTo(this.stage)

      //结束场景
      this.gameOverScene = new game.OverScene({
        id: 'overScene',
        width: this.width,
        height: this.height,
        image: this.asset.over,
        numberGlyphs: this.asset.numberGlyphs,
        visible: false
      }).addTo(this.stage)

      //绑定开始按钮事件
      this.gameOverScene.getChildById('start').on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation()
        this.gameReady()
      }.bind(this))
    },

    initRole: function () {
      this.role = new game.Role({
        id: 'role',
        atlas: this.asset.roleAtlas,
        startX: 100,
        startY: this.height / 2 - 20,
      }).addTo(this.stage, 3)
      this.role.getReady()
    },

    initEnemy: function () {
      this.dog = new game.Enemy({
        id: 'dog',
        atlas: this.asset.dogAtlas,
        speed: 5,
        direction: randomDirection(),
        startX: randomInt(200, BG_CORNER.right),
        startY: randomInt(60, BG_CORNER.bottom),
      }).addTo(this.stage, 3)

      this.dog.getReady()
    },

    onUpdate: function (delta) {
      if (hitTestRectangle(this.role, this.treasure)) {
        // If the treasure is touching the explorer, center it over the explorer
        this.treasure.x = this.role.x + 15
        this.treasure.y = this.role.y - 15
      }

      if (hitTestRectangle(this.role, this.dog) && !this.role.isInvincible) {
        // If the treasure is touching the explorer, center it over the explorer
        // this.role.tween.start()
        Hilo.Tween.to(this.role, {
          opacity: 0.3,
        }, {
          duration: 300,
          reverse: true,
          repeat: 3
        })
        this.setBlood(-this.dog.hurt)
      }

      if (hitTestRectangle(this.treasure, this.door)) {
        console.log('你赢了！')
        // this.blood.width -= 10
        this.blood.setImage(this.asset.bloodFull, [0, 0, 200, 33])
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
      }
    },

    gameReady: function () {
      this.gameOverScene.hide();
      this.state = 'ready';
      this.score = 0;
      this.currentScore.visible = true;
      this.currentScore.setText(this.score);
      this.gameReadyScene.visible = true;
      this.holdbacks.reset();
      this.role.getReady();
    },

    gameStart: function () {
      this.state = 'playing';
      this.gameReadyScene.visible = false;
      this.holdbacks.startMove();
    },

    gameOver: function () {
      if (this.state !== 'over') {
        //设置当前状态为结束over
        this.state = 'over';
        //停止障碍的移动
        this.holdbacks.stopMove();
        //小鸟跳转到第一帧并暂停
        this.role.goto(0, true);
        //隐藏屏幕中间显示的分数
        this.currentScore.visible = false;
        //显示结束场景
        this.gameOverScene.show('哈哈哈', this.saveBestScore());
      }
    },
  };

})();
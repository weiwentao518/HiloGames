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
      // this.initScenes()
      this.initRole()
      this.initEnemy()
      this.initCurrentScore()

      //准备游戏
      // this.gameReady()
      this.gameStart()
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

    initCurrentScore: function () {
      // 当前分数
      this.currentScore = new Hilo.BitmapText({
        id: 'score',
        glyphs: this.asset.numberGlyphs,
        text: this.score || '0',
        textAlign: 'center',
        scaleX: 0.5,
        scaleY: 0.5,
      }).addTo(this.stage)

      new Hilo.Bitmap({
        id: 'scoreTag',
        image: this.asset.scoreTag,
        x: 270,
        y: 8,
        width: 100,
        height: 50,
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
      this.role.getReady()
    },

    initEnemy: function () {

      for (let i = 0; i < this.enemyAmount; i++) {
        const dog = new game.Enemy({
          id: 'dog',
          atlas: this.asset.dogAtlas,
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

      if (hitTestRectangle(this.role, this.treasure)) {
        // If the treasure is touching the explorer, center it over the explorer
        this.catching = true
        this.treasure.x = this.role.x + 15
        this.treasure.y = this.role.y - 20
      }

      const roleRect = {
        ...this.role,
        x: this.role.x + 10,
        y: this.role.y + 10,
        width: this.role.width - 20,
        height: this.role.height - 20,
      }

      this.enemys.forEach(enemy => {
        const enemyRect = {
          ...enemy,
          x: enemy.x + 20,
          y: enemy.y + 30,
          width: enemy.width - 30,
          height: enemy.height - 30
        }
        if (hitTestRectangle(this.role, enemy) && !this.role.isInvincible) {
          // If the treasure is touching the explorer, center it over the explorer
          Databus.fire('beInjured', this.role)
          this.setBlood(-enemy.hurt)

          if (this.catching) {
            const { x, y } = this.treasure
            this.tween = Hilo.Tween.to(this.treasure, {
              x: x + 100,
              y: y + 100,
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

      if (hitTestRectangle(this.treasure, this.door)) {
        console.log('你赢了！')
        this.score += 10
        this.currentScore.setText(this.score)

        this.nextLevel()
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
      this.state = 'playing'
      // this.gameReadyScene.visible = false;
      // this.holdbacks.startMove();
    },

    nextLevel: function () {
      this.state = 'next'
      this.level += 1
      this.enemyAmount += 1
      this.catching = false
      this.ticker.stop()
      this.ticker.removeTick(Hilo.Tween)
      this.ticker.removeTick(this.stage)
      this.role.removeFromParent()
      this.enemys.forEach(i => i.removeFromParent())
      // this.stage.removeAllChildren()
      document.removeEventListener('keydown', this.onKeydown)
      document.removeEventListener('keyup', this.onKeyup)
      this.initStage()
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
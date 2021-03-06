var haveEvents = 'ongamepadconnected' in window;

// https://blog.csdn.net/github_35568698/article/details/79033687
// https://developer.mozilla.org/zh-CN/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  window.game.controller = gamepad;
  // requestAnimationFrame(updateStatus);
  setInterval(updateStatus, 32)
}

function disconnecthandler() {
  delete window.game.controller
}

let timer = 0
let lock = false
function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }
  const _this = window.game
  if (_this.role.isDead || _this.role.usingSkill) {
    // requestAnimationFrame(updateStatus);
    return
  }

  // for (i = 0; i < _this.controller.buttons.length; i++) {
  //   const btn = _this.controller.buttons[i]
  //   if (btn.pressed) {
  //     console.log("button pressed", i)
  //   }
  // }
  let padCode
  const buttonX = _this.controller.buttons[0]
  const buttonMusic = _this.controller.buttons[9]

  if (buttonX.pressed) {
    padCode = 32
  }

  if (buttonMusic.pressed) {
    if (!lock) {
      _this.musicSwitch()
    }
    lock = true
    timer = setTimeout(() => {
      lock = false
    }, 500)
  }

  for (i = 0; i < _this.controller.axes.length; i++) {
    if (i === 0) {
      const row1 = _this.controller.axes[i]
      if (row1 >= 0.8) {
        console.log('right!', row1.toFixed(4))
        padCode = 68
        break
      } else if (row1 <= -0.8) {
        console.log('left!', row1.toFixed(4))
        padCode = 65
        break
      }
    }

    if (i === 1) {
      const col1 = _this.controller.axes[i]
      if (col1 >= 0.8) {
        console.log('down!', col1.toFixed(4))
        padCode = 83
        break
      } else if (col1 <= -0.8) {
        console.log('go up!', col1.toFixed(4))
        padCode = 87
        break
      }
    }
  }

  switch (padCode) {
    case 32:
      if (_this.skillAmount > 0) {
        _this.skillAmount -= 1
        _this.role.useSkill()
        _this.initSkillAmount()
      }
    break
    case 87: _this.role.run('up')
    break
    case 65: _this.role.run('left')
    break
    case 68: _this.role.run('right')
    break
    case 83: _this.role.run('down')
    break
    default: _this.role.stand()
  }
  // requestAnimationFrame(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      window.game.controller = gamepads[i];
    }
  }
}

(function () {
  var Databus = new window.Databus()
  var {
    // Utils
    randomInt,
    randomEnemy,
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

    bg: null, // 舞台背景
    role: null, // 角色对象
    asset: null, // 静态资源
    stage: null, // 舞台
    state: null, // 状态机：ready 准备、playing 游戏中、over 结束、next 下一关过渡态
    ticker: null, // Hilo全局计时器
    controller: null, // 手柄控制器🎮
    musicState: 'stop', // BGM🎵状态：stop / play
    dialogVisible: false,
    gameOverScene: null,
    gameReadyScene: null,

    score: 0, // 分数
    level: 1, // 关卡
    enemys: [], // 敌人列表
    enemyAmount: 5, // 敌人数量
    skillAmount: 10, // 可释放技能数量
    skillIconList: [], // 技能列表
    bloodAmount: 100, // 初始血量：100%

    init: function () {
      this.asset = new game.Asset()
      this.asset.on('complete', function (e) {
        this.asset.off('complete')
        removeLoading()
        this.initStage()
      }.bind(this))
      this.asset.load()

      this.audio = new game.Audios()
      this.audio.load()
    },

    initStage: function () {
      this.width = Math.min(10000, 600) * 2
      this.height = Math.min(10000, 600) * 2
      this.scale = 0.5

      // 舞台画布
      var renderType = location.search.indexOf('dom') != -1 ? 'dom' : 'canvas'

      // 舞台
      this.stage = new Hilo.Stage({
        renderType: renderType,
        width: this.width,
        height: this.height,
        scaleX: this.scale,
        scaleY: this.scale
      })
      document.body.appendChild(this.stage.canvas)

      // 启动计时器
      this.ticker = new Hilo.Ticker(60)
      this.ticker.addTick(Hilo.Tween)
      this.ticker.addTick(this.stage)
      this.ticker.start(true)

      // 绑定交互事件
      this.onKeydown = this.onKeydown.bind(this)
      this.onKeyup = this.onKeyup.bind(this)
      this.stage.enableDOMEvent(Hilo.event.POINTER_START, true)

      // WASD键控制
      if (document.addEventListener) {
        document.addEventListener('keydown', this.onKeydown)
        document.addEventListener('keyup', this.onKeyup)
      }

      // 舞台更新
      this.stage.onUpdate = this.onUpdate.bind(this)

      // 初始化
      this.initBackground()
      this.initCurrentScore()
      this.initSkillAmount()
      this.initRole()
      this.initEnemy()
      this.initScenes()
      // 绑定事件
      this.initEvents()
      this.initGamepad()

      // 准备游戏
      this.level === 1 ? this.gameReady() : this.gameStart()
    },

    onKeydown: function (e) {
      if (this.role.isDead || this.role.usingSkill) return

      switch (e.keyCode) {
        case 32:
          if (this.skillAmount > 0) {
            this.skillAmount -= 1
            this.role.useSkill()
            this.initSkillAmount()
          }
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

    initGamepad: function () {
      window.addEventListener("gamepadconnected", connecthandler)
      window.addEventListener("gamepaddisconnected", disconnecthandler)
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

      this.whiteMask = new Hilo.View({
        width: this.width,
        height: this.height,
        alpha: 0,
        background: '#fff'
      }).addTo(this.stage)
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

      this.scoreTag = new Hilo.Bitmap({
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

    initSkillAmount: function () {
      this.skillIconList.forEach(i => i.removeFromParent())

      var amount = this.skillAmount
      while (amount > 0) {
        var icon = new Hilo.Bitmap({
          image: this.asset.skillIcon,
          x: 10 + amount * 60,
          y: this.height - 60,
          width: 50,
          height: 50,
        }).addTo(this.stage)
        this.skillIconList.push(icon)
        amount -= 1
      }
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
      var atlas = randomEnemy()

      for (let i = 0; i < this.enemyAmount; i++) {
        const enemy = new game.Enemy({
          id: `enemy_${i}`,
          atlas: this.asset[atlas],
          speed: 5 + this.level / 2,
          hurt: 10 + this.level,
          direction: randomDirection(),
          startX: randomInt(200, BG_CORNER.right),
          startY: randomInt(60, BG_CORNER.bottom),
        }).addTo(this.stage, 3)

        enemy.getReady()
        this.enemys.push(enemy)
      }
    },

    initScenes: function () {
      //准备场景
      this.gameReadyScene = new game.ReadyScene({
        id: 'readyScene',
        width: this.width,
        height: this.height,
        dialog: this.asset.dialog,
        playBtn: this.asset.playBtn,
        background: this.asset.bgStart,
        tutorialBtn: this.asset.tutorial,
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

      this.musicBtn = new Hilo.Bitmap({
        id: 'musicBtn',
        image: this.asset.musicBtn,
        rect: [this.musicState === 'play' ? 0 : 85, 0, 85, 92],
        x: 0,
        y: 0
      }).addTo(this.stage)
    },

    initEvents: function () {
      // 绑定开始按钮事件
      this.gameReadyScene.getChildById('startBtn').on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation()
        this.gameStart()
      }.bind(this))

      // 绑定教程按钮事件
      this.gameReadyScene.getChildById('tutorialBtn').on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation()
        if (this.dialogVisible) {
          Hilo.Tween.to(this.gameReadyScene.getChildById('dialog'), {
            y: 100,
            alpha: 0,
            visible: false,
          }, {
            duration: 200,
          })
          this.dialogVisible = false
        } else {
          Hilo.Tween.to(this.gameReadyScene.getChildById('dialog'), {
            y: 200,
            alpha: 1,
            visible: true,
          }, {
            duration: 200,
          })
          this.dialogVisible = true
        }
      }.bind(this))

      // 绑定再来一次按钮事件
      this.gameOverScene.getChildById('reStartBtn').on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation()
        this.gameOverScene.hide()
        this.resetData()
        this.clearBattleField()
        this.gameStart()
      }.bind(this))

      // 绑定音乐🎵开关事件
      this.musicBtn.on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation()
        this.musicSwitch()
      }.bind(this))
    },

    musicSwitch: function () {
      if (this.musicState === 'stop') {
        if (this.state === 'ready') this.audio.startBgm.play()

        this.musicState = 'play'
        this.musicBtn.setImage(this.asset.musicBtn, [0, 0, 85, 92])
        this.audio.resources.forEach(({ id, volume = 1 }) => {
          this.audio[id].volume = volume
        })
      } else {
        this.musicState = 'stop'
        this.musicBtn.setImage(this.asset.musicBtn, [85, 0, 85, 92])
        this.audio.resources.forEach(({ id }) => {
          this.audio[id].volume = 0
        })
      }
    },

    // Game帧渲染函数
    onUpdate: function (delta) {
      if (this.state !== 'playing') return

      if (this.role.hitTestObject(this.treasure) && !this.role.usingSkill) {
        this.catching = true
        this.treasure.x = this.role.x + 15
        this.treasure.y = this.role.y - 20
      }

      for (const enemy of this.enemys) {
        if (enemy.hitTestObject(this.role) && !this.role.isInvincible && !this.role.usingSkill) {
          Databus.fire('beInjured')
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
          break
        }
      }

      if (this.treasure.hitTestObject(this.door)) {
        this.score += 10
        this.currentScore.setText(this.score)

        this.gameNextLevel()
      }
    },

    // 设置血量
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

    // 游戏准备
    gameReady: function () {
      this.state = 'ready'
      this.score = 0
      this.gameReadyScene.visible = true
      this.role.getReady()
    },

    // 游戏开始
    gameStart: function () {
      this.state = 'playing'
      this.gameReadyScene.visible = false
      this.role.getReady()
      this.audio.startBgm.pause()
      this.audio.playBgm.play()
      // Databus.fire('roleTransform', this.asset.role3Atlas)
    },

    // 下一关
    gameNextLevel: function () {
      this.state = 'next'
      this.level += 1
      this.enemyAmount += 1
      this.clearBattleField()

      if (this.level % 3 === 0) this.skillAmount += 1
    },

    // 游戏结束
    gameOver: function () {
      if (this.state !== 'over') {
        this.state = 'over'
        this.audio.playBgm.pause()
        this.audio.gameover.currentTime = 0
        this.audio.gameover.play()
        this.gameOverScene.show(this.score)
        this.gameReadyScene.getChildById('startBtn').off()
      }
    },

    // 重置数据
    resetData: function () {
      this.score = 0
      this.level = 1
      this.enemyAmount = 5
      this.skillAmount = 1
      this.bloodAmount = 100
    },

    // 清理战场
    clearBattleField: function () {
      this.catching = false
      this.bloodAmount = 100
      this.ticker.stop()
      this.ticker.removeTick(Hilo.Tween)
      this.ticker.removeTick(this.stage)
      this.role.removeFromParent()
      this.enemys.forEach(i => i.removeFromParent())
      this.enemys = []
      this.stage.removeAllChildren()
      document.removeEventListener('keydown', this.onKeydown)
      document.removeEventListener('keyup', this.onKeyup)
      var canvas = document.getElementsByTagName('canvas')[0]
      canvas && canvas.parentNode.removeChild(canvas)
      this.initStage()
    },
  }

  function removeLoading () {
    var loading = document.querySelector('.loading')
    loading && loading.parentNode.removeChild(loading)
  }

})()
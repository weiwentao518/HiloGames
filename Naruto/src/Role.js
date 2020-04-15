(function (ns) {
  var Databus = new window.Databus()
  var { sleep, BG_CORNER, ROLE_RECT } = Databus

  var Role = ns.Role = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function (props) {
      Role.superclass.constructor.call(this, props);

      this.width = ROLE_RECT.normal.width
      this.height = ROLE_RECT.normal.height
      this.timer = null
      this.isDead = false
      this.usingSkill = false
      this.status = 'normal' // 鸣人状态：normal 正常 / third 三尾
      this.direction = 'standing'
      this.skillAtlas = ns.asset.skillAtlas
      // this.background = '#ff0'

      this.props = props
      this.speed = props.speed || 12
      this.atlas = props.atlas
      this.startX = props.startX // 起始x坐标
      this.startY = props.startY // 起始y坐标
      this.addFrame(this.atlas.getSprite('standing'))

      // 通过Databus监听传入的受伤事件🤕️
      Databus.on('beInjured', this.onBeInjured.bind(this))
      // 监听变身事件🦊
      Databus.on('roleTransform', this.onRoleTransform.bind(this))
    },

    run: function (direction) {
      if (this.direction === direction) {
        this.moving(direction)
        return
      }

      this.moving(direction)
      this.direction = direction

      this.clearFrame()
      this.addFrame(this.atlas.getSprite(direction))
      this.play()
    },

    stand: function () {
      this.goto(0, true)
      this.direction = 'standing'
    },

    moving: function (direction) {
      this.status === 'third' && this.setRoleRect(direction)

      switch (direction) {
        case 'up': (() => {
          if (this.y <= BG_CORNER.top) {
            this.y = BG_CORNER.top
          } else {
            this.y -= this.speed
          }
        })()
        break
        case 'left': (() => {
          if (this.x <= BG_CORNER.left) {
            this.x = BG_CORNER.left
          } else {
            this.x -= this.speed
          }
        })()
        break
        case 'right': (() => {
          if (this.x >= BG_CORNER.right) {
            this.x = BG_CORNER.right
          } else {
            this.x += this.speed
          }
        })()
        break
        case 'down': (() => {
          if (this.y >= BG_CORNER.bottom) {
            this.y = BG_CORNER.bottom
          } else {
            this.y += this.speed
          }
        })()
        break
        default: break
      }
    },

    setRoleRect: function (direction) {
      var rectMap = {
        up: 'thirdCol',
        left: 'thirdRow',
        right: 'thirdRow',
        down: 'thirdCol',
      }
      this.width = ROLE_RECT[rectMap[direction]].width
      this.height = ROLE_RECT[rectMap[direction]].height
    },

    // 使用全图必杀技
    useSkill: function () {
      this.timer && clearTimeout(this.timer)

      this.width = 384
      this.height = 190
      // this.width = 480 * 2
      // this.height = 155 * 2
      this.x -= 50
      this.y -= 100
      this.usingSkill = true
      this.clearFrame()
      this.addFrame(this.skillAtlas.getSprite('start'))
      this.play()
      ns.audio.skillPre.play()
      sleep(1500).then(() => {
        ns.audio.skillCur.play()
      })
      sleep(2850).then(() => {
        ns.audio.boom.play()
        Hilo.Tween.to(ns.whiteMask, {
          alpha: 1,
        }, {
          repeat: 3,
          duration: 50,
          reverse: true
        })
      })
      sleep(3000).then(() => {
        // 全屏秒杀
        ns.score += ns.enemys.length
        ns.currentScore.setText(ns.score)
        ns.enemys.forEach(i => i.removeFromParent())
        this.usingSkill = false
      })

      this.timer = setTimeout(() => {
        this.width = 52.5
        this.height = 75
        this.x += 150
        this.y += 100
        this.clearFrame()
        this.addFrame(this.atlas.getSprite(this.direction))
        this.stand()
      }, 2400)
    },

    getReady: function () {
      //设置起始坐标
      this.x = this.startX
      this.y = this.startY
      this.rotation = 0
      this.interval = 5
      this.play()
    },

    onUpdate: function () {
      if (this.isDead) {
        this.tween = Hilo.Tween.to(this, {
          rotation: -30,
        }, {
          duration: 200,
          reverse: false,
          loop: false
        })
      }
    },

    // 受伤事件🤕️
    onBeInjured: function () {
      this.tween = Hilo.Tween.to(this, {
        alpha: 0,
      }, {
        repeat: 3,
        duration: 50,
        reverse: true
      })
      this.tween.start()
      ns.audio.hurt.play()
    },

    // 变身三尾🦊
    onRoleTransform: function ({ detail: superAtlas }) {
      console.log(superAtlas)
      this.status = 'third'
      this.atlas = superAtlas

      sleep(10000).then(() => {
        this.status = 'normal'
        this.atlas = this.props.atlas
        this.width = ROLE_RECT.normal.width
        this.height = ROLE_RECT.normal.height
        this.stand()
      })
    }
  })

})(window.game)
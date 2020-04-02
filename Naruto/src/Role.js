(function (ns) {
  var Databus = new window.Databus()
  var { BG_CORNER } = Databus

  var Role = ns.Role = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function (props) {
      Role.superclass.constructor.call(this, props);

      this.width = 70
      this.height = 90
      // this.pivotX = this.width / 2
      // this.pivotY = this.height / 2
      this.isDead = false
      this.direction = 'standing'
      this.background = '#ff0'

      this.speed = props.speed || 12
      this.atlas = props.atlas
      this.startX = props.startX // 起始x坐标
      this.startY = props.startY // 起始y坐标
      this.addFrame(this.atlas.getSprite('standing'))

      // 通过Databus监听传入的受伤事件🤕️
      Databus.on('beInjured', this.onBeInjured.bind(this))
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

    getReady: function () {
      //设置起始坐标
      this.x = this.startX
      this.y = this.startY
      this.rotation = 0
      this.interval = 6
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

    // 监听game.js 传入的受伤事件🤕️
    onBeInjured: function () {
      this.tween = Hilo.Tween.to(this, {
        alpha: 0,
      }, {
        repeat: 3,
        duration: 50,
        reverse: true
      })
      this.tween.start()
    }
  })

})(window.game)
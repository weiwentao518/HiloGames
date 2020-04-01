(function (ns) {
  var Databus = new window.Databus()
  var { BG_CORNER } = Databus

  var Role = ns.Role = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function (props) {
      Role.superclass.constructor.call(this, props);

      this.width = 70
      this.height = 90
      this.speed = 12
      this.isDead = false
      this.direction = 'standing'

      this.atlas = props.atlas
      this.startX = props.startX // 起始x坐标
      this.startY = props.startY // 起始y坐标
      this.addFrame(this.atlas.getSprite('standing'))
    },

    run: function (direction) {
      if (this.direction === direction) {
        // 清除tween，否则无法y轴移动
        this.tween && this.tween.stop()
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

      // If this is not set, the character will not be able to move. like engine bug
      // this.tween = Hilo.Tween.to(this, {
      //   y: this.y + 0.01,
      // }, {
      //   duration: 1000,
      //   reverse: true,
      //   loop: true
      // })
    },

    onUpdate: function () {
      // TODO
      if (this.isDead) {
        this.tween = Hilo.Tween.to(this, {
          rotation: -90,
        }, {
          duration: 300,
          reverse: false,
          loop: false
        })
      }
    }
  });

})(window.game);
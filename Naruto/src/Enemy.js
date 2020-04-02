(function (ns) {
  var Databus = new window.Databus()
  var { contain, BG_CORNER } = Databus

  var Enemy = ns.Enemy = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function (props) {
      Enemy.superclass.constructor.call(this, props);

      this.width = 70
      this.height = 70
      this.forward = 1 // 控制方向：向前、还是向后跑
      this.hurt = props.hurt || 10
      this.speed = props.speed || 12
      this.direction = props.direction || 'standing'
      this.background = '#0ff'

      this.atlas = props.atlas
      this.startX = props.startX // 起始x坐标
      this.startY = props.startY // 起始y坐标
      this.addFrame(this.atlas.getSprite(props.direction))
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

    stop: function () {
      this.goto(0, true)
      this.direction = 'standing'
    },

    getReady: function () {
      //设置起始坐标
      this.x = this.startX
      this.y = this.startY
      this.rotation = 0
      this.interval = 8
      this.play()
    },

    onUpdate: function () {
      // return
      this.tween && this.tween.stop()

      var enemyHitsWall = contain(this, {
        top: 50,
        left: 60,
        width: 1130,
        height: 1120,
      })

      var directionMap = {
        top: 'down',
        left: 'right',
        right: 'left',
        bottom: 'up'
      }

      if (enemyHitsWall) {
        this.forward *= -1
        this.direction = directionMap[enemyHitsWall] || this.direction
        this.clearFrame()
        this.addFrame(this.atlas.getSprite(this.direction))
      }

      switch (this.direction) {
        case 'up': (() => {
          this.y -= this.speed * this.forward
        })()
        break
        case 'left': (() => {
          this.x -= this.speed * this.forward
        })()
        break
        case 'right': (() => {
          this.x += this.speed * this.forward
        })()
        break
        case 'down': (() => {
          this.y += this.speed * this.forward
        })()
        break
        default: break
      }
    },
  })

})(window.game);
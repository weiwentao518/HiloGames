(function () {
  var instance

  var Databus = window.Databus = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    constructor: function() {
      if (instance) return instance

      instance = this
      this.BG_CORNER = {
        top: 10,
        left: 55,
        right: 1065,
        bottom: 1040,
      }

      this.ROLE_RECT = {
        normal: {
          width: 52.5,
          height: 75
        },
        thirdRow: {
          width: 75 * 1.2,
          height: 60 * 1.2
        },
        thirdCol: {
          width: 55 * 1.2,
          height: 70 * 1.2
        }
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    // 碰撞检测
    hitTestRectangle(r1, r2) {
      return (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.height + r1.y > r2.y
      )
    },

    // 随机位置
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 随机方向
    randomDirection() {
      var directionMap = {
        0: 'up',
        1: 'left',
        2: 'right',
        3: 'down',
      }
      return directionMap[~~(Math.random() * 4)]
    },

    // 随机敌人
    randomEnemy() {
      var enemyMap = {
        0: 'shuimuAtlas',
        1: 'douAtlas',
        2: 'yaAtlas',
      }
      return enemyMap[~~(Math.random() * 3)]
    },

    contain(sprite, container) {

      var collision = undefined

      // Left
      if (sprite.x < container.left) {
        sprite.x = container.left
        collision = "left"
      }

      // Top
      if (sprite.y < container.top) {
        sprite.y = container.top
        collision = "top"
      }

      // Right
      if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width
        collision = "right"
      }

      // Bottom
      if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height
        collision = "bottom"
      }

      return collision
    }
  })
})()
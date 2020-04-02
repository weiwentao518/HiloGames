(function () {
  let instance

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

      // this.reset()
    },

    // 碰撞检测
    hitTestRectangle(rect1, rect2) {

      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      )

      // //Define the variables we'll need to calculate
      // let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

      // //hit will determine whether there's a collision
      // hit = false;

      // //Find the center points of each sprite
      // r1.centerX = r1.x + r1.width / 2;
      // r1.centerY = r1.y + r1.height / 2;
      // r2.centerX = r2.x + r2.width / 2;
      // r2.centerY = r2.y + r2.height / 2;

      // //Find the half-widths and half-heights of each sprite
      // r1.halfWidth = r1.width / 2;
      // r1.halfHeight = r1.height / 2;
      // r2.halfWidth = r2.width / 2;
      // r2.halfHeight = r2.height / 2;

      // //Calculate the distance vector between the sprites
      // vx = r1.centerX - r2.centerX;
      // vy = r1.centerY - r2.centerY;

      // //Figure out the combined half-widths and half-heights
      // combinedHalfWidths = r1.halfWidth + r2.halfWidth;
      // combinedHalfHeights = r1.halfHeight + r2.halfHeight;

      // //Check for a collision on the x axis
      // if (Math.abs(vx) < combinedHalfWidths) {

      //   //A collision might be occuring. Check for a collision on the y axis
      //   if (Math.abs(vy) < combinedHalfHeights) {

      //     //There's definitely a collision happening
      //     hit = true;
      //   } else {

      //     //There's no collision on the y axis
      //     hit = false;
      //   }
      // } else {

      //   //There's no collision on the x axis
      //   hit = false;
      // }

      // //`hit` will be either `true` or `false`
      // return hit;
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

    contain(sprite, container) {

      let collision = undefined

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
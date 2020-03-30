(function (ns) {

  var Role = ns.Role = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function (props) {
      Role.superclass.constructor.call(this, props);

      this.width = 70
      this.height = 90
      this.speed = 15
      this.direction = 'standing'

      this.atlas = props.atlas
      this.startX = props.startX //小鸟的起始x坐标
      this.startY = props.startY //小鸟的起始y坐标
      this.addFrame(this.atlas.getSprite('standing'));
    },

    run: function (direction) {
      if (this.direction === direction) {
        this.tween && this.tween.stop();
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
          if (this.y <= 10) {
            this.y = 10
          } else {
            this.y -= this.speed
          }
        })()
        break
        case 'left': (() => {
          if (this.x <= 55) {
            this.x = 55
          } else {
            this.x -= this.speed
          }
        })()
        break
        case 'right': (() => {
          if (this.x >= 1065) {
            this.x = 1065
          } else {
            this.x += this.speed
          }
        })()
        break
        case 'down': (() => {
          console.log(this.y)
          if (this.y >= 1040) {
            this.y = 1040
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
      this.x = this.startX;
      this.y = this.startY;

      console.log(this)

      this.rotation = 0;
      this.interval = 20;
      this.play();
      this.tween = Hilo.Tween.to(this, {
        y: this.y + 0.01,
      }, {
        duration: 1000,
        reverse: true,
        loop: true
      });
    },

    startFly: function () {
      this.isDead = false;
      this.interval = 3;
      this.flyStartY = this.y;
      this.flyStartTime = +new Date();
      if (this.tween) this.tween.stop();
    },

    onUpdate: function () {
      if (this.isDead) return;

      //飞行时间
      var time = (+new Date()) - this.flyStartTime;
      //飞行距离
      var distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
      //y轴坐标
      var y = this.flyStartY - distance;

      if (y <= this.groundY) {
        //小鸟未落地
        this.y = y;
        if (distance > 0 && !this.isUp) {
          //往上飞时，角度上仰20度
          this.tween = Hilo.Tween.to(this, {
            rotation: -20
          }, {
            duration: 200
          });
          this.isUp = true;
        } else if (distance < 0 && this.isUp) {
          //往下跌落时，角度往下90度
          this.tween = Hilo.Tween.to(this, {
            rotation: 90
          }, {
            duration: this.groundY - this.y
          });
          this.isUp = false;
        }
      } else {
        //小鸟已经落地，即死亡
        this.y = this.groundY;
        this.isDead = true;
      }
    }
  });

})(window.game);
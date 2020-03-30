(function () {

  window.onload = function () {
    game.init();
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
    ground: null,
    role: null,
    gameReadyScene: null,
    gameOverScene: null,

    init: function () {
      this.asset = new game.Asset();
      this.asset.on('complete', function (e) {
        this.asset.off('complete');
        this.initStage();
      }.bind(this));
      this.asset.load();
    },

    initStage: function () {
      this.width = Math.min(10000, 900) * 2;
      this.height = Math.min(10000, 600) * 2;
      this.scale = 0.5;

      //舞台画布
      var renderType = location.search.indexOf('dom') != -1 ? 'dom' : 'canvas';

      //舞台
      this.stage = new Hilo.Stage({
        renderType: renderType,
        width: this.width,
        height: this.height,
        scaleX: this.scale,
        scaleY: this.scale
      });
      document.body.appendChild(this.stage.canvas);

      //启动计时器
      this.ticker = new Hilo.Ticker(60);
      this.ticker.addTick(Hilo.Tween);
      this.ticker.addTick(this.stage);
      this.ticker.start(true);

      //绑定交互事件
      this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
      // this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));

      //Space键控制
      // if (document.addEventListener) {
      //   document.addEventListener('keydown', function (e) {
      //     if (e.keyCode === 32) this.onUserInput(e);
      //   }.bind(this));
      // } else {
      //   document.attachEvent('onkeydown', function (e) {
      //     if (e.keyCode === 32) this.onUserInput(e);
      //   }.bind(this));
      // }

      //舞台更新
      this.stage.onUpdate = this.onUpdate.bind(this);

      //初始化
      this.initBackground();
      // this.initScenes();
      this.initRole();
      // this.initCurrentScore();

      //准备游戏
      // this.gameReady();
    },

    initBackground: function () {
      //背景
      var bgWidth = this.width * this.scale;
      var bgHeight = this.height * this.scale;

      var bgImg = this.asset.bg;
      this.bg = new Hilo.Bitmap({
        id: 'bg',
        image: bgImg,
        scaleX: this.width / bgImg.width,
        scaleY: this.height / bgImg.height
      }).addTo(this.stage);
      return

      //地面
      var groundImg = this.asset.ground;
      var groundOffset = 60;
      this.ground = new Hilo.Bitmap({
        id: 'ground',
        image: groundImg,
        scaleX: (this.width + groundOffset * 2) / groundImg.width
      }).addTo(this.stage);

      //设置地面的y轴坐标
      this.ground.y = this.height - this.ground.height;

      //移动地面
      Hilo.Tween.to(this.ground, {
        x: -groundOffset * this.ground.scaleX
      }, {
        duration: 400,
        loop: true
      });
    },

    initScenes: function () {
      //准备场景
      this.gameReadyScene = new game.ReadyScene({
        id: 'readyScene',
        width: this.width,
        height: this.height,
        image: this.asset.ready
      }).addTo(this.stage);

      //结束场景
      this.gameOverScene = new game.OverScene({
        id: 'overScene',
        width: this.width,
        height: this.height,
        image: this.asset.over,
        numberGlyphs: this.asset.numberGlyphs,
        visible: false
      }).addTo(this.stage);

      //绑定开始按钮事件
      this.gameOverScene.getChildById('start').on(Hilo.event.POINTER_START, function (e) {
        e.stopImmediatePropagation && e.stopImmediatePropagation();
        this.gameReady();
      }.bind(this));
    },

    initRole: function () {
      this.role = new game.Role({
        id: 'role',
        atlas: this.asset.roleAtlas,
        startX: 500,
        startY: 500,
        // groundY: this.ground.y - 12
      }).addTo(this.stage, 1);
      this.role.getReady();
    },

    onUpdate: function (delta) {
      // if (this.state === 'ready') {
      //   return;
      // }

      // if (this.role.isDead) {
      //   this.gameOver();
      // } else {
      //   this.currentScore.setText(this.calcScore());
      //   //碰撞检测
      //   if (this.holdbacks.checkCollision(this.role)) {
      //     this.gameOver();
      //   }
      // }
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
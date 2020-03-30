(function (ns) {

  var Asset = ns.Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    bg: null,
    roleAtlas: null,

    load: function () {
      var resources = [
        {
          id: 'bg',
          src: 'images/bg.png'
        },
        {
          id: 'role',
          src: 'images/role.png'
        },
        {
          id: 'role3',
          src: 'images/role-third.png'
        },
        {
          id: 'door',
          src: 'images/door.png'
        },
        {
          id: 'blob',
          src: 'images/blob.png'
        },
        {
          id: 'treasure',
          src: 'images/treasure.png'
        },
      ];

      this.queue = new Hilo.LoadQueue();
      this.queue.add(resources);
      this.queue.on('complete', this.onComplete.bind(this));
      this.queue.start();
    },

    onComplete: function () {
      var w = 46
      var h = 62
      // var w = 70
      // var h = 80
      this.bg = this.queue.getContent('bg')
      this.door = this.queue.getContent('door')
      this.treasure = this.queue.getContent('treasure')

      this.roleAtlas = new Hilo.TextureAtlas({
        image: this.queue.getContent('role'),
        frames: [
          [0, 0, w, h],
          [w, 0, w, h],
          [w * 2, 0, w, h],
          [w * 3, 0, w, h],

          [0, h, w, h],
          [w, h, w, h],
          [w * 2, h, w, h],
          [w * 3, h, w, h],

          [0, h * 2, w, h],
          [w, h * 2, w, h],
          [w * 2, h * 2, w, h],
          [w * 3, h * 2, w, h],

          [0, h * 3, w, h],
          [w, h * 3, w, h],
          [w * 2, h * 3, w, h],
          [w * 3, h * 3, w, h],
        ],
        sprites: {
          standing: [0],
          down: [0, 1, 2, 3],
          left: [4, 5, 6, 7],
          right: [8, 9, 10, 11],
          up: [12, 13, 14, 15],
        },
      });

      this.roleMaxAtlas = new Hilo.TextureAtlas({
        image: this.queue.getContent('role3'),
        frames: [
          [0, 0, w, h],
          [w, 0, w, h],
          [w * 2, 0, w, h],
          [w * 3, 0, w, h],

          [0, h, w, h],
          [w, h, w, h],
          [w * 2, h, w, h],
          [w * 3, h, w, h],

          [0, h * 2, w + 2, h - 21],
          [w, h * 2, w + 2, h - 21],
          [w * 2, h * 2, w + 2, h - 21],
          [w * 3, h * 2, w + 2, h - 21],

          [0, h * 2.8, w + 5, h],
          [w, h * 2.8, w + 5, h],
          [w * 2, h * 2.8, w + 5, h],
          [w * 3, h * 2.8, w + 5, h],
        ],
        sprites: {
          standing: [0],
          down: [0, 1, 2, 3],
          left: [4, 5, 6, 7],
          right: [8, 9, 10, 11],
          up: [12, 13, 14, 15],
        }
      });

      this.bgAtlas = new Hilo.TextureAtlas({
        image: this.queue.getContent('bg2'),
        frames: {
          frameWidth: 256,
          frameHeight: 300,
          numFrames: 5
        },
        width: 256,
        height: 300,
      });

      this.queue.off('complete');
      this.fire('complete');
    }
  });

  Asset.great = true

})(window.game);